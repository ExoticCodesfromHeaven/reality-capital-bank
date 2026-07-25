import type {

  Request,

  Response,

  NextFunction,

} from "express";

import { exchangeRateService } from "./exchange-rate.service";

export const exchangeRateController = {

  async convert(

    req: Request,

    res: Response,

    next: NextFunction

  ) {

    try {

      const {

        amount,

        from,

        to,

      } = req.body;

      const result =
        await exchangeRateService.convert(

          amount,

          from,

          to

        );

      res.json({

        success: true,

        data: {

          amount,

          from,

          to,

          convertedAmount:
            result,

        },

      });

    }

    catch (error) {

      next(error);

    }

  },

};