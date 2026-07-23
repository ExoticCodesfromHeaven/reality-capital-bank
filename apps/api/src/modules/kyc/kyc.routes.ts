import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";
import { authorize } from "../../middlewares/authorize.middleware";
import { validate } from "../../middlewares/validate.middleware";

import { kycController } from "./kyc.controller";
import { rejectKycSchema } from "./kyc.validation";

const router = Router();

router.get(
  "/pending",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  kycController.getPending
);

router.get(
  "/:id",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  kycController.getOne
);

router.patch(
  "/:id/approve",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  kycController.approve
);

router.patch(
  "/:id/reject",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  validate(rejectKycSchema),
  kycController.reject
);

export default router;