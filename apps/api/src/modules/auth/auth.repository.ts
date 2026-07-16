import { prisma }  from "../../lib/prisma";
import { UserStatus, type Prisma }  from "@prisma/client";

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

  async findUserForLogin(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        role: true,
        country: true,
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

  async findOtp(userId: string, code: string) {
    return prisma.oTP.findFirst({
      where: {
        userId,
        code,
        used: false,
    },
  });
},

async markOtpUsed(id: string) {
  return prisma.oTP.update({
    where: {
      id,
    },
    data: {
      used: true,
    },
  });
},

async verifyUser(userId: string) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerified: true,
      status: UserStatus.ACTIVE,
    },
  });
},

};