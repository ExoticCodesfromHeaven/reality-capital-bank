import {
  Prisma,
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { generateReference } from "../../utils/reference"; 
import { AppError } from "../../errors/AppError";
import { notificationService } from "../notification/notification.service";
import { maskAccountNumber } from "../../utils/mask account-number";
import { auditService } from "../audit/audit.service";

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
      throw new AppError(
        "Sender account not found.",
        404
      );
    }

    if (
      sender.status !== "ACTIVE"
    ) {
      throw new AppError(
        "Sender account is frozen.",
        403
      );
    }

    if (!receiver) {
      throw new AppError(
        "Recipient account not found.",
        404
      );
    }

    if (
      receiver.status !== "ACTIVE"
    ) {
      throw new AppError(
        "Recipient account is frozen.",
        403
      );
    }


    if (sender.id === receiver.id) {
      throw new AppError(
        "You cannot transfer to your own account.",
        400
      );
    }


    if (
      Number(sender.balance) < amount
    ) {
      throw new AppError(
        "Insufficient balance.",
        400
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

      const maskedReceiver =
        maskAccountNumber(receiver.accountNumber);

      const maskedSender =
        maskAccountNumber(sender.accountNumber);

      await notificationService.create(
        sender.userId,
        "Transfer Successful",
        `You sent ₦${amount.toLocaleString()} to ${receiver.accountName} (${maskedReceiver}).`,
        "SUCCESS"
      );

      await notificationService.create(
        receiver.userId,
        "Money Received",
        `${sender.accountName} (${maskedSender}) sent you ₦${amount.toLocaleString()}.`,
        "SUCCESS"
      );

      await auditService.create(
        sender.userId,
        "LOCAL_TRANSFER",
        `Transferred ₦${amount.toLocaleString()} to ${receiver.accountName}.`
      );

      await auditService.create(
        receiver.userId,
        "MONEY_RECEIVED",
        `Received ₦${amount.toLocaleString()} from ${sender.accountName}.`
      );


      return result;

  },

  async getTransfers(userId: string) {
    const account = await prisma.account.findFirst({
        where: {
        userId,
        },
    });

    if (!account) {
        throw new AppError(
        "Account not found.",
        404
        );
    }

    return prisma.transfer.findMany({
        where: {
        OR: [
            {
            senderAccountId: account.id,
            },
            {
            receiverAccountId: account.id,
            },
        ],
        },

        include: {
        senderAccount: {
            select: {
            accountNumber: true,
            accountName: true,
            },
        },

          receiverAccount: {
            select: {
              accountNumber: true,
              accountName: true,
            },
        },
        },

        orderBy: {
        createdAt: "desc",
        },
    });
    },

};