import { z } from "zod";

/* ===========================
   LOGIN
=========================== */

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),

  password: z.string().min(6, "Password is required"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

/* ===========================
   REGISTER
=========================== */

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First Name is required"),

    middleName: z.string().optional(),

    lastName: z.string().min(1, "Last Name is required"),

    username: z
      .string()
      .min(1, "Username is required")
      .min(4, "Username must be at least 4 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address format"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),

    confirmPassword: z.string(),

    countryId: z.string().min(1, "Please select a country"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

export const verifyEmailSchema = z.object({
  email: z.string().email().min(1, "Email cannot be empty"),

  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    email: z.string().email(),

    otp: z.string().length(6, "OTP must be 6 digits"),

    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, "Must contain uppercase")
      .regex(/[a-z]/, "Must contain lowercase")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[^A-Za-z0-9]/, "Must contain a symbol"),

    confirmPassword: z.string(),
  })

  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;