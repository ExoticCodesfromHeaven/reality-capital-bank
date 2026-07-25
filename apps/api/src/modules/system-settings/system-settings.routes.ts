import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";

import { authorize } from "../../middlewares/authorize.middleware";

import { validate } from "../../middlewares/validate.middleware";

import { systemSettingsController } from "./system-settings.controller";

import { updateSettingSchema } from "./system-settings.validation";

const router = Router();

router.get(

  "/",

  authMiddleware,

  authorize("SUPER_ADMIN"),

  systemSettingsController.getAll

);

router.get(

  "/:key",

  authMiddleware,

  authorize("SUPER_ADMIN"),

  systemSettingsController.getOne

);

router.patch(

  "/:key",

  authMiddleware,

  authorize("SUPER_ADMIN"),

  validate(updateSettingSchema),

  systemSettingsController.update

);

export default router;