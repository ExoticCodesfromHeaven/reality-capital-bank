import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./modules/auth/auth.routes"

import accountRoutes from "./modules/accounts/account.routes";

import userRoutes from "./modules/users/user.routes";

import transferRoutes from "./modules/transfer/transfer.routes";

import transactionRoutes from "./modules/transaction/transaction.routes";

import { errorMiddleware } from "./middlewares/error.middleware";

import beneficiaryRoutes from "./modules/beneficiaries/beneficiary.routes";

import depositRoutes from "./modules/deposit/deposit.routes";

import withdrawalRoutes from "./modules/withdrawal/withdrawal.routes";

import statementRoutes from "./modules/statement/statement.routes";

import notificationRoutes from "./modules/notification/notification.routes";

import adminRoutes from "./modules/admin/admin.routes";

import kycRoutes from "./modules/kyc/kyc.routes";

import superAdminRoutes from "./modules/super-admin/super-admin.routes";

import exchangeRateRoutes from "./modules/exchange-rate/exchange-rate.routes";

import masterRoutes from "./modules/master-data/master.routes";

import settingsRoutes from "./modules/settings/settings.routes";

import supportRoutes from "./modules/support/support.routes";

import systemSettingsRoutes from "./modules/system-settings/system-settings.routes";

import investmentRoutes from "./modules/investment/investment.routes";

import jointInvestmentRoutes from "./modules/joint-investment/joint-investment.routes";

import fixedDepositRoutes from "./modules/fixed-deposit/fixed-deposit.routes";

import fixedDepositAdminRoutes from "./modules/fixed-deposit/fixed-deposit.admin.routes";

import adminAnalyticsRoutes from "./modules/admin-analytics/admin-analytics.routes";

import uploadRoutes from "./modules/uploads/upload-routes";

import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./docs/swagger";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(

  "/api/uploads",

  uploadRoutes

);

app.use("/uploads", express.static("uploads"));

app.use(
  cookieParser(process.env.COOKIE_SECRET)
);

app.use(

  "/api/admin-analytics",

  adminAnalyticsRoutes

);

app.use(
  "/api/kyc",
  kycRoutes
);

app.use(
  "/api/super-admin",
  superAdminRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/settings",
  settingsRoutes
);

app.use(
  "/api/system-settings",
  systemSettingsRoutes
);

app.use(
  "/api/master",
  masterRoutes
);

app.use(
  "/api/accounts",
  accountRoutes
);

app.use(
  "/api/transactions",
  transactionRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/exchange-rates",
  exchangeRateRoutes
);

app.use(
  "/api/transfers",
  transferRoutes
);

app.use(
  "/api/deposits",
  depositRoutes
);

app.use(
  "/api/withdrawals",
  withdrawalRoutes
);

app.use(
  "/api/investments",
  investmentRoutes
);

app.use(
"/api/joint-investments",
jointInvestmentRoutes
);

app.use(
"/api/admin/fixed-deposits",
fixedDepositAdminRoutes
);

app.use(
"/api/fixed-deposits",
fixedDepositRoutes
);

app.use(
  "/api/beneficiaries",
  beneficiaryRoutes
);

app.use(
  "/api/statements",
  statementRoutes
);

app.use(
  "/api/support",
  supportRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Reality Capital Bank API is running 🚀"
  });
});

app.use(

  "/docs",

  swaggerUi.serve,

  swaggerUi.setup(swaggerSpec)

);

app.use(errorMiddleware);

export default app;