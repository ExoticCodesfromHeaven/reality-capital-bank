import { z } from "zod";

export const convertCurrencySchema =

z.object({

  amount:

    z.number().positive(),

  from:

    z.string().length(3),

  to:

    z.string().length(3),

});