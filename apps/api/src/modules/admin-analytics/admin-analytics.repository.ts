import { prisma } from "../../lib/prisma";

export const adminAnalyticsRepository = {

  // ==========================
  // USER STATS
  // ==========================

  totalCustomers() {
    return prisma.user.count({
      where: {
        role: {
          is: {
            name: "CUSTOMER",
          },
        },
      },
    });
  },

  activeCustomers() {
    return prisma.user.count({
      where: {
        role: {
          is: {
            name: "CUSTOMER",
          },
        },
        status: "ACTIVE",
      },
    });
  },

  suspendedCustomers() {
    return prisma.user.count({
      where: {
        role: {
          is: {
            name: "CUSTOMER",
          },
        },
        status: "SUSPENDED",
      },
    });
  },

  emailVerifiedCustomers() {
    return prisma.user.count({
      where: {
        emailVerified: true,
      },
    });
  },

  kycApproved() {
    return prisma.kYC.count({
      where: {
        status: "APPROVED",
      },
    });
  },

  // ==========================
// ACCOUNT STATS
// ==========================

totalAccounts() {

  return prisma.account.count();

},

activeAccounts() {

  return prisma.account.count({

    where: {

      status: "ACTIVE",

    },

  });

},

frozenAccounts() {

  return prisma.account.count({

    where: {

      status: "FROZEN",

    },

  });

},

closedAccounts() {

  return prisma.account.count({

    where: {

      status: "CLOSED",

    },

  });

},

totalBankBalance() {

  return prisma.account.aggregate({

    _sum: {

      balance: true,

    },

  });

},

// ==========================
// LOCAL TRANSFERS
// ==========================

totalTransfers() {

  return prisma.transfer.count();

},

pendingTransfers() {

  return prisma.transfer.count({

    where: {

      status: "PENDING",

    },

  });

},

approvedTransfers() {

  return prisma.transfer.count({

    where: {

      status: "APPROVED",

    },

  });

},

rejectedTransfers() {

  return prisma.transfer.count({

    where: {

      status: "REJECTED",

    },

  });

},

localTransferVolume() {

  return prisma.transfer.aggregate({

    _sum: {

      amount: true,

    },

  });

},

// ==========================
// INTERNATIONAL TRANSFERS
// ==========================

totalInternationalTransfers() {

  return prisma.internationalTransfer.count();

},

pendingInternationalTransfers() {

  return prisma.internationalTransfer.count({

    where: {

      status: {

        in: [

          "PENDING",

          "UNDER_REVIEW",

          "PROCESSING",

        ],

      },

    },

  });

},

completedInternationalTransfers() {

  return prisma.internationalTransfer.count({

    where: {

      status: "COMPLETED",

    },

  });

},

failedInternationalTransfers() {

  return prisma.internationalTransfer.count({

    where: {

      status: {

        in: [

          "FAILED",

          "REJECTED",

          "CANCELLED",

        ],

      },

    },

  });

},

internationalTransferVolume() {

  return prisma.internationalTransfer.aggregate({

    _sum: {

      amount: true,

    },

  });

},

activeInvestments() {

  return prisma.investment.count({

    where: {

      status: "ACTIVE",

    },

  });

},

maturedInvestments() {

  return prisma.investment.count({

    where: {

      status: "MATURED",

    },

  });

},

cancelledInvestments() {

  return prisma.investment.count({

    where: {

      status: "CANCELLED",

    },

  });

},

investmentAmount() {

  return prisma.investment.aggregate({

    _sum: {

      amount: true,

      expectedReturn: true,

      totalAtMaturity: true,

    },

  });

},

activeJointInvestments() {

  return prisma.jointInvestment.count({

    where: {

      status: "ACTIVE",

    },

  });

},

pendingJointInvestments() {

  return prisma.jointInvestment.count({

    where: {

      status: "PENDING",

    },

  });

},

jointInvestmentAmount() {

  return prisma.jointInvestment.aggregate({

    _sum: {

      amount: true,

      expectedReturn: true,

      totalAtMaturity: true,

    },

  });

},

activeFixedDeposits() {

  return prisma.fixedDeposit.count({

    where: {

      status: "ACTIVE",

    },

  });

},

maturedFixedDeposits() {

  return prisma.fixedDeposit.count({

    where: {

      status: "MATURED",

    },

  });

},

fixedDepositAmount() {

  return prisma.fixedDeposit.aggregate({

    _sum: {

      amount: true,

      expectedInterest: true,

      maturityAmount: true,

    },

  });

},

supportTickets() {

  return prisma.supportTicket.count();

},

openTickets() {

  return prisma.supportTicket.count({

    where: {

      status: "OPEN",

    },

  });

},

assignedTickets() {

  return prisma.supportTicket.count({

    where: {

      status: "ASSIGNED",

    },

  });

},

waitingCustomerTickets() {

  return prisma.supportTicket.count({

    where: {

      status: "WAITING_FOR_CUSTOMER",

    },

  });

},

waitingSupportTickets() {

  return prisma.supportTicket.count({

    where: {

      status: "WAITING_FOR_SUPPORT",

    },

  });

},

resolvedTickets() {

  return prisma.supportTicket.count({

    where: {

      status: "RESOLVED",

    },

  });

},

closedTickets() {

  return prisma.supportTicket.count({

    where: {

      status: "CLOSED",

    },

  });

},

pendingKyc() {

  return prisma.kYC.count({

    where: {

      status: "PENDING",

    },

  });

},

approvedKyc() {

  return prisma.kYC.count({

    where: {

      status: "APPROVED",

    },

  });

},

rejectedKyc() {

  return prisma.kYC.count({

    where: {

      status: "REJECTED",

    },

  });

},

notificationsSent() {

  return prisma.notification.count();

},

unreadNotifications() {

  return prisma.notification.count({

    where: {

      isRead: false,

    },

  });

},

};