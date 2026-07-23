import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { kycService } from "./kyc.service";

export const kycController = {

  async getPending(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const applications =
        await kycService.getPendingKyc();

      res.json({
        success: true,
        data: applications,
      });

    } catch (error) {

      next(error);

    }

  },


  async getOne(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {

    try {

      const application =
        await kycService.getKyc(
          req.params.id
        );

      res.json({
        success: true,
        data: application,
      });

    } catch (error) {

      next(error);

    }

  },


  async approve(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {

    try {

      const user =
        await kycService.approveKyc(
          req.params.id
        );

      res.json({
        success: true,
        message: "KYC approved successfully.",
        data: user,
      });

    } catch (error) {

      next(error);

    }

  },


  async reject(
    req: Request<{ id: string }, {}, { reason: string }>,
    res: Response,
    next: NextFunction
  ) {

    try {

      const result =
        await kycService.rejectKyc(
          req.params.id,
          req.body.reason
        );

      res.json({
        success: true,
        message: "KYC rejected.",
        data: result,
      });

    } catch (error) {

      next(error);

    }

  },

};