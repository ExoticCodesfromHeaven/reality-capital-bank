import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { adminAnalyticsService } from "./admin-analytics.service";

export const userStats = async (

  _req: Request,

  res: Response,

  next: NextFunction

) => {

  try {

    const data =
  await adminAnalyticsService.getDashboardOverview();

    res.json({

      success: true,

      data,

    });

  } catch (error) {

    next(error);

  }

};