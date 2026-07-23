import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";
import { beneficiaryController } from "./beneficiary.controller";

const router = Router();

router.post(
  "/",
  authMiddleware,
  beneficiaryController.create
);

router.get(
  "/",
  authMiddleware,
  beneficiaryController.getAll
);

router.delete(
  "/:id",
  authMiddleware,
  beneficiaryController.delete
);

export default router;