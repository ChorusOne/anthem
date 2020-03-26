import getenv from "getenv";

/** ===========================================================================
 * Environment Variables Configuration
 * ============================================================================
 */

const DEV = getenv.bool("REACT_APP_DEV", false);
const SENTRY_DSN = getenv.string("REACT_APP_SENTRY_DSN", "");

const ALLOW_LEDGER_ADDRESS_OVERRIDE = getenv.bool(
  "REACT_APP_ALLOW_LEDGER_ADDRESS_OVERRIDE",
  false,
);

const ONE_MINUTE = 60000;
const ONE_DAY = 60000 * 24;

const FAST_POLL_INTERVAL = getenv.int(
  "REACT_APP_FAST_POLL_INTERVAL",
  ONE_MINUTE,
);
const SLOW_POLL_INTERVAL = getenv.int("REACT_APP_SLOW_POLL_INTERVAL", ONE_DAY);

const SEGMENT_WRITE_KEY = getenv.string("REACT_APP_SEGMENT_WRITE_KEY", "");

// const SERVER_URL = "https://graphql.chorus.one";
const SERVER_URL = getenv.string(
  "REACT_APP_GRAPHQL_URL",
  "http://localhost:8000",
);

const GRAPHQL_URL = `${SERVER_URL}/graphql`;

/**
 * NOTE: See
 * https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables
 */
const NODE_ENV = getenv.string("NODE_ENV", "");
const TEST = NODE_ENV === "test";
const DEVELOPMENT = NODE_ENV === "development";
const PRODUCTION = NODE_ENV === "production";

const ENABLE_MOCK_APIS = (DEV || TEST) && !PRODUCTION;

const ENV = {
  DEV,
  TEST,
  DEVELOPMENT,
  PRODUCTION,
  SERVER_URL,
  GRAPHQL_URL,
  SENTRY_DSN,
  FAST_POLL_INTERVAL,
  SLOW_POLL_INTERVAL,
  ENABLE_MOCK_APIS,
  SEGMENT_WRITE_KEY,
  ALLOW_LEDGER_ADDRESS_OVERRIDE,
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default ENV;
