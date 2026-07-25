import { Socket } from "socket.io";

import { prisma } from "../lib/prisma";

import type { AuthenticatedSocket } from "./socket.middleware";

export const registerSocketHandlers = (

  socket: AuthenticatedSocket

) => {

  socket.on(

  "join-ticket",

  async (

    ticketId: string

  ) => {

    const ticket =
      await prisma.supportTicket.findUnique({

        where: {

          id: ticketId,

        },

      });

    if (!ticket) {

      socket.emit(
          "error",
          "Unauthorized ticket."
      );

      return;

    }

    const user =
      socket.user;

    const allowed =

      ticket.createdById === user.id ||

      ticket.assignedToId === user.id;

    if (!allowed) {

      return;

    }

    socket.join(

      `ticket-${ticketId}`

    );

  }

);



  socket.on(

    "leave-ticket",

    (ticketId: string) => {

      socket.leave(

        `ticket-${ticketId}`

      );

    }

  );



  socket.on(
  "typing",
  (ticketId: string) => {

    socket.to(`ticket-${ticketId}`).emit(
      "support:typing",
      {
        userId: socket.user.id,
      }
    );

  }
);



  socket.on(
  "stop-typing",
  (ticketId: string) => {

    socket.to(`ticket-${ticketId}`).emit(
      "support:stop-typing",
      {
        userId: socket.user.id,
      }
    );

  }
);

};