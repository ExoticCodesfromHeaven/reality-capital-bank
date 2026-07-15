import { prisma }  from "../../lib/prisma";
import type { Prisma }  from "@prisma/client";

export const authRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },

  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: {
        username,
      },
    });
  },

  async createUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  },

  async createOTP(data: Prisma.OTPCreateInput) {
    return prisma.oTP.create({
      data,
    });
  },
};