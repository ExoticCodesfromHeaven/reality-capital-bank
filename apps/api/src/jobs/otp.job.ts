import { prisma } from "../lib/prisma";
import { scheduler } from "./scheduler";

scheduler.start(
  "OTP Cleanup",

  "0 * * * *",

  async () => {

    await prisma.oTP.deleteMany({

      where: {

        expiresAt: {

          lt: new Date(),

        },

      },

    });

  }
);