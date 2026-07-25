import { z } from "zod";


export const createFixedDepositSchema =
z.object({

 accountId:
 z.uuid(),


 planId:
 z.uuid(),


 amount:
 z.number()
 .positive(),

});