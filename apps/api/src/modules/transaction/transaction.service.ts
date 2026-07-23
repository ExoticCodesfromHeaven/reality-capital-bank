import { accountRepository } from "../accounts/account.repository";
import { formatAccount } from "../../utils/mappers/account.mapper";

export const transactionService = {
  async getTransactions(userId: string) {
    const accounts =
      await accountRepository.findByUserId(userId);

    return accounts.map(formatAccount);
  },
};