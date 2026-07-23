import { 
  KYCStatus,
  UserStatus
} from "@prisma/client";

import { kycRepository } from "./kyc.repository";
import { AppError } from "../../errors/AppError";


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


  async approveKyc(id:string) {


    const kyc =
      await kycRepository.getKycById(id);


    if(!kyc){

      throw new AppError(
        "KYC application not found.",
        404
      );

    }


    await kycRepository.updateKycStatus(
      id,
      KYCStatus.APPROVED
    );


    return kycRepository.updateUserStatus(
      kyc.userId,
      UserStatus.ACTIVE
    );

  },


  async rejectKyc(
    id:string,
    reason:string
  ) {


    const kyc =
      await kycRepository.getKycById(id);


    if(!kyc){

      throw new AppError(
        "KYC application not found.",
        404
      );

    }


    return kycRepository.updateKycStatus(
      id,
      KYCStatus.REJECTED,
      reason
    );

  },


};