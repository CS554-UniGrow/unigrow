import pino from "pino";
import pretty from "pino-pretty";
const logger = pino(
  {},
  pino.multistream([pretty(), pino.destination("./logs/logfile.log")])
);
export { logger };
