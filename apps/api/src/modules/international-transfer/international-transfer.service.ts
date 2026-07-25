import {
  AccountStatus,
  InternationalTransferStatus,
  NotificationType,
  Prisma,
  TransactionCategory,
  TransactionStatus,
  TransactionType,
  TransferPriority,
} from "@prisma/client";

import { prisma } from "../../lib/prisma";

import { AppError } from "../../errors/AppError";

import { generateReference } from "../../utils/reference";

import { internationalTransferRepository } from "./international-transfer.repository";

import { notificationService } from "../notification/notification.service";

import { auditService } from "../audit/audit.service";

import { systemSettingsRepository } from "../system-settings/system-settings.repository";

export const internationalTransferService = {

  async createTransfer({

    userId,

    senderAccountId,

    receiverCurrencyCode,

    recipientName,

    recipientAccountNumber,

    recipientBankName,

    recipientBankAddress,

    recipientCountry,

    swiftCode,

    iban,

    routingNumber,

    purpose,

    amount,

    priority,

  }:{

    userId:string;

    senderAccountId:string;

    receiverCurrencyCode:string;

    recipientName:string;

    recipientAccountNumber:string;

    recipientBankName:string;

    recipientBankAddress?:string;

    recipientCountry:string;

    swiftCode:string;

    iban?:string;

    routingNumber?:string;

    purpose:string;

    amount:number;

    priority:TransferPriority;

  }){

    const account =
      await internationalTransferRepository.getAccount(
        senderAccountId
      );

    if(!account){

      throw new AppError(
        "Account not found.",
        404
      );

    }

    if(account.userId !== userId){

      throw new AppError(
        "Unauthorized account.",
        403
      );

    }

    if(account.status === AccountStatus.FROZEN){

      throw new AppError(
        "Account is frozen.",
        403
      );

    }

    const receiverCurrency =
      await internationalTransferRepository.getCurrency(
        receiverCurrencyCode
      );

    if(!receiverCurrency){

      throw new AppError(
        "Destination currency not found.",
        404
      );

    }

    const senderCurrency =
      account.currency;

    const senderRate =
      Number(senderCurrency.exchangeRate);

    const receiverRate =
      Number(receiverCurrency.exchangeRate);

    const exchangeRate =
      receiverRate / senderRate;

    const convertedAmount =
      amount * exchangeRate;

        const chargesSetting =
      await systemSettingsRepository.getByKey(
        "international_transfer_charges"
      );

    if(!chargesSetting){

      throw new AppError(
        "International transfer settings missing.",
        500
      );

    }

    const config =
      chargesSetting.value as {

        flatFee:number;

        percentage:number;

        minimum:number;

        maximum:number;

      };

    let fee =

      config.flatFee +

      (amount * config.percentage / 100);

    if(fee < config.minimum){

      fee = config.minimum;

    }

    if(fee > config.maximum){

      fee = config.maximum;

    }

    const totalDebit =
      amount + fee;

    if(
      Number(account.availableBalance)
      <
      totalDebit
    ){

      throw new AppError(
        "Insufficient balance.",
        400
      );

    }

        const approvalSetting =
      await systemSettingsRepository.getByKey(
        "international_transfer_limits"
      );

    let requiresApproval = true;

    if(approvalSetting){

      const limits =
        approvalSetting.value as {

          autoApproveBelow:number;

        };

      requiresApproval =
        amount >= limits.autoApproveBelow;

    }

    const status =
      requiresApproval

      ? InternationalTransferStatus.PENDING

      : InternationalTransferStatus.APPROVED;

        const transfer =
      await internationalTransferRepository.create({

        reference:
          generateReference(),

        amount,

        fee,

        exchangeRate,

        convertedAmount,

        recipientName,

        recipientAccountNumber,

        recipientBankName,

        recipientBankAddress: recipientBankAddress ?? null,

        recipientCountry,

        swiftCode,

        iban : iban ?? null,

        routingNumber: routingNumber ?? null,

        purpose,

        priority,

        status,

        senderAccount:{
          connect:{
            id:account.id,
          },
        },

        senderCurrency:{
          connect:{
            id:senderCurrency.id,
          },
        },

        receiverCurrency:{
          connect:{
            id:receiverCurrency.id,
          },
        },

      });

        await notificationService.create(

      userId,

      "International Transfer Submitted",

      `Your international transfer request (${transfer.reference}) has been submitted successfully.`,

      NotificationType.INFO

    );

    await auditService.create(

      userId,

      "INTERNATIONAL_TRANSFER_CREATED",

      `Created international transfer ${transfer.reference}`

    );

    return transfer;

  },

  async getMyTransfers(
  userId: string
) {

  return internationalTransferRepository.getCustomerTransfers(
    userId
  );

},

async getTransfer(

  userId: string,

  transferId: string

) {

  const transfer =
    await internationalTransferRepository.getById(
      transferId
    );

  if (!transfer) {

    throw new AppError(

      "International transfer not found.",

      404

    );

  }

  if (
    transfer.senderAccount.userId !== userId
  ) {

    throw new AppError(

      "Unauthorized.",

      403

    );

  }

  return transfer;

},

async cancelTransfer(

  userId: string,

  transferId: string

) {

  const transfer =
    await internationalTransferRepository.getById(
      transferId
    );

  if (!transfer) {

    throw new AppError(

      "Transfer not found.",

      404

    );

  }

  if (
    transfer.senderAccount.userId !== userId
  ) {

    throw new AppError(

      "Unauthorized.",

      403

    );

  }

  if (
    transfer.status !==
    InternationalTransferStatus.PENDING
  ) {

    throw new AppError(

      "Only pending transfers can be cancelled.",

      400

    );

  }

  const cancelled =
    await internationalTransferRepository.updateStatus(

      transfer.id,

      {

        status:
          InternationalTransferStatus.CANCELLED,

        rejectionReason:
          "Cancelled by customer",

      }

    );

  await notificationService.create(

    userId,

    "Transfer Cancelled",

    `International transfer ${transfer.reference} has been cancelled.`,

    NotificationType.WARNING

  );

  await auditService.create(

    userId,

    "INTERNATIONAL_TRANSFER_CANCELLED",

    `Cancelled transfer ${transfer.reference}`

  );

  return cancelled;

},

async approveTransfer(

  adminId: string,

  transferId: string

) {

  const transfer =
    await internationalTransferRepository.getById(
      transferId
    );

  if (!transfer) {

    throw new AppError(
      "Transfer not found.",
      404
    );

  }

  if (
    transfer.status !==
    InternationalTransferStatus.PENDING
  ) {

    throw new AppError(
      "Transfer has already been processed.",
      400
    );

  }

  const approved =
    await internationalTransferRepository.updateStatus(

      transfer.id,

      {

        status:
          InternationalTransferStatus.APPROVED,

        approvedAt:
          new Date(),

        approvedBy: {
          connect: {
            id: adminId,
          },
        },

      }

    );

  await notificationService.create(

    transfer.senderAccount.userId,

    "Transfer Approved",

    `Your international transfer ${transfer.reference} has been approved and is awaiting processing.`,

    NotificationType.SUCCESS

  );

  await auditService.create(

    adminId,

    "INTERNATIONAL_TRANSFER_APPROVED",

    `Approved transfer ${transfer.reference}`

  );

  return approved;

},

async rejectTransfer(

  adminId: string,

  transferId: string,

  reason: string

) {

  const transfer =
    await internationalTransferRepository.getById(
      transferId
    );

  if (!transfer) {

    throw new AppError(
      "Transfer not found.",
      404
    );

  }

  if (
    transfer.status !==
    InternationalTransferStatus.PENDING
  ) {

    throw new AppError(
      "Transfer has already been processed.",
      400
    );

  }

  const rejected =
    await internationalTransferRepository.updateStatus(

      transfer.id,

      {

        status:
          InternationalTransferStatus.REJECTED,

        rejectionReason:
          reason,

        approvedBy: {
          connect: {
            id: adminId,
          },
        },

      }

    );

  await notificationService.create(

    transfer.senderAccount.userId,

    "Transfer Rejected",

    `Your international transfer has been rejected.\nReason: ${reason}`,

    NotificationType.ERROR

  );

  await auditService.create(

    adminId,

    "INTERNATIONAL_TRANSFER_REJECTED",

    `Rejected transfer ${transfer.reference}`

  );

  return rejected;

},

async getPendingTransfers() {

  return internationalTransferRepository.getPendingTransfers();

},

async getTransferForAdmin(
  id: string
) {

  const transfer =
    await internationalTransferRepository.getById(id);

  if (!transfer) {

    throw new AppError(
      "Transfer not found.",
      404
    );

  }

  return transfer;

}
};