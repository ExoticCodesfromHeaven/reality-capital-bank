import { AppError } from "../../errors/AppError";

import { auditService } from "../audit/audit.service";

import { systemSettingsRepository } from "./system-settings.repository";

export const systemSettingsService = {

  async getAll() {

    return systemSettingsRepository.getAll();

  },



  async getOne(
    key: string
  ) {

    const setting =
      await systemSettingsRepository.getByKey(
        key
      );

    if (!setting) {

      throw new AppError(

        "Setting not found.",

        404

      );

    }

    return setting;

  },



  async update(

    key: string,

    value: any,

    description: string | undefined,

    adminId: string

  ) {

    const exists =
      await systemSettingsRepository.getByKey(
        key
      );

    if (!exists) {

      throw new AppError(

        "Setting not found.",

        404

      );

    }

    const updated =
      await systemSettingsRepository.update(

        key,

        value,

        description

      );

    await auditService.create(

      adminId,

      "SYSTEM_SETTING_UPDATED",

      `Updated ${key}`

    );

    return updated;

  },

};