import type { Request, Response, NextFunction } from "express";

import { authService } from "./auth.service";
import { 
  registerSchema, 
  verifyEmailSchema, 
} from "./auth.validation";

export const authController = {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = registerSchema.parse(req.body);

      const result = await authService.register(data);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = verifyEmailSchema.parse(req.body);

      const result = await authService.verifyEmail(data);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};