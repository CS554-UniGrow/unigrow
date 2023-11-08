import { pino } from "pino";
import pretty from "pino-pretty";
pino.stdTimeFunctions.isoTime = () => `,"time":"${new Date().toISOString()}"`;
const logger = pino(
  { timestamp: pino.stdTimeFunctions.isoTime, mkdir: true },
  pino.multistream([pretty(), pino.destination("./logs/logfile.log")])
);
export { logger };
