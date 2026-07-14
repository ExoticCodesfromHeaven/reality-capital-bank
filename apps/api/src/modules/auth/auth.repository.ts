import { prisma }  from "../../lib/prisma";

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

  async createUser(data: any) {
    return prisma.user.create({
      data,
    });
  },
};