import actions, { ActionTypes } from "./actions";
import epics from "./epics";
import selector from "./selectors";
import store, { State } from "./store";

const polkadot = {
  actions,
  epics,
  store,
  selector,
};

export type PolkadotState = State;
export type PolkadotActionTypes = ActionTypes;

export default polkadot;
