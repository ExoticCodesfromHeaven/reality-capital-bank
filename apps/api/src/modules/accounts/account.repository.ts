import { prisma } from "../../lib/prisma";
import type { Prisma } from "@prisma/client";

export const accountRepository = {
  async findByAccountNumber(accountNumber: string) {
    return prisma.account.findUnique({
      where: {
        accountNumber,
      },
    });
  },

  async create(data: Prisma.AccountCreateInput) {
    return prisma.account.create({
      data,
    });
  },

  async findByUserId(userId: string) {
    return prisma.account.findMany({
      where: {
        userId,
      },
      include: {
        currency: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },
};