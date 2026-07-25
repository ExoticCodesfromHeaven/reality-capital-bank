import { AppError } from "../../errors/AppError";

import { currencyRepository } from "./currency.repository";

export const currencyService = {

  async getCurrencies() {

    return currencyRepository.getCurrencies();

  },



  async getCurrency(id: string) {

    const currency =
      await currencyRepository.getCurrency(id);

    if (!currency) {

      throw new AppError(
        "Currency not found.",
        404
      );

    }

    return currency;

  },



  async create(data: {

    code: string;

    name: string;

    symbol: string;

    exchangeRate: number;

  }) {

    const existing =
      await currencyRepository.getCurrencyByCode(
        data.code
      );

    if (existing) {

      throw new AppError(
        "Currency already exists.",
        400
      );

    }

    return currencyRepository.create(data);

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

    await this.getCurrency(id);

    if (data.code) {

      const existing =
        await currencyRepository.getCurrencyByCode(
          data.code
        );

      if (
        existing &&
        existing.id !== id
      ) {

        throw new AppError(
          "Currency code already exists.",
          400
        );

      }

    }

    return currencyRepository.update(
      id,
      data
    );

  },



  async activate(id: string) {

    await this.getCurrency(id);

    return currencyRepository.activate(id);

  },



  async deactivate(id: string) {

    const currency =
      await this.getCurrency(id);

    if (!currency.isActive) {

      throw new AppError(
        "Currency is already inactive.",
        400
      );

    }

    const activeCurrencies =
      await currencyRepository.getCurrencies();

    const activeCount =
      activeCurrencies.filter(
        (currency) => currency.isActive
      ).length;

    if (activeCount <= 1) {

      throw new AppError(
        "At least one active currency must remain.",
        400
      );

    }

    return currencyRepository.deactivate(id);

  },



  async delete(id: string) {

    await this.getCurrency(id);

    return currencyRepository.delete(id);

  },

};