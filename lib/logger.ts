import pino from "pino"
let logger = pino()
logger = pino(
  {
    timestamp: pino.stdTimeFunctions.isoTime
  }
  // uncomment to log to a file
  //pino.destination("./logs/log.txt")
)

export default logger
