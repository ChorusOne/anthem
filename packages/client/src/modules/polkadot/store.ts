import { createReducer } from "typesafe-actions";
import actions, { ActionTypes } from "./actions";

/** ===========================================================================
 * Loading Store
 * ============================================================================
 */

export type DotTransactionType = "ACTIVATE" | "ADD_FUNDS" | "REMOVE_FUNDS";

export type DotTransactionStage = "SETUP" | "SIGN" | "CONFIRMED";

export interface DotAccount {
  balance: number;
  controllerKey: string;
  stashKey: string;
}

export interface State {
  dialogOpen: boolean;
  stage: DotTransactionStage;
  interactionType: DotTransactionType;
  account: Nullable<DotAccount>;
  seed: string;
  loading: boolean;
  error: string;
}

const initialState: State = {
  seed: "",
  account: null,
  dialogOpen: false,
  stage: "SETUP",
  interactionType: "ACTIVATE",
  loading: true,
  error: "",
};

const polkadot = createReducer<State, ActionTypes>(initialState)
  .handleAction(actions.fetchAccount, (state, action) => ({
    ...state,
    error: "",
    loading: true,
  }))
  .handleAction(actions.fetchAccountSuccess, (state, action) => ({
    ...state,
    error: "",
    loading: false,
    account: action.payload,
  }))
  .handleAction(actions.fetchAccountFailure, (state, action) => ({
    ...state,
    error: "Error fetching account data.",
    loading: false,
  }))
  .handleAction(actions.polkadotSignin, (state, action) => ({
    ...state,
    seed: action.payload.seed,
    account: action.payload.account,
  }))
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
