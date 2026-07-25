import { prisma } from "../../lib/prisma";
import { ParticipantStatus } from "@prisma/client";


export const jointInvestmentRepository = {


  async getAccount(
    accountId:string
  ){

    return prisma.account.findUnique({

      where:{
        id:accountId,
      },

      include:{
        user:true,
        currency:true,
      },

    });

  },



  async create(
    data:any
  ){

    return prisma.jointInvestmentParticipant.create({

  data: {

    jointInvestmentId: data.jointInvestmentId,

    userId: data.userId,

    accountId: data.accountId,

    contribution: data.contribution,

    ownership: 0,

    status: "PENDING",

  },

});

  },



  async findById(
    id:string
  ){

    return prisma.jointInvestment.findUnique({

      where:{
        id,
      },

      include:{

        participants:{
          include:{
            user:true,
          },
        },

      },

    });

  },



  async findUserInvestments(
    userId:string
  ){

    return prisma.jointInvestment.findMany({

      where:{

        OR:[

          {
            createdById:userId,
          },

          {
            participants:{
              some:{
                userId,
              },
            },
          },

        ],

      },

      include:{

        participants:{
          include:{
            user:true,
          },
        },

      },

      orderBy:{
        createdAt:"desc",
      },

    });

  },


  async getUserByEmail(
    email:string
  ){

    return prisma.user.findUnique({

      where:{
        email,
      },

    });

  },

  async getParticipant(
  investmentId:string,
  userId:string
){

  return prisma.jointInvestmentParticipant.findUnique({

    where:{
      jointInvestmentId_userId:{
        jointInvestmentId: investmentId,
        userId,
      },
    },

  });

},

async updateParticipant(

  id:string,

  data:any

){

  return prisma.jointInvestmentParticipant.update({

    where:{
      id,
    },

    data,

  });

},

async updateParticipantStatus(
  id:string,
  status:ParticipantStatus
){

  return prisma.jointInvestmentParticipant.update({

    where:{
      id,
    },

    data:{
      status,
    },

  });

},

};