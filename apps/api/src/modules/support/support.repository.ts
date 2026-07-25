import { prisma } from "../../lib/prisma";
import { Prisma, TicketStatus } from "@prisma/client";
import { AppError } from "../../errors/AppError";

export const supportRepository = {

  async createTicket(data: {
    ticketNumber: string;
    subject: string;
    category: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    message: string;
    createdById: string;
  }) {

    return prisma.supportTicket.create({

      data: {

        ticketNumber: data.ticketNumber,

        subject: data.subject,

        category: data.category,

        priority: data.priority,

        createdBy: {
          connect: {
            id: data.createdById,
          },
        },

        messages: {

          create: {

    message: data.message,

    senderType: "CUSTOMER",

    sender: {
        connect: {
            id: data.createdById,
        },
    },

    isAdmin: false,

},

        },

      },

      include: {

        messages: {
          include: {
            sender: true,
          },
        },

      },

    });

  },



  async getUserTickets(userId: string) {

    return prisma.supportTicket.findMany({

      where: {

        createdById: userId,

      },

      include: {

        assignedTo: true,

      },

      orderBy: {

        updatedAt: "desc",

      },

    });

  },



  async getTicket(id: string) {

    return prisma.supportTicket.findUnique({

      where: {

        id,

      },

      include: {

        createdBy: true,

        assignedTo: true,

        messages: {

          include: {

            sender: {

              select: {

                id: true,

                firstName: true,

                lastName: true,

                role: true,

              },

            },

          },

          orderBy: {

            createdAt: "asc",

          },

        },

      },

    });

  },

  async getTicketByMessageId(
  messageId: string
) {

  return prisma.supportMessage.findUnique({

    where: {
      id: messageId,
    },

    select: {
      ticketId: true,
    },

  });

},

  async createReply(
    ticketId: string,
    senderId: string,
    message: string,
    isAdmin: boolean
  ) {

    return prisma.supportMessage.create({

      data: {

    message,

    isAdmin,

    senderType: isAdmin
        ? "ADMIN"
        : "CUSTOMER",

    sender: {

        connect: {

            id: senderId,

        },

    },

    ticket: {

        connect: {

            id: ticketId,

        },

    },

},

    });

  },



  async touchTicket(id: string) {

    return prisma.supportTicket.update({

      where: {

        id,

      },

      data: {

        updatedAt: new Date(),

      },

    });

  },



  async getAllTickets() {

    return prisma.supportTicket.findMany({

      include: {

        createdBy: {

          select: {

            firstName: true,

            lastName: true,

            email: true,

          },

        },

        assignedTo: {

          select: {

            firstName: true,

            lastName: true,

          },

        },

      },

      orderBy: {

        updatedAt: "desc",

      },

    });

  },



  async assignTicket(
  ticketId: string,
  adminId: string
) {

  return prisma.supportTicket.update({

    where: {
      id: ticketId,
    },

    data: {

      assignedTo: {
        connect: {
          id: adminId,
        },
      },

      status: TicketStatus.ASSIGNED,

    },

    include: {

      assignedTo: true,

      createdBy: true,

    },

  });

},



  async updateStatus(
    ticketId: string,
    status: any
  ) {

    return prisma.supportTicket.update({

      where: {

        id: ticketId,

      },

      data: {

        status,

      },

    });

  },

  async createMessage(
  data: Prisma.SupportMessageCreateInput
) {

  return prisma.supportMessage.create({
  data,
  include: {
    sender: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
      },
    },
  },
});

},

async getMessages(
  ticketId: string
) {

  return prisma.supportMessage.findMany({

    where: {

      ticketId,

    },

    include: {

      sender: {

        select: {

          id: true,

          firstName: true,

          lastName: true,

          avatar: true,

        },

      },

    },

    orderBy: {

      createdAt: "asc",

    },

  });

},

async markAsRead(
  ticketId: string,
  readerId: string
) {

  return prisma.supportMessage.updateMany({

    where: {

      ticketId,

      senderId: {

        not: readerId,

      },

      isRead: false,

    },

    data: {

      isRead: true,

    },

  });

},

async updateTicketStatus(

  ticketId: string,

  status: TicketStatus

) {

  return prisma.supportTicket.update({

    where: {

      id: ticketId,

    },

    data: {

      status,

      lastMessageAt: new Date(),

    },

  });

},

async updateUnread(

  ticketId: string,

  adminUnread: number,

  customerUnread: number

) {

  return prisma.supportTicket.update({

    where: {

      id: ticketId,

    },

    data: {

      adminUnread,

      customerUnread,

    },

  });

},

async getTicketById(
  id: string
) {

  return prisma.supportTicket.findUnique({

    where: {

      id,

    },

    include: {

      createdBy: true,

      assignedTo: true,

    },

  });

},

async editMessage(
  messageId: string,
  senderId: string,
  message: string
) {
  return prisma.supportMessage.updateMany({

    where: {
      id: messageId,
      senderId,
    },

    data: {
      message,
      edited: true,
      editedAt: new Date(),
    },

  });
},

async deleteMessage(
  messageId: string,
  senderId: string
) {

  const existing =
    await prisma.supportMessage.findUnique({

      where: {
        id: messageId,
      },

    });

  if (!existing) {

    return null;

  }

  if (existing.senderId !== senderId) {

    throw new AppError(
      "Unauthorized.",
      403
    );

  }

  return prisma.supportMessage.update({

    where: {
      id: messageId,
    },

    data: {

      message:
        "This message was deleted.",

      attachmentUrl: null,

      attachmentName: null,

      attachmentType: null,

      edited: false,

      editedAt: null,

      isSystemMessage: true,

    },

    include: {

      sender: {

        select: {

          id: true,

          firstName: true,

          lastName: true,

          avatar: true,

        },

      },

    },

  });

},

async getMessageById(id: string) {

  return prisma.supportMessage.findUnique({

    where: {

      id,

    },

  });

}

};