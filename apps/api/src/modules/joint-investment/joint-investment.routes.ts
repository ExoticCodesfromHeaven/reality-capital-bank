import { Router } from "express";


import { authMiddleware } 
from "../auth/auth.middleware";


import { validate } 
from "../../middlewares/validate.middleware";


import {
jointInvestmentController
}
from "./joint-investment.controller";


import {
createJointInvestmentSchema,
inviteParticipantSchema
}
from "./joint-investment.validation";



const router = Router();





router.post(

"/",

authMiddleware,

validate(createJointInvestmentSchema),

jointInvestmentController.create

);






router.post(

"/:id/invite",

authMiddleware,

validate(inviteParticipantSchema),

jointInvestmentController.invite

);






router.post(

"/:id/accept",

authMiddleware,

jointInvestmentController.accept

);






router.get(

"/",

authMiddleware,

jointInvestmentController.mine

);

router.post(

"/:id/decline",

authMiddleware,

jointInvestmentController.decline

);



router.patch(

"/:id/cancel",

authMiddleware,

jointInvestmentController.cancel

);


export default router;