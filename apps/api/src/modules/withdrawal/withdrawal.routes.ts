import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";
import { withdrawalController } from "./withdrawal.controller";

const router = Router();

router.post(
  "/",
  authMiddleware,
  withdrawalController.withdraw
);

export default router;