import { authRepository } from "../auth/auth.repository";

import type { UpdateProfileInput } from "./user.validation";

import { passwordService } from "../auth/password.service";
import { AppError } from "../../errors/AppError";

export const userService = {
  async updateProfile(
    userId: string,
    data: UpdateProfileInput
  ) {
    return authRepository.updateUser(
      userId,
      {
        firstName: data.firstName,
        middleName: data.middleName ?? null,
        lastName: data.lastName,
        phone: data.phone,
      }
    );
  },

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user =
      await authRepository.findByIdWithPassword(userId);

    if (!user) {
      throw new  AppError("User not found.", 404);
    }

    const matches =
      await passwordService.compare(
        currentPassword,
        user.password
      );

    if (!matches) {
      throw new AppError("Current password is incorrect.", 400);
    }

    const hashedPassword =
      await passwordService.hash(newPassword);

    return authRepository.updateUser(userId, {
      password: hashedPassword,
    });
  },
};