import { adminAnalyticsRepository } from "./admin-analytics.repository";

export const adminAnalyticsService = {

  // ==========================
  // DASHBOARD OVERVIEW
  // ==========================

  async getDashboardOverview() {

    const [

  totalCustomers,

  activeCustomers,

  suspendedCustomers,

  emailVerified,

  kycApproved,

  totalAccounts,

  activeAccounts,

  frozenAccounts,

  closedAccounts,

  totalBalance,

  totalTransfers,

  pendingTransfers,

  approvedTransfers,

  rejectedTransfers,

  localTransferVolume,

  totalInternationalTransfers,

  pendingInternationalTransfers,

  completedInternationalTransfers,

  failedInternationalTransfers,

  internationalTransferVolume,

  activeInvestments,
  maturedInvestments,
  cancelledInvestments,
  investmentAmount,

  activeJointInvestments,
  pendingJointInvestments,
  jointInvestmentAmount,

  activeFixedDeposits,
  maturedFixedDeposits,
  fixedDepositAmount,

  supportTickets,

  openTickets,

  assignedTickets,

  waitingCustomerTickets,

  waitingSupportTickets,

  resolvedTickets,

  closedTickets,

  pendingKyc,

  approvedKyc,

  rejectedKyc,

  notificationsSent,

  unreadNotifications,

] = await Promise.all([

  adminAnalyticsRepository.totalCustomers(),

  adminAnalyticsRepository.activeCustomers(),

  adminAnalyticsRepository.suspendedCustomers(),

  adminAnalyticsRepository.emailVerifiedCustomers(),

  adminAnalyticsRepository.kycApproved(),

  adminAnalyticsRepository.totalAccounts(),

  adminAnalyticsRepository.activeAccounts(),

  adminAnalyticsRepository.frozenAccounts(),

  adminAnalyticsRepository.closedAccounts(),

  adminAnalyticsRepository.totalBankBalance(),

  adminAnalyticsRepository.totalTransfers(),

  adminAnalyticsRepository.pendingTransfers(),

  adminAnalyticsRepository.approvedTransfers(),

  adminAnalyticsRepository.rejectedTransfers(),

  adminAnalyticsRepository.localTransferVolume(),

  adminAnalyticsRepository.totalInternationalTransfers(),

  adminAnalyticsRepository.pendingInternationalTransfers(),

  adminAnalyticsRepository.completedInternationalTransfers(),

  adminAnalyticsRepository.failedInternationalTransfers(),

  adminAnalyticsRepository.internationalTransferVolume(),

  adminAnalyticsRepository.activeInvestments(),

  adminAnalyticsRepository.maturedInvestments(),

  adminAnalyticsRepository.cancelledInvestments(),

  adminAnalyticsRepository.investmentAmount(),

  adminAnalyticsRepository.activeJointInvestments(),

  adminAnalyticsRepository.pendingJointInvestments(),

  adminAnalyticsRepository.jointInvestmentAmount(),

  adminAnalyticsRepository.activeFixedDeposits(),

  adminAnalyticsRepository.maturedFixedDeposits(),

  adminAnalyticsRepository.fixedDepositAmount(),

  adminAnalyticsRepository.supportTickets(),

  adminAnalyticsRepository.openTickets(),

  adminAnalyticsRepository.assignedTickets(),

  adminAnalyticsRepository.waitingCustomerTickets(),

  adminAnalyticsRepository.waitingSupportTickets(),

  adminAnalyticsRepository.resolvedTickets(),

  adminAnalyticsRepository.closedTickets(),

  adminAnalyticsRepository.pendingKyc(),

  adminAnalyticsRepository.approvedKyc(),

  adminAnalyticsRepository.rejectedKyc(),

  adminAnalyticsRepository.notificationsSent(),

  adminAnalyticsRepository.unreadNotifications(),

]);

return {

  customers: {

    total: totalCustomers,

    active: activeCustomers,

    suspended: suspendedCustomers,

    emailVerified,

    kycApproved,

  },

  accounts: {

    total: totalAccounts,

    active: activeAccounts,

    frozen: frozenAccounts,

    closed: closedAccounts,

    totalBalance: totalBalance._sum.balance ?? 0,

  },

  transfers: {

  local: {

    total: totalTransfers,

    pending: pendingTransfers,

    approved: approvedTransfers,

    rejected: rejectedTransfers,

    totalVolume:

      localTransferVolume._sum.amount ?? 0,

  },

  international: {

    total: totalInternationalTransfers,

    pending: pendingInternationalTransfers,

    completed: completedInternationalTransfers,

    failed: failedInternationalTransfers,

    totalVolume:

      internationalTransferVolume._sum.amount ?? 0,

  },

  investments: {

  personal: {

    active: activeInvestments,

    matured: maturedInvestments,

    cancelled: cancelledInvestments,

    invested:

      investmentAmount._sum.amount ?? 0,

    expectedProfit:

      investmentAmount._sum.expectedReturn ?? 0,

    maturityValue:

      investmentAmount._sum.totalAtMaturity ?? 0,

  },

  joint: {

    active: activeJointInvestments,

    pending: pendingJointInvestments,

    invested:

      jointInvestmentAmount._sum.amount ?? 0,

    expectedProfit:

      jointInvestmentAmount._sum.expectedReturn ?? 0,

    maturityValue:

      jointInvestmentAmount._sum.totalAtMaturity ?? 0,

  },

  fixedDeposits: {

    active: activeFixedDeposits,

    matured: maturedFixedDeposits,

    deposited:

      fixedDepositAmount._sum.amount ?? 0,

    expectedInterest:

      fixedDepositAmount._sum.expectedInterest ?? 0,

    maturityValue:

      fixedDepositAmount._sum.maturityAmount ?? 0,

  },

  support: {

  total: supportTickets,

  open: openTickets,

  assigned: assignedTickets,

  waitingCustomer: waitingCustomerTickets,

  waitingSupport: waitingSupportTickets,

  resolved: resolvedTickets,

  closed: closedTickets,

},

kyc: {

  pending: pendingKyc,

  approved: approvedKyc,

  rejected: rejectedKyc,

},

notifications: {

  sent: notificationsSent,

  unread: unreadNotifications,

},

},

},

};
}
}