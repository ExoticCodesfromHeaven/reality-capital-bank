import cron from "node-cron";

import {
  FixedDepositStatus,
  TransactionCategory,
  TransactionStatus,
  TransactionType,
  NotificationType,
} from "@prisma/client";


import { prisma } from "../lib/prisma";

import {
  generateReference,
} from "../utils/reference";


import {
  notificationService,
} from "../modules/notification/notification.service";


import {
  auditService,
} from "../modules/audit/audit.service";



export function startFixedDepositJob() {


cron.schedule(
"0 * * * *",
async()=>{


console.log(
"Running fixed deposit maturity scheduler..."
);



const deposits =
await prisma.fixedDeposit.findMany({

where:{

status:
FixedDepositStatus.ACTIVE,


maturesAt:{
lte:new Date(),
},


},


include:{

account:{
include:{
currency:true,
},
},


user:true,


},


});





for(
const deposit of deposits
){


try{


await prisma.$transaction(

async(tx)=>{



const account =
deposit.account;



const balanceBefore =
Number(account.balance);



const maturityAmount =
Number(
deposit.maturityAmount
);



const balanceAfter =
balanceBefore +
maturityAmount;





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
TransactionType.CREDIT,



category:
TransactionCategory.FIXED_DEPOSIT,



status:
TransactionStatus.SUCCESS,



amount:
maturityAmount,



balanceBefore,



balanceAfter,



narration:
"Fixed Deposit Maturity Payment",



account:{
connect:{
id:account.id,
},
},


},


});







await tx.fixedDeposit.update({

where:{
id:deposit.id,
},


data:{

status:
FixedDepositStatus.MATURED,

},


});



}

);





await notificationService.create(

deposit.userId,


"Fixed Deposit Matured",


`Your fixed deposit of ${deposit.account.currency.symbol}${Number(deposit.amount).toLocaleString()} has matured and ${deposit.account.currency.symbol}${Number(deposit.maturityAmount).toLocaleString()} has been credited to your account.`,


NotificationType.SUCCESS


);






await auditService.create(

deposit.userId,


"FIXED_DEPOSIT_MATURED",


`Fixed deposit ${deposit.id} matured.`

);



console.log(

`Fixed deposit ${deposit.id} completed`

);



}

catch(error){


console.error(

`Failed fixed deposit ${deposit.id}`,

error

);


}



}




}

);


}