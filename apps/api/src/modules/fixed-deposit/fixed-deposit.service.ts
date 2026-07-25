import {
  TransactionCategory,
  TransactionStatus,
  TransactionType,
  FixedDepositStatus,
  NotificationType,
} from "@prisma/client";


import { prisma } from "../../lib/prisma";

import { AppError } from "../../errors/AppError";

import {
  generateReference,
} from "../../utils/reference";


import {
  calculateFixedDeposit,
} from "../../utils/fixed-deposit";


import {
  fixedDepositRepository,
} from "./fixed-deposit.repository";


import {
  notificationService,
} from "../notification/notification.service";


import {
  auditService,
} from "../audit/audit.service";



export const fixedDepositService = {



async getPlans(){

 return fixedDepositRepository.getPlans();

},





async createFixedDeposit(

userId:string,

accountId:string,

planId:string,

amount:number

){



const account =
await fixedDepositRepository.getAccount(
accountId
);



if(!account){

 throw new AppError(
  "Account not found.",
 404
 );

}




if(
account.userId !== userId
){

 throw new AppError(
  "Unauthorized account.",
 403
 );

}




const plan =
await fixedDepositRepository.getPlan(
planId
);



if(!plan){

 throw new AppError(
  "Fixed deposit plan not found.",
 404
 );

}





if(!plan.isActive){

 throw new AppError(
  "This plan is currently unavailable.",
 400
 );

}





if(
amount <
Number(plan.minimumAmount)
){

 throw new AppError(
 `Minimum deposit is ${plan.minimumAmount}`,
 400
 );

}





if(
plan.maximumAmount &&
amount >
Number(plan.maximumAmount)

){

 throw new AppError(
 "Amount exceeds maximum limit.",
 400
 );

}






if(
Number(account.availableBalance)
<
amount

){

 throw new AppError(
 "Insufficient balance.",
 400
 );

}





const interest =
Number(plan.interestRate);




const {

expectedInterest,

maturityAmount

}

=
calculateFixedDeposit(

amount,

interest,

plan.durationMonths

);





const startsAt =
new Date();



const maturesAt =
new Date();


maturesAt.setMonth(

maturesAt.getMonth()
+
plan.durationMonths

);







const result =
await prisma.$transaction(

async(tx)=>{





const balanceBefore =
Number(account.balance);



const balanceAfter =
balanceBefore -
amount;





await tx.account.update({

where:{
 id:account.id,
},


data:{


balance:
balanceAfter,


availableBalance:
balanceAfter,


},


});






await tx.transaction.create({

data:{


reference:
generateReference(),


type:
TransactionType.DEBIT,


category:
TransactionCategory.INVESTMENT,


status:
TransactionStatus.SUCCESS,


amount,


balanceBefore,


balanceAfter,


narration:
"Fixed Deposit Placement",



account:{
 connect:{
  id:account.id,
 },
},


},


});








return tx.fixedDeposit.create({

data:{



amount,


interestRate:
plan.interestRate,


expectedInterest,


maturityAmount,



startsAt,


maturesAt,



status:
FixedDepositStatus.ACTIVE,



user:{
 connect:{
  id:userId,
 },
},



account:{
 connect:{
  id:accountId,
 },
},



plan:{
 connect:{
  id:planId,
 },
},


},


include:{


plan:true,


},


});



});






await notificationService.create(

userId,


"Fixed Deposit Created",


`Your fixed deposit of ${account.currency.symbol}${amount.toLocaleString()} has been created successfully.`,


NotificationType.SUCCESS

);





await auditService.create(

userId,


"FIXED_DEPOSIT_CREATED",


`Created fixed deposit ${result.id}`

);





return result;


},





async getMyDeposits(

userId:string

){

return fixedDepositRepository.getUserDeposits(
userId
);


},

async withdrawMaturedDeposit(
  userId:string,
  depositId:string
){


const deposit =
await prisma.fixedDeposit.findUnique({

where:{
id:depositId,
},

include:{
account:true,
},

});



if(!deposit){

throw new AppError(
"Fixed deposit not found.",
404
);

}



if(
deposit.userId !== userId
){

throw new AppError(
"You cannot withdraw this deposit.",
403
);

}




if(
deposit.status !== FixedDepositStatus.MATURED
){

throw new AppError(
"Only matured deposits can be withdrawn.",
400
);

}





const result =
await prisma.fixedDeposit.update({

where:{
id:depositId,
},


data:{

status:
FixedDepositStatus.WITHDRAWN,

},


});





await auditService.create(

userId,

"FIXED_DEPOSIT_WITHDRAWN",

`Withdrawn matured fixed deposit ${depositId}`

);



return result;


},

};