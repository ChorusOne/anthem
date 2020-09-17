import {
  ICeloValidatorGroup,
  ICosmosTransaction,
  ICosmosValidator,
} from "@anthem/utils";
import { PendingWithdrawal } from "@celo/contractkit/lib/wrappers/LockedGold";
import { ICeloTransactionResult } from "lib/celo-ledger-lib";
import { TRANSACTION_STAGES } from "tools/cosmos-transaction-utils";
import { TransactionData, TxPostBody } from "tools/cosmos-utils";
import { createReducer } from "typesafe-actions";
import { GenericCeloProposal } from "ui/governance/CeloGovernancePage";
import AppActions, { ActionTypes as AppActionTypes } from "../app/actions";
import LedgerActions, {
  ActionTypes as LedgerActionTypes,
} from "../ledger/actions";
import Actions, { ActionTypes } from "./actions";

/** ===========================================================================
 * Address Reducer
 * ============================================================================
 */

export type Vote = "Yes" | "No" | "Abstain";

export interface GovernanceVoteDetails {
  vote: Nullable<Vote>;
  proposal: GenericCeloProposal;
}

export interface TransactionState {
  transactionsPage: number;
  liveTransactionRecord: ICosmosTransaction[];
  transactionPostBody: Nullable<TxPostBody>;
  transactionData: Nullable<TransactionData | any>;
  transactionStage: TRANSACTION_STAGES;
  transactionHash: string;
  confirmTx: boolean;
  signPending: boolean;
  transactionResult: Nullable<ICosmosTransaction | ICeloTransactionResult>;
  governanceProposalData: Nullable<GovernanceVoteDetails>;
  broadcastingTransaction: boolean;
  selectedValidatorForDelegation: Nullable<
    ICosmosValidator | ICeloValidatorGroup
  >;
  celoPendingWithdrawalData?: PendingWithdrawal[];
}

const initialState: TransactionState = {
  transactionsPage: 1,
  liveTransactionRecord: [],
  transactionPostBody: null,
  transactionData: null,
  transactionStage: TRANSACTION_STAGES.SETUP,
  transactionHash: "",
  transactionResult: null,
  confirmTx: false,
  signPending: false,
  broadcastingTransaction: false,
  selectedValidatorForDelegation: null,
  governanceProposalData: null,
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
  .handleAction(Actions.setGovernanceVoteDetails, (state, action) => ({
    ...state,
    governanceProposalData: action.payload,
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
    transactionResult: action.payload,
    // TODO: Refactor to ignore action.payload for non-Cosmos blockchains
    // liveTransactionRecord: action.payload.transaction
    //   ? state.liveTransactionRecord.concat(action.payload.transaction)
    //   : state.liveTransactionRecord,
    transactionStage: TRANSACTION_STAGES.SUCCESS,
  }))
  .handleAction(Actions.removeLocalCopyOfTransaction, (state, action) => ({
    ...state,
    liveTransactionRecord: state.liveTransactionRecord.filter(
      tx => tx.hash !== action.payload.hash,
    ),
  }))
  .handleAction(Actions.setCeloPendingWithdrawalData, (state, action) => ({
    ...state,
    celoPendingWithdrawalData: action.payload,
  }))
  .handleAction(LedgerActions.logoutSuccess, () => initialState)
  .handleAction(
    [Actions.transactionFailed, LedgerActions.closeLedgerDialog],
    state => ({
      ...initialState,
      liveTransactionRecord: state.liveTransactionRecord,
      celoPendingWithdrawalData: state.celoPendingWithdrawalData,
    }),
  );

/** ===========================================================================
 * Export
 * ============================================================================
 */

export type State = TransactionState;

export default transaction;
