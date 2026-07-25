import { NotificationType } from "@prisma/client";

import { prisma } from "../../lib/prisma";

import { formatNotification } from "../../utils/mappers/notification.mapper";
import { getIO } from "../../socket/socket";

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

    const io = getIO();

      io.to(

          `user-${userId}`

      ).emit(

          "notification:new",

          notification

    );

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

  const updated =

    await prisma.notification.updateMany({

      where: {

        id: notificationId,

        userId,

      },

      data: {

        isRead: true,

      },

    });

  const io = getIO();

  io.to(

    `user-${userId}`

  ).emit(

    "notification:read",

    notificationId

  );

  return updated;

},

  async markAllAsRead(

  userId: string

) {

  const updated =

    await prisma.notification.updateMany({

      where: {

        userId,

      },

      data: {

        isRead: true,

      },

    });

  const io = getIO();

  io.to(

    `user-${userId}`

  ).emit(

    "notification:all-read"

  );

  return updated;

},
};