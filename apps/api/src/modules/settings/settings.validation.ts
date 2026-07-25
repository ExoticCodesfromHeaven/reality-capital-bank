import { z } from "zod";

export const createSettingSchema = z.object({

  key: z
    .string()
    .trim()
    .min(2)
    .max(100),

  description: z
    .string()
    .trim()
    .max(255)
    .optional(),

  value: z.any(),

});



export const updateSettingSchema = z.object({

  value: z.any(),

});



export const upsertSettingSchema = z.object({

  key: z
    .string()
    .trim()
    .min(2)
    .max(100),

  description: z
    .string()
    .trim()
    .max(255)
    .optional(),

  value: z.any(),

});



export type CreateSettingInput =
  z.infer<typeof createSettingSchema>;

export type UpdateSettingInput =
  z.infer<typeof updateSettingSchema>;

export type UpsertSettingInput =
  z.infer<typeof upsertSettingSchema>;