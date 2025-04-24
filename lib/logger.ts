import { format } from "date-fns";
import type { NextApiRequest } from "next";

type LogLevel = "info" | "warn" | "error";
type ErrorContext = {
  path?: string;
  method?: string;
  userAgent?: string;
  ip?: string;
  userId?: string;
};

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: ErrorContext;
  error?: any;
  stack?: string;
}

class Logger {
  private formatTimestamp(): string {
    return format(new Date(), "yyyy-MM-dd HH:mm:ss");
  }

  private log(
    level: LogLevel,
    message: string,
    context?: ErrorContext,
    error?: any
  ) {
    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      message,
      context,
      error: error?.message || error,
      stack: error?.stack,
    };

    const color = {
      info: "\x1b[36m", // Cyan
      warn: "\x1b[33m", // Yellow
      error: "\x1b[31m", // Red
    }[level];

    console[level](`${color}%s\x1b[0m`, JSON.stringify(entry, null, 2));
  }

  info(message: string, context?: ErrorContext) {
    this.log("info", message, context);
  }

  warn(message: string, context?: ErrorContext, error?: any) {
    this.log("warn", message, context, error);
  }

  error(message: string, context?: ErrorContext, error?: any) {
    this.log("error", message, context, error);
  }

  apiError(req: NextApiRequest, error: any) {
    this.error(
      "API Error",
      {
        path: req.url,
        method: req.method,
        userAgent: req.headers["user-agent"],
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      },
      error
    );
  }
}

export const logger = new Logger();
