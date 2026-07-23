import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";
import { depositController } from "./deposit.controller";

const router = Router();

router.post(
  "/",
  authMiddleware,
  depositController.deposit
);

export default router;