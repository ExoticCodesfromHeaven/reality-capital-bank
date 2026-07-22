import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";
import { userController } from "./user.controller";

const router = Router();

router.patch(
  "/profile",
  authMiddleware,
  userController.updateProfile
);

router.patch(
  "/change-password",
  authMiddleware,
  userController.changePassword
);

export default router;