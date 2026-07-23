import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { adminService } from "./admin.service";

export const adminController = {
  async dashboard(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        await adminService.dashboard();

      res.json({
        success: true,
        message:
          "Dashboard loaded successfully.",
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getUsers(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users =
      await adminService.getUsers();

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
},

async getUser(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const user =
      await adminService.getUser(
        req.params.id
      );

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
},

async freezeAccount(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {

  try {

    const account =
      await adminService.freezeAccount(
        req.params.id
      );

    res.json({
      success: true,
      message:
        "Account frozen successfully.",
      data: account,
    });

  } catch (error) {
    next(error);
  }

},

async unfreezeAccount(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {

  try {

    const account =
      await adminService.unfreezeAccount(
        req.params.id
      );

    res.json({
      success: true,
      message:
        "Account unfrozen successfully.",
      data: account,
    });

  } catch (error) {
    next(error);
  }

},

async getTransactions(
  req: Request,
  res: Response,
  next: NextFunction
) {

  try {

    const transactions =
      await adminService.getTransactions();

    res.json({
      success: true,
      data: transactions,
    });

  } catch(error) {

    next(error);

  }

},


async getTransaction(
  req: Request<{id:string}>,
  res: Response,
  next: NextFunction
) {

  try {

    const transaction =
      await adminService.getTransaction(
        req.params.id
      );


    res.json({
      success:true,
      data:transaction,
    });


  } catch(error) {

    next(error);

  }

},
};