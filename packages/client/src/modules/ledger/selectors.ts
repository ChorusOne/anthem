import { ReduxStoreState } from "modules/root";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { identity } from "tools/generic-utils";
import actions from "./actions";

/** ===========================================================================
 * Address
 * ============================================================================
 */

export const addressSelector = (state: ReduxStoreState) => {
  return state.ledger.ledger.address;
};

const setAddress = actions.setAddress;

export const withAddress = connect(addressSelector, {
  setAddress,
});

export interface AddressProps {
  address: string;
  setAddress: typeof setAddress;
}

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
