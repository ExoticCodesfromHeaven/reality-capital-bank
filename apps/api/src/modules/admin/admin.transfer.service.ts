import {
  TransactionCategory,
  TransactionStatus,
  TransactionType,
  NotificationType,
  TransferStatus,
} from "@prisma/client";

import { prisma } from "../../lib/prisma";

import { AppError } from "../../errors/AppError";

import { generateReference } from "../../utils/reference";

import { notificationService } from "../notification/notification.service";

import { auditService } from "../audit/audit.service";

import { adminTransferRepository } from "./admin.transfer.repository";


export const adminTransferService = {


  async getPendingTransfers() {

    return adminTransferRepository.getPendingTransfers();

  },



  async approveTransfer(
    id: string,
    adminId: string
  ) {


    const transfer =
      await adminTransferRepository.getTransfer(id);



    if (!transfer) {

      throw new AppError(
        "Transfer not found.",
        404
      );

    }



    if (
      transfer.status !== TransactionStatus.PENDING
    ) {

      throw new AppError(
        "Transfer already processed.",
        400
      );

    }



    const sender =
      transfer.senderAccount;


    const receiver =
      transfer.receiverAccount;



    if (
      Number(sender.balance) <
      Number(transfer.amount)
    ) {


      await adminTransferRepository.updateTransferStatus(
        id,
        {
          status: TransferStatus.REJECTED,

          approvedById: adminId,

          rejectionReason:
            "Insufficient balance.",

          approvedAt:
            new Date(),
        }
      );



      throw new AppError(
        "Sender no longer has sufficient balance.",
        400
      );

    }




    const result =
      await prisma.$transaction(
        async (tx) => {



          const senderAfter =
            Number(sender.balance) -
            Number(transfer.amount);



          const receiverAfter =
            Number(receiver.balance) +
            Number(transfer.amount);




          await tx.account.update({

            where: {
              id: sender.id,
            },

            data: {

              balance:
                senderAfter,

              availableBalance:
                senderAfter,

            },

          });





          await tx.account.update({

            where: {
              id: receiver.id,
            },

            data: {

              balance:
                receiverAfter,

              availableBalance:
                receiverAfter,

            },

          });







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



              amount:
                transfer.amount,



              balanceBefore:
                sender.balance,


              balanceAfter:
                senderAfter,



              account: {

                connect: {

                  id:
                    sender.id,

                },

              },



              transfer: {

                connect: {

                  id:
                    transfer.id,

                },

              },


            },

          });









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



              amount:
                transfer.amount,



              balanceBefore:
                receiver.balance,


              balanceAfter:
                receiverAfter,



              account: {

                connect: {

                  id:
                    receiver.id,

                },

              },



              transfer: {

                connect: {

                  id:
                    transfer.id,

                },

              },


            },

          });






          return tx.transfer.update({

            where: {

              id,

            },


            data: {

              status:
                TransferStatus.APPROVED,


              approvedById:
                adminId,


              approvedAt:
                new Date(),

            },


          });


        }
      );








    await notificationService.create(

      sender.userId,

      "Transfer Successful",

      `Your transfer of ₦${Number(transfer.amount).toLocaleString()} has been approved.`,

      NotificationType.SUCCESS

    );





    await notificationService.create(

      receiver.userId,

      "Money Received",

      `You received ₦${Number(transfer.amount).toLocaleString()} from ${sender.accountName}.`,

      NotificationType.SUCCESS

    );






    await auditService.create(

      adminId,

      "TRANSFER_APPROVED",

      `Approved transfer ${transfer.reference}`

    );



    return result;


  },





  async rejectTransfer(
    id: string,
    adminId: string,
    reason: string
  ) {



    const transfer =
      await adminTransferRepository.getTransfer(id);




    if (!transfer) {

      throw new AppError(
        "Transfer not found.",
        404
      );

    }




    if(
    transfer.status !== TransferStatus.PENDING
    ) {

      throw new AppError(
        "Transfer already processed.",
        400
      );

    }





    const rejected =
      await adminTransferRepository.updateTransferStatus(

        id,

        {

          status: TransferStatus.REJECTED,


          approvedById:
            adminId,


          rejectionReason:
            reason,


          approvedAt:
            new Date(),

        }

      );







    await notificationService.create(

      transfer.senderAccount.userId,

      "Transfer Failed",

      `Your transfer of ₦${Number(transfer.amount).toLocaleString()} was rejected. Reason: ${reason}`,

      NotificationType.ERROR

    );







    await auditService.create(

      adminId,

      "TRANSFER_REJECTED",

      `Rejected transfer ${transfer.reference}`

    );




    return rejected;


  }



};