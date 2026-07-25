import { prisma } from "../../lib/prisma";

export const settingsRepository = {

  async getAll() {

    return prisma.systemSetting.findMany({

      orderBy: {
        key: "asc",
      },

    });

  },



  async get(key: string) {

    return prisma.systemSetting.findUnique({

      where: {
        key,
      },

    });

  },



  async create(

    key: string,

    value: any,

    description?: string

  ) {

    return prisma.systemSetting.create({

      data: {

        key,

        value,

        ...(description !== undefined ? { description } : {}),

      },

    });

  },



  async update(

    key: string,

    value: any

  ) {

    return prisma.systemSetting.update({

      where: {
        key,
      },

      data: {

        value,

      },

    });

  },



  async upsert(

    key: string,

    value: any,

    description?: string

  ) {

    return prisma.systemSetting.upsert({

      where: {
        key,
      },

      create: {

        key,

        value,

        ...(description !== undefined ? { description } : {}),

      },

      update: {

        value,

        ...(description && {
          description,
        }),

      },

    });

  },



  async delete(key: string) {

    return prisma.systemSetting.delete({

      where: {
        key,
      },

    });

  },

};