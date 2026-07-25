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

export const depositService = {
  async deposit(
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
        where:{
        accountNumber
        },

        include:{
        currency:true,
        user:true
      }

    });

    if (!account) {
      throw new AppError(
        "Account not found.",
        404
      );
    }

    const balanceBefore =
      Number(account.balance);

    const balanceAfter =
      balanceBefore + amount;

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
            TransactionType.CREDIT,

          category:
            TransactionCategory.DEPOSIT,

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

        "Credit Alert",

        `${formatMoney(
        amount,
        account.currency.symbol
        )} has been credited to your account.`,

        NotificationType.SUCCESS

        );

        await auditService.create(

        account.userId,

        "ACCOUNT_CREDIT",

        `Account credited with ${formatMoney(
        amount,
        account.currency.symbol
        )}.`

      );

      return updatedAccount;

    });

  },
};