import { EpicSignature } from "modules/root";
import { combineEpics } from "redux-observable";
import {
  delay,
  filter,
  ignoreElements,
  mapTo,
  pluck,
  tap,
} from "rxjs/operators";
import { isActionOf } from "typesafe-actions";
import { Actions } from "../root-actions";

/** ===========================================================================
 * Epics
 * ============================================================================
 */

/**
 * Placeholder epic.
 */
const placeholderEpic: EpicSignature = (action$, state$, deps) => {
  return action$.pipe(
    filter(isActionOf(Actions.openPolkadotDialog)),
    tap(() => console.log("openPolkadotDialog epic!")),
    ignoreElements(),
  );
};

/**
 * Delay and then set the transaction stage to CONFIRMED.
 */
const mockConfirmEpic: EpicSignature = (action$, state$, deps) => {
  return action$.pipe(
    filter(isActionOf(Actions.setTransactionStage)),
    pluck("payload"),
    filter(x => x === "SIGN"),
    delay(3000),
    mapTo(Actions.setTransactionStage("CONFIRMED")),
  );
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default combineEpics(placeholderEpic, mockConfirmEpic);
