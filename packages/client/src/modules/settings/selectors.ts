import { createSelector } from "reselect";

import { ReduxStoreState } from "modules/root";
import { identity } from "tools/generic-utils";
import {
  createStringTranslationMethodFromLocale,
  createTranslationMethodFromLocale,
  getCatalogFromLocale,
} from "tools/i18n-utils";

/** ===========================================================================
 * i18n
 * ============================================================================
 */

const i18nLocale = (state: ReduxStoreState) => state.settings.locale;

export const i18nSelector = createSelector(
  i18nLocale,
  locale => {
    const catalog = getCatalogFromLocale(locale);
    const fns = {
      t: createTranslationMethodFromLocale(catalog),
      tString: createStringTranslationMethodFromLocale(catalog),
    };

    return {
      locale,
      ...fns,
    };
  },
);

/** ===========================================================================
 * Settings
 * ============================================================================
 */

export const settingsState = (state: ReduxStoreState) => {
  return state.settings;
};

export const settingsSelector = createSelector(
  settingsState,
  identity,
);

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default settingsSelector;
