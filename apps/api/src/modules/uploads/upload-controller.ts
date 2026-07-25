import type { Request, Response } from "express";

import { AppError } from "../../errors/AppError";

export const uploadController = {

  uploadSingle(

    req: Request,

    res: Response

  ) {

    if (!req.file) {

      throw new AppError(

        "No file uploaded.",

        400

      );

    }

    res.json({

      success: true,

      data: {

        url: req.file.path,

        filename: req.file.filename,

        mimetype: req.file.mimetype,

        size: req.file.size,

      },

    });

  },

};