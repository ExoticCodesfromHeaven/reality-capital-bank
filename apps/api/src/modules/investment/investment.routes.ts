import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";

import { validate } from "../../middlewares/validate.middleware";

import { investmentController } from "./investment.controller";

import {
  createInvestmentSchema,
} from "./investment.validation";

const router = Router();

router.post(

  "/",

  authMiddleware,

  validate(createInvestmentSchema),

  investmentController.create

);

router.get(

  "/",

  authMiddleware,

  investmentController.getMine

);

router.get(

  "/:id",

  authMiddleware,

  investmentController.getOne

);

router.post(

    "/:id/withdraw",

    authMiddleware,

    investmentController.withdraw

);

export default router;