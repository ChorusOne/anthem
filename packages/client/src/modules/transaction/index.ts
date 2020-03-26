import actions, { ActionTypes } from "./actions";
import epics from "./epics";
import selector from "./selectors";
import store, { State } from "./store";

const ledger = {
  actions,
  epics,
  store,
  selector,
};

export type TransactionState = State;
export type TransactionActionTypes = ActionTypes;

export default ledger;
