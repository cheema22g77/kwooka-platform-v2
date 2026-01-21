/**
 * Structured logging utility
 * In production, this can be extended to send logs to external services
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  userId?: string;
  action?: string;
  endpoint?: string;
  duration?: number;
  error?: Error | string;
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Minimum log level based on environment
const MIN_LEVEL: LogLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL];
}

function formatError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}${error.stack ? `\n${error.stack}` : ''}`;
  }
  return String(error);
}

function createLogEntry(level: LogLevel, message: string, context?: LogContext): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };

  if (context) {
    // Convert error to string if present
    if (context.error) {
      context.error = formatError(context.error);
    }
    entry.context = context;
  }

  return entry;
}

function log(level: LogLevel, message: string, context?: LogContext): void {
  if (!shouldLog(level)) return;

  const entry = createLogEntry(level, message, context);

  if (process.env.NODE_ENV === 'production') {
    // In production, output JSON for log aggregation services
    console[level](JSON.stringify(entry));
    
    // TODO: Send to external logging service (e.g., Axiom, Logtail, Datadog)
    // Example:
    // if (level === 'error') {
    //   sendToErrorTracking(entry);
    // }
  } else {
    // In development, use pretty formatting
    const color = {
      debug: '\x1b[36m', // cyan
      info: '\x1b[32m',  // green
      warn: '\x1b[33m',  // yellow
      error: '\x1b[31m', // red
    }[level];
    const reset = '\x1b[0m';
    
    console[level](
      `${color}[${level.toUpperCase()}]${reset} ${message}`,
      context ? context : ''
    );
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) => log('debug', message, context),
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, context?: LogContext) => log('error', message, context),
  
  /**
   * Log API request with timing
   */
  apiRequest: (endpoint: string, method: string, context?: LogContext) => {
    log('info', `API ${method} ${endpoint}`, { endpoint, ...context });
  },
  
  /**
   * Log API response with timing
   */
  apiResponse: (
    endpoint: string, 
    method: string, 
    status: number, 
    durationMs: number,
    context?: LogContext
  ) => {
    const level: LogLevel = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
    log(level, `API ${method} ${endpoint} -> ${status} (${durationMs}ms)`, {
      endpoint,
      status,
      duration: durationMs,
      ...context,
    });
  },
  
  /**
   * Log AI/LLM request
   */
  aiRequest: (model: string, action: string, context?: LogContext) => {
    log('info', `AI Request: ${action}`, { model, action, ...context });
  },
  
  /**
   * Log AI/LLM response
   */
  aiResponse: (
    model: string, 
    action: string, 
    durationMs: number,
    tokenCount?: number,
    context?: LogContext
  ) => {
    log('info', `AI Response: ${action} (${durationMs}ms)`, {
      model,
      action,
      duration: durationMs,
      tokens: tokenCount,
      ...context,
    });
  },
  
  /**
   * Log database query
   */
  dbQuery: (table: string, operation: string, durationMs?: number, context?: LogContext) => {
    log('debug', `DB ${operation} on ${table}${durationMs ? ` (${durationMs}ms)` : ''}`, {
      table,
      operation,
      duration: durationMs,
      ...context,
    });
  },
  
  /**
   * Log security-related events
   */
  security: (event: string, context?: LogContext) => {
    log('warn', `SECURITY: ${event}`, context);
  },
  
  /**
   * Log audit trail events
   */
  audit: (userId: string, action: string, resource: string, context?: LogContext) => {
    log('info', `AUDIT: User ${userId} ${action} ${resource}`, {
      userId,
      action,
      resource,
      ...context,
    });
  },
};

/**
 * Timer utility for measuring operation duration
 */
export function createTimer() {
  const start = Date.now();
  return {
    elapsed: () => Date.now() - start,
    log: (message: string, context?: LogContext) => {
      logger.info(message, { ...context, duration: Date.now() - start });
    },
  };
}

/**
 * Wrap an async function with automatic logging
 */
export function withLogging<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  name: string
): T {
  return (async (...args: Parameters<T>) => {
    const timer = createTimer();
    logger.debug(`Starting ${name}`);
    
    try {
      const result = await fn(...args);
      logger.debug(`Completed ${name}`, { duration: timer.elapsed() });
      return result;
    } catch (error) {
      logger.error(`Failed ${name}`, { error, duration: timer.elapsed() });
      throw error;
    }
  }) as T;
}
