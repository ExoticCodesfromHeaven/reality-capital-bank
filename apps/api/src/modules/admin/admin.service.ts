import { adminRepository } from "./admin.repository";
import { AppError } from "../../errors/AppError";
import { adminMapper } from "../../utils/mappers/admin.mapper";
import { AccountStatus } from "@prisma/client";

export const adminService = {
    async dashboard() {
        return adminRepository.getDashboardStats();
    },

    async getUsers() {

        const users =
            await adminRepository.getUsers();

        return users.map(
            adminMapper.userList
        );

    },

    async getUser(id: string) {

        const user =
            await adminRepository.getUser(id);

        if (!user) {

            throw new AppError(
                "User not found.",
                404
            );

        }

        return adminMapper.userDetails(
            user
        );

    },

    async freezeAccount(id: string) {

        const account =
        await adminRepository.updateAccountStatus(
            id,
            AccountStatus.FROZEN
        );

        return adminMapper.account(account);

        },

        async unfreezeAccount(id: string) {

        const account =
        await adminRepository.updateAccountStatus(
            id,
            AccountStatus.ACTIVE
        );

        return adminMapper.account(account);
        
    },

    async getTransactions() {

        return adminRepository.getTransactions();

    },


    async getTransaction(id: string) {

        const transaction =
            await adminRepository.getTransaction(id);


        if (!transaction) {

            throw new AppError(
                "Transaction not found.",
                404
            );

        }


        return transaction;
    },
};