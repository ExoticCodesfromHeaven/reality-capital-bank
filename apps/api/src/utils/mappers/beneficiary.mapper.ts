import { maskAccountNumber } from "../mask account-number";

export function formatBeneficiary(
  beneficiary: any
) {

  return {

    id: beneficiary.id,

    nickname:
      beneficiary.nickname,

    accountName:
      beneficiary.accountName,

    accountNumber:
      maskAccountNumber(
        beneficiary.accountNumber
      ),

    bankName:
      beneficiary.bankName,

  };

}