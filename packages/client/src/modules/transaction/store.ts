import { ICosmosTransaction, ICosmosValidator } from "@anthem/utils";
import { TRANSACTION_STAGES } from "tools/cosmos-transaction-utils";
import { TransactionData, TxPostBody } from "tools/cosmos-utils";
import { createReducer } from "typesafe-actions";
import AppActions, { ActionTypes as AppActionTypes } from "../app/actions";
import LedgerActions, {
  ActionTypes as LedgerActionTypes,
} from "../ledger/actions";
import Actions, { ActionTypes } from "./actions";

/** ===========================================================================
 * Address Reducer
 * ============================================================================
 */

export interface TransactionState {
  transactionsPage: number;
  liveTransactionRecord: ICosmosTransaction[];
  transactionPostBody: Nullable<TxPostBody>;
  transactionData: Nullable<TransactionData>;
  transactionStage: TRANSACTION_STAGES;
  transactionHash: string;
  confirmedTransactionHeight: string;
  confirmTx: boolean;
  signPending: boolean;
  broadcastingTransaction: boolean;
  selectedValidatorForDelegation: Nullable<ICosmosValidator>;
}

const initialState: TransactionState = {
  transactionsPage: 1,
  liveTransactionRecord: [],
  transactionPostBody: null,
  transactionData: null,
  transactionStage: TRANSACTION_STAGES.SETUP,
  confirmedTransactionHeight: "",
  transactionHash: "",
  confirmTx: false,
  signPending: false,
  broadcastingTransaction: false,
  selectedValidatorForDelegation: null,
};

const transaction = createReducer<
  TransactionState,
  ActionTypes | LedgerActionTypes | AppActionTypes
>(initialState)
  .handleAction(Actions.setTransactionStage, (state, action) => ({
    ...state,
    transactionStage: action.payload,
  }))
  .handleAction(Actions.setTransactionData, (state, action) => ({
    ...state,
    transactionData: action.payload,
    transactionStage: TRANSACTION_STAGES.SIGN,
  }))
  .handleAction(Actions.signTransaction, (state, action) => ({
    ...state,
    signPending: true,
  }))
  .handleAction(Actions.setDelegationValidatorSelection, (state, action) => ({
    ...state,
    selectedValidatorForDelegation: action.payload,
  }))
  .handleAction(Actions.signTransactionSuccess, (state, action) => ({
    ...state,
    signPending: false,
    transactionPostBody: action.payload,
    transactionStage: TRANSACTION_STAGES.CONFIRM,
  }))
  .handleAction(Actions.signTransactionFailure, (state, action) => ({
    ...state,
    signPending: false,
  }))
  .handleAction(Actions.broadcastTransaction, (state, action) => ({
    ...state,
    broadcastingTransaction: true,
  }))
  .handleAction(Actions.setTransactionsPage, (state, action) => ({
    ...state,
    transactionsPage: action.payload,
  }))
  .handleAction(Actions.broadcastTransactionSuccess, (state, action) => ({
    ...state,
    transactionHash: action.payload,
    broadcastingTransaction: false,
    transactionStage: TRANSACTION_STAGES.PENDING,
  }))
  .handleAction(Actions.broadcastTransactionFailure, state => ({
    ...initialState,
    liveTransactionRecord: state.liveTransactionRecord,
  }))
  .handleAction(LedgerActions.setAddressSuccess, state => ({
    ...initialState,
    transactionsPage: 1,
  }))
  .handleAction(AppActions.initializeAppSuccess, (state, action) => ({
    ...initialState,
    transactionsPage: action.payload.page,
  }))
  .handleAction(Actions.transactionConfirmed, (state, action) => ({
    ...state,
    transactionPage: 1, // Reset page to 1
    confirmedTransactionHeight: action.payload.height,
    liveTransactionRecord: action.payload.transaction
      ? state.liveTransactionRecord.concat(action.payload.transaction)
      : state.liveTransactionRecord,
    transactionStage: TRANSACTION_STAGES.SUCCESS,
  }))
  .handleAction(Actions.removeLocalCopyOfTransaction, (state, action) => ({
    ...state,
    liveTransactionRecord: state.liveTransactionRecord.filter(
      tx => tx.hash !== action.payload.hash,
    ),
  }))
  .handleAction(LedgerActions.logoutSuccess, () => initialState)
  .handleAction(
    [Actions.transactionFailed, LedgerActions.closeLedgerDialog],
    state => ({
      ...initialState,
      liveTransactionRecord: state.liveTransactionRecord,
    }),
  );

/** ===========================================================================
 * Export
 * ============================================================================
 */

export type State = TransactionState;

export default transaction;
