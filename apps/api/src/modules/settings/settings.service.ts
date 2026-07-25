import { AppError } from "../../errors/AppError";

import { settingsRepository } from "./settings.repository";

export const settingsService = {

  async getAll() {

    return settingsRepository.getAll();

  },



  async get(key: string) {

    const setting =
      await settingsRepository.get(key);

    if (!setting) {

      throw new AppError(
        `Setting "${key}" not found.`,
        404
      );

    }

    return setting.value;

  },



  async getSetting(key: string) {

    const setting =
      await settingsRepository.get(key);

    if (!setting) {

      throw new AppError(
        `Setting "${key}" not found.`,
        404
      );

    }

    return setting;

  },



  async create(

    key: string,

    value: unknown,

    description?: string

  ) {

    const existing =
      await settingsRepository.get(key);

    if (existing) {

      throw new AppError(
        "Setting already exists.",
        400
      );

    }

    return settingsRepository.create(

      key,

      value,

      description

    );

  },



  async update(

    key: string,

    value: unknown

  ) {

    await this.getSetting(key);

    return settingsRepository.update(

      key,

      value

    );

  },



  async upsert(

    key: string,

    value: unknown,

    description?: string

  ) {

    return settingsRepository.upsert(

      key,

      value,

      description

    );

  },



  async remove(key: string) {

    await this.getSetting(key);

    return settingsRepository.delete(key);

  },



  async getTransferCharges() {

    return this.get(
      "transfer_charges"
    );

  },



  async getInvestmentRates() {

    return this.get(
      "investment_rates"
    );

  },



  async getExchangeRates() {

    return this.get(
      "exchange_rates"
    );

  },



  async getTransferLimits() {

    return this.get(
      "transfer_limits"
    );

  },



  async getLoanSettings() {

    return this.get(
      "loan_settings"
    );

  },



  async getMaintenanceMode() {

    return this.get(
      "maintenance_mode"
    );

  },



  async getFeatureFlags() {

    return this.get(
      "feature_flags"
    );

  },



  async isFeatureEnabled(

    feature: string

  ) {

    const flags =
      await this.getFeatureFlags() as Record<string, boolean>;

    return Boolean(
      flags[feature]
    );

  },

};