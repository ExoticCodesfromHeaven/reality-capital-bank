import { transactionRepository } from "./transaction.repository";

export const transactionService = {
  async getTransactions(userId: string) {
    return transactionRepository.findByUserId(userId);
  },
};