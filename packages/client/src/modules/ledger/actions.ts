import { NETWORK_NAME, NetworkDefinition } from "@anthem/utils";
import { ActionType, createStandardAction } from "typesafe-actions";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

export type SIGNIN_TYPE =
  | "LEDGER"
  | "ADDRESS"
  | "INITIAL_SETUP"
  | "LEDGER_ACTION";

export type LEDGER_ACTION_TYPE = "DELEGATE" | "CLAIM" | "SEND";

export type LEDGER_ACCESS_TYPE = "SIGNIN" | "PERFORM_ACTION";

export interface LedgerDialogArguments {
  signinType: SIGNIN_TYPE;
  ledgerAccessType: LEDGER_ACCESS_TYPE;
  ledgerActionType?: LEDGER_ACTION_TYPE;
}

/** ===========================================================================
 * Action Types
 * ============================================================================
 */

enum ActionTypesEnum {
  SET_ADDRESS = "SET_ADDRESS",
  SET_ADDRESS_SUCCESS = "SET_ADDRESS_SUCCESS",
  SET_ADDRESS_FAILURE = "SET_ADDRESS_FAILURE",

  VIEW_SELECT_NETWORK = "VIEW_SELECT_NETWORK",

  SET_SIGNIN_NETWORK_NAME = "SET_SIGNIN_NETWORK_NAME",

  SEARCH_TRANSACTION_BY_HASH = "SEARCH_TRANSACTION_BY_HASH",

  CONNECT_LEDGER = "CONNECT_LEDGER",
  CONNECT_LEDGER_SUCCESS = "CONNECT_LEDGER_SUCCESS",
  CONNECT_LEDGER_FAILURE = "CONNECT_LEDGER_FAILURE",

  OPEN_LEDGER_DIALOG = "OPEN_LEDGER_DIALOG",
  CLOSE_LEDGER_DIALOG = "CLOSE_LEDGER_DIALOG",

  OPEN_LOGOUT_MENU = "OPEN_LOGOUT_MENU",
  CLOSE_LOGOUT_MENU = "CLOSE_LOGOUT_MENU",
  CONFIRM_LOGOUT = "CONFIRM_LOGOUT",
  LOGOUT_SUCCESS = "LOGOUT_SUCCESS",
  LOGOUT_FAILURE = "LOGOUT_FAILURE",

  CLEAR_ALL_RECENT_ADDRESSES = "CLEAR_ALL_RECENT_ADDRESSES",
}

/** ===========================================================================
 * Actions
 * ============================================================================
 */

const setAddress = createStandardAction(ActionTypesEnum.SET_ADDRESS)<
  string,
  { showToastForError: boolean }
>();

const setAddressSuccess = createStandardAction(
  ActionTypesEnum.SET_ADDRESS_SUCCESS,
)<{ address: string; network: NetworkDefinition }>();

const setAddressFailure = createStandardAction(
  ActionTypesEnum.SET_ADDRESS_FAILURE,
)<string>();

const openSelectNetworkDialog = createStandardAction(
  ActionTypesEnum.VIEW_SELECT_NETWORK,
)<LedgerDialogArguments>();

const setSigninNetworkName = createStandardAction(
  ActionTypesEnum.SET_SIGNIN_NETWORK_NAME,
)<NETWORK_NAME>();

const searchTransactionByHash = createStandardAction(
  ActionTypesEnum.SEARCH_TRANSACTION_BY_HASH,
)<string>();

const clearAllRecentAddresses = createStandardAction(
  ActionTypesEnum.CLEAR_ALL_RECENT_ADDRESSES,
)();

const connectLedger = createStandardAction(ActionTypesEnum.CONNECT_LEDGER)();

const connectLedgerSuccess = createStandardAction(
  ActionTypesEnum.CONNECT_LEDGER_SUCCESS,
)<{
  ledgerAddress: string;
  ledgerAppVersion: string;
  network: NetworkDefinition;
}>();

const connectLedgerFailure = createStandardAction(
  ActionTypesEnum.CONNECT_LEDGER_FAILURE,
)();

const openLedgerDialog = createStandardAction(
  ActionTypesEnum.OPEN_LEDGER_DIALOG,
)<LedgerDialogArguments>();
const closeLedgerDialog = createStandardAction(
  ActionTypesEnum.CLOSE_LEDGER_DIALOG,
)();

const openLogoutMenu = createStandardAction(ActionTypesEnum.OPEN_LOGOUT_MENU)();
const closeLogoutMenu = createStandardAction(
  ActionTypesEnum.CLOSE_LOGOUT_MENU,
)();
const confirmLogout = createStandardAction(ActionTypesEnum.CONFIRM_LOGOUT)();
const logoutSuccess = createStandardAction(ActionTypesEnum.LOGOUT_SUCCESS)();
const logoutFailure = createStandardAction(ActionTypesEnum.LOGOUT_FAILURE)();

const actions = {
  setAddress,
  setAddressSuccess,
  setAddressFailure,
  searchTransactionByHash,
  openSelectNetworkDialog,
  setSigninNetworkName,
  clearAllRecentAddresses,
  connectLedger,
  connectLedgerSuccess,
  connectLedgerFailure,
  openLedgerDialog,
  closeLedgerDialog,
  openLogoutMenu,
  closeLogoutMenu,
  confirmLogout,
  logoutSuccess,
  logoutFailure,
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export type ActionTypes = ActionType<typeof actions>;

export default actions;
