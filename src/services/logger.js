/**
 * NeoVault Logger — environment-aware logging utility.
 * In development: full error details are logged to the console.
 * In production: only a generic message is logged (no error objects that could
 * leak internal backend details, stack traces, or field names).
 */

const isDev = import.meta.env.DEV;

const logger = {
  error: (message, ...args) => {
    if (isDev) {
      console.error(message, ...args);
    } else {
      // In production, log only the human-readable message, not the full error object
      console.error(`[NeoVault] ${typeof message === 'string' ? message : 'An error occurred.'}`);
    }
  },

  warn: (message, ...args) => {
    if (isDev) {
      console.warn(message, ...args);
    }
  },

  info: (message, ...args) => {
    if (isDev) {
      console.info(message, ...args);
    }
  },

  log: (message, ...args) => {
    if (isDev) {
      console.log(message, ...args);
    }
  },
};

export default logger;
