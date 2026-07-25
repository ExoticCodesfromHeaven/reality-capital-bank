import { z } from "zod";

export const createInvestmentSchema = z.object({

  accountId: z.uuid(),

  amount: z
    .number()
    .positive(),

  durationMonths: z.enum([
    "3",
    "6",
    "12",
    "24",
  ]).transform(Number),

});

export type CreateInvestmentInput =
  z.infer<
    typeof createInvestmentSchema
  >;