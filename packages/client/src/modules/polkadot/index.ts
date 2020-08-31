import actions, { ActionTypes } from "./actions";
import epics from "./epics";
import selector from "./selectors";
import store, { State } from "./store";

/**
 * NOTE: The polkadot module exists but is not used. It was created in an
 * internal team hackathon for the Polkadot Staking Agent and the code
 * may very likely come into play soon as Chorus pursues this product
 * direction. Therefore, the code has been merged into master to keep
 * it in sync and make it easy to evolve this feature later, rather
 * than preserving it on a branch.
 */
const polkadot = {
  actions,
  epics,
  store,
  selector,
};

export type PolkadotState = State;
export type PolkadotActionTypes = ActionTypes;

export default polkadot;
