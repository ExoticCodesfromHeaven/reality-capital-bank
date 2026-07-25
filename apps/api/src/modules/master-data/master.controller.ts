import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { masterService } from "./master.service";

export const masterController = {

  // =========================
  // CURRENCIES
  // =========================

  async getCurrencies(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const currencies =
        await masterService.getCurrencies();

      res.json({

        success: true,

        data: currencies,

      });

    } catch (error) {

      next(error);

    }

  },


  async createCurrency(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const currency =
        await masterService.createCurrency(
          req.body
        );

      res.status(201).json({

        success: true,

        message:
          "Currency created successfully.",

        data: currency,

      });

    } catch (error) {

      next(error);

    }

  },


  async updateCurrency(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {

    try {

      const currency =
        await masterService.updateCurrency(

          req.params.id,

          req.body

        );

      res.json({

        success: true,

        message:
          "Currency updated successfully.",

        data: currency,

      });

    } catch (error) {

      next(error);

    }

  },


  async deleteCurrency(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {

    try {

      await masterService.deleteCurrency(
        req.params.id
      );

      res.json({

        success: true,

        message:
          "Currency deleted successfully.",

      });

    } catch (error) {

      next(error);

    }

  },



  // =========================
  // COUNTRIES
  // =========================

  async getCountries(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const countries =
        await masterService.getCountries();

      res.json({

        success: true,

        data: countries,

      });

    } catch (error) {

      next(error);

    }

  },


  async createCountry(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const country =
        await masterService.createCountry(
          req.body
        );

      res.status(201).json({

        success: true,

        message:
          "Country created successfully.",

        data: country,

      });

    } catch (error) {

      next(error);

    }

  },


  async updateCountry(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {

    try {

      const country =
        await masterService.updateCountry(

          req.params.id,

          req.body

        );

      res.json({

        success: true,

        message:
          "Country updated successfully.",

        data: country,

      });

    } catch (error) {

      next(error);

    }

  },


  async deleteCountry(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {

    try {

      await masterService.deleteCountry(
        req.params.id
      );

      res.json({

        success: true,

        message:
          "Country deleted successfully.",

      });

    } catch (error) {

      next(error);

    }

  },

};