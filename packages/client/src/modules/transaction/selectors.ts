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

const transactionsSelector = createSelector(transactionState, identity);

const liveTransactionsRecordSelector = createSelector(
  transactionState,
  txs => txs.liveTransactionRecord,
);

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default {
  transactionsSelector,
  liveTransactionsRecordSelector,
};
