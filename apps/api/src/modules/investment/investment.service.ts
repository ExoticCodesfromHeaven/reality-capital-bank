import {
  AccountStatus,
  InvestmentStatus,
  NotificationType,
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";

import { prisma } from "../../lib/prisma";

import { AppError } from "../../errors/AppError";

import { investmentRepository } from "./investment.repository";

import { systemSettingsRepository } from "../system-settings/system-settings.repository";

import { notificationService } from "../notification/notification.service";

import { auditService } from "../audit/audit.service";

import { generateReference } from "../../utils/reference";

import { calculateInvestment } from "../../utils/investment";

import { maturityDate } from "../../utils/investment-date";

import { formatMoney } from "../../utils/currency"; 

export const investmentService = {

  async createInvestment(

    userId: string,

    accountId: string,

    amount: number,

    durationMonths: number

  ) {

    const account =
      await investmentRepository.getAccount(
        accountId
      );

    if (!account) {

      throw new AppError(
        "Account not found.",
        404
      );

    }

    if (account.userId !== userId) {

      throw new AppError(
        "You do not own this account.",
        403
      );

    }

    if (
      account.status !== AccountStatus.ACTIVE
    ) {

      throw new AppError(
        "Account is not active.",
        400
      );

    }

    if (
      Number(account.availableBalance) < amount
    ) {

      throw new AppError(
        "Insufficient available balance.",
        400
      );

    }

    const settings =
      await systemSettingsRepository.getByKey(
        "investment_rates"
      );

    if (!settings) {

      throw new AppError(
        "Investment settings not configured.",
        500
      );

    }

    const rates =
      settings.value as Record<
        string,
        number
      >;

    const rate =
      rates[
        `${durationMonths}_months`
      ];

    if (!rate) {

      throw new AppError(
        "Invalid investment duration.",
        400
      );

    }

    const {

      expectedReturn,

      totalAtMaturity,

    } =
      calculateInvestment(
        amount,
        rate
      );

    const balanceBefore =
      Number(account.balance);

    const balanceAfter =
      balanceBefore - amount;

    const investment =
      await prisma.$transaction(
        async (tx) => {

          await tx.account.update({

            where: {
              id: account.id,
            },

            data: {

              balance:
                balanceAfter,

              availableBalance:
                balanceAfter,

            },

          });

          await tx.transaction.create({

            data: {

              reference:
                generateReference(),

              type:
                TransactionType.DEBIT,

              category:
                TransactionCategory.INVESTMENT,

              status:
                TransactionStatus.SUCCESS,

              amount,

              balanceBefore,

              balanceAfter,

              narration:
                `Investment (${durationMonths} Months)`,

              account: {

                connect: {

                  id:
                    account.id,

                },

              },

            },

          });

          return tx.investment.create({

            data: {

              amount,

              interestRate:
                rate,

              expectedReturn,

              totalAtMaturity,

              durationMonths,

              status:
                InvestmentStatus.ACTIVE,

              startsAt:
                new Date(),

              maturesAt:
                maturityDate(
                  durationMonths
                ),

              user: {

                connect: {

                  id:
                    userId,

                },

              },

              account: {

                connect: {

                  id:
                    account.id,

                },

              },

            },

            include: {

              account: {
                include: {
                  currency: true,
                },
              },

            },

          });

        }
      );

    await notificationService.create(

      userId,

      "Investment Created",

      `Your investment of ${formatMoney(amount, account.currency.code)} has been created successfully.`,

      NotificationType.SUCCESS

    );

    await auditService.create(

      userId,

      "INVESTMENT_CREATED",

      `Created ${durationMonths}-month investment.`

    );

    return investment;

  },



  async getMyInvestments(
    userId: string
  ) {

    return investmentRepository.getUserInvestments(
      userId
    );

  },



  async getInvestment(
    id: string,
    userId: string
  ) {

    const investment =
      await investmentRepository.getInvestment(
        id
      );

    if (!investment) {

      throw new AppError(
        "Investment not found.",
        404
      );

    }

    if (
      investment.userId !== userId
    ) {

      throw new AppError(
        "Unauthorized.",
        403
      );

    }

    return investment;

  },

  async withdrawInvestment(

    investmentId:string,

    userId:string

){

    const investment =
        await investmentRepository.getInvestment(
            investmentId
        );

    if(!investment){

        throw new AppError(
            "Investment not found.",
            404
        );

    }

    if(investment.userId !== userId){

        throw new AppError(
            "Unauthorized.",
            403
        );

    }

    if(
        investment.status !==
        InvestmentStatus.MATURED
    ){

        throw new AppError(
            "Investment has not matured yet.",
            400
        );

    }

    const account =
        investment.account;

    const balanceBefore =
        Number(account.balance);

    const payout =
        Number(
            investment.totalAtMaturity
        );

    const balanceAfter =
        balanceBefore + payout;

    await prisma.$transaction(
        async(tx)=>{

            await tx.account.update({

                where:{
                    id:account.id,
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

                    amount:payout,

                    balanceBefore,

                    balanceAfter,

                    narration:
                        "Investment Maturity",

                    account:{
                        connect:{
                            id:account.id,
                        },
                    },

                },

            });

            await tx.investment.update({

                where:{
                    id:investment.id,
                },

                data:{

                    status:
                        InvestmentStatus.WITHDRAWN,

                    withdrawnAt:
                        new Date(),

                },

            });

        }
    );

    await notificationService.create(

        userId,

        "Investment Withdrawn",

        `Your investment has been paid into your account.`,

        NotificationType.SUCCESS

    );

    await auditService.create(

        userId,

        "INVESTMENT_WITHDRAWN",

        `Investment ${investment.id}`

    );

}

};