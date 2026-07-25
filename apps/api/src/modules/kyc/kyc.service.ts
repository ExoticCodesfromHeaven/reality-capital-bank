import { 
  KYCStatus,
  UserStatus
} from "@prisma/client";

import { kycRepository } from "./kyc.repository";
import { AppError } from "../../errors/AppError";
import { notificationService } from "../notification/notification.service";
import { auditService } from "../audit/audit.service";


export const kycService = {


  async getPendingKyc() {

    return kycRepository.getPendingKyc();

  },


  async getKyc(id:string) {

    const kyc =
      await kycRepository.getKycById(id);


    if(!kyc){

      throw new AppError(
        "KYC application not found.",
        404
      );

    }


    return kyc;

  },


  async approveKyc(id:string, adminId:string) {


    const kyc =
      await kycRepository.getKycById(id);


    if(!kyc){

      throw new AppError(
        "KYC application not found.",
        404
      );

    }

    if (
      kyc.status === KYCStatus.APPROVED
    ) {

      throw new AppError(
        "KYC has already been approved.",
        400
      );

    }

    if (
      kyc.status === KYCStatus.REJECTED
    ) {

      throw new AppError(
        "KYC has already been rejected.",
        400
      );

    }


    await kycRepository.updateKycStatus(
      id,
      KYCStatus.APPROVED,
      adminId
    );

    await notificationService.create(

    kyc.userId,

    "KYC Approved",

    "Your identity verification has been approved. Your account is now fully verified.",

    "SUCCESS"

  );

  await auditService.create(

    adminId,

    "KYC_APPROVED",

    `Approved KYC for ${kyc.user.firstName} ${kyc.user.lastName}.`

  );


    return kycRepository.updateUserStatus(
      kyc.userId,
      UserStatus.ACTIVE
    );

  },


  async rejectKyc(
    id:string,
    reason:string,
    adminId:string
  ) {


    const kyc =
      await kycRepository.getKycById(id);


    if(!kyc){

      throw new AppError(
        "KYC application not found.",
        404
      );
    }

    if (
      kyc.status === KYCStatus.APPROVED
    ) {

      throw new AppError(
        "Approved KYC cannot be rejected.",
        400
      );

    }

    if (
      kyc.status === KYCStatus.REJECTED
    ) {

      throw new AppError(
        "KYC has already been rejected.",
        400
      );

    }


    const result =
      await kycRepository.updateKycStatus(
        id,
        KYCStatus.REJECTED,
        adminId,
        reason
      );

    await notificationService.create(

      kyc.userId,

      "KYC Rejected",

      `Your identity verification was rejected.\nReason: ${reason}`,

      "ERROR"

    );

    await auditService.create(

      adminId,

      "KYC_REJECTED",

      `Rejected KYC for ${kyc.user.firstName} ${kyc.user.lastName}.`

    );

    return result;

  },


};