import { z } from "zod";

export const createBeneficiarySchema = z.object({
  accountNumber: z.string().min(10).max(20),

  nickname: z.string().max(50).optional(),
});

export type CreateBeneficiaryInput =
  z.infer<typeof createBeneficiarySchema>;