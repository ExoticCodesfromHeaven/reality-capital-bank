import { maskAccountNumber } from "../mask account-number";

export const adminMapper = {

  userList(user: any) {

    return {

      id: user.id,

      firstName: user.firstName,

      lastName: user.lastName,

      username: user.username,

      email: user.email,

      phone: user.phone,

      status: user.status,

      role: user.role?.name,

      country: user.country?.name,

      accounts:
        user.accounts?.length ?? 0,

      createdAt: user.createdAt,

    };

  },

  userDetails(user: any) {

    return {

      id: user.id,

      firstName: user.firstName,

      middleName: user.middleName,

      lastName: user.lastName,

      username: user.username,

      email: user.email,

      phone: user.phone,

      avatar: user.avatar,

      status: user.status,

      emailVerified:
        user.emailVerified,

      country: user.country,

      role: user.role,

      accounts:
        user.accounts.map(
          (account: any) => ({
            id: account.id,

            accountName:
              account.accountName,

            accountNumber:
              maskAccountNumber(
                account.accountNumber
              ),

            balance:
              account.balance,

            availableBalance:
              account.availableBalance,

            accountType:
              account.accountType,

            status:
              account.status,

            currency:
              account.currency.code,
          })
        ),

      notifications:
        user.notifications,

      auditLogs:
        user.auditLogs,

      createdAt:
        user.createdAt,

    };

  },

  account(account: any) {
  return {

    id: account.id,

    accountName:
      account.accountName,

    accountNumber:
      maskAccountNumber(
        account.accountNumber
      ),

    balance:
      account.balance,

    availableBalance:
      account.availableBalance,

    accountType:
      account.accountType,

    status:
      account.status,

    currency:
      account.currency?.code,

    updatedAt:
      account.updatedAt,

  };
},

accountList(accounts: any[]) {
  return accounts.map(this.account);
},
};