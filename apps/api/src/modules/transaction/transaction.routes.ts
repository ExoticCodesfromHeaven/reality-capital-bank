import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware";
import { transactionController } from "./transaction.controller";

const router = Router();
/**
 * @swagger
 * /api/transactions:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Get transaction history
 *     description: Returns the authenticated user's transaction history ordered from newest to oldest.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of transactions per page.
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum:
 *             - DEBIT
 *             - CREDIT
 *         description: Filter by transaction type.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum:
 *             - TRANSFER
 *             - INTERNATIONAL_TRANSFER
 *             - DEPOSIT
 *             - WITHDRAWAL
 *             - INVESTMENT
 *             - FIXED_DEPOSIT
 *             - INTEREST
 *             - CHARGE
 *             - REVERSAL
 *         description: Filter by transaction category.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - PENDING
 *             - SUCCESS
 *             - FAILED
 *             - REVERSED
 *         description: Filter by transaction status.
 *     responses:
 *       200:
 *         description: Transaction history retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized.
 */
router.get(
  "/",
  authMiddleware,
  transactionController.getTransactions
);

export default router;