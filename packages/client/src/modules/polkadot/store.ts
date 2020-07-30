import { createReducer } from "typesafe-actions";
import actions, { ActionTypes } from "./actions";

/** ===========================================================================
 * Loading Store
 * ============================================================================
 */

export type DotTransactionType = "ACTIVATE" | "ADD_FUNDS" | "REMOVE_FUNDS";

export interface State {
  dialogOpen: boolean;
  interactionType: DotTransactionType;
}

const initialState: State = {
  dialogOpen: false,
  interactionType: "ACTIVATE",
};

const polkadot = createReducer<State, ActionTypes>(initialState)
  .handleAction(actions.openPolkadotDialog, (state, action) => ({
    ...state,
    dialogOpen: true,
    interactionType: action.payload,
  }))
  .handleAction(actions.closePolkadotDialog, (state, action) => ({
    ...state,
    dialogOpen: false,
  }));

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default polkadot;
