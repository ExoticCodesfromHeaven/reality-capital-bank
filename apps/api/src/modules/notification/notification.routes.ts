import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";
import { notificationController } from "./notification.controller";

const router = Router();

router.get(
  "/",
  authMiddleware,
  notificationController.getNotifications
);

router.patch(
  "/:id/read",
  authMiddleware,
  notificationController.markAsRead
);

router.patch(
  "/read-all",
  authMiddleware,
  notificationController.markAllAsRead
);

export default router;