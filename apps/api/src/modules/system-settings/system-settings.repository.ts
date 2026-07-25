import { prisma } from "../../lib/prisma";

export const systemSettingsRepository = {

  async getAll() {

    return prisma.systemSetting.findMany({

      orderBy: {
        key: "asc",
      },

    });

  },



  async getByKey(
    key: string
  ) {

    return prisma.systemSetting.findUnique({

      where: {
        key,
      },

    });

  },



  async update(
    key: string,
    value: any,
    description?: string
  ) {

    return prisma.systemSetting.update({

      where: {
        key,
      },

      data: {

        value,

        ...(description !== undefined && {
          description,
        }),

      },

    });

  },

};