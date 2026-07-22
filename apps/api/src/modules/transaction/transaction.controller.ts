import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { transactionService } from "./transaction.service";

export const transactionController = {
  async getTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const transactions =
        await transactionService.getTransactions(
          req.user.id
        );

      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  },
};