import { z } from "zod";

export const updateCurrencySchema = z.object({

  exchangeRate:

    z.number()

      .positive()

      .optional(),

  symbol:

    z.string()

      .max(5)

      .optional(),

});