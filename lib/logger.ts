import pino from "pino"
import { logflarePinoVercel } from "pino-logflare"
let logger = pino()
if (process.env.VERCEL === "1") {
  const { stream, send } = logflarePinoVercel({
    apiKey: process.env.NEXT_PUBLIC_LOGFLARE_KEY!,
    sourceToken: process.env.NEXT_PUBLIC_LOGFLARE_SOURCE_TOKEN!
  })

  logger = pino(
    {
      browser: {
        transmit: {
          send: send
        }
      },
      base: {
        env: process.env.NODE_ENV,
        revision: process.env.VERCEL_GITHUB_COMMIT_SHA
      }
    },
    stream
  )
} else {
  logger = pino(
    {
      timestamp: pino.stdTimeFunctions.isoTime
    }
    // uncomment to log to a file
    //pino.destination("./logs/log.txt")
  )
}

export default logger
