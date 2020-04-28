import { ReduxStoreState } from "modules/root";
import { createSelector } from "reselect";
import { identity } from "tools/client-utils";

/** ===========================================================================
 * Selectors
 * ============================================================================
 */

export const loadingState = (state: ReduxStoreState) => {
  return state.app.loading;
};

export const loadingSelector = createSelector([loadingState], identity);

export const appState = (state: ReduxStoreState) => {
  return state.app.app;
};

export const appSelector = createSelector([appState], identity);

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default {
  appSelector,
  loadingSelector,
};
