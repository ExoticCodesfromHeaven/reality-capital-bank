import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";
import { authorize } from "../../middlewares/authorize.middleware";

import * as controller from "./admin-analytics.controller";

const router = Router();

router.get(

  "/users",

  authMiddleware,

  authorize(

    "ADMIN",

    "SUPER_ADMIN"

  ),

  controller.userStats

);

export default router;