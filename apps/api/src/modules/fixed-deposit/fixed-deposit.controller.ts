import type {
  Request,
  Response,
  NextFunction,
} from "express";


import {
  fixedDepositService,
} from "./fixed-deposit.service";



export const fixedDepositController = {



async getPlans(

_req:Request,

res:Response,

next:NextFunction

){

try{


const plans =
await fixedDepositService.getPlans();



res.json({

success:true,

data:plans,

});


}catch(error){

next(error);

}

},





async create(

req:Request<
{},
{},
{
accountId:string;
planId:string;
amount:number;
}
>,

res:Response,

next:NextFunction

){

try{


const deposit =
await fixedDepositService.createFixedDeposit(

req.user.id,

req.body.accountId,

req.body.planId,

req.body.amount

);



res.status(201).json({

success:true,

message:
"Fixed deposit created successfully.",

data:deposit,

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


const deposits =
await fixedDepositService.getMyDeposits(

req.user.id

);



res.json({

success:true,

data:deposits,

});



}catch(error){

next(error);

}

},

async withdraw(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {

  try {

    const result =
      await fixedDepositService.withdrawMaturedDeposit(
        req.user.id,
        req.params.id
      );

    res.json({
      success: true,
      message: "Fixed deposit withdrawn successfully.",
      data: result,
    });

  } catch (error) {

    next(error);

  }

},

};