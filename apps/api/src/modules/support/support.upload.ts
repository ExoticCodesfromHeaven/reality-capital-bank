import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "uploads/support";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({

  destination(req, file, cb) {

    cb(null, uploadPath);

  },

  filename(req, file, cb) {

    const unique =

      `${Date.now()}-${Math.round(Math.random()*1e9)}`;

    cb(

      null,

      `${unique}${path.extname(file.originalname)}`

    );

  },

});

export const supportUpload = multer({

  storage,

  limits: {

    fileSize: 10 * 1024 * 1024,

  },

});