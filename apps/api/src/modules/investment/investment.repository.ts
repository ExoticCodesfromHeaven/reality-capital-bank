import { prisma } from "../../lib/prisma";
import { InvestmentStatus } from "@prisma/client";

export const investmentRepository = {

  async getAccount(accountId: string) {

    return prisma.account.findUnique({

      where: {
        id: accountId,
      },

      include: {
        currency: true,
        user: true,
      },

    });

  },



  async createInvestment(data: any) {

    return prisma.investment.create({

      data,

      include: {

        account: {
          include: {
            currency: true,
          },
        },

      },

    });

  },



  async getUserInvestments(
    userId: string
  ) {

    return prisma.investment.findMany({

      where: {
        userId,
      },

      include: {

        account: {
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



  async getInvestment(
    id: string
  ) {

    return prisma.investment.findUnique({

      where: {
        id,
      },

      include: {

        account: {
          include: {
            currency: true,
          },
        },

        user: true,

      },

    });

  },

  async updateStatus(
  id: string,
  status: InvestmentStatus
) {

  return prisma.investment.update({

    where:{
      id,
    },

    data:{
      status,
    },

  });

},



async withdraw(
  id:string
){

  return prisma.investment.update({

    where:{
      id,
    },

    data:{

      status:
        InvestmentStatus.WITHDRAWN,

      withdrawnAt:
        new Date(),

    },

    include:{
      account:{
        include:{
          currency:true,
        },
      },
    },

  });

},



async getActiveInvestments(){

  return prisma.investment.findMany({

    where:{

      status:
        InvestmentStatus.ACTIVE,

    },

    include:{

      account:{
        include:{
          currency:true,
        },
      },

    },

  });

},

};