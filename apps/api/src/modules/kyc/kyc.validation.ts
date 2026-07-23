import { z } from "zod";

export const rejectKycSchema = z.object({
  reason: z
    .string()
    .min(5, "Reason must be at least 5 characters."),
});