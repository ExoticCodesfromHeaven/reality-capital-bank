import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { formatBeneficiary } from "../../utils/mappers/beneficiary.mapper";

export const beneficiaryService = {
  async create(
    userId: string,
    accountNumber: string,
    nickname?: string
  ) {
    const account =
      await prisma.account.findUnique({
        where: {
          accountNumber,
        },
      });

    if (!account) {
      throw new AppError(
        "Account not found.",
        404
      );
    }

    if (account.userId === userId) {
      throw new AppError(
        "You cannot add yourself as a beneficiary.",
        400
      );
    }

    const existing =
      await prisma.beneficiary.findFirst({
        where: {
          userId,
          accountNumber,
        },
      });

    if (existing) {
      throw new AppError(
        "Beneficiary already exists.",
        409
      );
    }

    const beneficiary = await prisma.beneficiary.create({
      data: {
        accountNumber,

        accountName: account.accountName,

        bankName: "Reality Capital Bank",

        ...(nickname && { nickname }),

        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return formatBeneficiary(beneficiary);
  },

  async getAll(userId: string) {
    return prisma.beneficiary.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async delete(
    id: string,
    userId: string
  ) {
    const beneficiary =
      await prisma.beneficiary.findFirst({
        where: {
          id,
          userId,
        },
      });

    if (!beneficiary) {
      throw new AppError(
        "Beneficiary not found.",
        404
      );
    }

    await prisma.beneficiary.delete({
      where: {
        id,
      },
    });
  },
};