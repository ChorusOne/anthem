import ENV from "./server-env";

/** ===========================================================================
 * Logger Module
 * ----------------------------------------------------------------------------
 * console.log wrapper util.
 * ============================================================================
 */

class Logger {
  log = (message: string, logInAllEnvironments: boolean = false) => {
    if (ENV.DEVELOPMENT || logInAllEnvironments) {
      console.log(message);
    }
  };

  error = (error: any, logInAllEnvironments: boolean = false) => {
    if (ENV.DEVELOPMENT || logInAllEnvironments) {
      console.error(error);
    }
  };
}

/** ===========================================================================
 * Export
 * ============================================================================
 */

const logger = new Logger();

export default logger;
