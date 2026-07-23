import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { prisma } from "../../lib/prisma";
import { jwtService } from "../../utils/jwt";
import { AppError } from "../../errors/AppError";

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {

  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      throw new AppError(
        "Unauthorized",
        401
      );
    }

    const token =
      authHeader.replace("Bearer ", "");

    const payload =
      jwtService.verifyAccessToken(token);

    const user =
      await prisma.user.findUnique({

        where: {
          id: payload.userId,
        },

        include: {
          role: true,
        },

      });

    if (!user) {
      throw new AppError(
        "Unauthorized",
        401
      );
    }

    req.user = {
      id: user.id,
      role: user.role.name,
    };

    next();

  } catch (error) {
    next(error);
  }

}