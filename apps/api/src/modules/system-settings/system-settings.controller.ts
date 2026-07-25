import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { systemSettingsService } from "./system-settings.service";

export const systemSettingsController = {

  async getAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const settings =
        await systemSettingsService.getAll();

      res.json({

        success: true,

        data: settings,

      });

    } catch (error) {

      next(error);

    }

  },



  async getOne(
    req: Request<{ key: string }>,
    res: Response,
    next: NextFunction
  ) {

    try {

      const setting =
        await systemSettingsService.getOne(
          req.params.key
        );

      res.json({

        success: true,

        data: setting,

      });

    } catch (error) {

      next(error);

    }

  },



  async update(
    req: Request<{ key: string }>,
    res: Response,
    next: NextFunction
  ) {

    try {

      const setting =
        await systemSettingsService.update(

          req.params.key,

          req.body.value,

          req.body.description,

          req.user.id

        );

      res.json({

        success: true,

        message:
          "System setting updated successfully.",

        data: setting,

      });

    } catch (error) {

      next(error);

    }

  },

};