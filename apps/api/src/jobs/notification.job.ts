import { scheduler } from "./scheduler";

scheduler.start(

  "Notification Cleanup",

  "0 2 * * *",

  async () => {

    console.log("Notification cleanup...");

  }

);