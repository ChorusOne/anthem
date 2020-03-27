import { Action, Location } from "history";
import { ILocale } from "i18n/catalog";
import { ActionType, createStandardAction } from "typesafe-actions";
import { SettingsState } from "./store";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

enum ActionTypesEnum {
  UPDATE_SETTING = "UPDATE_SETTING",
  UPDATE_SETTING_SUCCESS = "UPDATE_SETTING_SUCCESS",
  ROUTE_CHANGE = "ROUTE_CHANGE",
}

/** ===========================================================================
 * Actions
 * ============================================================================
 */

const updateSetting = createStandardAction(ActionTypesEnum.UPDATE_SETTING)<
  Partial<SettingsState>
>();

const updateSettingSuccess = createStandardAction(
  ActionTypesEnum.UPDATE_SETTING_SUCCESS,
)();

interface RouteInformation extends Location {
  action: Action;
}

const onRouteChange = createStandardAction(ActionTypesEnum.ROUTE_CHANGE)<
  RouteInformation
>();

const setLocale = (locale: ILocale) => {
  return updateSetting({ locale });
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

const actions = {
  updateSetting,
  updateSettingSuccess,
  onRouteChange,
  setLocale,
};

export type ActionTypes = ActionType<typeof actions>;

export default actions;
