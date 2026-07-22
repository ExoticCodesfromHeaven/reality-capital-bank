import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";
import { transferController } from "./transfer.controller";

const router = Router();

router.post(
  "/local",
  authMiddleware,
  transferController.localTransfer
);

export default router;