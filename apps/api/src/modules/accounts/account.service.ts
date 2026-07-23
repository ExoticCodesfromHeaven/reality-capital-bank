import { AccountType, AccountStatus } from "@prisma/client";

import { accountRepository } from "./account.repository";
import { generateAccountNumber } from "../../utils/account-number";
import { AppError } from "../../errors/AppError";
import { formatAccount } from "../../utils/mappers/account.mapper";

export const accountService = {
  async createDefaultAccount(userId: string, currencyId: string, accountName: string) {
    let accountNumber: string;

    do {
      accountNumber = generateAccountNumber();
    } while (
      await accountRepository.findByAccountNumber(accountNumber)
    );

    return accountRepository.create({
      accountNumber,

      accountName,

      accountType: AccountType.CHECKING,

      status: AccountStatus.ACTIVE,

      balance: 0,

      availableBalance: 0,

      user: {
        connect: {
          id: userId,
        },
      },

      currency: {
        connect: {
          id: currencyId,
        },
      },
    });
  },

  async getAccounts(userId: string) {
    return accountRepository.findByUserId(userId);
  },

  async getAccount(
    accountNumber: string,
    userId: string
  ) {
    const account =
      await accountRepository.findByAccountNumberAndUser(
        accountNumber,
        userId
      );

    if (!account) {
      throw new AppError(
        "Account not found.",
        404
      );
    }

    return formatAccount(account);
  },

  async verifyAccount(accountNumber: string) {
    const account =
      await accountRepository.findByAccountNumber(
        accountNumber
      );

    if (!account) {
      throw new AppError(
        "Account not found.",
        404
      );
    }

    if (account.status !== AccountStatus.ACTIVE) {
      throw new AppError(
        "Account is not active.",
        400
      );
    }

    return {
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      bankName: "Reality Capital Bank",
    };
  },
};