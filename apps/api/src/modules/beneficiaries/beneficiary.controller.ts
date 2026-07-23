import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { beneficiaryService } from "./beneficiary.service";
import { createBeneficiarySchema } from "./beneficiary.validation";
import { AppError } from "../../errors/AppError";

export const beneficiaryController = {
  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        createBeneficiarySchema.parse(
          req.body
        );

      const beneficiary =
        await beneficiaryService.create(
          req.user.id,
          data.accountNumber,
          data.nickname
        );

      res.status(201).json({
        success: true,
        message:
          "Beneficiary added successfully.",
        data: beneficiary,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const beneficiaries =
        await beneficiaryService.getAll(
          req.user.id
        );

      res.json({
        success: true,
        data: beneficiaries,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

        if (!id || Array.isArray(id)) {
        throw new AppError(
            "Invalid beneficiary id.",
            400
        );
        }

        await beneficiaryService.delete(
        id,
        req.user.id
        );
        
    } catch (error) {
      next(error);
    }
  },
};