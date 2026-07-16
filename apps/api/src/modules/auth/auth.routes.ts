import { Router } from "express";

import { authController } from "./auth.controller";

const router = Router();

router.post("/register", authController.register);
router.post("/verify-email", authController.verifyEmail);

export default router;