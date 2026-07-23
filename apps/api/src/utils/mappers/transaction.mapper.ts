export function formatTransaction(
  transaction: any
) {

  return {

    reference:
      transaction.reference,

    amount:
      transaction.amount,

    type:
      transaction.type,

    category:
      transaction.category,

    status:
      transaction.status,

    narration:
      transaction.narration,

    balanceBefore:
      transaction.balanceBefore,

    balanceAfter:
      transaction.balanceAfter,

    createdAt:
      transaction.createdAt,

  };

}