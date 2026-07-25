import { prisma } from "../../lib/prisma";

export const superAdminRepository = {

  async getAdmins() {
    return prisma.user.findMany({
      where: {
        role: {
          name: {
            in: ["ADMIN", "SUPER_ADMIN"],
          },
        },
      },

      include: {
        role: true,
        country: true,
        accounts: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getAdmin(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },

      include: {
        role: true,
        country: true,
        accounts: true,
        auditLogs: {
          orderBy: {
            createdAt: "desc",
          },

          take: 20,
        },
      },
    });
  },

  async getRole(name: string) {
    return prisma.role.findUnique({
      where: {
        name,
      },
    });
  },

  async updateUserRole(
    userId: string,
    roleId: string
  ) {
    return prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        roleId,
      },

      include: {
        role: true,
      },
    });
  },

  async getUser(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },

      include: {
        role: true,
      },
    });
  },

};