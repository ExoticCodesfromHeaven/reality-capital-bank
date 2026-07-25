import type {
  Request,
  Response,
  NextFunction,
} from "express";


import { jointInvestmentService } 
from "./joint-investment.service";



export const jointInvestmentController = {



async create(

req:Request,

res:Response,

next:NextFunction

){

try{


const investment =
await jointInvestmentService.create(

req.user.id,

req.body.accountId,

req.body.amount,

req.body.durationMonths,

req.body.name

);



res.status(201).json({

success:true,

message:
"Joint investment created successfully.",

data:investment,

});



}catch(error){

next(error);

}

},





async invite(

req:Request<
{id:string},
{},
{
email:string;
contribution:string;
accountId:string;
}
>,

res:Response,

next:NextFunction

){

try{


const participant =
await jointInvestmentService.inviteParticipant(

  req.user.id,

  req.params.id,

  req.body.email,

  req.body.contribution,

  req.body.accountId

);



res.status(201).json({

success:true,

message:
"Participant invited successfully.",

data:participant,

});



}catch(error){

next(error);

}

},





async accept(

req:Request<{id:string}>,

res:Response,

next:NextFunction

){

try{


const result =
await jointInvestmentService.acceptInvitation(

req.user.id,

req.params.id

);



res.json({

success:true,

message:
"Invitation accepted.",

data:result,

});



}catch(error){

next(error);

}

},






async mine(

req:Request,

res:Response,

next:NextFunction

){

try{


const investments =
await jointInvestmentService.getMine(

req.user.id

);



res.json({

success:true,

data:investments,

});



}catch(error){

next(error);

}

},

async decline(

req:Request<{id:string}>,

res:Response,

next:NextFunction

){

try{


const result =
await jointInvestmentService.declineInvitation(

req.user.id,

req.params.id

);



res.json({

success:true,

message:
"Invitation declined.",

data:result,

});


}catch(error){

next(error);

}

},

async cancel(

req:Request<{id:string}>,

res:Response,

next:NextFunction

){

try{


const result =
await jointInvestmentService.cancelInvestment(

req.user.id,

req.params.id

);



res.json({

success:true,

message:
"Investment cancelled.",

data:result,

});


}catch(error){

next(error);

}

},
};