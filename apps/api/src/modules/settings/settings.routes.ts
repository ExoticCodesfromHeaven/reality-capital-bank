import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";

import { authorize } from "../../middlewares/authorize.middleware";

import { validate } from "../../middlewares/validate.middleware";

import { settingsController } from "./settings.controller";

import {

  createSettingSchema,

  updateSettingSchema,

  upsertSettingSchema,

} from "./settings.validation";

const router = Router();



router.use(

  authMiddleware,

  authorize("SUPER_ADMIN")

);



router.get(

  "/",

  settingsController.getAll

);



router.get(

  "/:key",

  settingsController.getOne

);



router.post(

  "/",

  validate(createSettingSchema),

  settingsController.create

);



router.post(

  "/upsert",

  validate(upsertSettingSchema),

  settingsController.upsert

);



router.put(

  "/:key",

  validate(updateSettingSchema),

  settingsController.update

);



router.delete(

  "/:key",

  settingsController.remove

);



export default router;