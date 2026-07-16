import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().trim().min(2).max(50),

  middleName: z.string().trim().max(50).optional(),

  lastName: z.string().trim().min(2).max(50),

  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(4)
    .max(20)
    .regex(/^[a-z0-9_]+$/, {
      message:
        "Username can only contain lowercase letters, numbers and underscores.",
    }),

  email: z.email().transform((email) => email.toLowerCase()),

  phone: z.string().optional(),

  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must contain an uppercase letter.")
    .regex(/[a-z]/, "Must contain a lowercase letter.")
    .regex(/[0-9]/, "Must contain a number.")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character."),

  countryId: z.uuid(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const verifyEmailSchema = z.object({
  userId: z.uuid(),

  code: z
    .string()
    .trim()
    .length(6, "OTP must be exactly 6 digits.")
    .regex(/^\d+$/, "OTP must contain only numbers."),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;