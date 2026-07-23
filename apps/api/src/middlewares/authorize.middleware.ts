import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { AppError } from "../errors/AppError";

export function authorize(
  ...roles: string[]
) {

  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {

    if (
      !roles.includes(req.user.role)
    ) {

      return next(
        new AppError(
          "Forbidden",
          403
        )
      );

    }

    next();

  };

}