import { Router } from "express";


import {
authMiddleware
}
from "../auth/auth.middleware";


import {
validate
}
from "../../middlewares/validate.middleware";


import {
fixedDepositController
}
from "./fixed-deposit.controller";


import {
createFixedDepositSchema
}
from "./fixed-deposit.validation";



const router = Router();




// Available fixed deposit plans

router.get(

"/plans",

authMiddleware,

fixedDepositController.getPlans

);





// Create fixed deposit

router.post(

"/",

authMiddleware,

validate(createFixedDepositSchema),

fixedDepositController.create

);


// Customer fixed deposits

router.get(

"/mine",

authMiddleware,

fixedDepositController.mine

);

router.patch(

"/:id/withdraw",

authMiddleware,

fixedDepositController.withdraw

);

export default router;