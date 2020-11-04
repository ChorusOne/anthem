require("dotenv").config();

import getenv from "getenv";

/** ===========================================================================
 * Environment Configuration
 * ----------------------------------------------------------------------------
 * Read environment variables and exposes to the application.
 * ============================================================================
 */

const NODE_ENV = getenv.string("NODE_ENV", "production");
const TEST = NODE_ENV === "test";
const DEVELOPMENT = NODE_ENV === "development";
const PRODUCTION = NODE_ENV === "production";

// Disable safeguard outside of production
if (!PRODUCTION) {
  getenv.disableErrors();
}

const PORT = getenv.string("PORT", "8000");
const RUN_ALL_MOCKS = getenv.bool("RUN_ALL_MOCKS", false);
const DISABLE_LOGGING = getenv.bool("DISABLE_LOGGING", false);
const DISABLE_GRAPHIQL = getenv.bool("DISABLE_GRAPHIQL", false);
const RECORD_CLIENT_DATA = getenv.bool("RECORD_CLIENT_DATA", false);

// These variables are required in production.
const SENTRY_DSN = getenv.string("SENTRY_DSN", "");
const CRYPTO_COMPARE_API_KEY = getenv.string("CRYPTO_COMPARE_API_KEY");

// External APIs
const KAVA_LCD_NODE = getenv.string("KAVA_LCD_NODE");
const TERRA_LCD_NODE = getenv.string("TERRA_LCD_NODE");
const COSMOS_LCD_NODE = getenv.string("COSMOS_LCD_NODE");
const CELO_EXTRACTOR_API = getenv.string("CELO_EXTRACTOR_API");
const OASIS_EXTRACTOR_API =
  "http://216.18.206.50:10100" || getenv.string("OASIS_EXTRACTOR_API");

// Database names
const COSMOS_DB = getenv.string("COSMOS_DB", "cosmos4");
const TERRA_DB = getenv.string("TERRA_DB", "columbus3dev");
const KAVA_DB = getenv.string("KAVA_DB", "kava");

const ENABLE_GRAPHIQL = !DISABLE_GRAPHIQL;
const ENABLE_LOGGING = !DISABLE_LOGGING;

const ENV = {
  TEST,
  DEVELOPMENT,
  PRODUCTION,
  PORT,
  SENTRY_DSN,
  ENABLE_GRAPHIQL,
  ENABLE_LOGGING,
  RUN_ALL_MOCKS,
  RECORD_CLIENT_DATA,
  CRYPTO_COMPARE_API_KEY,
  COSMOS_DB,
  TERRA_DB: "columbus3dev",
  KAVA_DB,
  KAVA_LCD_NODE,
  TERRA_LCD_NODE,
  COSMOS_LCD_NODE,
  CELO_EXTRACTOR_API,
  OASIS_EXTRACTOR_API,
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default ENV;
