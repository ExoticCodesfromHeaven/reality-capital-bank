import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { settingsService } from "./settings.service";

export const settingsController = {

  async getAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const settings =
        await settingsService.getAll();

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
        await settingsService.getSetting(
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



  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const setting =
        await settingsService.create(

          req.body.key,

          req.body.value,

          req.body.description

        );

      res.status(201).json({

        success: true,

        message:
          "Setting created successfully.",

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
        await settingsService.update(

          req.params.key,

          req.body.value

        );

      res.json({

        success: true,

        message:
          "Setting updated successfully.",

        data: setting,

      });

    } catch (error) {

      next(error);

    }

  },



  async upsert(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const setting =
        await settingsService.upsert(

          req.body.key,

          req.body.value,

          req.body.description

        );

      res.json({

        success: true,

        message:
          "Setting saved successfully.",

        data: setting,

      });

    } catch (error) {

      next(error);

    }

  },



  async remove(
    req: Request<{ key: string }>,
    res: Response,
    next: NextFunction
  ) {

    try {

      await settingsService.remove(
        req.params.key
      );

      res.json({

        success: true,

        message:
          "Setting deleted successfully.",

      });

    } catch (error) {

      next(error);

    }

  },

};