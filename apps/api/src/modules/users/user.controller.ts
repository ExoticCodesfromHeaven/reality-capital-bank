import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { userService } from "./user.service";
import { updateProfileSchema } from "./user.validation";
import { changePasswordSchema } from "./user.validation";

export const userController = {
  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        updateProfileSchema.parse(req.body);

      const result =
        await userService.updateProfile(
          req.user.id,
          data
        );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    try {
        const data =
        changePasswordSchema.parse(req.body);

        await userService.changePassword(
        req.user.id,
        data.currentPassword,
        data.newPassword
        );

        res.status(200).json({
        message: "Password changed successfully.",
        });
    } catch (error) {
        next(error);
    }
    },
};