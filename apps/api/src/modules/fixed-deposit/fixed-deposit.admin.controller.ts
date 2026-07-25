import type {
Request,
Response,
NextFunction
}
from "express";


import {
fixedDepositAdminService
}
from "./fixed-deposit.admin.service";



export const fixedDepositAdminController = {



async createPlan(
req:Request,
res:Response,
next:NextFunction
){

try{


const plan =
await fixedDepositAdminService.createPlan(
req.body
);



res.status(201).json({

success:true,

message:
"Fixed deposit plan created.",

data:plan,

});


}catch(error){

next(error);

}

},





async plans(
_req:Request,
res:Response,
next:NextFunction
){

try{


const plans =
await fixedDepositAdminService.getPlans();



res.json({

success:true,

data:plans,

});


}catch(error){

next(error);

}

},





async updatePlan(
req:Request,
res:Response,
next:NextFunction
){

try{


const result =
await fixedDepositAdminService.updatePlan(

req.params.id as string,

req.body

);



res.json({

success:true,

message:
"Plan updated.",

data:result,

});


}catch(error){

next(error);

}

},





async deposits(
_req:Request,
res:Response,
next:NextFunction
){

try{


const deposits =
await fixedDepositAdminService.getDeposits();



res.json({

success:true,

data:deposits,

});


}catch(error){

next(error);

}

},





async disable(
req:Request,
res:Response,
next:NextFunction
){

try{


const result =
await fixedDepositAdminService.disablePlan(
req.params.id as string
);



res.json({

success:true,

message:
"Plan disabled.",

data:result,

});


}catch(error){

next(error);

}

},




async enable(
req:Request,
res:Response,
next:NextFunction
){

try{


const result =
await fixedDepositAdminService.enablePlan(
req.params.id as string
);



res.json({

success:true,

message:
"Plan enabled.",

data:result,

});


}catch(error){

next(error);

}

},

};