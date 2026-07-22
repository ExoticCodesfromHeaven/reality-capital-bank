import { prisma } from "../../lib/prisma";
import type { Prisma } from "@prisma/client";

export const transferRepository = {
  async create(
    data: Prisma.TransferCreateInput
  ) {
    return prisma.transfer.create({
      data,
    });
  },
};