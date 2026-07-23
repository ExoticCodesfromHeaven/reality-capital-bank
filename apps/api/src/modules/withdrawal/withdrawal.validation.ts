import { z } from "zod";

export const withdrawalSchema = z.object({
  accountNumber: z.string(),

  amount: z.coerce.number().positive(),

  narration: z.string().max(200).optional(),
});

export type WithdrawalInput =
  z.infer<typeof withdrawalSchema>;