import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { accountService } from "./account.service";

export const accountController = {
  async getAccounts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const accounts =
        await accountService.getAccounts(
          req.user.id
        );

      res.status(200).json(accounts);
    } catch (error) {
      next(error);
    }
  },
};