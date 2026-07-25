import {

AccountStatus,

InternationalTransferStatus,

NotificationType,

Prisma,

TransactionCategory,

TransactionStatus,

TransactionType,

} from "@prisma/client";

import { prisma } from "../../lib/prisma";

import { AppError } from "../../errors/AppError";

import { notificationService } from "../notification/notification.service";

import { auditService } from "../audit/audit.service";

export const internationalTransferProcessor = {

    async process(

transferId:string

){

const transfer =
await prisma.internationalTransfer.findUnique({

where:{
id:transferId,
},

include:{

senderAccount:{
include:{
user:true,
},
},

senderCurrency:true,

receiverCurrency:true,

},

});


if(!transfer){

throw new AppError(
"Transfer not found.",
404
);

}

if(

transfer.status !==
InternationalTransferStatus.APPROVED

){

throw new AppError(

"Transfer is not approved.",

400

);

}

const account =
transfer.senderAccount;

if(

account.status ===
AccountStatus.FROZEN

){

throw new AppError(

"Sender account frozen.",

403

);

}

const totalDebit =

Number(transfer.amount)

+

Number(transfer.fee);

if(

Number(account.availableBalance)

<

totalDebit

){

throw new AppError(

"Insufficient funds.",

400

);

}

await prisma.$transaction(

async(tx)=>{

const newBalance =

Number(account.balance)

-

totalDebit;

await tx.account.update({

where:{
id:account.id,
},

data:{

balance:new Prisma.Decimal(newBalance),

availableBalance:
new Prisma.Decimal(newBalance),

},

});

await tx.transaction.create({

data:{

reference:
transfer.reference,

type:
TransactionType.DEBIT,

category:
TransactionCategory.INTERNATIONAL_TRANSFER,

status:
TransactionStatus.SUCCESS,

amount:
transfer.amount,

balanceBefore:
account.balance,

balanceAfter:
new Prisma.Decimal(newBalance),

account:{
connect:{
id:account.id,
},

},

internationalTransfer:{
connect:{
id:transfer.id,
},

},

narration:

`International Transfer to ${transfer.recipientName}`,

},

});

await tx.transaction.create({

data:{

reference:

`${transfer.reference}-FEE`,

type:
TransactionType.DEBIT,

category:
TransactionCategory.CHARGE,

status:
TransactionStatus.SUCCESS,

amount:
transfer.fee,

balanceBefore:
new Prisma.Decimal(

newBalance+

Number(transfer.fee)

),

balanceAfter:
new Prisma.Decimal(newBalance),

account:{
connect:{
id:account.id,
},
},

narration:
"International Transfer Fee",

},

});

await tx.internationalTransfer.update({

where:{
id:transfer.id,
},

data:{

status:
InternationalTransferStatus.COMPLETED,

completedAt:
new Date(),

},

});

});

await notificationService.create(

transfer.senderAccount.userId,

"International Transfer Completed",

`Your transfer ${transfer.reference} has been completed successfully.`,

NotificationType.SUCCESS

);

await auditService.create(

transfer.senderAccount.userId,

"INTERNATIONAL_TRANSFER_COMPLETED",

`Completed transfer ${transfer.reference}`

);

return true;

},

};