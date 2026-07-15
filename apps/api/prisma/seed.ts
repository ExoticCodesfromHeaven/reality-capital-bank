import { PrismaClient } from "@prisma/client";

console.log("Seed file is running");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Roles
  const roles = [
    {
      name: "SUPER_ADMIN",
      description: "Full system access",
    },
    {
      name: "ADMIN",
      description: "Administrative access",
    },
    {
      name: "CUSTOMER",
      description: "Bank customer",
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {},
      create: role,
    });
  }

  console.log("✅ Roles created");

  // Currencies
  const currencies = [
    {
      code: "NGN",
      name: "Nigerian Naira",
      symbol: "₦",
    },
    {
      code: "USD",
      name: "US Dollar",
      symbol: "$",
    },
  ];

  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: {
        code: currency.code,
      },
      update: {},
      create: currency,
    });
  }

  console.log("✅ Currencies created");

  const ngn = await prisma.currency.findUnique({
    where: {
      code: "NGN",
    },
  });

  const usd = await prisma.currency.findUnique({
    where: {
      code: "USD",
    },
  });

  if (!ngn || !usd) {
    throw new Error("Currencies missing");
  }

  // Countries
  const countries = [
    {
      name: "Nigeria",
      isoCode: "NG",
      phoneCode: "+234",
      flagEmoji: "🇳🇬",
      currencyId: ngn.id,
    },
    {
      name: "United States",
      isoCode: "US",
      phoneCode: "+1",
      flagEmoji: "🇺🇸",
      currencyId: usd.id,
    },
  ];

  for (const country of countries) {
    await prisma.country.upsert({
      where: {
        isoCode: country.isoCode,
      },
      update: {},
      create: country,
    });
  }

  console.log("✅ Countries created");
}

main()
  .then(async () => {
    console.log("🎉 Seed completed");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("❌ Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });