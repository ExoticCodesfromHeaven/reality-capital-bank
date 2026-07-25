import multer from "multer";

import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../lib/cloudinary";

import { AppError } from "../errors/AppError";

const storage = new CloudinaryStorage({

  cloudinary,

  params: async (req, file) => {

    let folder = "reality-capital-bank/general";

    if (file.fieldname === "avatar") {

      folder = "reality-capital-bank/avatars";

    }

    if (file.fieldname === "document") {

      folder = "reality-capital-bank/kyc";

    }

    if (file.fieldname === "attachment") {

      folder = "reality-capital-bank/support";

    }

    return {

      folder,

      resource_type: "auto",

      public_id: `${Date.now()}-${file.originalname}`,

    };

  },

});

const allowedMimeTypes = [

  "image/jpeg",

  "image/png",

  "image/webp",

  "application/pdf",

];

export const upload = multer({

  storage,

  limits: {

    fileSize: 10 * 1024 * 1024,

  },

  fileFilter: (req, file, cb) => {

    if (

      allowedMimeTypes.includes(

        file.mimetype

      )

    ) {

      cb(null, true);

      return;

    }

    cb(

      new AppError(

        "Only JPG, PNG, WEBP and PDF files are allowed.",

        400

      )

    );

  },

});

export const uploadAvatar =
  upload.single("avatar");

export const uploadKyc =
  upload.single("document");

export const uploadSupport =
  upload.single("attachment");