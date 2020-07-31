import { ActionType, createStandardAction } from "typesafe-actions";
import { DotAccount, DotTransactionStage, DotTransactionType } from "./store";

/** ===========================================================================
 * Action Types
 * ============================================================================
 */

enum ActionTypesEnum {
  FETCH_POLKADOT_ACCOUNT = "FETCH_POLKADOT_ACCOUNT",
  FETCH_POLKADOT_ACCOUNT_SUCCESS = "FETCH_POLKADOT_ACCOUNT_SUCCESS",
  FETCH_POLKADOT_ACCOUNT_FAILURE = "FETCH_POLKADOT_ACCOUNT_FAILURE",

  POLKADOT_SIGNIN = "POLKADOT_SIGNIN",
  OPEN_POLKADOT_DIALOG = "OPEN_POLKADOT_DIALOG",
  CLOSE_POLKADOT_DIALOG = "CLOSE_POLKADOT_DIALOG",
  SET_POLKADOT_TRANSACTION_STAGE = "SET_POLKADOT_TRANSACTION_STAGE",
}

/** ===========================================================================
 * Actions
 * ============================================================================
 */

const fetchAccount = createStandardAction(
  ActionTypesEnum.FETCH_POLKADOT_ACCOUNT,
)();

const fetchAccountSuccess = createStandardAction(
  ActionTypesEnum.FETCH_POLKADOT_ACCOUNT_SUCCESS,
)<DotAccount>();

const fetchAccountFailure = createStandardAction(
  ActionTypesEnum.FETCH_POLKADOT_ACCOUNT_FAILURE,
)();

const polkadotSignin = createStandardAction(ActionTypesEnum.POLKADOT_SIGNIN)<{
  account: DotAccount;
  seed: string;
}>();

const openPolkadotDialog = createStandardAction(
  ActionTypesEnum.OPEN_POLKADOT_DIALOG,
)<DotTransactionType>();

const closePolkadotDialog = createStandardAction(
  ActionTypesEnum.CLOSE_POLKADOT_DIALOG,
)();

const setTransactionStage = createStandardAction(
  ActionTypesEnum.SET_POLKADOT_TRANSACTION_STAGE,
)<DotTransactionStage>();

const actions = {
  fetchAccount,
  fetchAccountSuccess,
  fetchAccountFailure,
  polkadotSignin,
  openPolkadotDialog,
  closePolkadotDialog,
  setTransactionStage,
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export type ActionTypes = ActionType<typeof actions>;

export default actions;
