import {
  AccountStatus,
  JointInvestmentStatus,
  ParticipantStatus,
} from "@prisma/client";


import { prisma } from "../../lib/prisma";

import { AppError } from "../../errors/AppError";

import {
  TransactionCategory,
  TransactionStatus,
  TransactionType,
  NotificationType
} from "@prisma/client";

import {
 generateReference
} from "../../utils/reference";

import {
 notificationService
} from "../notification/notification.service";

import {
 auditService
} from "../audit/audit.service";

import { jointInvestmentRepository }
from "./joint-investment.repository";


import { systemSettingsRepository }
from "../system-settings/system-settings.repository";


import { calculateInvestment }
from "../../utils/investment";


import { maturityDate }
from "../../utils/investment-date";



export const jointInvestmentService = {



async create(

 userId:string,

 accountId:string,

 amount:number,

 durationMonths:number,

 name?:string

){


const account =
await jointInvestmentRepository.getAccount(
 accountId
);



if(!account){

 throw new AppError(
  "Account not found.",
 404
 );

}



if(account.userId !== userId){

 throw new AppError(
  "Unauthorized account.",
 403
 );

}



if(
 account.status !== AccountStatus.ACTIVE
){

 throw new AppError(
  "Account is not active.",
 400
 );

}



if(
 Number(account.availableBalance)
 < amount
){

 throw new AppError(
  "Insufficient balance.",
 400
 );

}




const settings =
await systemSettingsRepository.getByKey(
 "investment_rates"
);



if(!settings){

 throw new AppError(
 "Investment settings missing.",
 500
 );

}



const rates =
settings.value as Record<string,number>;

const interestRate =
  rates[
    `${durationMonths}_months`
  ];

if (interestRate === undefined) {
  throw new AppError(
    "Interest rate for the specified duration is missing.",
    500
  );
}



const {
 expectedReturn,
 totalAtMaturity

} =
calculateInvestment(
 amount,
 interestRate
);




return prisma.jointInvestment.create({

 data:{


  name: name ?? null,


  amount,


  interestRate,


  expectedReturn,


  totalAtMaturity,


  durationMonths,


  status:
   JointInvestmentStatus.PENDING,


  createdBy:{
   connect:{
    id:userId,
   },
  },


  participants:{

 create:{

  userId,

  accountId,

  contribution:
   amount,

  ownership:
   100,

  status:
   ParticipantStatus.ACTIVE,

 }

}


 },

 include:{

  participants:true,

 },

});

},





async inviteParticipant(

creatorId:string,

jointInvestmentId:string,

email:string,

accountId:string,

contribution:string

){



const investment =
await jointInvestmentRepository.findById(
 jointInvestmentId
);



if(!investment){

 throw new AppError(
 "Investment not found.",
 404
 );

}



if(
 investment.createdById !== creatorId
){

 throw new AppError(
 "Only creator can invite.",
 403
 );

}




const user =
await jointInvestmentRepository.getUserByEmail(
 email
);



if(!user){

 throw new AppError(
 "User not found.",
 404
 );

}



return prisma.jointInvestmentParticipant.create({

 data:{

jointInvestmentId,

userId:user.id,

accountId,

contribution,

ownership:0,

status:
ParticipantStatus.PENDING,

}

});

},




async getMine(
userId:string
){

return jointInvestmentRepository.findUserInvestments(
 userId
);


},

async acceptInvitation(

 userId:string,

 investmentId:string

){

const investment =
await jointInvestmentRepository.findById(
 investmentId
);



if(!investment){

 throw new AppError(
 "Investment not found.",
 404
 );

}

const participant =
await jointInvestmentRepository.getParticipant(

 investmentId,

 userId

);



if(!participant){

 throw new AppError(
 "Invitation not found.",
 404
 );

}



if(
 participant.status !== ParticipantStatus.PENDING
){

 throw new AppError(
 "Invitation already processed.",
 400
 );

}




await jointInvestmentRepository.updateParticipant(

 participant.id,

 {

  status:ParticipantStatus.ACTIVE,

 }

);




// calculate ownership


const participants =
await prisma.jointInvestmentParticipant.findMany({

 where:{
  jointInvestmentId:investmentId,
 },

});



const totalAmount =
participants.reduce(

(sum,p)=>
sum + Number(p.contribution),

0

);



for(const p of participants){


await prisma.jointInvestmentParticipant.update({

where:{
 id:p.id,
},


data:{

 ownership:

 Number(
   (
    Number(p.contribution)
    /
    totalAmount
    *
    100
   )
   .toFixed(2)
 ),

},


});


}





const updatedParticipants =
await prisma.jointInvestmentParticipant.findMany({

where:{
 jointInvestmentId:investmentId,
},

});





const totalCommitted =
updatedParticipants.reduce(

(sum,p)=>
sum + Number(p.contribution),

0

);





if(
 totalCommitted <
 Number(investment.amount)

){

 return {
  status:"WAITING_FOR_PARTICIPANTS"
 };

}





/*
 ACTIVATE INVESTMENT
*/



await prisma.$transaction(

async(tx)=>{


for(
const member of updatedParticipants
){


const account =
await tx.account.findUnique({

where:{
 id:member.accountId,
},
});



if(!account){

 throw new AppError(
 "Participant account missing.",
 400
 );

}




if(
Number(account.balance)
<
Number(member.contribution)

){

throw new AppError(
 `${member.userId} has insufficient funds.`,
400
);

}




const before =
Number(account.balance);


const after =
before -
Number(member.contribution);




await tx.account.update({

where:{
 id:account.id,
},


data:{

balance:after,

availableBalance:after,

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


amount:
member.contribution,


balanceBefore:
before,


balanceAfter:
after,


narration:
"Joint Investment Contribution",


account:{
 connect:{
  id:account.id,
 },
},


},


});



}



await tx.jointInvestment.update({

where:{
id:investmentId,
},


data:{


status:
JointInvestmentStatus.ACTIVE,


startsAt:
new Date(),


maturesAt:
new Date(
 Date.now()
 +
 investment.durationMonths
 *
 30
 *
 24
 *
 60
 *
 60
 *
 1000
),


},


});



}

);





for(
const member of updatedParticipants
){

await notificationService.create(

member.userId,

"Joint Investment Activated",

"Your joint investment has started successfully.",

NotificationType.SUCCESS

);

}



await auditService.create(

userId,

"JOINT_INVESTMENT_ACTIVATED",

`Activated joint investment ${investmentId}`

);



return {
 success:true,
 message:
 "Joint investment activated."
};


},

async declineInvitation(

 userId:string,

 investmentId:string

){


const participant =
await prisma.jointInvestmentParticipant.findUnique({

where:{
 jointInvestmentId_userId:{
  jointInvestmentId:investmentId,
  userId,
 },
},

});



if(!participant){

 throw new AppError(
 "Invitation not found.",
 404
 );

}

if(
 participant.status !==
 ParticipantStatus.PENDING
){

 throw new AppError(
 "Invitation already processed.",
 400
 );

}

return prisma.jointInvestmentParticipant.update({

where:{
 id:participant.id,
},


data:{

 status:
 ParticipantStatus.DECLINED,

},

});

},

async cancelInvestment(

 userId:string,

 investmentId:string

){


const investment =
await prisma.jointInvestment.findUnique({

where:{
 id:investmentId,
},

});



if(!investment){

 throw new AppError(
 "Investment not found.",
 404
 );

}



if(
 investment.createdById !== userId
){

 throw new AppError(
 "Only creator can cancel.",
 403
 );

}



if(
 investment.status !==
 JointInvestmentStatus.PENDING
){

 throw new AppError(
 "Only pending investments can be cancelled.",
 400
 );

}



return prisma.jointInvestment.update({

where:{
 id:investmentId,
},

data:{

 status:
 JointInvestmentStatus.CANCELLED,

},

});

},

};