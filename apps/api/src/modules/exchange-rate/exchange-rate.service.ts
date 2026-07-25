import { prisma } from "../../lib/prisma";

import { AppError } from "../../errors/AppError";

type CurrencyWithExchangeRate = {
  id: string;
  name: string;
  code: string;
  symbol: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  exchangeRate: string | number;
};

export const exchangeRateService = {

  async getCurrency(
    code: string
  ) {

    const currency =
      await prisma.currency.findUnique({

        where: {
          code: code.toUpperCase(),
        },

      }) as CurrencyWithExchangeRate | null;

    if (!currency) {

      throw new AppError(
        `Currency ${code} not found.`,
        404
      );

    }

    if (!currency.isActive) {

      throw new AppError(
        `${currency.code} is currently disabled.`,
        400
      );

    }

    return currency;

  },



  async convert(

    amount: number,

    fromCode: string,

    toCode: string

  ) {

    const from =
      await this.getCurrency(fromCode);

    const to =
      await this.getCurrency(toCode);

    if (from.code === to.code) {

      return amount;

    }

    const usdAmount =
      amount /
      Number(from.exchangeRate);

    const converted =
      usdAmount *
      Number(to.exchangeRate);

    return Number(
      converted.toFixed(2)
    );

  },



  async format(

    amount: number,

    currencyCode: string

  ) {

    const currency =
      await this.getCurrency(
        currencyCode
      );

    return `${currency.symbol}${amount.toLocaleString()}`;

  },

};