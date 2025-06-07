import { env } from "@/lib/config";

type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, unknown>
}

class Logger {
  private isDevelopment = env.isDevelopment

  private formatTimestamp(): string {
    return new Date().toISOString().replace("T", " ").substring(0, 19)
  }

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      timestamp: this.formatTimestamp(),
      level,
      message,
      context: context || {},
    }
  }

  private output(entry: LogEntry): void {
    if (typeof window === "undefined") {
      // Server-side logging
      console.log(JSON.stringify(entry))
    } else {
      // Client-side logging
      const color = {
        info: "#2563eb",
        warn: "#d97706",
        error: "#dc2626",
        debug: "#7c3aed",
      }[entry.level]

      console.log(
        `%c[${entry.level.toUpperCase()}] ${entry.message}`,
        `color: ${color}; font-weight: bold;`,
        entry.context,
      )
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry("info", message, context)
    this.output(entry)
  }

  warn(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry("warn", message, context)
    this.output(entry)
  }

  error(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry("error", message, context)
    this.output(entry)
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      const entry = this.createLogEntry("debug", message, context)
      this.output(entry)
    }
  }
}

export const logger = new Logger()
export default logger
