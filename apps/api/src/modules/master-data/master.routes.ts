import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";

import { authorize } from "../../middlewares/authorize.middleware";

import { validate } from "../../middlewares/validate.middleware";

import { masterController } from "./master.controller";

import {

  createCurrencySchema,

  updateCurrencySchema,

  createCountrySchema,

  updateCountrySchema,

} from "./master.validation";

const router = Router();



// =======================
// Currency
// =======================

router.get(

  "/currencies",

  authMiddleware,

  authorize("SUPER_ADMIN"),

  masterController.getCurrencies

);



router.post(

  "/currencies",

  authMiddleware,

  authorize("SUPER_ADMIN"),

  validate(createCurrencySchema),

  masterController.createCurrency

);



router.patch(

  "/currencies/:id",

  authMiddleware,

  authorize("SUPER_ADMIN"),

  validate(updateCurrencySchema),

  masterController.updateCurrency

);



router.delete(

  "/currencies/:id",

  authMiddleware,

  authorize("SUPER_ADMIN"),

  masterController.deleteCurrency

);



// =======================
// Countries
// =======================

router.get(

  "/countries",

  authMiddleware,

  authorize("SUPER_ADMIN"),

  masterController.getCountries

);



router.post(

  "/countries",

  authMiddleware,

  authorize("SUPER_ADMIN"),

  validate(createCountrySchema),

  masterController.createCountry

);



router.patch(

  "/countries/:id",

  authMiddleware,

  authorize("SUPER_ADMIN"),

  validate(updateCountrySchema),

  masterController.updateCountry

);



router.delete(

  "/countries/:id",

  authMiddleware,

  authorize("SUPER_ADMIN"),

  masterController.deleteCountry

);



export default router;