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

app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Reality Capital Bank API is running 🚀"
  });
});

app.use(errorMiddleware);

export default app;