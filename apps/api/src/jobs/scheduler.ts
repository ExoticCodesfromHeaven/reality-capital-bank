import cron from "node-cron";

export const scheduler = {
  start(name: string, expression: string, task: () => Promise<void> | void) {
    console.log(`✅ Job Registered: ${name}`);

    cron.schedule(expression, async () => {
      console.log(`▶ Running ${name}`);

      try {
        await task();
      } catch (error) {
        console.error(`${name} failed`, error);
      }
    });
  },
};