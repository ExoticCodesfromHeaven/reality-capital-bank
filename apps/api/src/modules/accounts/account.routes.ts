import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";
import { accountController } from "./account.controller";

const router = Router();

router.get(
  "/",
  authMiddleware,
  accountController.getAccounts
);

export default router;