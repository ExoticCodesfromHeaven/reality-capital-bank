import { Router } from "express";

import { upload } from "../../middlewares/upload.middleware";

import { authMiddleware } from "../auth/auth.middleware";

import { uploadController } from "./upload-controller";

const router = Router();

router.post(

  "/single",

  authMiddleware,

  upload.single("file"),

  uploadController.uploadSingle

);

export default router;