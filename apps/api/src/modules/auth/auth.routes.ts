import { Router } from "express";

import { authController } from "./auth.controller";

import { authMiddleware } from "./auth.middleware";

const router = Router();

router.post("/register", authController.register);
router.post("/verify-email", authController.verifyEmail);
router.post("/login", authController.login);

router.get(
    "/me",
    authMiddleware,
    authController.me
);

router.post(
    "/refresh",
    authController.refresh
);

router.post(
    "/logout",
    authController.logout
);

export default router;