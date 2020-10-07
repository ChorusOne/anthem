import client from "graphql/apollo-client";
import { createBrowserHistory } from "history";
import cosmosBlockchainModule from "lib/blockchain-lib";
import celoLedgerLib from "lib/celo-ledger-lib";
import cosmosLedgerLib from "lib/cosmos-ledger-lib";
import oasisLedgerLib from "lib/oasis-ledger-lib";
import polkadotLedgerLib from "lib/polkadot-ledger-lib";
import { applyMiddleware, createStore, Middleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import { createEpicMiddleware } from "redux-observable";
import ENV from "tools/client-env";
import { EpicDependencies, rootEpic, rootReducer } from "./root";

/** ===========================================================================
 * Redux Logger Setup
 * ============================================================================
 */

const TITLE = "#15B06D";
const ACTION = "#ff6647";
const NEXT_STATE = "#50adfa";

const logger = createLogger({
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
 * Router History
 * ============================================================================
 */

const history = createBrowserHistory();

/** ===========================================================================
 * Setup middleware and configure store
 * ============================================================================
 */

const dependencies: EpicDependencies = {
  client,
  router: history,
  cosmosLedgerUtil: cosmosLedgerLib,
  celoLedgerUtil: celoLedgerLib,
  oasisLedgerUtil: oasisLedgerLib,
  polkadotLedgerUtil: polkadotLedgerLib,
  cosmos: cosmosBlockchainModule,
};

const epicMiddleware = createEpicMiddleware({
  dependencies,
});

let middleware: ReadonlyArray<Middleware> = [epicMiddleware];

if (ENV.DEVELOPMENT) {
  middleware = middleware.concat(logger);
}

const configureStore = () => {
  const reduxStore = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware)),
  );

  // @ts-ignore
  epicMiddleware.run(rootEpic);

  return reduxStore;
};

/** ===========================================================================
 * Create Store
 * ============================================================================
 */

const store = configureStore();

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { history };

export default store;
