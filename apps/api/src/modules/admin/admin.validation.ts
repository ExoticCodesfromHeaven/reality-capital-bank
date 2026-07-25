import { z } from "zod";

export const adminCreditSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be greater than zero."),

  narration: z
    .string()
    .trim()
    .max(255)
    .optional(),
});

export type AdminCreditInput =
  z.infer<typeof adminCreditSchema>;