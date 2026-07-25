import { z } from "zod";

export const createCurrencySchema = z.object({

  code: z
    .string()
    .trim()
    .length(3)
    .transform(value => value.toUpperCase()),

  name: z
    .string()
    .trim()
    .min(2)
    .max(100),

  symbol: z
    .string()
    .trim()
    .min(1)
    .max(10),

  exchangeRate: z
    .number()
    .positive(),

});

export const updateCurrencySchema =
  createCurrencySchema.partial();





export const createCountrySchema = z.object({

  name: z
    .string()
    .trim()
    .min(2)
    .max(100),

  isoCode: z
    .string()
    .trim()
    .length(2)
    .transform(value => value.toUpperCase()),

  phoneCode: z
    .string()
    .trim()
    .min(2)
    .max(6),

  flagEmoji:
    z.string().optional(),

  currencyId:
    z.string().uuid(),

});

export const updateCountrySchema =
  createCountrySchema.partial();