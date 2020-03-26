import { TxPostBody } from "tools/cosmos-utils";
import { TRANSACTION_STAGES } from "tools/transaction-utils";
import { ActionType, createStandardAction } from "typesafe-actions";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

/** ===========================================================================
 * Action Types
 * ============================================================================
 */

enum ActionTypesEnum {
  SET_TRANSACTION_DATA = "SET_TRANSACTION_DATA",
  SET_TRANSACTION_STAGE = "SET_TRANSACTION_STAGE",

  SIGN_TRANSACTION = "SIGN_TRANSACTION",
  SIGN_TRANSACTION_SUCCESS = "SIGN_TRANSACTION_SUCCESS",
  SIGN_TRANSACTION_FAILURE = "SIGN_TRANSACTION_FAILURE",

  BROADCAST_TRANSACTION = "BROADCAST_TRANSACTION",
  BROADCAST_TRANSACTION_SUCCESS = "BROADCAST_TRANSACTION_SUCCESS",
  BROADCAST_TRANSACTION_FAILURE = "BROADCAST_TRANSACTION_FAILURE",

  POLL_FOR_TRANSACTION = "POLL_FOR_TRANSACTION",
  TRANSACTION_CONFIRMED = "TRANSACTION_CONFIRMED",
  TRANSACTION_FAILED = "TRANSACTION_FAILED",
}

/** ===========================================================================
 * Actions
 * ============================================================================
 */

const setTransactionData = createStandardAction(
  ActionTypesEnum.SET_TRANSACTION_DATA,
)<any>();

const setTransactionStage = createStandardAction(
  ActionTypesEnum.SET_TRANSACTION_STAGE,
)<TRANSACTION_STAGES>();

const signTransaction = createStandardAction(
  ActionTypesEnum.SIGN_TRANSACTION,
)();
const signTransactionSuccess = createStandardAction(
  ActionTypesEnum.SIGN_TRANSACTION_SUCCESS,
)<TxPostBody>();
const signTransactionFailure = createStandardAction(
  ActionTypesEnum.SIGN_TRANSACTION_FAILURE,
)();

const broadcastTransaction = createStandardAction(
  ActionTypesEnum.BROADCAST_TRANSACTION,
)();

const broadcastTransactionSuccess = createStandardAction(
  ActionTypesEnum.BROADCAST_TRANSACTION_SUCCESS,
)<string>();

const broadcastTransactionFailure = createStandardAction(
  ActionTypesEnum.BROADCAST_TRANSACTION_FAILURE,
)();

const pollForTransaction = createStandardAction(
  ActionTypesEnum.POLL_FOR_TRANSACTION,
)();

const transactionConfirmed = createStandardAction(
  ActionTypesEnum.TRANSACTION_CONFIRMED,
)<string>();

const transactionFailed = createStandardAction(
  ActionTypesEnum.TRANSACTION_FAILED,
)();

const actions = {
  setTransactionData,
  setTransactionStage,
  signTransaction,
  signTransactionSuccess,
  signTransactionFailure,
  broadcastTransaction,
  broadcastTransactionSuccess,
  broadcastTransactionFailure,
  pollForTransaction,
  transactionConfirmed,
  transactionFailed,
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export type ActionTypes = ActionType<typeof actions>;

export default actions;
