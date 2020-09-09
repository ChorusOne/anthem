import { FiatCurrenciesDocument } from "@anthem/utils";
import { FiatCurrency } from "constants/fiat";
import { EpicSignature } from "modules/root";
import { combineEpics } from "redux-observable";
import { filter, ignoreElements, mergeMap, tap } from "rxjs/operators";
import { isActionOf } from "typesafe-actions";
import { Actions } from "../root-actions";
import { SETTINGS_STORE_KEY } from "./store";

/** ===========================================================================
 * Epics
 * ============================================================================
 */

const serializeSettingsStoreEpic: EpicSignature = (action$, state$, deps) => {
  return action$.pipe(
    filter(isActionOf(Actions.updateSetting)),
    tap(() => {
      const settings = state$.value.settings;
      const serializedState = JSON.stringify(settings);
      localStorage.setItem(SETTINGS_STORE_KEY, serializedState);
    }),
    ignoreElements(),
  );
};

/**
 * Handle updating the fiat currency setting to add the newly included
 * letter value.
 */
const updateFiatCurrencySettingEpic: EpicSignature = (
  action$,
  state$,
  deps,
) => {
  return action$.pipe(
    filter(isActionOf(Actions.initializeAppSuccess)),
    filter(() => {
      // Only proceed if the selected fiat currency has no letter
      const { fiatCurrency } = state$.value.settings;
      return !fiatCurrency.letter;
    }),
    mergeMap(async () => {
      const { fiatCurrency } = state$.value.settings;
      const query = FiatCurrenciesDocument;
      const result = await deps.client.query({ query });
      const currencies: FiatCurrency[] = result.data.fiatCurrencies;
      const currency = currencies.find(x => x.symbol === fiatCurrency.symbol);
      if (currency) {
        return Actions.updateSetting({ fiatCurrency: currency });
      } else {
        return Actions.empty("No currency found...?");
      }
    }),
  );
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default combineEpics(
  serializeSettingsStoreEpic,
  updateFiatCurrencySettingEpic,
);
