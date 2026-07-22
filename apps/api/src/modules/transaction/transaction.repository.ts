import { prisma } from "../../lib/prisma";
import type { Prisma } from "@prisma/client";

export const transactionRepository = {
    async findByUserId(userId: string) {
        return prisma.transaction.findMany({
        where: {
            account: {
            userId,
            },
        },

        include: {
            account: true,
        },

        orderBy: {
            createdAt: "desc",
        },
        });
    },

    async findByAccountNumber(accountNumber: string) {
        return prisma.account.findUnique({
            where: {
            accountNumber,
            },
        });
    },

    async updateBalance(
        accountId: string,
        balance: Prisma.Decimal
        ) {
        return prisma.account.update({
            where: {
            id: accountId,
            },
            data: {
            balance,
            availableBalance: balance,
            },
        });
    },

    async createTransaction(
        data: Prisma.TransactionCreateInput
        ) {
        return prisma.transaction.create({
            data,
        });
    },

    async findAccountByUserId(userId: string) {
        return prisma.account.findFirst({
            where: {
            userId,
            },
        });
    },
};