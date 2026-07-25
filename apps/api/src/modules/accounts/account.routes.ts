import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";
import { accountController } from "./account.controller";

const router = Router();
/**
 * @swagger
 * /api/accounts/verify/{accountNumber}:
 *   get:
 *     tags:
 *       - Accounts
 *     summary: Verify recipient account
 *     description: Verifies an account number before making a transfer.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountNumber
 *         required: true
 *         schema:
 *           type: string
 *         example: "10234567891"
 *     responses:
 *       200:
 *         description: Account verified successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 accountNumber: "10234567891"
 *                 accountName: "John Doe"
 *       404:
 *         description: Account not found.
 *       401:
 *         description: Unauthorized.
 */
router.get(
  "/verify/:accountNumber",
  authMiddleware,
  accountController.verifyAccount
);
/**
 * @swagger
 * /api/accounts/{accountNumber}:
 *   get:
 *     tags:
 *       - Accounts
 *     summary: Get account details
 *     description: Returns the full details of a customer's bank account.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountNumber
 *         required: true
 *         schema:
 *           type: string
 *         example: "10234567891"
 *     responses:
 *       200:
 *         description: Account retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 accountNumber: "10234567891"
 *                 accountName: "John Doe"
 *                 balance: 250000
 *                 availableBalance: 245000
 *                 accountType: SAVINGS
 *                 status: ACTIVE
 *                 currency: NGN
 *       404:
 *         description: Account not found.
 *       401:
 *         description: Unauthorized.
 */
router.get(
  "/:accountNumber",
  authMiddleware,
  accountController.getAccount
);

export default router;