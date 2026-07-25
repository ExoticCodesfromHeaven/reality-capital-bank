import { prisma } from "../../lib/prisma";


export const fixedDepositRepository = {


async getPlans(){

 return prisma.fixedDepositPlan.findMany({

  where:{
   isActive:true,
  },

  orderBy:{
   durationMonths:"asc",
  },

 });

},



async getPlan(id:string){

 return prisma.fixedDepositPlan.findUnique({

  where:{
   id,
  },

 });

},



async getAccount(id:string){

 return prisma.account.findUnique({

  where:{
   id,
  },

  include:{
   currency:true,
   user:true,
  },

 });

},



async getUserDeposits(userId:string){

 return prisma.fixedDeposit.findMany({

  where:{
   userId,
  },

  include:{
   plan:true,
   account:{
    include:{
     currency:true,
    },
   },
  },


  orderBy:{
   createdAt:"desc",
  },

 });

},


};