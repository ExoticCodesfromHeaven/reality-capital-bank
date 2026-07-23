import { maskAccountNumber } from "../mask account-number";

export function formatTransfer(
  transfer: any
) {

  return {

    reference:
      transfer.reference,

    amount:
      transfer.amount,

    narration:
      transfer.narration,

    status:
      transfer.status,

    sender: {

      accountName:
        transfer.senderAccount.accountName,

      accountNumber:
        maskAccountNumber(
          transfer.senderAccount.accountNumber
        ),

    },

    receiver: {

      accountName:
        transfer.receiverAccount.accountName,

      accountNumber:
        maskAccountNumber(
          transfer.receiverAccount.accountNumber
        ),

    },

    createdAt:
      transfer.createdAt,

  };

}