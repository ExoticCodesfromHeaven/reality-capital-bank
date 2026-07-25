import { prisma } from "../../lib/prisma";

export const masterRepository = {

  // =========================
  // CURRENCIES
  // =========================

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
        code,
      },

    });

  },


  async createCurrency(data: {

    code: string;

    name: string;

    symbol: string;

    exchangeRate: number;

  }) {

    return prisma.currency.create({

      data,

    });

  },


  async updateCurrency(

    id: string,

    data: Partial<{

      name: string;

      symbol: string;

      exchangeRate: number;

      isActive: boolean;

    }>

  ) {

    return prisma.currency.update({

      where: {
        id,
      },

      data,

    });

  },


  async deleteCurrency(id: string) {

    return prisma.currency.delete({

      where: {
        id,
      },

    });

  },



  // =========================
  // COUNTRIES
  // =========================

  async getCountries() {

    return prisma.country.findMany({

      include: {

        currency: true,

      },

      orderBy: {

        name: "asc",

      },

    });

  },


  async getCountry(id: string) {

    return prisma.country.findUnique({

      where: {
        id,
      },

      include: {

        currency: true,

      },

    });

  },


  async getCountryByIsoCode(
    isoCode: string
  ) {

    return prisma.country.findUnique({

      where: {
        isoCode,
      },

    });

  },


  async createCountry(data: {

    name: string;

    isoCode: string;

    phoneCode: string;

    flagEmoji?: string;

    currencyId: string;

  }) {

    return prisma.country.create({

      data,

      include: {

        currency: true,

      },

    });

  },


  async updateCountry(

    id: string,

    data: Partial<{

      name: string;

      isoCode: string;

      phoneCode: string;

      flagEmoji: string;

      currencyId: string;

      isActive: boolean;

    }>

  ) {

    return prisma.country.update({

      where: {
        id,
      },

      data,

      include: {

        currency: true,

      },

    });

  },


  async deleteCountry(id: string) {

    return prisma.country.delete({

      where: {
        id,
      },

    });

  },

};