import client from "graphql/apollo-client";
import { createBrowserHistory } from "history";
import cosmosBlockchainModule from "lib/blockchain-lib";
import celoLedgerLib from "lib/celo-ledger-lib";
import ENV from "lib/client-env";
import cosmosLedgerLib from "lib/cosmos-ledger-lib";
import { reduxLogger as logger } from "lib/logger-lib";
import oasisLedgerLib from "lib/oasis-ledger-lib";
import { applyMiddleware, createStore, Middleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createEpicMiddleware } from "redux-observable";
import { EpicDependencies, rootEpic, rootReducer } from "./root";

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
