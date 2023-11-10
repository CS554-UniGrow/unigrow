import pino from "pino";
import { logflarePinoVercel } from "pino-logflare";

const { stream, send } = logflarePinoVercel({
  apiKey: "0zOJCBI3RcAA",
  sourceToken: "565e0fd4-13f5-40c4-8262-d69a2a7f1256"
});

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
