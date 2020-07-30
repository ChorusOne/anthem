import { ReduxStoreState } from "modules/root";
import { createSelector } from "reselect";
import { identity } from "tools/client-utils";

/** ===========================================================================
 * Selectors
 * ============================================================================
 */

export const polkadotSelector = (state: ReduxStoreState) => {
  return state.polkadot;
};

export const appSelector = createSelector([polkadotSelector], identity);

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default {
  polkadotSelector,
};
