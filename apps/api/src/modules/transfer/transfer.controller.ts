import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { transferService } from "./transfer.service";
import { localTransferSchema } from "./transfer.validation";

export const transferController = {
  async localTransfer(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        localTransferSchema.parse(req.body);

      const result =
        await transferService.localTransfer(
          req.user.id,
          data.recipientAccountNumber,
          data.amount,
          data.narration
        );

      res.status(200).json({
        success: true,
        message: "Transfer successful.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getTransfers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const transfers =
        await transferService.getTransfers(
          req.user.id
        );

      res.json({
        success: true,
        data: transfers,
      });
    } catch (error) {
      next(error);
    }
  },
};