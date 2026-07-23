export function formatNotification(
  notification: any
) {
  return {

    id: notification.id,

    title: notification.title,

    message: notification.message,

    type: notification.type,

    isRead: notification.isRead,

    createdAt:
      notification.createdAt,

  };
}