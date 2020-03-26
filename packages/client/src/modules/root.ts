import { NormalizedCacheObject } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { History } from "history";
import { combineReducers } from "redux";
import { combineEpics, Epic } from "redux-observable";

import cosmosBlockchainModule from "lib/blockchain-lib";
import ledgerModule from "lib/ledger-lib";

/** ===========================================================================
 * Import Redux Modules
 * ============================================================================
 */

import { catchError } from "rxjs/operators";
import App, { AppActionTypes, AppState } from "./app";
import Ledger, { LedgerActionTypes, LedgerState } from "./ledger";
import Settings, { SettingsActionTypes, SettingsState } from "./settings";
import Transaction, {
  TransactionActionTypes,
  TransactionState,
} from "./transaction";

/** ===========================================================================
 * Root Actions and Selectors
 * ============================================================================
 */

export type ReduxActionTypes =
  | LedgerActionTypes
  | SettingsActionTypes
  | AppActionTypes
  | TransactionActionTypes;

export const selectors = {
  app: App.selector,
  ledger: Ledger.selector,
  settings: Settings.selector,
  transaction: Transaction.selector,
};

export const actions = {
  app: App.actions,
  ledger: Ledger.actions,
  settings: Settings.actions,
  transaction: Transaction.actions,
};

const Modules = {
  selectors,
  actions,
};

/** ===========================================================================
 * Root Reducer
 * ============================================================================
 */

export interface ReduxStoreState {
  app: AppState;
  ledger: LedgerState;
  settings: SettingsState;
  transaction: TransactionState;
}

const rootReducer = combineReducers({
  app: App.store,
  ledger: Ledger.store,
  settings: Settings.store,
  transaction: Transaction.store,
});

/** ===========================================================================
 * Root Epic
 * ============================================================================
 */

export interface EpicDependencies {
  ledger: typeof ledgerModule;
  router: History<any>;
  cosmos: typeof cosmosBlockchainModule;
  client: ApolloClient<NormalizedCacheObject>;
}

export type EpicSignature = Epic<
  ReduxActionTypes,
  ReduxActionTypes,
  ReduxStoreState,
  EpicDependencies
>;

const epics: ReadonlyArray<Epic> = [
  Ledger.epics,
  Settings.epics,
  App.epics,
  Transaction.epics,
];

/**
 * See "Adding global error handler" section of:
 * https://redux-observable.js.org/docs/basics/SettingUpTheMiddleware.html
 *
 * If there is an uncaught error, resubscribe the stream so it does not
 * collapse.
 */
const rootEpic = (action$: any, store$: any, dependencies: any) => {
  return combineEpics(...epics)(action$, store$, dependencies).pipe(
    catchError(resubscribeOnError),
  );
};

const resubscribeOnError = (error: any, source: any) => {
  // Handle error side effects
  return source;
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { rootEpic, rootReducer };

export default Modules;
