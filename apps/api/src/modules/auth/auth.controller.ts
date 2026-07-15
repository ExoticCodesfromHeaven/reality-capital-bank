import type { Request, Response, NextFunction } from "express";

import { authService } from "./auth.service";
import { registerSchema } from "./auth.validation";

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
};