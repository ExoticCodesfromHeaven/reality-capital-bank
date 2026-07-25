import { Server } from "socket.io";

let io: Server;

import { socketAuthMiddleware } from "./socket.middleware";

export const initializeSocket = (
  server: any
) => {

  io = new Server(server, {

    cors: {

      origin:
      process.env.CLIENT_URL,

      credentials: true,

    },

  });

  io.use(socketAuthMiddleware);

  return io;

};

export const getIO = () => {

  if (!io) {

    throw new Error(
      "Socket.IO not initialized."
    );

  }

  return io;

};