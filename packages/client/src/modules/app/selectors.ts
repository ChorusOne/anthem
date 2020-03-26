import { createSelector } from "reselect";

import { ReduxStoreState } from "modules/root";
import { identity } from "tools/generic-utils";

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
