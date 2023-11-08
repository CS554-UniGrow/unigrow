import { pino } from "pino";
import pretty from "pino-pretty";
import fs from "fs";
// ./logs/logfile.log check if exists else create
if (!fs.existsSync("./logs" || process.env.LOG_DIR))
  fs.mkdir("./logs", { recursive: true }, (err) => {});
pino.stdTimeFunctions.isoTime = () => `,"time":"${new Date().toISOString()}"`;
const logger = pino(
  { timestamp: pino.stdTimeFunctions.isoTime, mkdir: true },
  pino.multistream([
    pretty(),
    pino.destination(("./logs/" || process.env.LOG_DIR) + "logfile.log")
  ])
);
export { logger };
