import { prisma }  from "../../lib/prisma";
import { OTPType, UserStatus, type Prisma }  from "@prisma/client";

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

async createSession(data: Prisma.SessionCreateInput) {
  return prisma.session.create({
    data,
  });
},

async deleteSession(refreshToken: string) {
  return prisma.session.deleteMany({
    where: {
      refreshToken,
    },
  });
},

async findSession(refreshToken: string) {
  return prisma.session.findUnique({
    where: {
      refreshToken,
    },
    include: {
      user: true,
    },
  });
},

async findById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      role: true,
      country: true,
      accounts: true,
    },
  });
},

async deleteSessionByUser(userId: string) {
  return prisma.session.deleteMany({
    where: {
      userId,
    },
  });
},

async updateUser(
  userId: string,
  data: Prisma.UserUpdateInput
) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data,
  });
},

async findByIdWithPassword(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      role: true,
    },
  });
},

async deleteOtps(
  userId: string,
  type: Prisma.OTPWhereInput["type"]
) {
  const where: Prisma.OTPWhereInput = { userId };
  if (type !== undefined) {
    // assign when provided to satisfy exactOptionalPropertyTypes
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    where.type = type as any;
  }

  return prisma.oTP.deleteMany({ where });
},

async findOtpByType(
  userId: string,
  code: string,
  type: Prisma.OTPWhereInput["type"]
) {
  const where: Prisma.OTPWhereInput = {
    userId,
    code,
    used: false,
  };
  if (type !== undefined) {
    where.type = type as any;
  }

  return prisma.oTP.findFirst({ where });
},

async updatePassword(
  userId: string,
  password: string
) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password,
    },
  });
},

async deleteAllSessions(
  userId: string
) {
  return prisma.session.deleteMany({
    where: {
      userId,
    },
  });
},
async findPasswordResetOtp(
  userId: string,
  code: string
) {
  return prisma.oTP.findFirst({
    where: {
      userId,
      code,
      type: "PASSWORD_RESET",
      used: false,
    },
  });
},
async invalidateOtps(
  userId: string,
  type: OTPType
) {
  return prisma.oTP.updateMany({
    where: {
      userId,
      type,
      used: false,
    },
    data: {
      used: true,
    },
  });
}
};