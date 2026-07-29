import { prisma } from "../../lib/prisma";

export const countryRepository = {
  getAll() {
    return prisma.country.findMany({
      where: {
        isActive: true,
      },

      orderBy: {
        name: "asc",
      },

      select: {
        id: true,

        name: true,

        flagEmoji: true,
      },
    });
  },
};
