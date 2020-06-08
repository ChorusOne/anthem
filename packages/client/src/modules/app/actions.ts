import { NetworkDefinition } from "@anthem/utils";
import { Action, Location } from "history";
import { PORTFOLIO_CHART_TYPES } from "i18n/english";
import { ActionType, createStandardAction } from "typesafe-actions";
import {
  BANNER_NOTIFICATIONS_KEYS,
  VALIDATORS_LIST_SORT_FILTER,
} from "./store";

/** ===========================================================================
 * Action Types
 * ============================================================================
 */

enum ActionTypesEnum {
  // Empty action
  EMPTY_ACTION = "EMPTY_ACTION",

  SET_DASHBOARD_ADDRESS_INPUT_FOCUS_STATE = "SET_DASHBOARD_ADDRESS_INPUT_FOCUS_STATE",

  TOGGLE_NOTIFICATIONS_BANNER = "TOGGLE_NOTIFICATIONS_BANNER",
  SHOW_MONTHLY_SUMMARY_TOOLTIP = "SHOW_MONTHLY_SUMMARY_TOOLTIP",
  TOGGLE_MONTHLY_SUMMARY_TOOLTIP = "TOGGLE_MONTHLY_SUMMARY_TOOLTIP",

  DISPLAY_DATA_INTEGRITY_HELP_LABEL = "DISPLAY_DATA_INTEGRITY_HELP_LABEL",
  TOGGLE_DATA_INTEGRITY_HELP_LABEL = "TOGGLE_DATA_INTEGRITY_HELP_LABEL",

  REFRESH_BALANCE_AND_TRANSACTIONS = "REFRESH_BALANCE_AND_TRANSACTIONS",
  REFRESH_BALANCE_AND_TRANSACTIONS_SUCCESS = "REFRESH_BALANCE_AND_TRANSACTIONS_SUCCESS",

  INITIALIZING_APP = "INITIALIZING_APP",
  INITIALIZING_APP_SUCCESS = "INITIALIZING_APP_SUCCESS",

  NEWSLETTER_SIGNUP = "NEWSLETTER_SIGNUP",
  NEWSLETTER_SIGNUP_SUCCESS = "NEWSLETTER_SIGNUP_SUCCESS",
  NEWSLETTER_SIGNUP_FAILURE = "NEWSLETTER_SIGNUP_FAILURE",

  SET_VALIDATOR_LIST_SORT_TYPE = "SET_VALIDATOR_LIST_SORT_TYPE",

  SET_PORTFOLIO_SIZE = "SET_PORTFOLIO_SIZE",
  SET_TRANSACTIONS_SIZE = "SET_TRANSACTIONS_SIZE",

  SET_ADDRESS_INPUT_REF = "SET_ADDRESS_INPUT_REF",

  ROUTE_CHANGE = "ROUTE_CHANGE",

  SET_ACTIVE_CHART_TAB = "SET_ACTIVE_CHART_TAB",
}

/** ===========================================================================
 * Actions
 * ============================================================================
 */

const empty = createStandardAction(ActionTypesEnum.EMPTY_ACTION)<string>();

const setDashboardAddressInputFocusState = createStandardAction(
  ActionTypesEnum.SET_DASHBOARD_ADDRESS_INPUT_FOCUS_STATE,
)<boolean>();

const showMonthlySummaryTooltip = createStandardAction(
  ActionTypesEnum.SHOW_MONTHLY_SUMMARY_TOOLTIP,
)();

const displayDataIntegrityHelpLabel = createStandardAction(
  ActionTypesEnum.DISPLAY_DATA_INTEGRITY_HELP_LABEL,
)();

const toggleDataIntegrityHelpLabel = createStandardAction(
  ActionTypesEnum.TOGGLE_DATA_INTEGRITY_HELP_LABEL,
)<boolean>();

const toggleMonthlySummaryTooltip = createStandardAction(
  ActionTypesEnum.TOGGLE_MONTHLY_SUMMARY_TOOLTIP,
)<boolean>();

const toggleNotificationsBanner = createStandardAction(
  ActionTypesEnum.TOGGLE_NOTIFICATIONS_BANNER,
)<{ key: BANNER_NOTIFICATIONS_KEYS; visible: boolean }>();

const refreshBalanceAndTransactions = createStandardAction(
  ActionTypesEnum.REFRESH_BALANCE_AND_TRANSACTIONS,
)();
const refreshBalanceAndTransactionsSuccess = createStandardAction(
  ActionTypesEnum.REFRESH_BALANCE_AND_TRANSACTIONS_SUCCESS,
)();

const initializeApp = createStandardAction(ActionTypesEnum.INITIALIZING_APP)();
const initializeAppSuccess = createStandardAction(
  ActionTypesEnum.INITIALIZING_APP_SUCCESS,
)<{ address: string; network: NetworkDefinition; page: number }>();

const newsletterSignup = createStandardAction(
  ActionTypesEnum.NEWSLETTER_SIGNUP,
)<string>();

const newsletterSignupSuccess = createStandardAction(
  ActionTypesEnum.NEWSLETTER_SIGNUP_SUCCESS,
)();

const newsletterSignupFailure = createStandardAction(
  ActionTypesEnum.NEWSLETTER_SIGNUP_FAILURE,
)();

const setValidatorListSortType = createStandardAction(
  ActionTypesEnum.SET_VALIDATOR_LIST_SORT_TYPE,
)<VALIDATORS_LIST_SORT_FILTER>();

const togglePortfolioSize = createStandardAction(
  ActionTypesEnum.SET_PORTFOLIO_SIZE,
)();

const toggleTransactionsSize = createStandardAction(
  ActionTypesEnum.SET_TRANSACTIONS_SIZE,
)();

const setAddressInputRef = createStandardAction(
  ActionTypesEnum.SET_ADDRESS_INPUT_REF,
)<Nullable<HTMLInputElement>>();

interface RouteInformation extends Location {
  action: Action;
}

const onRouteChange = createStandardAction(ActionTypesEnum.ROUTE_CHANGE)<
  RouteInformation
>();

const setActiveChartTab = createStandardAction(
  ActionTypesEnum.SET_ACTIVE_CHART_TAB,
)<PORTFOLIO_CHART_TYPES>();

const actions = {
  empty,
  initializeApp,
  initializeAppSuccess,
  newsletterSignup,
  newsletterSignupSuccess,
  newsletterSignupFailure,
  displayDataIntegrityHelpLabel,
  toggleDataIntegrityHelpLabel,
  toggleNotificationsBanner,
  showMonthlySummaryTooltip,
  toggleMonthlySummaryTooltip,
  refreshBalanceAndTransactions,
  setDashboardAddressInputFocusState,
  refreshBalanceAndTransactionsSuccess,
  setValidatorListSortType,
  togglePortfolioSize,
  toggleTransactionsSize,
  setAddressInputRef,
  onRouteChange,
  setActiveChartTab,
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export type ActionTypes = ActionType<typeof actions>;

export default actions;
