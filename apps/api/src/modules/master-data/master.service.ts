import { AppError } from "../../errors/AppError";

import { masterRepository } from "./master.repository";

export const masterService = {

  // =========================
  // CURRENCIES
  // =========================

  async getCurrencies() {

    return masterRepository.getCurrencies();

  },


  async createCurrency(data: {

    code: string;

    name: string;

    symbol: string;

    exchangeRate: number;

  }) {

    const existingCurrency =
      await masterRepository.getCurrencyByCode(
        data.code
      );


    if (existingCurrency) {

      throw new AppError(
        "Currency already exists.",
        409
      );

    }


    return masterRepository.createCurrency(data);

  },


  async updateCurrency(

    id: string,

    data: {

      name?: string;

      symbol?: string;

      exchangeRate?: number;

      isActive?: boolean;

    }

  ) {

    const currency =
      await masterRepository.getCurrency(id);


    if (!currency) {

      throw new AppError(
        "Currency not found.",
        404
      );

    }


    return masterRepository.updateCurrency(
      id,
      data
    );

  },


  async deleteCurrency(id: string) {

    const currency =
      await masterRepository.getCurrency(id);


    if (!currency) {

      throw new AppError(
        "Currency not found.",
        404
      );

    }


    return masterRepository.deleteCurrency(id);

  },



  // =========================
  // COUNTRIES
  // =========================

  async getCountries() {

    return masterRepository.getCountries();

  },


  async createCountry(data: {

    name: string;

    isoCode: string;

    phoneCode: string;

    flagEmoji?: string;

    currencyId: string;

  }) {

    const existingCountry =
      await masterRepository.getCountryByIsoCode(
        data.isoCode
      );


    if (existingCountry) {

      throw new AppError(
        "Country already exists.",
        409
      );

    }


    const currency =
      await masterRepository.getCurrency(
        data.currencyId
      );


    if (!currency) {

      throw new AppError(
        "Currency not found.",
        404
      );

    }


    return masterRepository.createCountry(data);

  },


  async updateCountry(

    id: string,

    data: {

      name?: string;

      isoCode?: string;

      phoneCode?: string;

      flagEmoji?: string;

      currencyId?: string;

      isActive?: boolean;

    }

  ) {

    const country =
      await masterRepository.getCountry(id);


    if (!country) {

      throw new AppError(
        "Country not found.",
        404
      );

    }


    if (data.currencyId) {

      const currency =
        await masterRepository.getCurrency(
          data.currencyId
        );


      if (!currency) {

        throw new AppError(
          "Currency not found.",
          404
        );

      }

    }


    return masterRepository.updateCountry(
      id,
      data
    );

  },


  async deleteCountry(id: string) {

    const country =
      await masterRepository.getCountry(id);


    if (!country) {

      throw new AppError(
        "Country not found.",
        404
      );

    }


    return masterRepository.deleteCountry(id);

  },

};