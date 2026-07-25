import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { supportService } from "./support.service";

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

};