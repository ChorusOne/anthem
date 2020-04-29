import { ReduxStoreState } from "modules/root";
import { createSelector } from "reselect";
import { identity } from "tools/client-utils";

/** ===========================================================================
 * Selectors
 * ============================================================================
 */

const transactionState = (state: ReduxStoreState) => {
  return state.transaction;
};

export const transactionStateSelector = createSelector(
  transactionState,
  identity,
);

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default transactionStateSelector;
