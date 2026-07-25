import { Router } from "express";


import {
authMiddleware
}
from "../auth/auth.middleware";


import {
authorize
}
from "../../middlewares/authorize.middleware";


import {
fixedDepositAdminController
}
from "./fixed-deposit.admin.controller";



const router = Router();



router.post(

"/plans",

authMiddleware,

authorize(
"SUPER_ADMIN"
),

fixedDepositAdminController.createPlan

);





router.get(

"/plans",

authMiddleware,

authorize(
"ADMIN",
"SUPER_ADMIN"
),

fixedDepositAdminController.plans

);





router.patch(

"/plans/:id",

authMiddleware,

authorize(
"SUPER_ADMIN"
),

fixedDepositAdminController.updatePlan

);





router.patch(

"/plans/:id/disable",

authMiddleware,

authorize(
"SUPER_ADMIN"
),

fixedDepositAdminController.disable

);





router.patch(

"/plans/:id/enable",

authMiddleware,

authorize(
"SUPER_ADMIN"
),

fixedDepositAdminController.enable

);





router.get(

"/deposits",

authMiddleware,

authorize(
"ADMIN",
"SUPER_ADMIN"
),

fixedDepositAdminController.deposits

);



export default router;