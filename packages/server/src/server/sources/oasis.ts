import {
  IOasisTransaction,
  IOasisTransactionType,
  IQuery,
  NetworkDefinition,
} from "@anthem/utils";
import { AxiosUtil, getHostFromNetworkName } from "../axios-utils";

/** ===========================================================================
 * Oasis REST API Utils
 * ----------------------------------------------------------------------------
 * This file contains REST API utils for fetching data using the Oasis
 * blockchain APIs.
 * ============================================================================
 */

interface OasisDelegation {
  delegator: string;
  validator: string;
  amount: string;
}

interface OasisAccountResponse {
  address: string;
  balance: string;
  height: number;
  delegations: OasisDelegation[];
  meta: {
    is_validator: boolean;
    is_delegator: boolean;
  };
}

/**
 * Fetch Oasis account balances.
 */
const fetchAccountBalances = async (
  address: string,
  network: NetworkDefinition,
): Promise<IQuery["accountBalances"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get<OasisAccountResponse>(
    `${host}/account/${address}`,
  );

  return {
    balance: [
      {
        denom: "oasis",
        amount: response.balance,
      },
    ],
    rewards: [],
    delegations: response.delegations.map(d => ({
      delegator_address: d.delegator,
      validator_address: d.validator,
      shares: d.amount,
    })),
    unbonding: [],
    commissions: [],
  };
};

interface TxBurn {
  owner: string;
  tokens: string;
}

interface TxEscrow {
  add?: {
    owner: string;
    escrow: string;
    tokens: string;
  };
  take?: {
    owner: string;
    tokens: string;
  };
  reclaim?: {
    owner: string;
    escrow: string;
    tokens: string;
  };
}

interface TxTransfer {
  to: string;
  from: string;
  tokens: string;
}

interface OasisTransaction {
  date: string;
  height?: string;
  escrow?: TxEscrow;
  burn?: TxBurn;
  transfer?: TxTransfer;
}

const adaptOasisTransaction = (
  tx: OasisTransaction,
): Nullable<IOasisTransaction> => {
  if (!!tx.burn) {
    // BURN Transaction
    return {
      height: 1,
      date: tx.date,
      type: IOasisTransactionType.Burn,
      data: {
        owner: tx.burn.owner,
        tokens: tx.burn.tokens,
      },
    };
  } else if (!!tx.transfer) {
    // TRANSFER Transaction
    return {
      height: 1,
      date: tx.date,
      type: IOasisTransactionType.Transfer,
      data: {
        to: tx.transfer.to,
        from: tx.transfer.from,
        tokens: tx.transfer.tokens,
      },
    };
  } else if (!!tx.escrow) {
    // ESCROW Transactions
    const { escrow } = tx;
    if (!!escrow.add) {
      // ESCROW ADD Transaction
      return {
        height: 1,
        date: tx.date,
        type: IOasisTransactionType.EscrowAdd,
        data: {
          owner: escrow.add.owner,
          escrow: escrow.add.escrow,
          tokens: escrow.add.tokens,
        },
      };
    } else if (!!escrow.take) {
      // ESCROW TAKE Transaction
      return {
        height: 1,
        date: tx.date,
        type: IOasisTransactionType.EscrowTake,
        data: {
          owner: escrow.take.owner,
          tokens: escrow.take.tokens,
        },
      };
    } else if (!!escrow.reclaim) {
      // ESCROW RECLAIM Transaction
      return {
        height: 1,
        date: tx.date,
        type: IOasisTransactionType.EscrowReclaim,
        data: {
          owner: escrow.reclaim.owner,
          escrow: escrow.reclaim.escrow,
          tokens: escrow.reclaim.tokens,
        },
      };
    }
  }

  // Unrecognized transaction data -
  return null;
};

const fetchTransactions = async (
  address: string,
  pageSize: number,
  startingPage: number,
  network: NetworkDefinition,
): Promise<IQuery["oasisTransactions"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get<OasisTransaction[]>(
    `${host}/account/${address}/events`,
  );

  // Transform the response data
  const convertedTransactions = response
    .map(adaptOasisTransaction)
    .filter(x => x !== null) as IOasisTransaction[];

  return {
    page: 1,
    limit: 25,
    moreResultsExist: true,
    data: convertedTransactions,
  };
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

const OASIS = {
  fetchAccountBalances,
  fetchTransactions,
};

export default OASIS;
