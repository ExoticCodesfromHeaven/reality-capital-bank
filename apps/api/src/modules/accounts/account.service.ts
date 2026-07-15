import { AccountType, AccountStatus } from "@prisma/client";

import { accountRepository } from "./account.repository";
import { generateAccountNumber } from "../../utils/account-number";

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
};