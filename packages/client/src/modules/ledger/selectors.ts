import { ReduxStoreState } from "modules/root";
import { createSelector } from "reselect";
import { identity } from "tools/client-utils";

/** ===========================================================================
 * Address
 * ============================================================================
 */

export const addressSelector = (state: ReduxStoreState) => {
  return state.ledger.ledger.address;
};

/** ===========================================================================
 * Ledger
 * ============================================================================
 */

const ledgerState = (state: ReduxStoreState) => {
  return state.ledger.ledger;
};

const ledgerSelector = createSelector(ledgerState, identity);

const networkState = (state: ReduxStoreState) => {
  return state.ledger.ledger.network;
};

const networkSelector = createSelector(networkState, identity);

const ledgerDialogState = (state: ReduxStoreState) => {
  return state.ledger.ledgerDialog;
};

const ledgerDialogSelector = createSelector(ledgerDialogState, identity);

const ledgerLogoutMenuState = (state: ReduxStoreState) => {
  return state.ledger.logoutMenuOpen;
};

const ledgerLogoutMenuSelector = createSelector(
  ledgerLogoutMenuState,
  identity,
);

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default {
  addressSelector,
  ledgerSelector,
  networkSelector,
  ledgerDialogSelector,
  ledgerLogoutMenuSelector,
};
