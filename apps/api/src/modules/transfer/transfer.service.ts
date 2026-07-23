import { prisma } from "../../lib/prisma";

import { generateReference } from "../../utils/reference";
import { AppError } from "../../errors/AppError";

import { notificationService } from "../notification/notification.service";

import {
  NotificationType,
} from "@prisma/client";

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
          accountNumber:
            recipientAccountNumber,
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



    if (
      sender.id === receiver.id
    ) {

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

    if (
      amount <= 0
    ) {

      throw new AppError(
        "Invalid transfer amount.",
        400
      );

    }

    const transfer =
      await prisma.transfer.create({

        data: {

          reference:
            generateReference(),


          amount,


          ...(narration && {
            narration,
          }),


          status:
            "PENDING",



          senderAccount: {

            connect: {

              id:
                sender.id,

            },

          },



          receiverAccount: {

            connect: {

              id:
                receiver.id,

            },

          },


        },

      });





    const maskedReceiver =
      maskAccountNumber(
        receiver.accountNumber
      );



    await notificationService.create(

      sender.userId,

      "Transfer Pending",

      `Your transfer request of ₦${amount.toLocaleString()} to ${receiver.accountName} (${maskedReceiver}) is Pending.`,

      NotificationType.INFO

    );

    await auditService.create(

      sender.userId,

      "TRANSFER_REQUEST",

      `Your transfer of ₦${amount.toLocaleString()} to ${receiver.accountName} (${maskedReceiver}) is pending.`

    );

    return transfer;
  },

  async getTransfers(
    userId: string
  ) {


    const account =
      await prisma.account.findFirst({

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

            senderAccountId:
              account.id,

          },


          {

            receiverAccountId:
              account.id,

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

        createdAt:
          "desc",

      },


    });


  },


};