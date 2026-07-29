import type { Request, Response } from "express";

import { countryService } from "./country.service";

export const countryController = {
  async getAll(req: Request, res: Response) {
    const countries = await countryService.getAll();

    res.json({
      success: true,

      data: countries,
    });
  },
};
