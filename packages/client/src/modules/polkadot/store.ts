import { createReducer } from "typesafe-actions";
import actions, { ActionTypes } from "./actions";

/** ===========================================================================
 * Loading Store
 * ============================================================================
 */

export interface State {
  dialogOpen: boolean;
}

const initialState: State = {
  dialogOpen: false,
};

const polkadot = createReducer<State, ActionTypes>(initialState)
  .handleAction(actions.openPolkadotDialog, (state, action) => ({
    ...state,
    dialogOpen: true,
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
