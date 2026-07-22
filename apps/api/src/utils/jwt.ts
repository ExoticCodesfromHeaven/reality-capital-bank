import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const jwtService = {
  generateAccessToken(userId: string) {
    return jwt.sign(
      { userId },
      ACCESS_SECRET,
      {
        expiresIn:
          process.env.JWT_ACCESS_EXPIRES_IN as StringValue,
      }
    );
  },

  generateRefreshToken(userId: string) {
    return jwt.sign(
      { userId },
      REFRESH_SECRET,
      {
        expiresIn:
          process.env.JWT_REFRESH_EXPIRES_IN as StringValue,
      }
    );
  },

  verifyAccessToken(token: string) {
    return jwt.verify(token, ACCESS_SECRET) as {
      userId: string;
    };
  },

  verifyRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_SECRET) as {
      userId: string;
    };
  },
};