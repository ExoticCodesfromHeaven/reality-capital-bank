import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({

  definition: {

    openapi: "3.0.3",

    info: {

        title: "Reality Capital Bank API",

        version: "1.0.0",

        description:
          "Official REST API documentation for Reality Capital Bank.",

        contact: {

          name: "Reality Capital Bank",

          email: "support@realitycapitalbank.com",

        },

        license: {

          name: "Private",

        },

    },

    servers: [

      {

        url: "http://localhost:5000",

        description: "Development",

      },

      {

        url: "https://api.realitycapitalbank.com",

        description: "Production",

      },

    ],

    components: {

      securitySchemes: {

        bearerAuth: {

          type: "http",

          scheme: "bearer",

          bearerFormat: "JWT",

        },

      },

      schemas: {

        SuccessResponse: {

          type: "object",

          properties: {

            success: {

              type: "boolean",

              example: true,

            },

          },

        },



        ErrorResponse: {

          type: "object",

          properties: {

            success: {

              type: "boolean",

              example: false,

            },

            message: {

              type: "string",

              example: "Unauthorized",

            },

          },

        },



        User: {

          type: "object",

          properties: {

            id: {

              type: "string",

              example: "0b34c1b7...",

            },

            firstName: {

              type: "string",

              example: "John",

            },

            middleName: {

              type: "string",

              nullable: true,

            },

            lastName: {

              type: "string",

              example: "Doe",

            },

            username: {

              type: "string",

              example: "johndoe",

            },

            email: {

              type: "string",

              example: "john@gmail.com",

            },

            phone: {

              type: "string",

              example: "+2348012345678",

            },

            avatar: {

              type: "string",

              nullable: true,

            },

            status: {

              type: "string",

              example: "ACTIVE",

            },

          },

        },



        Account: {

          type: "object",

          properties: {

            id: {

              type: "string",

            },

            accountNumber: {

              type: "string",

              example: "10234567891",

            },

            accountName: {

              type: "string",

              example: "John Doe",

            },

            balance: {

              type: "number",

              example: 250000,

            },

            availableBalance: {

              type: "number",

              example: 249500,

            },

            accountType: {

              type: "string",

              example: "SAVINGS",

            },

            status: {

              type: "string",

              example: "ACTIVE",

            },

            currency: {

              type: "string",

              example: "NGN",

            },

          },

        },

        Transaction: {

          type: "object",

          properties: {

            id: {

              type: "string",

              example: "8fd34b0d...",

            },

            reference: {

              type: "string",

              example: "TRX202607250001",

            },

            type: {

              type: "string",

              example: "DEBIT",

            },

            category: {

              type: "string",

              example: "TRANSFER",

            },

            status: {

              type: "string",

              example: "SUCCESS",

            },

            amount: {

              type: "number",

              example: 5000,

            },

            balanceBefore: {

              type: "number",

              example: 250000,

            },

            balanceAfter: {

              type: "number",

              example: 245000,

            },

            narration: {

              type: "string",

              example: "Transfer to Jane Doe",

            },

            createdAt: {

              type: "string",

              format: "date-time",

            },

          },

        },

        Notification: {

          type: "object",

          properties: {

            id: {

              type: "string",

            },

            title: {

              type: "string",

            },

            message: {

              type: "string",

            },

            type: {

              type: "string",

            },

            isRead: {

              type: "boolean",

            },

            createdAt: {

              type: "string",

              format: "date-time",

            },

          },

        },



        AuditLog: {

          type: "object",

          properties: {

            id: {

              type: "string",

            },

            action: {

              type: "string",

            },

            description: {

              type: "string",

            },

            createdAt: {

              type: "string",

              format: "date-time",

            },

          },

        },

      },

    },

    security: [

      {

        bearerAuth: [],

      },

    ],

    tags: [

      { name: "Authentication" },

      { name: "Users" },

      { name: "Accounts" },

      { name: "Transfers" },

      { name: "International Transfers" },

      { name: "Transactions" },

      { name: "Deposits" },

      { name: "Withdrawals" },

      { name: "Beneficiaries" },

      { name: "KYC" },

      { name: "Notifications" },

      { name: "Support" },

      { name: "Investments" },

      { name: "Joint Investments" },

      { name: "Fixed Deposits" },

      { name: "Admin" },

      { name: "Super Admin" },

      { name: "Exchange Rates" },

      { name: "Master Data" },

      { name: "Settings" },

    ],

  },

  apis: [

    "./src/modules/**/*.routes.ts",

  ],

});