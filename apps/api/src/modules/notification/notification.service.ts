import { NotificationType } from "@prisma/client";

import { prisma } from "../../lib/prisma";

import { formatNotification } from "../../utils/mappers/notification.mapper";
import { registerSocketHandlers } from "../../socket/socket.handlers";

export const notificationService = {
  async create(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = NotificationType.INFO
  ) {
    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,

        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return formatNotification(notification);
  },

  async getNotifications(userId: string) {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return notifications.map(formatNotification);
  },

  async markAsRead(
    notificationId: string,
    userId: string
  ) {
    return prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },

      data: {
        isRead: true,
      },
    });
  },

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
      },

      data: {
        isRead: true,
      },
    });
  },
};