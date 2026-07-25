import { z } from "zod";

export const updateSettingSchema = z.object({

  value: z.any(),

  description: z
    .string()
    .max(255)
    .optional(),

});

export type UpdateSettingInput =
  z.infer<typeof updateSettingSchema>;