import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { statementSchema } from "./statement.validation";
import { statementService } from "./statement.service";

export const statementController = {

  async getStatement(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const query =
        statementSchema.parse(req.query);

      const queryParams = {
        ...(query.from !== undefined ? { from: query.from } : {}),
        ...(query.to !== undefined ? { to: query.to } : {}),
        ...(query.type !== undefined ? { type: query.type } : {}),
        ...(query.category !== undefined ? { category: query.category } : {}),
      };

      const statement =
        await statementService.getStatement(
          req.user.id,
          queryParams
        );

      res.json({
        success: true,
        message:
          "Statement retrieved successfully.",
        data: statement,
      });

    } catch (error) {
      next(error);
    }

  },

};