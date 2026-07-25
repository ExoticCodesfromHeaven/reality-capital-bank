import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";

import { validate } from "../../middlewares/validate.middleware";

import { convertCurrencySchema } from "./exchange-rate.validation";

import { exchangeRateController } from "./exchange-rate.controller";

const router = Router();

router.post(

  "/convert",

  authMiddleware,

  validate(convertCurrencySchema),

  exchangeRateController.convert

);

export default router;