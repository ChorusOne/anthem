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

const deregister: TxDeregister = {
  id: "sa8df70af7as0",
  nodes: ["sa980df7a0", "sa9d67f89a", "as9df76sa9"],
  allow_entity_signed_nodes: true,
};

const reg: TxRegister = {
  id: "sa8df70af7as0",
  nodes: ["sa980df7a0", "sa9d67f89a", "as9df76sa9"],
  allow_entity_signed_nodes: true,
};

const unknown: TxUnknown = {
  method_name: "HEIST",
};

const amend: TxAmendCommissionSchedule = {
  rates: ["1", "2", "3"],
  bounds: ["1", "2", "3"],
};

const runtime: TxRegisterRuntime = {
  id: "as9fd7as97f6sad0",
  version: "1.2.4",
};

const unfreeze: TxUnfreezeNode = {
  id: "s76fd9af9s8ad",
};

const register: TxRegisterNode = {
  id: "s0a9f780sa97f0sad",
  entity_id: "saf967as986f784as67d5f",
  expiration: 15000,
};

const date = new Date().toISOString();

const T = [
  { date, register_entity: reg },
  { date, deregister_entity: deregister },
  { date, register_node: register },
  { date, unfreeze_node: unfreeze },
  { date, register_runtime: runtime },
  { date, amend_commission_schedule: amend },
  { date, unknown_method: unknown },
];

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
  // const host = getHostFromNetworkName(network.name);
  // const response = await AxiosUtil.get<OasisTransaction[]>(
  //   `${host}/account/${address}/events`,
  // );

  const response = T;

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
        type: IOasisTransactionType.RegisterEntity,
        id: tx.register_entity.id,
        nodes: tx.register_entity.nodes,
        allow_entity_signed_nodes: tx.register_entity.allow_entity_signed_nodes,
      },
    };
  } else if (!!tx.deregister_entity) {
    // DEREGISTER ENTITY Transaction
    return {
      height: 1,
      date: tx.date,
      event: {
        type: IOasisTransactionType.RegisterEntity,
        id: tx.deregister_entity.id,
        nodes: tx.deregister_entity.nodes,
        allow_entity_signed_nodes:
          tx.deregister_entity.allow_entity_signed_nodes,
      },
    };
  } else if (!!tx.register_node) {
    // REGISTER NODE Transaction
    return {
      height: 1,
      date: tx.date,
      event: {
        type: IOasisTransactionType.RegisterNode,
        id: tx.register_node.id,
        entity_id: tx.register_node.entity_id,
        expiration: tx.register_node.expiration,
      },
    };
  } else if (!!tx.unfreeze_node) {
    // UNFREEZE NODE Transaction
    return {
      height: 1,
      date: tx.date,
      event: {
        type: IOasisTransactionType.UnfreezeNode,
        id: tx.unfreeze_node.id,
      },
    };
  } else if (!!tx.register_runtime) {
    // REGISTER RUNTIME Transaction
    return {
      height: 1,
      date: tx.date,
      event: {
        type: IOasisTransactionType.RegisterRuntime,
        id: tx.register_runtime.id,
        version: tx.register_runtime.version,
      },
    };
  } else if (!!tx.amend_commission_schedule) {
    // AMEND COMMISSION SCHEDULE Transaction
    return {
      height: 1,
      date: tx.date,
      event: {
        type: IOasisTransactionType.AmendCommissionSchedule,
        rates: tx.amend_commission_schedule.rates,
        bounds: tx.amend_commission_schedule.bounds,
      },
    };
  } else if (!!tx.unknown_method) {
    // UNKNOWN Transaction
    return {
      height: 1,
      date: tx.date,
      event: {
        type: IOasisTransactionType.UnknownEvent,
        method_name: tx.unknown_method.method_name,
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
