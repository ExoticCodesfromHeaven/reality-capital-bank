import { z } from "zod";

export const depositSchema = z.object({
  accountNumber: z.string(),

  amount: z.coerce.number().positive(),

  narration: z.string().max(200).optional(),
});

export type DepositInput =
  z.infer<typeof depositSchema>;