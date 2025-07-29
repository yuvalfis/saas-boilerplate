import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import { AsyncLocalStorage } from "async_hooks";
import safeStringify from "fast-safe-stringify";
import { format, transports } from "winston";
import * as Transport from "winston-transport";
import { ConfigService } from "@nestjs/config";
export const loggerAls = new AsyncLocalStorage();

const addHostname = (hostname: string) =>
  format((info) => {
    info.hostname = hostname;
    return info;
  });

export function getTraceId(): string | undefined {
  const store = loggerAls.getStore() as Record<string, unknown> | undefined;
  return store?.traceId as string | undefined;
}

export function getPTraceId(): string[] | undefined {
  const store = loggerAls.getStore() as Record<string, unknown> | undefined;
  return store?.pTraceId as string[] | undefined;
}

const addTraceId = format((info) => {
  const store = loggerAls.getStore() as Record<string, unknown> | undefined;
  for (const attr of ["pTraceId", "traceId", "traceSrc"]) {
    if (store?.[attr]) {
      info[attr] = store[attr];
    }
  }
  return info;
});

const colors = {
  bold: (text: string) => `\x1B[1m${text}\x1B[0m`,
  green: (text: string) => `\x1B[32m${text}\x1B[39m`,
  yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
  red: (text: string) => `\x1B[31m${text}\x1B[39m`,
  magentaBright: (text: string) => `\x1B[95m${text}\x1B[39m`,
  cyanBright: (text: string) => `\x1B[96m${text}\x1B[39m`,
};

const colorScheme: Record<string, (text: string) => string> = {
  log: colors.green,
  error: colors.red,
  warn: colors.yellow,
  debug: colors.magentaBright,
  verbose: colors.cyanBright,
};

const consoleFormat = (isProduction: boolean) =>
  format.printf(({ context, level, timestamp, message, ms, stack }) => {
    // Fix send error instead of stack by mistake
    if (
      Array.isArray(stack) &&
      stack.length === 1 &&
      typeof stack[0] === "object" &&
      stack[0].stack
    ) {
      stack = stack[0].stack;
    }

    const colorEnable = !isProduction;

    if (timestamp) {
      try {
        timestamp = new Date(timestamp as string).toISOString();
      } catch {
        // ignore parsing errors
      }
    }

    const color =
      (colorEnable && colorScheme[level]) || ((text: string): string => text);
    const yellow = colorEnable ? colors.yellow : (text: string): string => text;

    let contextString: string | undefined;
    if (context) {
      if (typeof context === "object") {
        contextString = `${safeStringify(context)}`;
      } else {
        contextString = `[${context}]`;
      }
    }

    return (
      (timestamp ? `${timestamp} ` : "") +
      `${color(level.toUpperCase().padStart(7))} ` +
      (message ? color(message as string) : "") +
      (ms ? ` ${yellow(ms as string)}` : "") +
      (contextString && contextString.length > 40 ? `\n` : " ") +
      (contextString ? `${yellow(contextString)}` : "") +
      (stack ? `\n${colors.red(stack as string)}` : "")
    );
  });

export function getDefaultLogger(
  configService: ConfigService,
  {
    logtailApiKey,
    appName,
    logtailForceLogging,
  }: {
    logtailApiKey?: string;
    appName?: string;
    logtailForceLogging?: boolean;
  } = {}
) {
  if (!appName) {
    appName = configService.get<string>("APP_NAME", "saas-boilerplate-backend");
  }

  const isProduction = configService.get<string>("NODE_ENV") === "production";

  const defaultOptions: Transport.TransportStreamOptions = {
    level: isProduction ? "info" : "debug",
    handleExceptions: true,
    handleRejections: true,
  };

  const defaultFormat = [
    format.errors({ stack: true }),
    format.timestamp(),
    format.ms(),
  ];

  const transportList: Transport[] = [
    new transports.Console({
      ...defaultOptions,
      format: format.combine(...defaultFormat, consoleFormat(isProduction)),
    }),
  ];

  // Only add Logtail in production or when forced
  if (isProduction || logtailForceLogging) {
    const LOGTAIL_API_KEY: string | undefined =
      logtailApiKey || configService.get<string>("LOGTAIL_API_KEY");

    if (LOGTAIL_API_KEY) {
      const logtail = new Logtail(LOGTAIL_API_KEY);
      const hostname = configService.get<string>("HOSTNAME", "localhost");
      transportList.push(
        new LogtailTransport(logtail, {
          ...defaultOptions,
          format: format.combine(
            ...defaultFormat,
            addHostname(hostname)(),
            addTraceId(),
            format.json()
          ),
        })
      );
    } else {
      // LOGTAIL_API_KEY is not defined, Logtail logging disabled
    }
  }

  return {
    transports: transportList,
  };
}
