import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";
import { accountController } from "./account.controller";

const router = Router();

router.get(
  "/verify/:accountNumber",
  authMiddleware,
  accountController.verifyAccount
);

router.get(
  "/:accountNumber",
  authMiddleware,
  accountController.getAccount
);

export default router;