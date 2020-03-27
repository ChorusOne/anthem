import { AvailableReward } from "components/CreateTransactionForm";
import { COIN_DENOMS, NETWORK_NAME, NetworkMetadata } from "constants/networks";
import {
  IAccountInformation,
  ITxFee,
  ITxMsg,
  ITxSignature,
  ITxValue,
} from "graphql/types";
import { LEDGER_ACTION_TYPE } from "modules/ledger/actions";
import { atomsToDenom } from "./currency-utils";
import { assertUnreachable } from "./generic-utils";
import { multiply } from "./math-utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface TransactionMetadata {
  from: string;
  chain_id: string;
  generate_only: boolean;
  fees: string;
  sequence: string;
  account_number: string;
}

export interface TransactionData {
  txMsg: ITxValue;
  txRequestMetadata: TransactionMetadata;
}

interface JsonTransaction {
  txMsg: ITxValue;
  txRequestMetadata: TransactionMetadata;
}

export interface TxPostBody {
  type: string;
  value: {
    fee: ITxFee;
    memo: string;
    msg: Maybe<ReadonlyArray<ITxMsg>>;
    signatures: ReadonlyArray<
      ITxSignature & {
        account_number: string;
        sequence: string;
        pub_key: { type: string; value: string };
      }
    >;
  };
}

/** ===========================================================================
 * Constants related to the Cosmos Network
 * ============================================================================
 */

export const COSMOS_MESSAGE_TYPES = {
  VOTE: "cosmos-sdk/MsgVote",
  DELEGATE: "cosmos-sdk/MsgDelegate",
  CLAIM: "cosmos-sdk/MsgWithdrawDelegationReward",
};

export const TERRA_MESSAGE_TYPES = {
  VOTE: "governance/MsgVote",
  DELEGATE: "staking/MsgDelegate",
  CLAIM: "distribution/MsgWithdrawDelegationReward",
};

// TODO: Implement
export const OASIS_MESSAGE_TYPES = {};

const getTransactionMessageTypeForNetwork = (
  network: NETWORK_NAME,
  transactionType: LEDGER_ACTION_TYPE,
) => {
  switch (network) {
    case "COSMOS":
    case "KAVA":
      return COSMOS_MESSAGE_TYPES[transactionType];
    case "TERRA":
      return TERRA_MESSAGE_TYPES[transactionType];
    case "OASIS":
      console.warn("[TODO]: Implement Oasis transaction types!");
      // @ts-ignore
      return OASIS_MESSAGE_TYPES[transactionType];
    default:
      return assertUnreachable(network);
  }
};

const TRANSACTION_MEMO =
  "Stake online with Chorus One at https://anthem.chorus.one";

/** ===========================================================================
 * Utils
 * ============================================================================
 */

/**
 * Create the delegation transaction message.
 */
export const createDelegationTransactionMessage = (args: {
  amount: string;
  address: string;
  gasAmount: string;
  gasPrice: string;
  denom: COIN_DENOMS;
  network: NETWORK_NAME;
  validatorOperatorAddress: string;
}): ITxValue => {
  const {
    denom,
    amount,
    network,
    address,
    gasPrice,
    gasAmount,
    validatorOperatorAddress,
  } = args;

  const type = getTransactionMessageTypeForNetwork(network, "DELEGATE");

  return {
    fee: {
      amount: [
        {
          denom,
          amount: multiply(gasAmount, gasPrice, String),
        },
      ],
      gas: gasAmount,
    },
    signatures: null,
    memo: TRANSACTION_MEMO,
    msg: [
      {
        type,
        value: {
          delegator_address: address,
          validator_address: validatorOperatorAddress,
          amount: {
            denom,
            amount: atomsToDenom(amount, String),
          },
        },
      },
    ],
  };
};

/**
 * Create the rewards claim transaction message.
 */
export const createRewardsClaimTransaction = (args: {
  address: string;
  gasAmount: string;
  gasPrice: string;
  selectedRewards: ReadonlyArray<AvailableReward>;
  denom: COIN_DENOMS;
  network: NETWORK_NAME;
}): ITxValue => {
  const {
    denom,
    network,
    address,
    gasPrice,
    gasAmount,
    selectedRewards,
  } = args;

  const type = getTransactionMessageTypeForNetwork(network, "CLAIM");

  return {
    fee: {
      amount: [
        {
          denom,
          amount: multiply(gasAmount, gasPrice, String),
        },
      ],
      gas: gasAmount,
    },
    signatures: null,
    memo: TRANSACTION_MEMO,
    msg: selectedRewards.map(reward => {
      return {
        type,
        value: {
          delegator_address: address,
          validator_address: reward.validator_address,
        },
      };
    }),
  };
};

/**
 * Get the request metadata object for a transaction.
 */
export const createTransactionRequestMetadata = (args: {
  address: string;
  account: IAccountInformation;
  gasAmount: string;
  gasPrice: string;
  network: NetworkMetadata;
}): TransactionMetadata => {
  const { address, network, account, gasAmount, gasPrice } = args;
  const { value: accountValue } = account;

  return {
    from: address,
    chain_id: network.chainId,
    generate_only: false,
    fees: multiply(gasPrice, gasAmount, String),
    sequence: String(accountValue.sequence),
    account_number: String(accountValue.account_number),
  };
};

/**
 * Get the request metadata object for a transaction.
 */
export const createCosmosTransactionPostBody = (args: {
  transactionData: JsonTransaction;
  signature: string;
  publicKey: string;
}): TxPostBody => {
  const { transactionData, signature, publicKey } = args;
  const { txRequestMetadata } = transactionData;

  return {
    // TODO: Works for any network?
    type: "cosmos-sdk/StdTx",
    value: {
      ...transactionData.txMsg,
      signatures: [
        {
          signature,
          account_number: txRequestMetadata.account_number,
          sequence: txRequestMetadata.sequence,
          pub_key: {
            type: "tendermint/PubKeySecp256k1",
            value: publicKey,
          },
        },
      ],
      memo: TRANSACTION_MEMO,
    },
  };
};
