import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { withdrawalService } from "./withdrawal.service";
import { withdrawalSchema } from "./withdrawal.validation";

export const withdrawalController = {
  async withdraw(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const data =
        withdrawalSchema.parse(req.body);

      const account =
        await withdrawalService.withdraw(
          data.accountNumber,
          data.amount,
          data.narration
        );

      res.status(200).json({
        success: true,
        message:
          "Withdrawal successful.",
        data: account,
      });

    } catch (error) {
      next(error);
    }
  },
};