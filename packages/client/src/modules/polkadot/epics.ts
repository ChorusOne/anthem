import { EpicSignature } from "modules/root";
import { combineEpics } from "redux-observable";
import { filter, ignoreElements, tap } from "rxjs/operators";
import { isActionOf } from "typesafe-actions";
import { Actions } from "../root-actions";

/** ===========================================================================
 * Epics
 * ============================================================================
 */

/**
 * Handling syncing the activeChartTab state to the url when
 * the url changes.
 */
const placeholderEpic: EpicSignature = (action$, state$, deps) => {
  return action$.pipe(
    filter(isActionOf(Actions.openPolkadotDialog)),
    tap(() => console.log("openPolkadotDialog epic!")),
    ignoreElements(),
  );
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default combineEpics(placeholderEpic);
