import { z } from "zod";


export const createJointInvestmentSchema = z.object({

  accountId: z.uuid(),

  name: z
    .string()
    .min(3)
    .optional(),

  amount: z
    .number()
    .positive(),

  durationMonths: z
    .enum([
      "3",
      "6",
      "12",
      "24",
    ])
    .transform(Number),

});


export const inviteParticipantSchema = z.object({

  email: z.email(),

  contribution: z
  .string()
  .refine(
    (value)=>Number(value)>0,
    "Contribution must be greater than zero."
  ),

  accountId: z.uuid(),

});