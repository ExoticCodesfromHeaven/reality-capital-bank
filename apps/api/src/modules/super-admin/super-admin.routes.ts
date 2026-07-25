import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";
import { authorize } from "../../middlewares/authorize.middleware";
import { validate } from "../../middlewares/validate.middleware";

import { superAdminController } from "./super-admin.controller";

const router = Router();

router.use(
  authMiddleware,
  authorize("SUPER_ADMIN")
);

router.get(
  "/admins",
  superAdminController.getAdmins
);

router.get(
  "/admins/:id",
  superAdminController.getAdmin
);

router.patch(
  "/admins/:id/promote",
  superAdminController.promoteToAdmin
);

router.patch(
  "/admins/:id/demote",
  superAdminController.demoteAdmin
);

export default router;