import {
  assertUnreachable,
  IOasisAccountBalances,
  IOasisTransaction,
  IOasisTransactionType,
  IQuery,
  NetworkDefinition,
} from "@anthem/utils";
import { PaginationParams } from "../resolvers/resolvers";
import { AxiosUtil, getHostFromNetworkName } from "../tools/axios-utils";
import { logSentryMessage } from "../tools/server-utils";

/** ===========================================================================
 * Types & Config
 * ----------------------------------------------------------------------------
 * Reference:
 * - https://github.com/ChorusOne/Hippias/blob/master/pkg/oasis/types.go
 * ============================================================================
 */

interface OasisDelegation {
  delegator: string;
  validator: string;
  amount: string;
}

interface Balance {
  balance: string;
  shares: string;
}

interface OasisAccountResponse {
  height: number;
  address: string;
  balance: string;
  staked_balance: Balance;
  debonding_balance: Balance;
  delegations: OasisDelegation[];
  meta: AccountMeta;
}

interface OasisAccountHistory {
  date: string;
  height: number;
  address: string;
  balance: string;
  rewards: string;
  staked_balance: Balance;
  debonding_balance: Balance;
  delegations: OasisDelegation[];
  meta: AccountMeta;
}

interface AccountMeta {
  is_validator: boolean;
  is_delegator: boolean;
}

enum OasisTransactionMethod {
  TRANSFER = "staking.Transfer",
  BURN = "staking.Burn",
  ADD_ESCROW = "staking.AddEscrow",
  RECLAIM_ESCROW = "staking.ReclaimEscrow",
  TAKE_ESCROW = "staking.TakeEscrow",
  REGISTER_ENTITY = "registry.RegisterEntity",
  REGISTER_NODE = "registry.RegisterNode",
  DE_REGISTER_ENTITY = "staking.DeregisterEntity",
  UN_FREEZE_NODE = "staking.UnfreezeNode",
  RATE = "staking.Rate",
  BOUND = "staking.Bound",
  REGISTER_RUNTIME = "staking.RegisterRuntime",
  AMEND_COMMISSION_SCHEDULE = "staking.AmendCommissionSchedule",
  UNKNOWN_METHOD = "UnknownMethod",
}

interface OasisTransactionBase {
  hash: string;
  fee: string;
  gas: number;
  gas_price: string;
  height: number;
  sender: string;
  method: OasisTransactionMethod;
  date: string;
}

interface TxTransfer extends OasisTransactionBase {
  method: OasisTransactionMethod.TRANSFER;
  data: {
    from: string;
    to: string;
    tokens: string;
  };
}

interface TxAddEscrow extends OasisTransactionBase {
  method: OasisTransactionMethod.ADD_ESCROW;
  data: {
    to: string;
    tokens: string;
  };
}

interface TxTakeEscrow extends OasisTransactionBase {
  method: OasisTransactionMethod.TAKE_ESCROW;
  data: {
    from: string;
    to: string;
    tokens: string;
  };
}

interface TxReclaimEscrow extends OasisTransactionBase {
  method: OasisTransactionMethod.RECLAIM_ESCROW;
  data: {
    from: string;
    shares: string;
  };
}

interface TxBurn extends OasisTransactionBase {
  method: OasisTransactionMethod.BURN;
  data: {
    owner: string;
    tokens: string;
  };
}

interface TxRegisterNode extends OasisTransactionBase {
  method: OasisTransactionMethod.REGISTER_NODE;
  data: {
    id: string;
    entity_id: string;
    expiration: number;
  };
}

interface TxRegisterEntity extends OasisTransactionBase {
  method: OasisTransactionMethod.REGISTER_ENTITY;
  data: {
    id: string;
    nodes: string[];
    allow_entity_signed_nodes: boolean;
  };
}

interface TxDeregisterEntity extends OasisTransactionBase {
  method: OasisTransactionMethod.DE_REGISTER_ENTITY;
  data: {
    id: string;
    nodes: string[];
    allow_entity_signed_nodes: boolean;
  };
}

interface TxUnfreezeNode extends OasisTransactionBase {
  method: OasisTransactionMethod.UN_FREEZE_NODE;
  data: {
    id: string;
  };
}

interface TxRate extends OasisTransactionBase {
  method: OasisTransactionMethod.RATE;
  data: {
    start: string;
    rate: string;
  };
}

interface TxBound extends OasisTransactionBase {
  method: OasisTransactionMethod.BOUND;
  data: {
    start: string;
    rate_min: string;
    rate_max: string;
  };
}

interface TxRegisterRuntime extends OasisTransactionBase {
  method: OasisTransactionMethod.REGISTER_RUNTIME;
  data: {
    id: string;
    version: string;
  };
}

interface TxAmendCommissionSchedule extends OasisTransactionBase {
  method: OasisTransactionMethod.AMEND_COMMISSION_SCHEDULE;
  data: {
    rates: string[];
    bounds: string[];
  };
}

interface TxUnknownMethod extends OasisTransactionBase {
  method: OasisTransactionMethod.UNKNOWN_METHOD;
  data: {
    method_name: string;
  };
}

type OasisTransaction =
  | TxBurn
  | TxTransfer
  | TxAddEscrow
  | TxTakeEscrow
  | TxReclaimEscrow
  | TxRegisterNode
  | TxRegisterEntity
  | TxDeregisterEntity
  | TxUnfreezeNode
  | TxRate
  | TxBound
  | TxRegisterRuntime
  | TxAmendCommissionSchedule
  | TxUnknownMethod;

/** ===========================================================================
 * Oasis REST API Utils
 * ----------------------------------------------------------------------------
 * This file contains the utils for fetching Oasis Network data.
 * ============================================================================
 */

const ZeroBalance: IOasisAccountBalances = {
  available: "0",
  staked: { balance: "0", shares: "0" },
  unbonding: { balance: "0", shares: "0" },
  rewards: "0",
  commissions: "0",
  meta: {
    is_validator: false,
    is_delegator: false,
  },
  delegations: [],
};

/**
 * Fetch Oasis account balances.
 */
const fetchAccountBalances = async (
  address: string,
  network: NetworkDefinition,
): Promise<IOasisAccountBalances> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get<OasisAccountResponse>(
    `${host}/account/${address}`,
  );

  // No balances, default to zero:
  if (!response) {
    return ZeroBalance;
  }

  const {
    meta,
    balance,
    staked_balance,
    debonding_balance,
    delegations,
  } = response;

  const balances = {
    available: balance,
    staked: staked_balance,
    unbonding: debonding_balance,
    rewards: "0",
    commissions: "0",
    meta,
    delegations,
  };

  return balances;
};

/**
 * Fetch account history.
 */
const fetchAccountHistory = async (
  address: string,
  network: NetworkDefinition,
): Promise<IQuery["oasisAccountHistory"]> => {
  const host = getHostFromNetworkName(network.name);
  const url = `${host}/account/${address}/history`;
  const response = await AxiosUtil.get<OasisAccountHistory[]>(url);
  return response;
};

/**
 * Fetch transaction history.
 */
const fetchTransactions = async (
  args: PaginationParams,
): Promise<IQuery["oasisTransactions"]> => {
  const { address, network, startingPage, pageSize } = args;
  const host = getHostFromNetworkName(network.name);
  const params = `limit=${pageSize + 1}&page=${startingPage}`;
  const url = `${host}/account/${address}/transactions?${params}`;
  const response = await AxiosUtil.get<OasisTransaction[]>(url);
  const pages = Array.isArray(response) ? response.slice(0, pageSize) : [];
  const moreResultsExist = response.length > pageSize;

  // Transform the response data
  const convertedTransactions = pages
    .map(x => adaptOasisTransaction(x, address))
    .filter(x => x !== null) as IOasisTransaction[];

  return {
    limit: pageSize,
    page: startingPage,
    moreResultsExist,
    data: convertedTransactions,
  };
};

/**
 * Fetch a transaction by hash.
 */
const fetchTransaction = async (hash: string): Promise<IOasisTransaction> => {
  const host = getHostFromNetworkName("OASIS");
  const url = `${host}/transaction?hash=${hash}`;
  const response = await AxiosUtil.get<OasisTransaction>(url);

  if (!response) {
    throw new Error(`No transaction found for hash: ${hash}`);
  }

  const result = adaptOasisTransaction(response, "");
  if (result) {
    return result;
  } else {
    throw new Error(`No transaction found for hash: ${hash}`);
  }
};

/**
 * Fetch network summary stats for Oasis.
 */
const fetchNetworkSummaryStats = async () => {
  return {
    inflation: null,
    expectedReward: null,
    totalSupply: null,
  };
};

/** ===========================================================================
 * Utils
 * ============================================================================
 */

/**
 * Map the transaction type onto the transaction data.
 */
const combineWithType = (
  transaction: OasisTransaction,
  type: IOasisTransactionType,
) => {
  const result: IOasisTransaction = {
    ...transaction,
    data: { ...transaction.data, type },
  };

  return result;
};

/**
 * Transform the original transaction records to match the GraphQL schema
 * definition.
 */
const adaptOasisTransaction = (
  tx: OasisTransaction,
  address: string,
): IOasisTransaction | null => {
  const { method } = tx;

  switch (method) {
    case OasisTransactionMethod.TRANSFER: {
      return combineWithType(tx, IOasisTransactionType.Transfer);
    }
    case OasisTransactionMethod.ADD_ESCROW: {
      return combineWithType(tx, IOasisTransactionType.EscrowAdd);
    }
    case OasisTransactionMethod.RECLAIM_ESCROW: {
      return combineWithType(tx, IOasisTransactionType.EscrowReclaim);
    }
    case OasisTransactionMethod.TAKE_ESCROW: {
      return combineWithType(tx, IOasisTransactionType.EscrowTake);
    }
    case OasisTransactionMethod.BURN: {
      return combineWithType(tx, IOasisTransactionType.Burn);
    }
    case OasisTransactionMethod.REGISTER_NODE: {
      return combineWithType(tx, IOasisTransactionType.RegisterNode);
    }
    case OasisTransactionMethod.REGISTER_ENTITY: {
      return combineWithType(tx, IOasisTransactionType.RegisterEntity);
    }
    case OasisTransactionMethod.DE_REGISTER_ENTITY: {
      return null;
    }
    case OasisTransactionMethod.UN_FREEZE_NODE: {
      return combineWithType(tx, IOasisTransactionType.UnfreezeNode);
    }
    case OasisTransactionMethod.RATE: {
      return combineWithType(tx, IOasisTransactionType.RateEvent);
    }
    case OasisTransactionMethod.BOUND: {
      return combineWithType(tx, IOasisTransactionType.BoundEvent);
    }
    case OasisTransactionMethod.REGISTER_RUNTIME: {
      return combineWithType(tx, IOasisTransactionType.RegisterRuntime);
    }
    case OasisTransactionMethod.AMEND_COMMISSION_SCHEDULE: {
      return combineWithType(tx, IOasisTransactionType.AmendCommissionSchedule);
    }
    case OasisTransactionMethod.UNKNOWN_METHOD: {
      return combineWithType(tx, IOasisTransactionType.UnknownEvent);
    }

    default: {
      // Unrecognized transaction data:
      logSentryMessage(
        `Unrecognized Oasis transaction received for address ${address}. Original transaction data: ${JSON.stringify(
          tx,
        )}`,
      );
      return assertUnreachable(method);
    }
  }
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

const OASIS = {
  fetchAccountBalances,
  fetchAccountHistory,
  fetchTransactions,
  fetchTransaction,
  fetchNetworkSummaryStats,
};

export default OASIS;
