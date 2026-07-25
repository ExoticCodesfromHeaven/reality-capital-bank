import cron from "node-cron";

import {
  JointInvestmentStatus,
  TransactionCategory,
  TransactionStatus,
  TransactionType,
  NotificationType,
} from "@prisma/client";

import { prisma } from "../lib/prisma";

import { generateReference } 
from "../utils/reference";

import { notificationService }
from "../modules/notification/notification.service";

import { auditService }
from "../modules/audit/audit.service";


export function startJointInvestmentJob() {


  cron.schedule(
    "0 * * * *",
    async () => {


      console.log(
        "Running joint investment scheduler..."
      );


      const investments =
        await prisma.jointInvestment.findMany({

          where: {

            status:
              JointInvestmentStatus.ACTIVE,


            maturesAt: {

              lte:new Date(),

            },

          },


          include:{

            participants:{

              include:{

                user:true,

                account:true,

              },

            },

          },

        });




      for(
        const investment of investments
      ){

        try {


          await prisma.$transaction(
            async(tx)=>{


              for(
                const participant 
                of investment.participants
              ){



                const account =
                  participant.account;



                const ownership =
                  Number(
                    participant.ownership
                  );



                const payout =
                  (
                    Number(
                      investment.totalAtMaturity
                    )
                    *
                    ownership
                  )
                  /
                  100;



                const balanceBefore =
                  Number(
                    account.balance
                  );



                const balanceAfter =
                  balanceBefore + payout;



                await tx.account.update({

                  where:{

                    id:
                    account.id,

                  },


                  data:{

                    balance:
                    balanceAfter,


                    availableBalance:
                    balanceAfter,

                  },


                });





                await tx.transaction.create({

                  data:{


                    reference:
                    generateReference(),



                    type:
                    TransactionType.CREDIT,



                    category:
                    TransactionCategory.INTEREST,



                    status:
                    TransactionStatus.SUCCESS,



                    amount:
                    payout,



                    balanceBefore,



                    balanceAfter,



                    narration:
                    "Joint Investment Maturity Payout",



                    account:{

                      connect:{

                        id:
                        account.id,

                      },

                    },


                  },

                });

              }





              await tx.jointInvestment.update({

                where:{

                  id:
                  investment.id,

                },


                data:{


                  status:
                  JointInvestmentStatus.WITHDRAWN,


                },

              });



            }

          );






          for(
            const participant 
            of investment.participants
          ){


            await notificationService.create(

              participant.userId,


              "Joint Investment Completed",


              "Your joint investment has matured and your payout has been credited.",


              NotificationType.SUCCESS

            );


          }





          await auditService.create(

            investment.createdById,


            "JOINT_INVESTMENT_COMPLETED",


            `Joint investment ${investment.id} completed.`


          );



          console.log(

            `Completed ${investment.id}`

          );



        }

        catch(error){


          console.error(

            `Failed investment ${investment.id}`,

            error

          );


        }


      }


    }

  );
}