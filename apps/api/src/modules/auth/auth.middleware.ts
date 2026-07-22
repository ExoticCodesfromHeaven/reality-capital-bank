import type {
    NextFunction,
    Request,
    Response,
  } from "express";
  
  import { jwtService } from "../../utils/jwt";
  
  export function authMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
  ) {
    try {
      const authHeader = req.headers.authorization;
  
      if (!authHeader) {
        throw new Error("Unauthorized.");
      }
  
      const token = authHeader.replace("Bearer ", "");
  
      const payload = jwtService.verifyAccessToken(token);
  
      req.user = {
        id: payload.userId,
      };
  
      next();
    } catch {
      next(new Error("Unauthorized."));
    }
  }