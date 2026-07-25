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
    reviewedBy?: string,
    rejectionReason?: string
  ) {

    return prisma.kYC.update({

      where: {
        id,
      },

      data: {
        status,

          ...(reviewedBy !== undefined ? { reviewedBy } : {}),

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

  async getByUserId(userId: string) {

  return prisma.kYC.findUnique({

    where: {

      userId,

    },

  });

},

async upsertKyc(

  userId: string,

  data: {

    idDocument: string;

    addressDocument?: string | null;

    selfie?: string | null;

  }

) {

  return prisma.kYC.upsert({

    where: {

      userId,

    },

    update: {

      ...data,

      status: KYCStatus.PENDING,

      rejectionReason: null,

      reviewedBy: null,

    },

    create: {

      user: {

        connect: {

          id: userId,

        },

      },

      ...data,

    },

  });

}

};