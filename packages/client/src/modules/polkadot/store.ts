import { createReducer } from "typesafe-actions";
import actions, { ActionTypes } from "./actions";

/** ===========================================================================
 * Loading Store
 * ============================================================================
 */

export type DotTransactionType = "ACTIVATE" | "ADD_FUNDS" | "REMOVE_FUNDS";

export type DotTransactionStage = "SETUP" | "SIGN" | "CONFIRMED";

export interface State {
  dialogOpen: boolean;
  stage: DotTransactionStage;
  interactionType: DotTransactionType;
}

const initialState: State = {
  dialogOpen: false,
  stage: "SETUP",
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
  }))
  .handleAction(actions.setTransactionStage, (state, action) => ({
    ...state,
    stage: action.payload,
  }));

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default polkadot;
