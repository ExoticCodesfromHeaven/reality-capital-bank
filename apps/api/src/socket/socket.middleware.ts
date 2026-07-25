import { Socket } from "socket.io";

import jwt from "jsonwebtoken";

import { env } from "../env";

export interface AuthenticatedSocket
  extends Socket {

  user: {

    id: string;

    role: string;

  };

}

export const socketAuthMiddleware = (

  socket: Socket,

  next: (err?: Error) => void

) => {

  try {

    const token =

      socket.handshake.auth?.token ||

      socket.handshake.headers.authorization?.replace(

        "Bearer ",

        ""

      );

    if (!token) {

      return next(

        new Error(

          "Unauthorized"

        )

      );

    }

    const decoded =
      jwt.verify(

        token,

        env.JWT_SECRET

      ) as {

        id: string;

        role: string;

      };

    (socket as AuthenticatedSocket).user = {

      id: decoded.id,

      role: decoded.role,

    };

    next();

  } catch {

    next(

      new Error(

        "Invalid token"

      )

    );

  }

};