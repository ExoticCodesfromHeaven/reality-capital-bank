import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { superAdminService } from "./super-admin.service";
import { AppError } from "../../errors/AppError";

export const superAdminController = {

  async getAdmins(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const admins =
        await superAdminService.getAdmins();

      res.json({
        success: true,
        data: admins,
      });

    } catch (error) {
      next(error);
    }

  },



  async getAdmin(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {

    try {

      const admin =
        await superAdminService.getAdmin(
          req.params.id
        );

      res.json({
        success: true,
        data: admin,
      });

    } catch (error) {
      next(error);
    }

  },



  async promoteToAdmin(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {

    try {

      const admin =
        await superAdminService.promoteToAdmin(
          req.params.id,
          req.user.id
        );

      if (admin.role.name === "ADMIN") {
        throw new AppError(
          "User is already an admin.",
          400
        );
      }

      if (admin.role.name === "SUPER_ADMIN") {
        throw new AppError(
          "Cannot modify a Super Admin.",
          400
        );
      }

      res.json({
        success: true,
        message: "User promoted successfully.",
        data: admin,
      });

    } catch (error) {
      next(error);
    }

  },



  async demoteAdmin(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {

    try {

      const user =
        await superAdminService.demoteAdmin(
          req.params.id,
          req.user.id
        );

      if (user.role.name === "CUSTOMER") {
        throw new AppError(
          "User is already a customer.",
          400
        );
      }

      if (user.role.name === "SUPER_ADMIN") {
        throw new AppError(
          "Super Admin cannot be demoted.",
          400
        );
      }

      res.json({
        success: true,
        message:
          "Admin demoted successfully.",
        data: user,
      });

    } catch (error) {
      next(error);
    }

  },

};