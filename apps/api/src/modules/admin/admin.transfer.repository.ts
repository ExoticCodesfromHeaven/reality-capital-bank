import { prisma } from "../../lib/prisma";
import type { TransferStatus } from "@prisma/client";

export const adminTransferRepository = {

  async getPendingTransfers() {

    return prisma.transfer.findMany({

      where: {
        status: "PENDING",
      },

      include: {

        senderAccount: {
          include: {
            user: true,
          },
        },

        receiverAccount: {
          include: {
            user: true,
          },
        },

      },

      orderBy: {
        createdAt: "asc",
      },

    });

  },


  async getTransfer(id: string) {

    return prisma.transfer.findUnique({

      where: {
        id,
      },

      include: {

        senderAccount: {
          include: {
            user: true,
          },
        },

        receiverAccount: {
          include: {
            user: true,
          },
        },

        transactions: true,

      },

    });

  },


  async updateTransferStatus(
  id: string,
  data: {
    status: TransferStatus;
    approvedById?: string;
    rejectionReason?: string;
    approvedAt?: Date;
  }
) {

  const {
    approvedById,
    ...rest
  } = data;


  return prisma.transfer.update({

    where: {
      id,
    },


    data: {

      ...rest,


      ...(approvedById && {
        approvedBy: {
          connect: {
            id: approvedById,
          },
        },
      }),

    },

  });

},

};