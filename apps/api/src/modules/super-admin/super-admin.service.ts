import { AppError } from "../../errors/AppError";
import { auditService } from "../audit/audit.service";
import { adminMapper } from "../../utils/mappers/admin.mapper";
import { superAdminRepository } from "./super-admin.respository";

export const superAdminService = {

  async getAdmins() {

    const admins =
      await superAdminRepository.getAdmins();

    return admins.map(
      adminMapper.userList
    );

  },



  async getAdmin(id: string) {

    const admin =
      await superAdminRepository.getAdmin(id);

    if (!admin) {

      throw new AppError(
        "User not found.",
        404
      );

    }

    return adminMapper.userDetails(admin);

  },



  async promoteToAdmin(

    userId: string,

    superAdminId: string

  ) {

    const user =
    await superAdminRepository.getUser(userId);

    if (!user) {

      throw new AppError(
        "User not found.",
        404
      );

    }

    if (
      user.role.name === "SUPER_ADMIN"
    ) {

      throw new AppError(
        "You cannot modify another Super Admin.",
        400
      );

    }

    if (
      user.role.name === "ADMIN"
    ) {

      throw new AppError(
        "User is already an Admin.",
        400
      );

    }

    const adminRole =
      await superAdminRepository.getRole(
        "ADMIN"
      );

    if (!adminRole) {

      throw new AppError(
        "ADMIN role not found.",
        500
      );

    }

    const updated =
      await superAdminRepository.updateUserRole(

        user.id,

        adminRole.id

      );

    await auditService.create(

      superAdminId,

      "ADMIN_PROMOTED",

      `Promoted ${user.email} to ADMIN.`

    );

    return updated;

  },



  async demoteAdmin(

    userId: string,

    superAdminId: string

  ) {

    const user =
      await superAdminRepository.getAdmin(
        userId
      );

    if (!user) {

      throw new AppError(
        "User not found.",
        404
      );

    }

    if (
      user.role.name === "SUPER_ADMIN"
    ) {

      throw new AppError(
        "You cannot demote a Super Admin.",
        400
      );

    }

    if (
      user.role.name !== "ADMIN"
    ) {

      throw new AppError(
        "This user is not an Admin.",
        400
      );

    }

    const customerRole =
      await superAdminRepository.getRole(
        "CUSTOMER"
      );

    if (!customerRole) {

      throw new AppError(
        "CUSTOMER role not found.",
        500
      );

    }

    const updated =
      await superAdminRepository.updateUserRole(

        user.id,

        customerRole.id

      );

    await auditService.create(

      superAdminId,

      "ADMIN_DEMOTED",

      `Removed admin privileges from ${user.email}.`

    );

    return updated;

  },

};