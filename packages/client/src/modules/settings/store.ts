import {
  CURRENCY_SETTING,
  DEFAULT_FIAT_CURRENCY,
  FiatCurrency,
} from "constants/fiat";
import { ILocale } from "i18n/catalog";
import { createReducer } from "typesafe-actions";
import AppActions, { ActionTypes as AppActionTypes } from "../app/actions";
import actions, { ActionTypes } from "./actions";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

export interface SettingsState {
  locale: ILocale;
  isDarkTheme: boolean;
  darkThemeEnabled: boolean;
  isDesktop: boolean;
  fiatCurrency: FiatCurrency;
  currencySetting: CURRENCY_SETTING;
}

export type State = SettingsState;

export const SETTINGS_STORE_KEY = "SETTINGS_STORE_KEY";

const getInitialState = () => {
  const onLandingPage = window.location.pathname.includes("landing");
  const isDesktop = window.innerWidth > 768;
  const defaultState: SettingsState = {
    locale: "en-US",
    isDesktop,
    isDarkTheme: false, // Dark theme is disabled by default
    darkThemeEnabled: false,
    currencySetting: "crypto",
    fiatCurrency: DEFAULT_FIAT_CURRENCY,
  };

  try {
    const storedState = localStorage.getItem(SETTINGS_STORE_KEY);
    if (storedState) {
      const state = JSON.parse(storedState);
      if (state) {
        return {
          ...state,
          isDesktop,
          isDarkTheme: onLandingPage ? false : state.isDarkTheme,
        };
      }
    }
  } catch (err) {
    console.log("Error deserializing settings state: ", err);
  }

  return defaultState;
};

const initialState = getInitialState();

/** ===========================================================================
 * Settings Store Reducer
 * ============================================================================
 */

const settings = createReducer<SettingsState, ActionTypes | AppActionTypes>(
  initialState,
)
  .handleAction(actions.updateSetting, (state, action) => ({
    ...state,
    ...action.payload,
  }))
  .handleAction(AppActions.onRouteChange, (state, action) => {
    /**
     * NOTE: `darkThemeEnabled` is the true theme setting, and `isDarkTheme`
     * is used to actually determine the current app theme. The reason is
     * whatever theme the user selects, the Landing Page still must default
     * to light theme, but we still need to track their actual theme setting
     * in the app.
     */
    const ON_LOGIN =
      action.payload.pathname.includes("login") ||
      window.location.pathname.includes("login");

    if (ON_LOGIN) {
      return {
        ...state,
        isDarkTheme: false,
      };
    } else {
      return {
        ...state,
        isDarkTheme: state.darkThemeEnabled,
      };
    }
  });

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default settings;
