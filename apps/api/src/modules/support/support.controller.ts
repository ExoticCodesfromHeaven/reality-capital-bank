import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { supportService } from "./support.service";

type TicketParams = {
  ticketId: string;
};

type TicketIdParams = {
  id: string;
};

export const supportController = {

  async createTicket(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const ticket =
        await supportService.createTicket(

          req.user.id,

          req.body

        );

      res.status(201).json({

        success: true,

        message:
          "Support ticket created successfully.",

        data: ticket,

      });

    } catch (error) {

      next(error);

    }

  },

  async getMyTickets(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const tickets =
        await supportService.getMyTickets(

          req.user.id

        );

      res.json({

        success: true,

        data: tickets,

      });

    } catch (error) {

      next(error);

    }

  },



  async getTicket(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {

    try {

      const ticket =
        await supportService.getTicket(

          req.params.id,

          req.user.id,

          req.user.role === "ADMIN" ||
          req.user.role === "SUPER_ADMIN"

        );

      res.json({

        success: true,

        data: ticket,

      });

    } catch (error) {

      next(error);

    }

  },



  async reply(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {

    try {

      const ticket =
        await supportService.reply(

          req.params.id,

          req.user.id,

          req.body.message,

          req.user.role === "ADMIN" ||
          req.user.role === "SUPER_ADMIN"

        );

      res.json({

        success: true,

        message:
          "Reply sent successfully.",

        data: ticket,

      });

    } catch (error) {

      next(error);

    }

  },



  async getAllTickets(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const tickets =
        await supportService.getAllTickets();

      res.json({

        success: true,

        data: tickets,

      });

    } catch (error) {

      next(error);

    }

  },



  async assignTicket(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {

    try {

      const ticket =
        await supportService.assignTicket(

          req.params.id,

          req.user.id

        );

      res.json({

        success: true,

        message:
          "Ticket assigned successfully.",

        data: ticket,

      });

    } catch (error) {

      next(error);

    }

  },



  async updateStatus(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {

    try {

      const ticket =
        await supportService.updateStatus(

          req.params.id,

          req.body.status,

          req.user.id

        );

      res.json({

        success: true,

        message:
          "Ticket updated successfully.",

        data: ticket,

      });

    } catch (error) {

      next(error);

    }

  },

  async sendMessage(

  req: Request<TicketParams>,

  res: Response,

  next: NextFunction

) {

  try {

    const payload = {

        ticketId: req.params.ticketId,

        senderId: req.user.id,

        message: req.body.message,

        ...(req.file && {

          attachmentUrl: req.file.path,

          attachmentName: req.file.originalname,

          attachmentType: req.file.mimetype,

        }),

      };

      const message = await supportService.sendMessage(payload);

    return res.status(201).json({

      success: true,

      message: "Message sent successfully.",

      data: message,

    });

  } catch (error) {

    next(error);

  }

},

async getMessages(

  req: Request<TicketParams>,

  res: Response,

  next: NextFunction

) {

  try {

    const messages =
      await supportService.getMessages(

        req.params.ticketId,

        req.user.id

      );

    return res.json({

      success: true,

      data: messages,

    });

  } catch (error) {

    next(error);

  }

}

};

export const editMessage = async (

  req: Request,

  res: Response,

  next: NextFunction

) => {

  try {

    const messageId = Array.isArray(req.params.messageId)
      ? req.params.messageId[0]
      : req.params.messageId;

    if (!messageId) {
      throw new Error('messageId is required');
    }

    const result =
      await supportService.editMessage(

        messageId,

        req.user.id,

        req.body.message

      );

    res.json({

      success: true,

      data: result,

    });

  } catch (error) {

    next(error);

  }

};

export const deleteMessage = async (

  req: Request,

  res: Response,

  next: NextFunction

) => {

  try {

    const result =
      await supportService.deleteMessage(

        req.params.messageId as string,

        req.user.id

      );

    res.json({

      success: true,

      data: result,

    });

  } catch (error) {

    next(error);

  }

};