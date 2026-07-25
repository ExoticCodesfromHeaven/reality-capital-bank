import {
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { generateReference } from "../../utils/reference";
import { formatMoney } from "../../utils/currency";
import { notificationService } from "../notification/notification.service";
import { auditService } from "../audit/audit.service";
import { NotificationType } from "@prisma/client";

export const withdrawalService = {
  async withdraw(
    accountNumber: string,
    amount: number,
    narration?: string
  ) {

    if (process.env.NODE_ENV === "production") {
      throw new AppError(
        "This endpoint is unavailable in production.",
        403
      );
    }

    const account =
      await prisma.account.findUnique({
        include: {
          currency: true,
          user: true
        },
        where: {
          accountNumber,
        },
      });

    if (!account) {
      throw new AppError(
        "Account not found.",
        404
      );
    }

    const balanceBefore =
      Number(account.balance);

    if (balanceBefore < amount) {
      throw new AppError(
        "Insufficient balance.",
        400
      );
    }

    const balanceAfter =
      balanceBefore - amount;

    return prisma.$transaction(async (tx) => {

      const updatedAccount =
        await tx.account.update({
          where: {
            id: account.id,
          },
          data: {
            balance: balanceAfter,
            availableBalance: balanceAfter,
          },
        });

      await tx.transaction.create({
        data: {

          reference:
            generateReference(),

          type:
            TransactionType.DEBIT,

          category:
            TransactionCategory.WITHDRAWAL,

          status:
            TransactionStatus.SUCCESS,

          amount,

          balanceBefore,

          balanceAfter,

          ...(narration && {
            narration,
          }),

          account: {
            connect: {
              id: account.id,
            },
          },
        },
      });

      await notificationService.create(

      account.userId,

      "Debit Alert",

      `${formatMoney(
      amount,
      account.currency.symbol
      )} has been debited from your account.`,

      NotificationType.SUCCESS

      );

      await auditService.create(

      account.userId,

      "ACCOUNT_DEBIT",

      `Account debited by ${formatMoney(
      amount,
      account.currency.symbol
      )}.`

      );

      return updatedAccount;

    });
  },
};