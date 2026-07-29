import { prisma } from "../../config/prisma";

import {
  AccountStatus,
  KYCStatus,
  UserStatus,
} from "@prisma/client";

export const adminAnalyticsRepository = {
  // =========================
  // USER STATS
  // =========================

  getTotalCustomers() {
    return prisma.user.count();
  },

  getActiveCustomers() {
    return prisma.user.count({
      where: {
        status: UserStatus.ACTIVE,
      },
    });
  },

  getSuspendedCustomers() {
    return prisma.user.count({
      where: {
        status: UserStatus.SUSPENDED,
      },
    });
  },

  getEmailVerifiedCustomers() {
    return prisma.user.count({
      where: {
        emailVerified: true,
      },
    });
  },

  getApprovedKycCustomers() {
    return prisma.user.count({
      where: {
        kyc: {
          status: KYCStatus.APPROVED,
        },
      },
    });
  },

  // =========================
  // ACCOUNT STATS
  // =========================

  getTotalAccounts() {
    return prisma.account.count();
  },

  getActiveAccounts() {
    return prisma.account.count({
      where: {
        status: AccountStatus.ACTIVE,
      },
    });
  },

  getFrozenAccounts() {
    return prisma.account.count({
      where: {
        status: AccountStatus.FROZEN,
      },
    });
  },

  getClosedAccounts() {
    return prisma.account.count({
      where: {
        status: AccountStatus.CLOSED,
      },
    });
  },

  getTotalBalance() {
    return prisma.account.aggregate({
      _sum: {
        balance: true,
      },
    });
  },
};