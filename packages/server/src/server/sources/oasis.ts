import {
  IDelegation,
  IOasisTransaction,
  IOasisTransactionType,
  IQuery,
  NetworkDefinition,
} from "@anthem/utils";
import { logSentryMessage } from "../../tools/server-utils";
import { AxiosUtil, getHostFromNetworkName } from "../axios-utils";

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

interface OasisTransaction {
  date: string;
  height?: string;
  escrow?: TxEscrow;
  burn?: TxBurn;
  transfer?: TxTransfer;
  register_entity?: TxRegister;
  deregister_entity?: TxDeregister;
  register_node?: TxRegisterNode;
  unfreeze_node?: TxUnfreezeNode;
  register_runtime?: TxRegisterRuntime;
  amend_commission_schedule?: TxAmendCommissionSchedule;
  unknown_method?: TxUnknown;
}

interface TxTransfer {
  to: string;
  from: string;
  tokens: string;
}

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

interface TxRegister {
  id: string;
  nodes: string[];
  allow_entity_signed_nodes: boolean;
}

interface TxDeregister {
  id: string;
  nodes: string[];
  allow_entity_signed_nodes: boolean;
}

interface TxRegisterNode {
  id: string;
  entity_id: string;
  expiration: number;
}

interface TxUnfreezeNode {
  id: string;
}

interface TxRegisterRuntime {
  id: string;
  version: string;
}

interface TxAmendCommissionSchedule {
  rates: string[];
  bounds: string[];
}

interface TxUnknown {
  method_name: string;
}

/** ===========================================================================
 * Oasis REST API Utils
 * ----------------------------------------------------------------------------
 * This file contains the utils for fetching Oasis Network data.
 * ============================================================================
 */

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

  const { balance, delegations } = response;

  return {
    balance: [
      {
        denom: network.denom,
        amount: balance,
      },
    ],
    rewards: [],
    delegations: delegations.map(convertDelegations),
    unbonding: [],
    commissions: [],
  };
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
    .map(x => adaptOasisTransaction(x, address))
    .filter(x => x !== null) as IOasisTransaction[];

  return {
    page: 1,
    limit: 25,
    moreResultsExist: false,
    data: convertedTransactions,
  };
};

/** ===========================================================================
 * Utils
 * ============================================================================
 */

/**
 * Transform the delegations to match the expected GraphQL schema
 * definition.
 */
const convertDelegations = (delegation: OasisDelegation): IDelegation => {
  return {
    delegator_address: delegation.delegator,
    validator_address: delegation.validator,
    shares: delegation.amount,
  };
};

/**
 * Transform the original transaction records to match the GraphQL schema
 * definition.
 */
const adaptOasisTransaction = (
  tx: OasisTransaction,
  address: string,
): Nullable<IOasisTransaction> => {
  if (!!tx.burn) {
    // BURN Transaction
    return {
      height: 1,
      date: tx.date,
      event: {
        type: IOasisTransactionType.Burn,
        owner: tx.burn.owner,
        tokens: tx.burn.tokens,
      },
    };
  } else if (!!tx.transfer) {
    // TRANSFER Transaction
    return {
      height: 1,
      date: tx.date,
      event: {
        type: IOasisTransactionType.Transfer,
        to: tx.transfer.to,
        from: tx.transfer.from,
        tokens: tx.transfer.tokens,
      },
    };
  } else if (!!tx.register_entity) {
    // REGISTER ENTITY Transaction
    return {
      height: 1,
      date: tx.date,
      event: {
        type: IOasisTransactionType.Transfer,
        ...tx.register_entity,
      },
    };
  } else if (!!tx.deregister_entity) {
    // DEREGISTER ENTITY Transaction
    return {
      height: 1,
      date: tx.date,
      event: {
        type: IOasisTransactionType.Transfer,
        ...tx.deregister_entity,
      },
    };
  } else if (!!tx.register_node) {
    // REGISTER NODE Transaction
    return {
      height: 1,
      date: tx.date,
      event: {
        type: IOasisTransactionType.Transfer,
        ...tx.register_node,
      },
    };
  } else if (!!tx.unfreeze_node) {
    // UNFREEZE NODE Transaction
    return {
      height: 1,
      date: tx.date,
      event: {
        type: IOasisTransactionType.Transfer,
        ...tx.unfreeze_node,
      },
    };
  } else if (!!tx.register_runtime) {
    // REGISTER RUNTIME Transaction
    return {
      height: 1,
      date: tx.date,
      event: {
        type: IOasisTransactionType.Transfer,
        ...tx.register_runtime,
      },
    };
  } else if (!!tx.amend_commission_schedule) {
    // AMEND COMMISSION SCHEDULE Transaction
    return {
      height: 1,
      date: tx.date,
      event: {
        type: IOasisTransactionType.Transfer,
        ...tx.amend_commission_schedule,
      },
    };
  } else if (!!tx.unknown_method) {
    // UNKNOWN Transaction
    return {
      height: 1,
      date: tx.date,
      event: {
        type: IOasisTransactionType.Transfer,
        ...tx.unknown_method,
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
        event: {
          owner: escrow.add.owner,
          escrow: escrow.add.escrow,
          tokens: escrow.add.tokens,
          type: IOasisTransactionType.EscrowAdd,
        },
      };
    } else if (!!escrow.take) {
      // ESCROW TAKE Transaction
      return {
        height: 1,
        date: tx.date,
        event: {
          type: IOasisTransactionType.EscrowTake,
          owner: escrow.take.owner,
          tokens: escrow.take.tokens,
        },
      };
    } else if (!!escrow.reclaim) {
      // ESCROW RECLAIM Transaction
      return {
        height: 1,
        date: tx.date,
        event: {
          type: IOasisTransactionType.EscrowReclaim,
          owner: escrow.reclaim.owner,
          escrow: escrow.reclaim.escrow,
          tokens: escrow.reclaim.tokens,
        },
      };
    }
  }

  // Unrecognized transaction data:
  logSentryMessage(
    `Unrecognized Oasis transaction received for address ${address}. Original transaction data: ${JSON.stringify(
      tx,
    )}`,
  );

  return null;
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
