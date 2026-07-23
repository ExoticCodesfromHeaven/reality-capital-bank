import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { notificationService } from "./notification.service";

export const notificationController = {
  async getNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const notifications =
        await notificationService.getNotifications(
          req.user.id
        );

      res.json({
        success: true,
        message:
          "Notifications retrieved successfully.",
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  },

  async markAsRead(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      await notificationService.markAsRead(
        req.params.id,
        req.user.id
      );

      res.json({
        success: true,
        message:
          "Notification marked as read.",
      });
    } catch (error) {
      next(error);
    }
  },

  async markAllAsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await notificationService.markAllAsRead(
        req.user.id
      );

      res.json({
        success: true,
        message:
          "All notifications marked as read.",
      });
    } catch (error) {
      next(error);
    }
  },
};