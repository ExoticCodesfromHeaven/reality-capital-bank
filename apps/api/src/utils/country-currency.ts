import { prisma } from "../lib/prisma";
import { AppError } from "../errors/AppError";

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
    throw new AppError("Country not found.", 404);
  }

  return country.currency;
}