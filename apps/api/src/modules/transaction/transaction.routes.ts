import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";
import { transactionController } from "./transaction.controller";

const router = Router();

router.get(
  "/",
  authMiddleware,
  transactionController.getTransactions
);

export default router;