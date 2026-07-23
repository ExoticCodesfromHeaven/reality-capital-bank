import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { depositService } from "./deposit.service";
import { depositSchema } from "./deposit.validation";

export const depositController = {

  async deposit(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const data =
        depositSchema.parse(req.body);

      const account =
        await depositService.deposit(
          data.accountNumber,
          data.amount,
          data.narration
        );

      res.status(200).json({
        success: true,
        message:
          "Deposit successful.",
        data: account,
      });

    } catch (error) {
      next(error);
    }
  },

};