import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).max(50),

  middleName: z.string().max(50).optional(),

  lastName: z.string().min(2).max(50),

  phone: z.string().min(7).max(20),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),

  newPassword: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      "Password must contain uppercase, lowercase, number and special character."
    ),
});

export type ChangePasswordInput =
  z.infer<typeof changePasswordSchema>;

export type UpdateProfileInput =
  z.infer<typeof updateProfileSchema>;