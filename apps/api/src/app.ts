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

import { parseArgs } from "node:util";

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
  cookieParser(process.env.COOKIE_SECRET)
);

app.use(
  "/api/admin",
  adminRoutes
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
  "/api/beneficiaries",
  beneficiaryRoutes
);

app.use(
  "/api/statements",
  statementRoutes
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

app.use(errorMiddleware);

export default app;