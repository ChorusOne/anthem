import { createLogger } from "redux-logger";

import ENV from "lib/env-lib";

/** ===========================================================================
 * Redux Logger Setup
 * ============================================================================
 */

const TITLE = "#15B06D";
const ACTION = "#ff6647";
const NEXT_STATE = "#50adfa";

const reduxLogger = createLogger({
  collapsed: true,
  duration: true,
  level: {
    prevState: false,
    action: "info",
    nextState: "info",
  },
  colors: {
    title: () => TITLE,
    action: () => ACTION,
    nextState: () => NEXT_STATE,
  },
});

/** ===========================================================================
 * App Logger Module
 * ----------------------------------------------------------------------------
 * console.log wrapper which only logs messages in development.
 * ============================================================================
 */

const logger = (message: string) => {
  if (ENV.DEVELOPMENT) {
    console.log(message);
  }
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { reduxLogger };

export default logger;
