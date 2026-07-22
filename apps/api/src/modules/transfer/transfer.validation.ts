import { z } from "zod";

export const localTransferSchema = z.object({
  recipientAccountNumber: z.string(),

  amount: z.coerce.number().positive(),

  narration: z.string().max(200).optional(),
});

export type LocalTransferInput =
  z.infer<typeof localTransferSchema>;