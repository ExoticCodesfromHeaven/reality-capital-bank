import { Prisma, AccountStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const adminRepository = {
  async getDashboardStats() {
    const [
      users,
      accounts,
      transactions,
      transfers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.account.count(),
      prisma.transaction.count(),
      prisma.transfer.count(),
    ]);

    const balances = await prisma.account.aggregate({
      _sum: {
        balance: true,
      },
    });

    return {
      users,
      accounts,
      transactions,
      transfers,
      totalBalance:
        balances._sum.balance ?? 0,
    };
  },

  async getUsers() {
  return prisma.user.findMany({
    include: {
      role: true,
      country: true,
      accounts: {
        include: {
          currency: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
},

async getUser(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },

    include: {
      role: true,
      country: true,
      accounts: {
        include: {
          currency: true,
        },
      },

      notifications: {
        orderBy: {
          createdAt: "desc",
        },

        take: 10,
      },

      auditLogs: {
        orderBy: {
          createdAt: "desc",
        },

        take: 20,
      },
    },
  });
},

async getAccount(id: string) {
  return prisma.account.findUnique({
    where: {
      id,
    },

    include: {
      currency: true,
      user: true,
    },
  });
},

async updateAccountStatus(
  id: string,
  status: AccountStatus
) {
  return prisma.account.update({
    where: {
      id,
    },

    data: {
      status,
    },

    include: {
      currency: true,
      user: true,
    },
  });
},

async getTransactions(
  page = 1,
  limit = 20
) {

 const skip =
   (page - 1) * limit;


 const [transactions,total] =
 await Promise.all([

  prisma.transaction.findMany({

    skip,

    take: limit,

    include:{
      account:{
        include:{
          user:{
            select:{
              firstName:true,
              lastName:true,
              email:true,
            }
          }
        }
      },

      transfer:true,
    },

    orderBy:{
      createdAt:"desc"
    }

  }),


  prisma.transaction.count()

 ]);


 return {
   transactions,
   pagination:{
     page,
     limit,
     total,
     pages:
       Math.ceil(total / limit)
   }
 };

},


async getTransaction(id: string) {
  return prisma.transaction.findUnique({
    where: {
      id,
    },

    include: {
      account: {
        include: {
          user: true,
          currency: true,
        },
      },

      transfer: {
        include: {
          senderAccount: true,
          receiverAccount: true,
        },
      },
    },
  });
},
};