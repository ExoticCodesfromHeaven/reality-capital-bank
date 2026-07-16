import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

export const jwtService = {
  generateAccessToken(userId: string) {
    return jwt.sign(
      { userId },
      process.env.JWT_ACCESS_SECRET!,
      {
        expiresIn:
          process.env.JWT_ACCESS_EXPIRES_IN as StringValue,
      }
    );
  },

  generateRefreshToken(userId: string) {
    return jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn:
          process.env.JWT_REFRESH_EXPIRES_IN as StringValue,
      }
    );
  },
};