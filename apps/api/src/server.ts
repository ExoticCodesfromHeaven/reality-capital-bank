import app from "./app";
import http from "http";
import "./jobs";
import { startInvestmentJob } from "./jobs/investment.job";
import { initializeSocket } from "./socket/socket";
import { registerSocketHandlers } from "./socket/socket.handlers";
import {startJointInvestmentJob} from "./jobs/joint-investment.job";
import {startFixedDepositJob} from "./jobs/fixed-deposit.job";
import type { AuthenticatedSocket } from "./socket/socket.middleware";

const PORT = process.env.PORT || 5000;


const server = http.createServer(app);

const io =
  initializeSocket(server);

  io.on("connection", (socket) => {
    const authSocket = socket as AuthenticatedSocket;

    authSocket.join(
      `user-${authSocket.user.id}`
    );

    console.log(
      "Socket Connected",
      authSocket.id
    );

    registerSocketHandlers(authSocket);
  });

server.listen(PORT, () => {
  console.log(
    `🏦 Reality Capital Bank API running on port ${PORT}`
  );
});

startInvestmentJob();
startJointInvestmentJob();
startFixedDepositJob();