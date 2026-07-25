import { AppError } from "../../errors/AppError";

import {
fixedDepositAdminRepository
}
from "./fixed-deposit.admin.repository";



export const fixedDepositAdminService = {



async createPlan(data:any){

return fixedDepositAdminRepository.createPlan({

name:data.name,

durationMonths:
data.durationMonths,

interestRate:
data.interestRate,

minimumAmount:
data.minimumAmount,

maximumAmount:
data.maximumAmount,

});

},






async getPlans(){

return fixedDepositAdminRepository.getPlans();

},






async updatePlan(
id:string,
data:any
){


const plan =
await fixedDepositAdminRepository.getPlan(id);



if(!plan){

throw new AppError(
"Fixed deposit plan not found.",
404
);

}



return fixedDepositAdminRepository.updatePlan(
id,
data
);


},





async disablePlan(
id:string
){

return fixedDepositAdminRepository.togglePlan(
id,
false
);

},





async enablePlan(
id:string
){

return fixedDepositAdminRepository.togglePlan(
id,
true
);

},






async getDeposits(){

return fixedDepositAdminRepository.getAllDeposits();

},



};