import {
  Prisma,
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { generateReference } from "../../utils/reference"; 


export const transferService = {

  async localTransfer(
    userId: string,
    recipientAccountNumber: string,
    amount: number,
    narration?: string
  ) {

    const sender =
      await prisma.account.findFirst({
        where: {
          userId,
        },
      });


    const receiver =
      await prisma.account.findUnique({
        where: {
          accountNumber: recipientAccountNumber,
        },
      });


    if (!sender) {
      throw new Error(
        "Sender account not found."
      );
    }


    if (!receiver) {
      throw new Error(
        "Recipient account not found."
      );
    }


    if (sender.id === receiver.id) {
      throw new Error(
        "You cannot transfer to your own account."
      );
    }


    if (
      Number(sender.balance) < amount
    ) {
      throw new Error(
        "Insufficient balance."
      );
    }


    const transferReference =
      generateReference();


    const senderBalanceBefore =
      Number(sender.balance);


    const receiverBalanceBefore =
      Number(receiver.balance);


    const senderBalanceAfter =
      senderBalanceBefore - amount;


    const receiverBalanceAfter =
      receiverBalanceBefore + amount;



    const result =
      await prisma.$transaction(
        async (tx) => {


          // Update sender

          await tx.account.update({
            where: {
              id: sender.id,
            },

            data: {
              balance:
                senderBalanceAfter,

              availableBalance:
                senderBalanceAfter,
            },
          });



          // Update receiver

          await tx.account.update({
            where: {
              id: receiver.id,
            },

            data: {
              balance:
                receiverBalanceAfter,

              availableBalance:
                receiverBalanceAfter,
            },
          });



          // Create transfer record

          const transfer =
            await tx.transfer.create({

              data: {

                reference:
                  transferReference,

                amount,

                ...(narration && { narration }),

                status:
                  TransactionStatus.SUCCESS,


                senderAccount: {
                  connect: {
                    id: sender.id,
                  },
                },


                receiverAccount: {
                  connect: {
                    id: receiver.id,
                  },
                },

              },

            });



          // Debit transaction

          await tx.transaction.create({

            data: {

              reference:
                generateReference(),

              type:
                TransactionType.DEBIT,


              category:
                TransactionCategory.TRANSFER,


              status:
                TransactionStatus.SUCCESS,


              amount,


              balanceBefore:
                senderBalanceBefore,


              balanceAfter:
                senderBalanceAfter,


              ...(narration && { narration }),


              account: {
                connect: {
                  id: sender.id,
                },
              },


              transfer: {
                connect: {
                  id: transfer.id,
                },
              },

            },

          });



          // Credit transaction

          await tx.transaction.create({

            data: {

              reference:
                generateReference(),


              type:
                TransactionType.CREDIT,


              category:
                TransactionCategory.TRANSFER,


              status:
                TransactionStatus.SUCCESS,


              amount,


              balanceBefore:
                receiverBalanceBefore,


              balanceAfter:
                receiverBalanceAfter,


              ...(narration && { narration }),


              account: {
                connect: {
                  id: receiver.id,
                },
              },


              transfer: {
                connect: {
                  id: transfer.id,
                },
              },

            },

          });



          return transfer;

        }
      );


      return result;

  },

};