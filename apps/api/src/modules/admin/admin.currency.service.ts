import { AppError } from "../../errors/AppError";

import { adminCurrencyRepository } from "./admin.currency.repository";

export const adminCurrencyService = {

  async getCurrencies() {

    return adminCurrencyRepository.getCurrencies();

  },



  async getCurrency(id: string) {

    const currency =

      await adminCurrencyRepository.getCurrency(id);

    if (!currency) {

      throw new AppError(

        "Currency not found.",

        404

      );

    }

    return currency;

  },



  async updateCurrency(

    id: string,

    exchangeRate?: number,

    symbol?: string

  ) {

    await this.getCurrency(id);

    const updateData: {
      exchangeRate?: number;
      symbol?: string;
    } = {};

    if (exchangeRate !== undefined) {
      updateData.exchangeRate = exchangeRate;
    }

    if (symbol !== undefined) {
      updateData.symbol = symbol;
    }

    return adminCurrencyRepository.updateCurrency(

      id,

      updateData

    );

  },



  async toggleCurrency(id: string) {

    const currency =

      await this.getCurrency(id);

    return adminCurrencyRepository.updateCurrency(

      id,

      {

        isActive: !currency.isActive,

      }

    );

  },

};