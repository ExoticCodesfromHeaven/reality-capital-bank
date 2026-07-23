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

  async getAccount(
    req: Request<{ accountNumber:string }>,
    res: Response,
    next: NextFunction
    ) {
    try {
        const account =
        await accountService.getAccount(
            req.params.accountNumber,
            req.user.id
        );

        res.status(200).json(account);
    } catch (error) {
        next(error);
    }
},

async verifyAccount(
  req: Request<{ accountNumber: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const account =
      await accountService.verifyAccount(
        req.params.accountNumber
      );

    res.json({
      success: true,
      data: account,
    });
  } catch (error) {
    next(error);
  }
},
};