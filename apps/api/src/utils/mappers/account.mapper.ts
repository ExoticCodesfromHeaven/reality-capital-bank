import { maskAccountNumber } from "../mask account-number";

export function formatAccount(account: any) {
  return {

    id: account.id,

    accountName: account.accountName,

    accountNumber:
      maskAccountNumber(
        account.accountNumber
      ),

    balance: account.balance,

    availableBalance:
      account.availableBalance,

    currency: account.currency,

    accountType:
      account.accountType,

    status: account.status,

  };
}