import { prisma } from "../../lib/prisma";


export const fixedDepositAdminRepository = {


async createPlan(data:any){

return prisma.fixedDepositPlan.create({

data,

});

},



async getPlans(){

return prisma.fixedDepositPlan.findMany({

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





async updatePlan(
id:string,
data:any
){

return prisma.fixedDepositPlan.update({

where:{
id,
},

data,

});

},





async togglePlan(
id:string,
status:boolean
){

return prisma.fixedDepositPlan.update({

where:{
id,
},

data:{
isActive:status,
},

});

},




async getAllDeposits(){

return prisma.fixedDeposit.findMany({

include:{

user:{
select:{
firstName:true,
lastName:true,
email:true,
},
},


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