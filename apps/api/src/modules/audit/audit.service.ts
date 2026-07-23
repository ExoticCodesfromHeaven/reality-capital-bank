import { prisma } from "../../lib/prisma";

export const auditService = {
  async create(
    userId: string,
    action: string,
    description?: string,
    ipAddress?: string
  ) {
    return prisma.auditLog.create({
      data: {
        action,
        description: description ?? null,
        ipAddress: ipAddress ?? null,

        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  },
};