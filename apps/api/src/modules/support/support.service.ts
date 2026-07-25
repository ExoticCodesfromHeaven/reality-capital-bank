import {
  NotificationType,
  TicketStatus,
} from "@prisma/client";

import { AppError } from "../../errors/AppError";

import { supportRepository } from "./support.repository";

import { generateTicketNumber } from "../../utils/ticket-number";

import { notificationService } from "../notification/notification.service";

import { auditService } from "../audit/audit.service";

import { getIO } from "../../socket/socket";

import { uploadService } from "../uploads/upload-service";

export const supportService = {

  async createTicket(
    userId: string,
    data: {
      subject: string;
      category: string;
      priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
      message: string;
    }
  ) {

    const ticketNumber =
      await generateTicketNumber();

    const ticket =
      await supportRepository.createTicket({

        ticketNumber,

        createdById: userId,

        ...data,

      });

    await notificationService.create(

      userId,

      "Support Ticket Created",

      `Your support ticket ${ticketNumber} has been created successfully.`,

      NotificationType.SUCCESS

    );

    await auditService.create(

      userId,

      "SUPPORT_TICKET_CREATED",

      `Created support ticket ${ticketNumber}`

    );

    return ticket;

  },



  async getMyTickets(userId: string) {

    return supportRepository.getUserTickets(userId);

  },
  
  async getTicket(
    ticketId: string,
    userId: string,
    isAdmin = false
  ) {

    const ticket =
      await supportRepository.getTicket(ticketId);

    if (!ticket) {

      throw new AppError(

        "Support ticket not found.",

        404

      );

    }

    if (

      !isAdmin &&

      ticket.createdById !== userId

    ) {

      throw new AppError(

        "You do not have access to this ticket.",

        403

      );

    }

    return ticket;

  },



  async reply(

    ticketId: string,

    senderId: string,

    message: string,

    isAdmin = false

  ) {

    const ticket =
      await supportRepository.getTicket(ticketId);

    if (!ticket) {

      throw new AppError(

        "Support ticket not found.",

        404

      );

    }

    await supportRepository.createReply(

      ticketId,

      senderId,

      message,

      isAdmin

    );

    await supportRepository.touchTicket(ticketId);

    // Customer replied after resolution
    if (

      !isAdmin &&

      ticket.status === TicketStatus.RESOLVED

    ) {

      await supportRepository.updateStatus(

        ticketId,

        TicketStatus.OPEN

      );

    }

    if (isAdmin) {

      await notificationService.create(

        ticket.createdById,

        "Support Reply",

        `Support has replied to your ticket ${ticket.ticketNumber}.`,

        NotificationType.INFO

      );

    } else {

      if (ticket.assignedToId) {

        await notificationService.create(

          ticket.assignedToId,

          "New Support Message",

          `${ticket.createdBy.firstName} sent a new support message.`,

          NotificationType.INFO

        );

      }

    }

    await auditService.create(

      senderId,

      isAdmin
        ? "SUPPORT_REPLY_ADMIN"
        : "SUPPORT_REPLY_CUSTOMER",

      `Replied to ${ticket.ticketNumber}`

    );

    return supportRepository.getTicket(ticketId);

  },



  async getAllTickets() {

    return supportRepository.getAllTickets();

  },



  async assignTicket(
  ticketId: string,
  adminId: string
) {

  const ticket =
    await supportRepository.getTicket(ticketId);

  if (!ticket) {

    throw new AppError(
      "Support ticket not found.",
      404
    );

  }

  if (ticket.assignedToId) {

    throw new AppError(
      "Ticket has already been assigned.",
      400
    );

  }

  const updated =
    await supportRepository.assignTicket(
      ticketId,
      adminId
    );

  await notificationService.create(

    ticket.createdById,

    "Support Ticket Assigned",

    "A support agent has started working on your ticket.",

    NotificationType.INFO

  );

  await auditService.create(

    adminId,

    "SUPPORT_ASSIGNED",

    `Assigned ${ticket.ticketNumber}`

  );

  return updated;

},

  async updateStatus(

    ticketId: string,

    status: TicketStatus,

    adminId: string

  ) {

    const ticket =
      await supportRepository.getTicket(ticketId);

    if (!ticket) {

      throw new AppError(

        "Support ticket not found.",

        404

      );

    }

    await supportRepository.updateStatus(

      ticketId,

      status

    );

    await notificationService.create(

      ticket.createdById,

      "Ticket Updated",

      `Your support ticket ${ticket.ticketNumber} is now ${status.replace("_"," ")}.`,

      NotificationType.INFO

    );

    await auditService.create(

      adminId,

      "SUPPORT_STATUS_UPDATED",

      `${ticket.ticketNumber} -> ${status}`

    );

    return supportRepository.getTicket(ticketId);

  },

  async sendMessage({

  ticketId,

  senderId,

  message,

  attachmentUrl,

  attachmentName,

  attachmentType,

}:{

  ticketId:string;

  senderId:string;

  message:string;

  attachmentUrl?:string;

  attachmentName?:string;

  attachmentType?:string;

}){

  const ticket =
    await supportRepository.getTicketById(
      ticketId
    );

  if(!ticket){

    throw new AppError(

      "Support ticket not found.",

      404

    );

  }

  const isCustomer =

    ticket.createdById === senderId;

  const isAssignedAdmin =

    ticket.assignedToId === senderId;

  if(

    !isCustomer &&

    !isAssignedAdmin

  ){

    throw new AppError(

      "Unauthorized.",

      403

    );

  }

  const created =
    await supportRepository.createMessage({

    message,

    attachmentUrl: attachmentUrl ?? null,

    attachmentName: attachmentName ?? null,

    attachmentType: attachmentType ?? null,

    senderType: isCustomer
        ? "CUSTOMER"
        : "ADMIN",

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

});

    const io = getIO();

    io.to(`ticket-${ticketId}`).emit(
      "support:new-message",
      created
    );

      if(isCustomer){

    await supportRepository.updateTicketStatus(

      ticketId,

      TicketStatus.WAITING_FOR_SUPPORT

    );

    await notificationService.create(

      ticket.assignedToId!,

      "New Support Message",

      `${ticket.createdBy.firstName} sent a new support message.`,

      NotificationType.INFO

    );

  }else{

    await supportRepository.updateTicketStatus(

      ticketId,

      TicketStatus.WAITING_FOR_CUSTOMER

    );

    await notificationService.create(

      ticket.createdById,

      "Support Reply",

      "Support has replied to your ticket.",

      NotificationType.INFO

    );

  }

    await auditService.create(

    senderId,

    "SUPPORT_MESSAGE_SENT",

    `Sent message to ticket ${ticket.ticketNumber}`

  );

  return created;

},

async getMessages(

  ticketId:string,

  userId:string

){

  const ticket =
    await supportRepository.getTicketById(
      ticketId
    );

  if(!ticket){

    throw new AppError(

      "Ticket not found.",

      404

    );

  }

  const allowed =

    ticket.createdById === userId ||

    ticket.assignedToId === userId;

  if(!allowed){

    throw new AppError(

      "Unauthorized.",

      403

    );

  }

  await supportRepository.markAsRead(

    ticketId,

    userId

  );

  const io = getIO();

io.to(`ticket-${ticketId}`).emit(
  "support:messages-read",
  {
    ticketId,
    readerId: userId,
  }
);

  return supportRepository.getMessages(
    ticketId
  );

},

async editMessage(

  messageId: string,

  senderId: string,

  message: string

) {

  const updated =
    await supportRepository.editMessage(

      messageId,

      senderId,

      message

    );

  if (updated.count === 0) {

    throw new AppError(

      "Message not found or unauthorized.",

      404

    );

  }

  const io = getIO();

  const ticket =
  await supportRepository.getTicketByMessageId(
    messageId
  );

if (!ticket) {

    throw new AppError(
        "Message not found.",
        404
    );

}

io.to(
    `ticket-${ticket.ticketId}`
).emit(
    "support:message-edited",
    {
        messageId,
        message,
        edited: true,
        editedAt: new Date(),
    }
);

  await auditService.create(

    senderId,

    "SUPPORT_MESSAGE_EDITED",

    `Edited support message ${messageId}`

  );

  return {

    success: true,

  };

},

async deleteMessage(

  messageId: string,

  senderId: string

) {

  const message =
    await supportRepository.getMessageById(
      messageId
    );

  if (!message) {

    throw new AppError(

      "Message not found.",

      404

    );

  }

  if (message.attachmentUrl) {

    const publicId =
      uploadService.getPublicId(
        message.attachmentUrl
      );

    if (publicId) {

      await uploadService.deleteFile(
        publicId
      );

    }

  }

  const deleted =
    await supportRepository.deleteMessage(

      messageId,

      senderId

    );

  if (!deleted) {

    throw new AppError(

      "Message not found.",

      404

    );

  }

  const io = getIO();

  io.to(
    `ticket-${deleted.ticketId}`
  ).emit(

    "support:message-deleted",

    deleted

  );

  await auditService.create(

    senderId,

    "SUPPORT_MESSAGE_DELETED",

    `Deleted support message ${messageId}`

  );

  return deleted;

},

};