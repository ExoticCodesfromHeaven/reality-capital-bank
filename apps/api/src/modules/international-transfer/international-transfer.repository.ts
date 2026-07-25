import {
  InternationalTransferStatus,
  Prisma,
} from "@prisma/client";

import { prisma } from "../../lib/prisma";

export const internationalTransferRepository = {

  async create(
    data: Prisma.InternationalTransferCreateInput
  ) {

    return prisma.internationalTransfer.create({

      data,

      include: {

        senderAccount: {
          include: {
            currency: true,
            user: true,
          },
        },

        senderCurrency: true,

        receiverCurrency: true,

      },

    });

  },



  async getById(id: string) {

    return prisma.internationalTransfer.findUnique({

      where: {
        id,
      },

      include: {

        senderAccount: {
          include: {
            user: true,
            currency: true,
          },
        },

        senderCurrency: true,

        receiverCurrency: true,

        approvedBy: true,

        transactions: true,

      },

    });

  },



  async getByReference(
    reference: string
  ) {

    return prisma.internationalTransfer.findUnique({

      where: {
        reference,
      },

      include: {

        senderAccount: true,

        senderCurrency: true,

        receiverCurrency: true,

      },

    });

  },



  async getCustomerTransfers(
    userId: string
  ) {

    return prisma.internationalTransfer.findMany({

      where: {

        senderAccount: {

          userId,

        },

      },

      include: {

        senderCurrency: true,

        receiverCurrency: true,

      },

      orderBy: {

        createdAt: "desc",

      },

    });

  },



  async getPendingTransfers() {

    return prisma.internationalTransfer.findMany({

      where: {

        status: {

          in: [

            InternationalTransferStatus.PENDING,

            InternationalTransferStatus.UNDER_REVIEW,

          ],

        },

      },

      include: {

        senderAccount: {

          include: {

            user: true,

            currency: true,

          },

        },

        senderCurrency: true,

        receiverCurrency: true,

      },

      orderBy: {

        createdAt: "asc",

      },

    });

  },



  async updateStatus(

    id: string,

    data: Prisma.InternationalTransferUpdateInput

  ) {

    return prisma.internationalTransfer.update({

      where: {

        id,

      },

      data,

    });

  },



  async getAll() {

    return prisma.internationalTransfer.findMany({

      include: {

        senderAccount: {

          include: {

            user: true,

            currency: true,

          },

        },

        senderCurrency: true,

        receiverCurrency: true,

      },

      orderBy: {

        createdAt: "desc",

      },

    });

  },

  async getAccount(accountId: string) {

  return prisma.account.findUnique({

    where: {
      id: accountId,
    },

    include: {

      user: true,

      currency: true,

    },

  });

},

async getCurrency(
  code: string
) {

  return prisma.currency.findUnique({

    where: {
      code,
    },

  });

},

};