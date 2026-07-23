import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";
import { statementController } from "./statement.controller";

const router = Router();

router.get(
  "/",
  authMiddleware,
  statementController.getStatement
);

export default router;