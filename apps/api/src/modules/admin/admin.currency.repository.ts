import { prisma } from "../../lib/prisma";

export const adminCurrencyRepository = {

  async getCurrencies() {

    return prisma.currency.findMany({

      orderBy: {
        code: "asc",
      },

    });

  },



  async getCurrency(id: string) {

    return prisma.currency.findUnique({

      where: {
        id,
      },

    });

  },



  async updateCurrency(

    id: string,

    data: {
      exchangeRate?: number;
      symbol?: string;
      isActive?: boolean;
    }

  ) {

    return prisma.currency.update({

      where: {
        id,
      },

      data,

    });

  },

};