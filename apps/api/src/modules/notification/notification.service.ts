import { NotificationType } from "@prisma/client";

import { prisma } from "../../lib/prisma";

import { formatNotification } from "../../utils/mappers/notification.mapper";

export const notificationService = {
  async create(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = NotificationType.INFO
  ) {
    return prisma.notification.create({
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