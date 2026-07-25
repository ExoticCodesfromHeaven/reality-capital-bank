import cron from "node-cron";

import {
  InvestmentStatus,
  NotificationType,
} from "@prisma/client";

import { prisma } from "../lib/prisma";

import { notificationService } from "../modules/notification/notification.service";

import { auditService } from "../modules/audit/audit.service";

export function startInvestmentJob() {

  cron.schedule(

    "0 * * * *",

    async () => {

      console.log(
        "Running Investment Scheduler..."
      );

      const investments =
        await prisma.investment.findMany({

          where: {

            status:
              InvestmentStatus.ACTIVE,

            maturesAt: {

              lte: new Date(),

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

      for (const investment of investments) {

        await prisma.investment.update({

          where: {

            id: investment.id,

          },

          data: {

            status:
              InvestmentStatus.MATURED,

          },

        });

        await notificationService.create(

          investment.userId,

          "Investment Matured",

          "Congratulations! Your investment has matured and is ready for withdrawal.",

          NotificationType.SUCCESS

        );

        await auditService.create(

          investment.userId,

          "INVESTMENT_MATURED",

          `Investment ${investment.id} matured.`

        );

      }

      console.log(

        `${investments.length} investment(s) matured.`

      );

    }

  );

}