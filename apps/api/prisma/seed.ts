import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  console.log("🌱 Seeding Reality Capital Bank...");

  // ==========================
  // ROLES
  // ==========================

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

  console.log("✅ Roles");


  // ==========================
  // CURRENCIES
  // ==========================

  const currencies = [

    {
      code: "NGN",
      name: "Nigerian Naira",
      symbol: "₦",
      exchangeRate: 1,
    },

    {
      code: "USD",
      name: "US Dollar",
      symbol: "$",
      exchangeRate: 0.00065,
    },

    {
      code: "GBP",
      name: "British Pound",
      symbol: "£",
      exchangeRate: 0.00048,
    },

    {
      code: "EUR",
      name: "Euro",
      symbol: "€",
      exchangeRate: 0.00056,
    },

    {
      code: "CAD",
      name: "Canadian Dollar",
      symbol: "C$",
      exchangeRate: 0.00089,
    },

    {
      code: "AUD",
      name: "Australian Dollar",
      symbol: "A$",
      exchangeRate: 0.0010,
    },

    {
      code: "NZD",
      name: "New Zealand Dollar",
      symbol: "NZ$",
      exchangeRate: 0.0011,
    },

    {
      code: "ZAR",
      name: "South African Rand",
      symbol: "R",
      exchangeRate: 0.011,
    },

    {
      code: "AED",
      name: "UAE Dirham",
      symbol: "AED",
      exchangeRate: 0.0024,
    },

    {
      code: "INR",
      name: "Indian Rupee",
      symbol: "₹",
      exchangeRate: 0.056,
    },

    {
      code: "PHP",
      name: "Philippine Peso",
      symbol: "₱",
      exchangeRate: 0.037,
    },

    {
      code: "JPY",
      name: "Japanese Yen",
      symbol: "¥",
      exchangeRate: 0.095,
    },

    {
      code: "CHF",
      name: "Swiss Franc",
      symbol: "CHF",
      exchangeRate: 0.00057,
    },

  ];

  for (const currency of currencies) {

    await prisma.currency.upsert({

      where: {

        code: currency.code,

      },

      update: {

        name: currency.name,

        symbol: currency.symbol,

        exchangeRate: currency.exchangeRate,

      },

      create: currency,

    });

  }

  console.log("✅ Currencies");


  const currencyMap = Object.fromEntries(

    (
      await prisma.currency.findMany()

    ).map((currency) => [

      currency.code,

      currency.id,

    ])

  );


  // ==========================
  // COUNTRIES
  // ==========================

  const countries = [

    {
      name: "Nigeria",
      isoCode: "NG",
      phoneCode: "+234",
      flagEmoji: "🇳🇬",
      currency: "NGN",
    },

    {
      name: "United States",
      isoCode: "US",
      phoneCode: "+1",
      flagEmoji: "🇺🇸",
      currency: "USD",
    },

    {
      name: "United Kingdom",
      isoCode: "GB",
      phoneCode: "+44",
      flagEmoji: "🇬🇧",
      currency: "GBP",
    },

    {
      name: "Germany",
      isoCode: "DE",
      phoneCode: "+49",
      flagEmoji: "🇩🇪",
      currency: "EUR",
    },

    {
      name: "France",
      isoCode: "FR",
      phoneCode: "+33",
      flagEmoji: "🇫🇷",
      currency: "EUR",
    },

    {
      name: "Canada",
      isoCode: "CA",
      phoneCode: "+1",
      flagEmoji: "🇨🇦",
      currency: "CAD",
    },

    {
      name: "Australia",
      isoCode: "AU",
      phoneCode: "+61",
      flagEmoji: "🇦🇺",
      currency: "AUD",
    },

    {
      name: "New Zealand",
      isoCode: "NZ",
      phoneCode: "+64",
      flagEmoji: "🇳🇿",
      currency: "NZD",
    },

    {
      name: "South Africa",
      isoCode: "ZA",
      phoneCode: "+27",
      flagEmoji: "🇿🇦",
      currency: "ZAR",
    },

    {
      name: "United Arab Emirates",
      isoCode: "AE",
      phoneCode: "+971",
      flagEmoji: "🇦🇪",
      currency: "AED",
    },

    {
      name: "India",
      isoCode: "IN",
      phoneCode: "+91",
      flagEmoji: "🇮🇳",
      currency: "INR",
    },

    {
      name: "Philippines",
      isoCode: "PH",
      phoneCode: "+63",
      flagEmoji: "🇵🇭",
      currency: "PHP",
    },

    {
      name: "Japan",
      isoCode: "JP",
      phoneCode: "+81",
      flagEmoji: "🇯🇵",
      currency: "JPY",
    },

    {
      name: "Switzerland",
      isoCode: "CH",
      phoneCode: "+41",
      flagEmoji: "🇨🇭",
      currency: "CHF",
    },

  ];

  for (const country of countries) {

    await prisma.country.upsert({

      where: {

        isoCode: country.isoCode,

      },

      update: {

        name: country.name,

        phoneCode: country.phoneCode,

        flagEmoji: country.flagEmoji,

        currencyId: currencyMap[country.currency]!,

      },

      create: {

        name: country.name,

        isoCode: country.isoCode,

        phoneCode: country.phoneCode,

        flagEmoji: country.flagEmoji,

        currencyId: currencyMap[country.currency]!,

      },

    });

  }

  console.log("✅ Countries");


  // ==========================
  // SYSTEM SETTINGS
  // ==========================

  const settings = [

    {

      key: "transfer_charges",

      description: "Transfer Charges",

      value: {
        local:50,

        international:{
        percent:1.5,
        minimum:25,
        maximum:500
        }
      },

    },

    {

      key: "transfer_limits",

      description: "Transfer Limits",

      value: {

        daily: 10000000,

        single: 2000000,

      },

    },

    {

      key: "investment_rates",

      description: "Investment Interest Rates",

      value: {
        "3_months":{
            "interest":10,
            "minimum":1000
        },

        "6_months":{
            "interest":15,
            "minimum":5000
        },

        "12_months":{
            "interest":25,
            "minimum":10000
        }
      },

    },

    {

      key: "maintenance_mode",

      description: "Maintenance Mode",

      value: false,

    },

    {

      key: "loan_settings",

      description: "Loan Configuration",

      value: {

        enabled: false,

        minimumAmount: 0,

        maximumAmount: 0,

        interest: 0,

      },

    },

    {

      key: "feature_flags",

      description: "Feature Toggles",

      value: {

        investments: true,

        joint_investments: true,

        fixed_deposits: true,

        international_transfers: true,

        loans: false,

        crypto: false,

        support_chat: true,

      },

    },

  ];

  for (const setting of settings) {

    await prisma.systemSetting.upsert({

      where: {

        key: setting.key,

      },

      update: {

        value: setting.value,

        description: setting.description,

      },

      create: setting,

    });

  }

  console.log("✅ System Settings");

  console.log("🎉 Reality Capital Bank seeded successfully.");

}

main()
  .catch(console.error)
  .finally(async () => {

    await prisma.$disconnect();

  });