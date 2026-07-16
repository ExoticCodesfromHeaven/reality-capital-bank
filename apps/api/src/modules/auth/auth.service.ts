import { UserStatus } from "@prisma/client";

import { authRepository } from "./auth.repository";
import { passwordService } from "./password.service";
import { otpService } from "./otp.service";

import { accountService } from "../accounts/account.service";

import { generateAccountName } from "../../utils/account-name";
import { getCurrencyByCountry } from "../../utils/country-currency";
import { isUsernameAvailable } from "../../utils/username";

import type { 
  RegisterInput,
  VerifyEmailInput,
 } from "./auth.validation";

import { emailService } from "./email.service";
import { verifyEmailTemplate } from "../../emails/verify-email";

export const authService = {
  async register(data: RegisterInput) {
    // 1. Check email
    const existingEmail = await authRepository.findByEmail(data.email);

    if (existingEmail) {
      throw new Error("Email already exists.");
    }

    // 2. Check username
    const usernameAvailable = await isUsernameAvailable(data.username);

    if (!usernameAvailable) {
      throw new Error("Username already taken.");
    }

    // 3. Hash password
    const hashedPassword = await passwordService.hash(data.password);

    // 4. Get country & currency
    const currency = await getCurrencyByCountry(data.countryId);

    // 5. Create user
    const user = await authRepository.createUser({
      firstName: data.firstName,
      middleName: data.middleName ?? null,
      lastName: data.lastName,

      username: data.username,

      email: data.email,
      phone: data.phone ?? null,

      password: hashedPassword,

      status: UserStatus.EMAIL_PENDING,

      country: {
        connect: {
          id: data.countryId,
        },
      },

      // We'll connect the CUSTOMER role here shortly.
      role: {
        connect: {
          name: "CUSTOMER",
        },
      },
    });

    // 6. Create default checking account
    await accountService.createDefaultAccount(
      user.id,
      currency.id,
      generateAccountName(user.firstName, user.lastName)
    );

    // 7. Generate OTP
    const otp = otpService.generate();

    const expiresAt = otpService.expiresAt();

    await authRepository.createOTP({
    code: otp,

    type: "EMAIL_VERIFICATION",

    expiresAt,

    user: {
        connect: {
        id: user.id,
        },
    },
    });

    await emailService.sendEmail(
    user.email,
    "Verify your Reality Capital Bank Account",
    verifyEmailTemplate(user.firstName, otp)
    );

    return {
        success: true,
        message: "Registration successful. Please verify your email.",
    };
  },

  async verifyEmail(data: VerifyEmailInput) {
    const otp = await authRepository.findOtp(
      data.userId,
      data.code
    );

    if (!otp) {
      throw new Error("Invalid OTP.");
    }

    if (otp.expiresAt < new Date()) {
      throw new Error("OTP has expired.");
    }

    await authRepository.markOtpUsed(otp.id);

    await authRepository.verifyUser(data.userId);

    return {
      message: "Email verified successfully.",
    };
  },
};