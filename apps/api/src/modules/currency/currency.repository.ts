import { prisma } from "../../lib/prisma";

export const currencyRepository = {

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



  async getCurrencyByCode(code: string) {

    return prisma.currency.findUnique({

      where: {
        code: code.toUpperCase(),
      },

    });

  },



  async create(data: {

    code: string;

    name: string;

    symbol: string;

    exchangeRate: number;

  }) {

    return prisma.currency.create({

      data: {

        code: data.code.toUpperCase(),

        name: data.name,

        symbol: data.symbol,

        exchangeRate: data.exchangeRate,

      },

    });

  },



  async update(

    id: string,

    data: {

      code?: string;

      name?: string;

      symbol?: string;

      exchangeRate?: number;

      isActive?: boolean;

    }

  ) {

    return prisma.currency.update({

      where: {
        id,
      },

      data: {

        ...(data.code && {
          code: data.code.toUpperCase(),
        }),

        ...(data.name && {
          name: data.name,
        }),

        ...(data.symbol && {
          symbol: data.symbol,
        }),

        ...(data.exchangeRate !== undefined && {
          exchangeRate: data.exchangeRate,
        }),

        ...(data.isActive !== undefined && {
          isActive: data.isActive,
        }),

      },

    });

  },



  async activate(id: string) {

    return prisma.currency.update({

      where: {
        id,
      },

      data: {
        isActive: true,
      },

    });

  },



  async deactivate(id: string) {

    return prisma.currency.update({

      where: {
        id,
      },

      data: {
        isActive: false,
      },

    });

  },



  async delete(id: string) {

    return prisma.currency.delete({

      where: {
        id,
      },

    });

  },

};