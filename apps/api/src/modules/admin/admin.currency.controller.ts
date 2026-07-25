import type {

  Request,

  Response,

  NextFunction,

} from "express";

import { adminCurrencyService } from "./admin.currency.service";

export const adminCurrencyController = {

  async getCurrencies(

    _req: Request,

    res: Response,

    next: NextFunction

  ) {

    try {

      const currencies =

        await adminCurrencyService.getCurrencies();

      res.json({

        success: true,

        data: currencies,

      });

    }

    catch (error) {

      next(error);

    }

  },



  async getCurrency(

    req: Request,

    res: Response,

    next: NextFunction

  ) {

    try {

      const { id } = req.params;

      if (typeof id !== "string") {
        throw new Error("Invalid currency id.");
      }

      const currency =

        await adminCurrencyService.getCurrency(id);

      res.json({

        success: true,

        data: currency,

      });

    }

    catch (error) {

      next(error);

    }

  },



  async updateCurrency(

    req: Request,

    res: Response,

    next: NextFunction

  ) {

    try {

      const { id } = req.params;

      if (typeof id !== "string") {
        throw new Error("Invalid currency id.");
      }

      const currency =

        await adminCurrencyService.updateCurrency(

          id,

          req.body.exchangeRate,

          req.body.symbol

        );

      res.json({

        success: true,

        message:

          "Currency updated successfully.",

        data: currency,

      });

    }

    catch (error) {

      next(error);

    }

  },



  async toggleCurrency(

    req: Request,

    res: Response,

    next: NextFunction

  ) {

    try {

      const { id } = req.params;

      if (typeof id !== "string") {
        throw new Error("Invalid currency id.");
      }

      const currency =

        await adminCurrencyService.toggleCurrency(
          id
        );

      res.json({

        success: true,

        message:

          "Currency updated successfully.",

        data: currency,

      });

    }

    catch (error) {

      next(error);

    }

  },

};