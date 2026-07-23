import {
  Prisma,
  TransactionCategory,
  TransactionType,
} from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { formatTransaction } from "../../utils/mappers/transaction.mapper";

export const statementService = {
  async getStatement(
    userId: string,
    filters: {
      from?: string;
      to?: string;
      type?: TransactionType;
      category?: TransactionCategory;
    }
  ) {

    const where: Prisma.TransactionWhereInput = {
      account: {
        userId,
      },
    };

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.from || filters.to) {
      where.createdAt = {};

      if (filters.from) {
        where.createdAt.gte =
          new Date(filters.from);
      }

      if (filters.to) {
        where.createdAt.lte =
          new Date(filters.to);
      }
    }

    const transactions =
      await prisma.transaction.findMany({

        where,

        include: {
          account: {
            select: {
              accountName: true,
              accountNumber: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },

      });

    const summary = {
      credits: 0,
      debits: 0,
      count: transactions.length,
    };

    for (const transaction of transactions) {

      if (transaction.type === "CREDIT") {
        summary.credits += Number(
          transaction.amount
        );
      }

      if (transaction.type === "DEBIT") {
        summary.debits += Number(
          transaction.amount
        );
      }

    }

    return {
      transactions:
        transactions.map(formatTransaction),
      summary,
    };

  },
};