// backend/src/utils/logger.js
import pino from "pino";
import path from "path";
import fs from "fs";

const isProd = process.env.NODE_ENV === "production";
const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

// file destination
const fileDest = pino.destination({ dest: path.join(logsDir, "app.log"), sync: false });

// Console transport (pretty) in dev, plain in prod
const logger =
  !isProd
    ? pino(
        {
          level: process.env.LOG_LEVEL || "debug",
        },
        pino.transport({
          target: "pino-pretty",
          options: { colorize: true, translateTime: "SYS:standard" },
        })
      )
    : pino(
        {
          level: process.env.LOG_LEVEL || "info",
        },
        fileDest
      );

export default logger;
