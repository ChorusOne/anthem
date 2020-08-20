import {
  assertUnreachable,
  COIN_DENOMS,
  ICosmosTransaction,
  ILogMessage,
  IMsgBeginRedelegate,
  IMsgDelegate,
  IMsgModifyWithdrawAddress,
  IMsgSend,
  IMsgSubmitProposal,
  IMsgVote,
  IMsgWithdrawDelegationReward,
  IMsgWithdrawValidatorCommission,
} from "@anthem/utils";
import * as Sentry from "@sentry/browser";
import { formatAddressString } from "./client-utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

export enum COSMOS_TRANSACTION_TYPES {
  SEND = "cosmos-sdk/MsgSend",
  RECEIVE = "custom-receive-transaction-type",
  VOTE = "cosmos-sdk/MsgVote",
  DELEGATE = "cosmos-sdk/MsgDelegate",
  UNDELEGATE = "cosmos-sdk/MsgUndelegate",
  SUBMIT_PROPOSAL = "cosmos-sdk/MsgSubmitProposal",
  BEGIN_REDELEGATE = "cosmos-sdk/MsgBeginRedelegate",
  CLAIM_REWARDS = "cosmos-sdk/MsgWithdrawDelegationReward",
  CLAIM_COMMISSION = "cosmos-sdk/MsgWithdrawValidatorCommission",
  CREATE_VALIDATOR = "cosmos-sdk/MsgCreateValidator",
  EDIT_VALIDATOR = "cosmos-sdk/MsgEditValidator",
  MODIFY_WITHDRAW_ADDRESS = "cosmos-sdk/MsgModifyWithdrawAddress",
}

// WIP: Work in progress.
export enum TERRA_TRANSACTION_TYPES {
  SEND = "bank/MsgSend",
  MULTI_SEND = "bank/MsgMultiSend",
  RECEIVE = "custom-receive-transaction-type",
  DELEGATE = "staking/MsgDelegate",
  UNDELEGATE = "staking/MsgUndelegate",
  REDELEGATE = "staking/MsgBeginRedelegate",
  GOVERNANCE_DEPOSIT = "gov/MsgDeposit",
  DELEGATE_FEED_CONSENT = "oracle/MsgDelegateFeedConsent",
  WITHDRAW_REWARD = "distribution/MsgWithdrawDelegationReward",
  WITHDRAW_COMMISSION = "distribution/MsgWithdrawValidatorCommission",
  EXCHANGE_RATE_VOTE = "oracle/MsgExchangeRateVote",
  EXCHANGE_RATE_PRE_VOTE = "oracle/MsgExchangeRatePrevote",
}

export enum TRANSACTION_STAGES {
  "SETUP" = "SETUP",
  "SIGN" = "SIGN",
  "CONFIRM" = "CONFIRM",
  "PENDING" = "PENDING",
  "SUCCESS" = "SUCCESS",
}

export interface CosmosBalance {
  amount: string;
  denom: string;
}

export type CosmosTransactionFee = Nullable<CosmosBalance>;

export interface TransactionItemData {
  type: COSMOS_TRANSACTION_TYPES;
  timestamp: string;
  amount: Nullable<CosmosBalance>;
  fee: CosmosTransactionFee;
  toAddress: string;
  fromAddress: string;
}

export interface GovernanceVoteMessageData {
  fee: CosmosTransactionFee;
  option: string;
  proposal_id: string;
  timestamp: string;
  type: COSMOS_TRANSACTION_TYPES.VOTE;
}

export interface GovernanceSubmitProposalMessageData {
  fee: CosmosTransactionFee;
  title: string;
  deposit: Nullable<CosmosBalance>;
  proposer: string;
  timestamp: string;
  description: string;
  type: COSMOS_TRANSACTION_TYPES.SUBMIT_PROPOSAL;
}

export interface ValidatorCreateOrEditMessageData {
  fee: CosmosTransactionFee;
  type: COSMOS_TRANSACTION_TYPES;
  timestamp: string;
  delegatorAddress: string;
  validatorAddress: string;
}

export interface ValidatorModifyWithdrawAddressMessageData {
  fee: CosmosTransactionFee;
  type: COSMOS_TRANSACTION_TYPES;
  timestamp: string;
  withdrawAddress: string;
  validatorAddress: string | null;
}

export type CosmosTransactionItemData =
  | TransactionItemData
  | GovernanceVoteMessageData
  | GovernanceSubmitProposalMessageData
  | ValidatorCreateOrEditMessageData
  | ValidatorModifyWithdrawAddressMessageData;

/** ===========================================================================
 * Utils
 * ============================================================================
 */

// Get all failed logs in a log message.
const getFailedLogs = (logs: Array<Maybe<ILogMessage>>) => {
  return logs.filter(log => log && !log.success);
};

// Determine if a transaction failed and return the log message.
export const getTransactionFailedLogMessage = (
  transaction: ICosmosTransaction,
): Nullable<string> => {
  try {
    const { log } = transaction;
    if (Array.isArray(log)) {
      const failedLogs = getFailedLogs(log);
      const firstLog = failedLogs[0];
      if (firstLog) {
        const maybeLogMessage = JSON.parse(firstLog.message || "");
        const { message } = maybeLogMessage;
        return message || null;
      } else {
        return "";
      }
    }
  } catch (err) {
    /* Do nothing */
  }

  return null;
};

const getTxAmount = (
  transaction: ICosmosTransaction,
  msgIndex: number,
): Nullable<CosmosBalance> => {
  const txMsg = transaction.msgs[msgIndex].value as IMsgSend;

  if (txMsg && txMsg.amounts) {
    return txMsg.amounts[0];
    // @ts-ignore
  } else if (txMsg && txMsg.amount) {
    // @ts-ignore
    txMsg.amount.amount.replace(",", "");
    // @ts-ignore
    return txMsg.amount;
  } else {
    return null;
  }
};

export const getTxFee = (
  transaction: ICosmosTransaction,
): CosmosTransactionFee => {
  const { fees } = transaction;
  const { amount } = fees;

  if (amount) {
    return amount[0];
  } else {
    return null;
  }
};

// Send transaction type.
const getTransactionSendMessage = (
  transaction: ICosmosTransaction,
  address: string,
  msgIndex: number,
): TransactionItemData => {
  const { from_address, to_address } = transaction.msgs[msgIndex]
    .value as IMsgSend;
  const fee = getTxFee(transaction);
  const amount = getTxAmount(transaction, msgIndex);
  const toAddress = to_address || "";
  const fromAddress = from_address || "";

  const IS_SEND = fromAddress === address;

  return {
    fee,
    amount,
    toAddress,
    fromAddress,
    type: IS_SEND
      ? (transaction.msgs[0].type as COSMOS_TRANSACTION_TYPES)
      : COSMOS_TRANSACTION_TYPES.RECEIVE,
    timestamp: transaction.timestamp,
  };
};

// Delegate transaction type.
const getDelegationTransactionMessage = (
  transaction: ICosmosTransaction,
  msgIndex: number,
): TransactionItemData => {
  const msg = transaction.msgs[msgIndex];
  const fee = getTxFee(transaction);
  const vote = msg.value as IMsgDelegate;
  const { amount, delegator_address, validator_address } = vote;

  const delegationAmount = amount ? amount : null;
  const toAddress = validator_address || "";
  const fromAddress = delegator_address || "";

  return {
    fee,
    toAddress,
    fromAddress,
    amount: delegationAmount,
    timestamp: transaction.timestamp,
    type: COSMOS_TRANSACTION_TYPES.DELEGATE,
  };
};

// Rewards claim transaction type.
const getClaimRewardsMessageData = (
  transaction: ICosmosTransaction,
  msgIndex: number,
  denom: COIN_DENOMS,
): TransactionItemData => {
  const { tags } = transaction;
  const msg = transaction.msgs[msgIndex];

  const { type, value } = msg;
  const {
    validator_address,
    delegator_address,
  } = value as IMsgWithdrawDelegationReward;

  let rewards: Nullable<string> = null;

  if (tags) {
    const rewardTags = tags.filter(tag => {
      return tag.key === "rewards";
    });

    /* Get the same tag as the msgIndex...¿ */
    const rewardTag = rewardTags[msgIndex];

    if (rewardTag && rewardTag.value) {
      // Replace denom and other non numbers:
      rewards = rewardTag.value.replace(denom, "");
      rewards = rewards.replace(/[^\d]/g, "");
    }
  }

  const fee = getTxFee(transaction);
  const validatorAddress = validator_address || "";
  const delegatorAddress = delegator_address || "";

  return {
    fee,
    amount: { amount: rewards || "0", denom },
    toAddress: delegatorAddress,
    fromAddress: validatorAddress,
    timestamp: transaction.timestamp,
    type: type as COSMOS_TRANSACTION_TYPES,
  };
};

// Commissions claim transaction type.
const getValidatorClaimRewardsMessageData = (
  transaction: ICosmosTransaction,
  msgIndex: number,
  denom: COIN_DENOMS,
): TransactionItemData => {
  const { tags } = transaction;
  const msg = transaction.msgs[msgIndex];

  const { type, value } = msg;
  const { validator_address } = value as IMsgWithdrawValidatorCommission;

  let commissions: Nullable<string> = null;

  if (tags) {
    const commissionsTag = tags.filter(
      tag => tag.key === "commission" && Boolean(tag.value),
    );

    if (commissionsTag.length && commissionsTag[0].value) {
      // Replace denom and other non numbers:
      commissions = commissionsTag[0].value.replace(denom, "");
      commissions = commissions.replace(/[^\d]/g, "");
    }
  }

  const fee = getTxFee(transaction);
  const validatorAddress = validator_address || "";

  return {
    fee,
    toAddress: "",
    amount: { amount: commissions || "0", denom },
    fromAddress: validatorAddress,
    timestamp: transaction.timestamp,
    type: type as COSMOS_TRANSACTION_TYPES,
  };
};

// Undelegate transaction type.
const getUndelegateMessage = (
  transaction: ICosmosTransaction,
  msgIndex: number,
): TransactionItemData => {
  const msg = transaction.msgs[msgIndex];
  let undelegateAmount = null;

  let delegatorAddress = "";
  let validatorAddress = "";

  if (msg) {
    const value = msg.value as IMsgDelegate;
    const { amount } = value as IMsgDelegate;
    undelegateAmount = amount;

    delegatorAddress = value.delegator_address || "";
    validatorAddress = value.validator_address || "";
  }

  const fee = getTxFee(transaction);

  return {
    fee,
    amount: undelegateAmount,
    toAddress: formatAddressString(delegatorAddress, true),
    fromAddress: formatAddressString(validatorAddress, true),
    timestamp: transaction.timestamp,
    type: COSMOS_TRANSACTION_TYPES.UNDELEGATE,
  };
};

// Redelegate transaction type.
const getRedelegateMessageData = (
  transaction: ICosmosTransaction,
  msgIndex: number,
): TransactionItemData => {
  const msg = transaction.msgs[msgIndex];

  const fee = getTxFee(transaction);
  const { value } = msg;
  const {
    amount,
    validator_src_address,
    validator_dst_address,
  } = value as IMsgBeginRedelegate;

  let redelegateAmount = null;

  if (amount) {
    redelegateAmount = amount;
  }

  return {
    fee,
    amount: redelegateAmount,
    timestamp: transaction.timestamp,
    fromAddress: validator_src_address,
    toAddress: validator_dst_address,
    type: COSMOS_TRANSACTION_TYPES.BEGIN_REDELEGATE,
  };
};

// Vote transaction type.
const getGovernanceVoteMessage = (
  transaction: ICosmosTransaction,
  msgIndex: number,
): GovernanceVoteMessageData => {
  const { timestamp } = transaction;
  const msg = transaction.msgs[msgIndex];

  const fee = getTxFee(transaction);
  const vote = msg.value as IMsgVote;
  const { option, proposal_id } = vote;

  return {
    option,
    fee,
    timestamp,
    proposal_id,
    type: COSMOS_TRANSACTION_TYPES.VOTE,
  };
};

// Submit Governance Proposal transaction type.
const getGovernanceSubmitProposalMessage = (
  transaction: ICosmosTransaction,
  msgIndex: number,
): GovernanceSubmitProposalMessageData => {
  const { timestamp } = transaction;
  const msg = transaction.msgs[msgIndex];

  const fee = getTxFee(transaction);
  const proposal = msg.value as IMsgSubmitProposal;
  const { title, description, proposer, initial_deposit } = proposal;
  const deposit = initial_deposit ? initial_deposit[0] : null;

  return {
    fee,
    title,
    deposit,
    proposer,
    timestamp,
    description,
    type: COSMOS_TRANSACTION_TYPES.SUBMIT_PROPOSAL,
  };
};

// Validator create or edit message.
const getValidatorCreateOrEditMessage = (
  transaction: ICosmosTransaction,
  msgIndex: number,
): ValidatorCreateOrEditMessageData => {
  const msg = transaction.msgs[msgIndex];
  const fee = getTxFee(transaction);
  const value = msg.value as IMsgWithdrawDelegationReward;
  const { delegator_address, validator_address } = value;

  const delegatorAddress = delegator_address || "";
  const validatorAddress = validator_address || "";

  return {
    fee,
    delegatorAddress,
    validatorAddress,
    timestamp: transaction.timestamp,
    type: COSMOS_TRANSACTION_TYPES.CREATE_VALIDATOR,
  };
};

// Validator modify withdraw address message.
const getChangeWithdrawAddressMessage = (
  transaction: ICosmosTransaction,
  msgIndex: number,
): ValidatorModifyWithdrawAddressMessageData => {
  const msg = transaction.msgs[msgIndex];
  const fee = getTxFee(transaction);
  const value = msg.value as IMsgModifyWithdrawAddress;
  const { withdraw_address, validator_address } = value;

  const withdrawAddress = withdraw_address || "";
  const validatorAddress = validator_address;

  return {
    fee,
    withdrawAddress,
    validatorAddress,
    timestamp: transaction.timestamp,
    type: COSMOS_TRANSACTION_TYPES.MODIFY_WITHDRAW_ADDRESS,
  };
};

/**
 * Primary method to handle converting a transaction to the relevant data
 * and text to render.
 */
export const transformCosmosTransactionToRenderElements = ({
  address,
  transaction,
  msgIndex,
  denom,
}: {
  address: string;
  msgIndex: number;
  denom: COIN_DENOMS;
  transaction: ICosmosTransaction;
}): CosmosTransactionItemData | null => {
  const IS_COSMOS = transaction.chain.includes("cosmos");

  if (IS_COSMOS) {
    const TX_TYPE = transaction.msgs[msgIndex].type as COSMOS_TRANSACTION_TYPES;

    switch (TX_TYPE) {
      // NOTE: Receive is not a real type
      case COSMOS_TRANSACTION_TYPES.RECEIVE:
      case COSMOS_TRANSACTION_TYPES.SEND: {
        return getTransactionSendMessage(transaction, address, msgIndex);
      }

      case COSMOS_TRANSACTION_TYPES.DELEGATE: {
        return getDelegationTransactionMessage(transaction, msgIndex);
      }

      case COSMOS_TRANSACTION_TYPES.VOTE: {
        return getGovernanceVoteMessage(transaction, msgIndex);
      }

      case COSMOS_TRANSACTION_TYPES.UNDELEGATE: {
        return getUndelegateMessage(transaction, msgIndex);
      }

      case COSMOS_TRANSACTION_TYPES.SUBMIT_PROPOSAL: {
        return getGovernanceSubmitProposalMessage(transaction, msgIndex);
      }

      case COSMOS_TRANSACTION_TYPES.BEGIN_REDELEGATE: {
        return getRedelegateMessageData(transaction, msgIndex);
      }

      case COSMOS_TRANSACTION_TYPES.CLAIM_REWARDS: {
        return getClaimRewardsMessageData(transaction, msgIndex, denom);
      }

      case COSMOS_TRANSACTION_TYPES.CLAIM_COMMISSION: {
        return getValidatorClaimRewardsMessageData(
          transaction,
          msgIndex,
          denom,
        );
      }

      case COSMOS_TRANSACTION_TYPES.CREATE_VALIDATOR: {
        return getValidatorCreateOrEditMessage(transaction, msgIndex);
      }

      case COSMOS_TRANSACTION_TYPES.EDIT_VALIDATOR: {
        return getValidatorCreateOrEditMessage(transaction, msgIndex);
      }

      case COSMOS_TRANSACTION_TYPES.MODIFY_WITHDRAW_ADDRESS: {
        return getChangeWithdrawAddressMessage(transaction, msgIndex);
      }

      default:
        return assertUnreachable(TX_TYPE);
    }
  } else {
    const TX_TYPE = transaction.msgs[msgIndex].type as TERRA_TRANSACTION_TYPES;

    switch (TX_TYPE) {
      // NOTE: Receive is not a real type
      case TERRA_TRANSACTION_TYPES.SEND:
      case TERRA_TRANSACTION_TYPES.MULTI_SEND:
      case TERRA_TRANSACTION_TYPES.RECEIVE: {
        return getTransactionSendMessage(transaction, address, msgIndex);
      }

      case TERRA_TRANSACTION_TYPES.DELEGATE: {
        return getDelegationTransactionMessage(transaction, msgIndex);
      }
      case TERRA_TRANSACTION_TYPES.UNDELEGATE: {
        return getUndelegateMessage(transaction, msgIndex);
      }

      case TERRA_TRANSACTION_TYPES.REDELEGATE: {
        return getRedelegateMessageData(transaction, msgIndex);
      }

      case TERRA_TRANSACTION_TYPES.WITHDRAW_REWARD: {
        return getClaimRewardsMessageData(transaction, msgIndex, denom);
      }

      case TERRA_TRANSACTION_TYPES.WITHDRAW_COMMISSION: {
        return getValidatorClaimRewardsMessageData(
          transaction,
          msgIndex,
          denom,
        );
      }

      case TERRA_TRANSACTION_TYPES.GOVERNANCE_DEPOSIT:
      case TERRA_TRANSACTION_TYPES.DELEGATE_FEED_CONSENT:
      case TERRA_TRANSACTION_TYPES.EXCHANGE_RATE_VOTE:
      case TERRA_TRANSACTION_TYPES.EXCHANGE_RATE_PRE_VOTE:
      default:
        Sentry.captureException(
          `Unhandled Terra transaction type ${TX_TYPE} for address: ${address}`,
        );
        return null;
    }
  }
};
