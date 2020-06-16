import { ICosmosTransaction, ICosmosValidator } from "@anthem/utils";
import { TRANSACTION_STAGES } from "tools/cosmos-transaction-utils";
import { TxPostBody } from "tools/cosmos-utils";
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

  REMOVE_LOCAL_COPY_OF_TRANSACTION = "REMOVE_LOCAL_COPY_OF_TRANSACTION",

  SET_TRANSACTIONS_PAGE = "SET_TRANSACTIONS_PAGE",

  SET_DELEGATION_VALIDATOR_SELECTION = "SET_DELEGATION_VALIDATOR_SELECTION",
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
)<{ height: string; transaction: Nullable<ICosmosTransaction> }>();

const transactionFailed = createStandardAction(
  ActionTypesEnum.TRANSACTION_FAILED,
)();

const setTransactionsPage = createStandardAction(
  ActionTypesEnum.SET_TRANSACTIONS_PAGE,
)<number>();

const removeLocalCopyOfTransaction = createStandardAction(
  ActionTypesEnum.REMOVE_LOCAL_COPY_OF_TRANSACTION,
)<{ hash: string }>();

const setDelegationValidatorSelection = createStandardAction(
  ActionTypesEnum.SET_DELEGATION_VALIDATOR_SELECTION,
)<ICosmosValidator>();

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
  setTransactionsPage,
  removeLocalCopyOfTransaction,
  setDelegationValidatorSelection,
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export type ActionTypes = ActionType<typeof actions>;

export default actions;
