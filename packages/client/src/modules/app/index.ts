import actions, { ActionTypes } from "./actions";
import epics from "./epics";
import selector from "./selectors";
import store, { State } from "./store";

const app = {
  actions,
  epics,
  store,
  selector,
};

export type AppState = State;
export type AppActionTypes = ActionTypes;

export default app;
