import { scheduler } from "./scheduler";

scheduler.start(

  "Scheduled Transfers",

  "* * * * *",

  async () => {

    console.log("Checking scheduled transfers...");

  }

);