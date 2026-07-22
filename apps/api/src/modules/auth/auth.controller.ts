import type { Request, Response, NextFunction } from "express";

import { authService } from "./auth.service";
import { 
  loginSchema,
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

  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = loginSchema.parse(req.body);

      const result = await authService.login(data);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async me(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await authService.me(req.user.id);
  
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { refreshToken } = req.body;
  
      const result = await authService.refresh(refreshToken);
  
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { refreshToken } = req.body;
  
      const result =
        await authService.logout(refreshToken);
  
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};