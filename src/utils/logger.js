/**
 * Custom Logging Middleware
 * All application logging goes through this module.
 * No console.log usage anywhere else in the app.
 */

const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

const LOG_BUFFER = [];
const MAX_BUFFER_SIZE = 500;

function formatTimestamp() {
  return new Date().toISOString();
}

function createLogEntry(level, context, message, meta = {}) {
  return {
    timestamp: formatTimestamp(),
    level,
    context,
    message,
    meta,
  };
}

function persistLog(entry) {
  LOG_BUFFER.push(entry);
  if (LOG_BUFFER.length > MAX_BUFFER_SIZE) {
    LOG_BUFFER.shift();
  }
  // In production, this could send to a remote logging service.
  // For development visibility, we use structured stderr output.
  if (process.env.NODE_ENV === 'development') {
    const formatted = `[${entry.timestamp}] [${entry.level}] [${entry.context}] ${entry.message}`;
    switch (entry.level) {
      case LOG_LEVELS.ERROR:
        // eslint-disable-next-line no-console
        console.error(formatted, entry.meta);
        break;
      case LOG_LEVELS.WARN:
        // eslint-disable-next-line no-console
        console.warn(formatted, entry.meta);
        break;
      default:
        // eslint-disable-next-line no-console
        console.info(formatted, entry.meta);
        break;
    }
  }
}

const logger = {
  debug(context, message, meta) {
    persistLog(createLogEntry(LOG_LEVELS.DEBUG, context, message, meta));
  },
  info(context, message, meta) {
    persistLog(createLogEntry(LOG_LEVELS.INFO, context, message, meta));
  },
  warn(context, message, meta) {
    persistLog(createLogEntry(LOG_LEVELS.WARN, context, message, meta));
  },
  error(context, message, meta) {
    persistLog(createLogEntry(LOG_LEVELS.ERROR, context, message, meta));
  },
  getBuffer() {
    return [...LOG_BUFFER];
  },
};

export default logger;
