import { prisma } from "../lib/prisma";

export async function getCurrencyByCountry(countryId: string) {
  const country = await prisma.country.findUnique({
    where: {
      id: countryId,
    },
    include: {
      currency: true,
    },
  });

  if (!country) {
    throw new Error("Country not found.");
  }

  return country.currency;
}