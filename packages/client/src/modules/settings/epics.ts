import { EpicSignature } from "modules/root";
import { combineEpics } from "redux-observable";
import { filter, ignoreElements, tap } from "rxjs/operators";
import { isActionOf } from "typesafe-actions";
import actions from "./actions";
import { SETTINGS_STORE_KEY } from "./store";

/** ===========================================================================
 * Epics
 * ============================================================================
 */

const serializeSettingsStoreEpic: EpicSignature = (action$, state$, deps) => {
  return action$.pipe(
    filter(isActionOf(actions.updateSetting)),
    tap(() => {
      const settings = state$.value.settings;
      const serializedState = JSON.stringify(settings);
      localStorage.setItem(SETTINGS_STORE_KEY, serializedState);
    }),
    ignoreElements(),
  );
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default combineEpics(serializeSettingsStoreEpic);
