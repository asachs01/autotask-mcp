// Logger Utility
// Provides structured logging using winston

import winston from 'winston';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
export type LogFormat = 'json' | 'simple';

/**
 * Safely serialize an object to avoid circular references
 */
function safeStringify(obj: any): string {
  const seen = new WeakSet();
  return JSON.stringify(obj, (_key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular Reference]';
      }
      seen.add(value);
    }
    if (value instanceof Error) {
      return {
        name: value.name,
        message: value.message,
        stack: value.stack
      };
    }
    return value;
  });
}

export class Logger {
  private winston: winston.Logger;

  constructor(level: LogLevel = 'info', format: LogFormat = 'json') {
    this.winston = winston.createLogger({
      level,
      format: format === 'json' 
        ? winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              const logObject = {
                level,
                message,
                timestamp,
                ...meta
              };
              return safeStringify(logObject);
            })
          )
        : winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              const metaStr = Object.keys(meta).length > 0 ? ` ${safeStringify(meta)}` : '';
              return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
            })
          ),
      transports: [
        new winston.transports.Console({
          // MCP stdio transport uses stdout for JSON-RPC messages.
          // All log output must go to stderr to avoid corrupting the channel.
          stderrLevels: ['error', 'warn', 'info', 'debug']
        })
      ]
    });
  }

  error(message: string, meta?: any): void {
    this.winston.error(message, meta);
  }

  warn(message: string, meta?: any): void {
    this.winston.warn(message, meta);
  }

  info(message: string, meta?: any): void {
    this.winston.info(message, meta);
  }

  debug(message: string, meta?: any): void {
    this.winston.debug(message, meta);
  }

  setLevel(level: LogLevel): void {
    this.winston.level = level;
  }
} 