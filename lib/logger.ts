import pino from "pino";
import { logflarePinoVercel } from "pino-logflare";

// create pino-logflare console stream for serverless functions and send function for browser logs
// Browser logs are going to: https://logflare.app/sources/13989
// Vercel log drain was setup to send logs here: https://logflare.app/sources/13830

const { stream, send } = logflarePinoVercel({
  apiKey: process.env.LOG_FLARE_API_KEY!,
  sourceToken: process.env.LOG_FLARE_SOURCE_TOKEN!
});

// create pino logger
const logger = pino(
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
);

export default logger;
