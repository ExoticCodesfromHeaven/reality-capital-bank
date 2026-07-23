import { prisma } from "../../lib/prisma";
import { KYCStatus, UserStatus } from "@prisma/client";

export const kycRepository = {

  async getPendingKyc() {

    return prisma.kYC.findMany({

      where: {
        status: KYCStatus.PENDING,
      },

      include: {

        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            username: true,
            status: true,
          },
        },

      },

      orderBy: {
        createdAt: "asc",
      },

    });

  },


  async getKycById(id: string) {

    return prisma.kYC.findUnique({

      where: {
        id,
      },

      include: {
        user: true,
      },

    });

  },


  async updateKycStatus(
    id: string,
    status: KYCStatus,
    rejectionReason?: string
  ) {

    return prisma.kYC.update({

      where: {
        id,
      },

      data: {
        status,
        ...(rejectionReason !== undefined ? { rejectionReason } : {}),
      },

      include: {
        user: true,
      },

    });

  },


  async updateUserStatus(
    userId: string,
    status: UserStatus
  ) {

    return prisma.user.update({

      where: {
        id: userId,
      },

      data: {
        status,
      },

    });

  },

};