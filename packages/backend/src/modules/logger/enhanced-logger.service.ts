import { Inject, Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';

@Injectable()
export class EnhancedLoggerService implements NestLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
  ) {}

  /**
   * Write an error message to the logs
   */
  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, { context, stack: trace });
  }

  /**
   * Write a warning message to the logs
   */
  warn(message: string, context?: string): void {
    this.logger.warn(message, { context });
  }

  /**
   * Write an info/log message to the logs
   */
  log(message: string, context?: string): void {
    this.logger.info(message, { context });
  }

  /**
   * Write a debug message to the logs
   */
  debug(message: string, context?: string): void {
    this.logger.debug(message, { context });
  }

  /**
   * Write a verbose message to the logs
   */
  verbose(message: string, context?: string): void {
    this.logger.verbose(message, { context });
  }

  /**
   * Log an error with additional metadata
   */
  logError(message: string, error: any, context?: string, metadata?: Record<string, any>): void {
    const errorDetails = {
      context,
      stack: error?.stack,
      errorMessage: error?.message,
      ...metadata,
    };
    
    this.logger.error(message, errorDetails);
  }

  /**
   * Log webhook events with structured data
   */
  logWebhook(event: string, data: Record<string, any>, context: string = 'WebhookService'): void {
    this.logger.info(`Webhook ${event}`, {
      context,
      event,
      ...data,
    });
  }

  /**
   * Log authentication events
   */
  logAuth(
    event: string,
    userId?: string,
    details?: Record<string, any>,
    context: string = 'AuthService',
  ): void {
    this.logger.info(`Auth ${event}`, {
      context,
      event,
      userId,
      ...details,
    });
  }

  /**
   * Log with custom metadata
   */
  logWithMetadata(
    level: 'error' | 'warn' | 'info' | 'debug' | 'verbose',
    message: string,
    metadata: Record<string, any>,
    context?: string,
  ): void {
    this.logger[level](message, { context, ...metadata });
  }

  /**
   * Create a child logger with persistent context
   */
  child(defaultContext: string) {
    return {
      error: (message: string, trace?: string, context?: string) =>
        this.error(message, trace, context || defaultContext),
      warn: (message: string, context?: string) =>
        this.warn(message, context || defaultContext),
      log: (message: string, context?: string) =>
        this.log(message, context || defaultContext),
      debug: (message: string, context?: string) =>
        this.debug(message, context || defaultContext),
      verbose: (message: string, context?: string) =>
        this.verbose(message, context || defaultContext),
      logError: (message: string, error: any, context?: string, metadata?: Record<string, any>) =>
        this.logError(message, error, context || defaultContext, metadata),
      logWebhook: (event: string, data: Record<string, any>, context?: string) =>
        this.logWebhook(event, data, context || defaultContext),
      logAuth: (event: string, userId?: string, details?: Record<string, any>, context?: string) =>
        this.logAuth(event, userId, details, context || defaultContext),
    };
  }
}