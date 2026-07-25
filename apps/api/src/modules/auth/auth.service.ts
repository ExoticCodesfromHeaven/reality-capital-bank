import { UserStatus, OTPType } from "@prisma/client";
import { jwtService } from "../../utils/jwt";

import { authRepository } from "./auth.repository";
import { passwordService } from "./password.service";
import { otpService } from "./otp.service";

import { accountService } from "../accounts/account.service";

import { generateAccountName } from "../../utils/account-name";
import { getCurrencyByCountry } from "../../utils/country-currency";
import { isUsernameAvailable } from "../../utils/username";

import bcrypt from "bcrypt";
import { passwordResetSuccessTemplate } from "../../emails/password-reset-success";

import { NotificationType } from "@prisma/client";
import { notificationService } from "../notification/notification.service";

import { auditService } from "../audit/audit.service";

import type { 
  LoginInput,
  RegisterInput,
  VerifyEmailInput,
 } from "./auth.validation";

import { emailService } from "../../emails/email.service";
import { verifyEmailTemplate } from "../../emails/verify-email";
import { AppError } from "../../errors/AppError";

export const authService = {
  async register(data: RegisterInput) {
    // 1. Check email
    const existingEmail = await authRepository.findByEmail(data.email);

    if (existingEmail) {
      throw new AppError("Email already exists.", 400);
    }

    // 2. Check username
    const usernameAvailable = await isUsernameAvailable(data.username);

    if (!usernameAvailable) {
      throw new AppError("Username already taken.", 400);
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

    await emailService.sendVerificationEmail(

    user.email,

    user.firstName,

    otp

    );

    return {
        success: true,
        message: "Registration successful. Please verify your email.",
    };
  },

  async resendVerificationOtp(email: string) {

  const user =
    await authRepository.findByEmail(email);

  if (!user) {

    throw new AppError(
      "User not found.",
      404
    );

  }

  if (user.emailVerified) {

    throw new AppError(
      "Email has already been verified.",
      400
    );

  }

  // Remove previous verification OTPs
  await authRepository.deleteOtps(
    user.id,
    OTPType.EMAIL_VERIFICATION
  );

  const otp = otpService.generate();

  await authRepository.createOTP({

    code: otp,

    type: OTPType.EMAIL_VERIFICATION,

    expiresAt: otpService.expiresAt(),

    user: {

        connect: {

            id: user.id,

        },

    },

});

  await emailService.sendVerificationEmail(

    user.email,

    user.firstName,

    otp

    );

  await auditService.create(

    user.id,

    "OTP_RESENT",

    "Resent email verification OTP"

  );

  return {

    message:
      "Verification code sent successfully.",

  };

},

  async verifyEmail(data: VerifyEmailInput) {
    const otp = await authRepository.findOtp(
      data.userId,
      data.code
    );

    if (!otp) {
      throw new AppError("Invalid OTP.", 400);
    }

    if (otp.expiresAt < new Date()) {
      throw new AppError("OTP has expired.", 400);
    }

    await authRepository.markOtpUsed(otp.id);

    await authRepository.verifyUser(data.userId);

    return {
      message: "Email verified successfully.",
    };
  },

  async login(data: LoginInput) {
    // 1. Find user
    const user = await authRepository.findUserForLogin(
      data.email
    );

    if (!user) {
      throw new AppError("Invalid email or password.", 400);
    }

    // 2. Compare password
    const passwordMatches =
      await passwordService.compare(
        data.password,
        user.password
      );

    if (!passwordMatches) {
      throw new AppError("Invalid email or password.", 400);
    }

    // 3. Email verified?
    if (!user.emailVerified) {
      throw new AppError(
        "Please verify your email before logging in.",
        400
      );
    }

    // 4. Account active?
    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError(
        "Your account is not active.",
        400
      );
    }

    const accessToken =
      jwtService.generateAccessToken(user.id);

    const refreshToken =
      jwtService.generateRefreshToken(user.id);

    await authRepository.createSession({
      refreshToken,

      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),

      user: {
        connect: {
          id: user.id,
        },
      },
    });

    // JWTs come next session.
    return {
      message: "Login successful.",
    
      accessToken,
    
      refreshToken,
    
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role.name,
      },
    };
  },

  async me(userId: string) {
    const user = await authRepository.findById(userId);
  
    if (!user) {
      throw new AppError("User not found.", 404);
    }
  
    return user;
  },

  async refresh(refreshToken: string) {
    const session =
      await authRepository.findSession(refreshToken);

    if (!session) {
      throw new AppError("Invalid refresh token.", 400);
    }

    if (session.expiresAt < new Date()) {
      throw new AppError("Refresh token expired.", 400);
    }

    jwtService.verifyRefreshToken(refreshToken);

    // Invalidate old session
    await authRepository.deleteSession(refreshToken);

    const accessToken =
      jwtService.generateAccessToken(session.user.id);

    const newRefreshToken =
      jwtService.generateRefreshToken(session.user.id);

    await authRepository.createSession({
      refreshToken: newRefreshToken,

      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),

      user: {
        connect: {
          id: session.user.id,
        },
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  },

  async logout(refreshToken: string) {
    await authRepository.deleteSession(
      refreshToken
    );
  
    return {
      message: "Logged out successfully.",
    };
  },
  async forgotPassword(email: string) {

  const user =
    await authRepository.findByEmail(email);

  if (!user) {

    throw new AppError(
      "No account exists with that email.",
      404
    );

  }

  await authRepository.deleteOtps(

    user.id,

    OTPType.PASSWORD_RESET

  );

  const otp =
    otpService.generate();

  await authRepository.createOTP({

    code: otp,

    type: OTPType.PASSWORD_RESET,

    expiresAt:
      otpService.expiresAt(),

    user: {

      connect: {

        id: user.id,

      },

    },

  });

  await emailService.sendPasswordResetEmail(
    user.email,
    user.firstName,
    otp
  );

  await auditService.create(

    user.id,

    "PASSWORD_RESET_REQUESTED",

    "Requested password reset"

  );

  return {

    message:
      "Password reset code sent successfully.",

  };

},
async resetPassword({

  email,

  otp,

  password,

}:{

  email:string;

  otp:string;

  password:string;

}){

  const user =
    await authRepository.findByEmail(
      email
    );

  if(!user){

    throw new AppError(
      "Invalid email.",
      404
    );

  }

  const otpRecord =
    await authRepository.findPasswordResetOtp(

      user.id,

      otp

    );

  if(!otpRecord){

    throw new AppError(

      "Invalid OTP.",

      400

    );

  }

  if(

    otpRecord.expiresAt < new Date()

  ){

    throw new AppError(

      "OTP has expired.",

      400

    );

  }

  const hashedPassword =
    await bcrypt.hash(
      password,
      12
    );

  await authRepository.updatePassword(

    user.id,

    hashedPassword

  );

  await authRepository.markOtpUsed(

    otpRecord.id

  );

  await authRepository.deleteAllSessions(

    user.id

  );

  await emailService.sendPasswordResetSuccessEmail(

    user.email,

    user.firstName

  );

  await notificationService.create(

    user.id,

    "Password Changed",

    "Your password has been changed successfully.",

    NotificationType.SUCCESS

  );

  await auditService.create(

    user.id,

    "PASSWORD_RESET_COMPLETED",

    "Password reset completed."

  );

  return{

    message:
      "Password reset successfully.",

  };

},
};