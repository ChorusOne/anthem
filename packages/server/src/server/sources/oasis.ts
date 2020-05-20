import {
  assertUnreachable,
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

// interface OasisTransaction {
//   date: string;
//   height?: string;
//   escrow?: TxEscrow;
//   burn?: TxBurn;
//   transfer?: TxTransfer;
//   register_entity?: TxRegister;
//   deregister_entity?: TxDeregister;
//   register_node?: TxRegisterNode;
//   unfreeze_node?: TxUnfreezeNode;
//   rate?: TxRateEvent;
//   bound?: TxBoundEvent;
//   register_runtime?: TxRegisterRuntime;
//   amend_commission_schedule?: TxAmendCommissionSchedule;
//   unknown_method?: TxUnknown;
// }

enum OasisTransactionMethod {
  TRANSFER = "staking.Transfer",
  BURN = "staking.Burn",
  ADD_ESCROW = "staking.AddEscrow",
  RECLAIM_ESCROW = "staking.ReclaimEscrow",
  TAKE_ESCROW = "staking.TakeEscrow",
  REGISTER_ENTITY = "staking.RegisterEntity",
  REGISTER_NODE = "staking.RegisterNode",
  DE_REGISTER_ENTITY = "staking.DeregisterEntity",
  UN_FREEZE_NODE = "staking.UnfreezeNode",
  RATE = "staking.Rate",
  BOUND = "staking.Bound",
  REGISTER_RUNTIME = "staking.RegisterRuntime",
  AMEND_COMMISSION_SCHEDULE = "staking.AmendCommissionSchedule",
  UNKNOWN_METHOD = "UnknownMethod",
}

interface OasisTransactionBase {
  amount: string;
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
  data: null;
}

interface TxRegisterNode extends OasisTransactionBase {
  method: OasisTransactionMethod.REGISTER_NODE;
  data: null;
}

interface TxRegisterEntity extends OasisTransactionBase {
  method: OasisTransactionMethod.REGISTER_ENTITY;
  data: null;
}

interface TxDeregisterEntity extends OasisTransactionBase {
  method: OasisTransactionMethod.DE_REGISTER_ENTITY;
  data: null;
}

interface TxUnfreezeNode extends OasisTransactionBase {
  method: OasisTransactionMethod.UN_FREEZE_NODE;
  data: null;
}

interface TxRate extends OasisTransactionBase {
  method: OasisTransactionMethod.RATE;
  data: null;
}

interface TxBound extends OasisTransactionBase {
  method: OasisTransactionMethod.BOUND;
  data: null;
}

interface TxRegisterRuntime extends OasisTransactionBase {
  method: OasisTransactionMethod.REGISTER_RUNTIME;
  data: null;
}

interface TxAmendCommissionSchedule extends OasisTransactionBase {
  method: OasisTransactionMethod.AMEND_COMMISSION_SCHEDULE;
  data: null;
}

interface TxUnknownMethod extends OasisTransactionBase {
  method: OasisTransactionMethod.UNKNOWN_METHOD;
  data: null;
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
 * Legacy Types:
 * ============================================================================
 */

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

interface TxBoundEvent {
  start: string;
  rate_min: string;
  rate_max: string;
}

interface TxRateEvent {
  start: string;
  rate: string;
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

  // const response = MOCK_OASIS_EVENTS;

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
): IOasisTransaction | null => {
  const { method } = tx;

  const combineWithType = (
    transaction: OasisTransaction,
    type: IOasisTransactionType,
  ) => {
    const result: IOasisTransaction = {
      ...tx,
      // @ts-ignore
      data: { ...tx.data, type },
    };

    return result;
  };

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

  // Legacy Code:
  // if (!!tx.burn) {
  //   // BURN Transaction
  //   return {
  //     height: 1,
  //     date: tx.date,
  //     event: {
  //       type: IOasisTransactionType.Burn,
  //       owner: tx.burn.owner,
  //       tokens: tx.burn.tokens,
  //     },
  //   };
  // } else if (!!tx.transfer) {
  //   // TRANSFER Transaction
  //   return {
  //     height: 1,
  //     date: tx.date,
  //     event: {
  //       type: IOasisTransactionType.Transfer,
  //       to: tx.transfer.to,
  //       from: tx.transfer.from,
  //       tokens: tx.transfer.tokens,
  //     },
  //   };
  // } else if (!!tx.register_entity) {
  //   // REGISTER ENTITY Transaction
  //   return {
  //     height: 1,
  //     date: tx.date,
  //     event: {
  //       type: IOasisTransactionType.RegisterEntity,
  //       id: tx.register_entity.id,
  //       nodes: tx.register_entity.nodes,
  //       allow_entity_signed_nodes: tx.register_entity.allow_entity_signed_nodes,
  //     },
  //   };
  // } else if (!!tx.deregister_entity) {
  //   // DEREGISTER ENTITY Transaction
  //   return {
  //     height: 1,
  //     date: tx.date,
  //     event: {
  //       type: IOasisTransactionType.RegisterEntity,
  //       id: tx.deregister_entity.id,
  //       nodes: tx.deregister_entity.nodes,
  //       allow_entity_signed_nodes:
  //         tx.deregister_entity.allow_entity_signed_nodes,
  //     },
  //   };
  // } else if (!!tx.register_node) {
  //   // REGISTER NODE Transaction
  //   return {
  //     height: 1,
  //     date: tx.date,
  //     event: {
  //       type: IOasisTransactionType.RegisterNode,
  //       id: tx.register_node.id,
  //       entity_id: tx.register_node.entity_id,
  //       expiration: tx.register_node.expiration,
  //     },
  //   };
  // } else if (!!tx.unfreeze_node) {
  //   // UNFREEZE NODE Transaction
  //   return {
  //     height: 1,
  //     date: tx.date,
  //     event: {
  //       type: IOasisTransactionType.UnfreezeNode,
  //       id: tx.unfreeze_node.id,
  //     },
  //   };
  // } else if (!!tx.register_runtime) {
  //   // REGISTER RUNTIME Transaction
  //   return {
  //     height: 1,
  //     date: tx.date,
  //     event: {
  //       type: IOasisTransactionType.RegisterRuntime,
  //       id: tx.register_runtime.id,
  //       version: tx.register_runtime.version,
  //     },
  //   };
  // } else if (!!tx.rate) {
  //   // RATE Transaction
  //   return {
  //     height: 1,
  //     date: tx.date,
  //     event: {
  //       type: IOasisTransactionType.RateEvent,
  //       start: tx.rate.start,
  //       rate: tx.rate.rate,
  //     },
  //   };
  // } else if (!!tx.bound) {
  //   // BOUND Transaction
  //   return {
  //     height: 1,
  //     date: tx.date,
  //     event: {
  //       type: IOasisTransactionType.BoundEvent,
  //       start: tx.bound.start,
  //       rate_min: tx.bound.rate_min,
  //       rate_max: tx.bound.rate_max,
  //     },
  //   };
  // } else if (!!tx.amend_commission_schedule) {
  //   // AMEND COMMISSION SCHEDULE Transaction
  //   return {
  //     height: 1,
  //     date: tx.date,
  //     event: {
  //       type: IOasisTransactionType.AmendCommissionSchedule,
  //       rates: tx.amend_commission_schedule.rates,
  //       bounds: tx.amend_commission_schedule.bounds,
  //     },
  //   };
  // } else if (!!tx.unknown_method) {
  //   // UNKNOWN Transaction
  //   return {
  //     height: 1,
  //     date: tx.date,
  //     event: {
  //       type: IOasisTransactionType.UnknownEvent,
  //       method_name: tx.unknown_method.method_name,
  //     },
  //   };
  // } else if (!!tx.escrow) {
  //   // ESCROW Transactions
  //   const { escrow } = tx;
  //   if (!!escrow.add) {
  //     // ESCROW ADD Transaction
  //     return {
  //       height: 1,
  //       date: tx.date,
  //       event: {
  //         owner: escrow.add.owner,
  //         escrow: escrow.add.escrow,
  //         tokens: escrow.add.tokens,
  //         type: IOasisTransactionType.EscrowAdd,
  //       },
  //     };
  //   } else if (!!escrow.take) {
  //     // ESCROW TAKE Transaction
  //     return {
  //       height: 1,
  //       date: tx.date,
  //       event: {
  //         type: IOasisTransactionType.EscrowTake,
  //         owner: escrow.take.owner,
  //         tokens: escrow.take.tokens,
  //       },
  //     };
  //   } else if (!!escrow.reclaim) {
  //     // ESCROW RECLAIM Transaction
  //     return {
  //       height: 1,
  //       date: tx.date,
  //       event: {
  //         type: IOasisTransactionType.EscrowReclaim,
  //         owner: escrow.reclaim.owner,
  //         escrow: escrow.reclaim.escrow,
  //         tokens: escrow.reclaim.tokens,
  //       },
  //     };
  //   }
  // }

  // // Unrecognized transaction data:
  // logSentryMessage(
  //   `Unrecognized Oasis transaction received for address ${address}. Original transaction data: ${JSON.stringify(
  //     tx,
  //   )}`,
  // );

  // return null;
};

/** ===========================================================================
 * Mock Transactions for Testing
 * ============================================================================
 */

// const deregister: TxDeregister = {
//   id: "sa8df70af7as0",
//   nodes: ["sa980df7a0", "sa9d67f89a", "as9df76sa9"],
//   allow_entity_signed_nodes: true,
// };

// const register: TxRegister = {
//   id: "sa8df70af7as0",
//   nodes: ["sa980df7a0", "sa9d67f89a", "as9df76sa9"],
//   allow_entity_signed_nodes: true,
// };

// const rateEvent: TxRateEvent = {
//   start: "Start",
//   rate: "Rate",
// };

// const amend: TxAmendCommissionSchedule = {
//   rates: ["1", "2", "3"],
//   bounds: ["1", "2", "3"],
// };

// const registerRuntime: TxRegisterRuntime = {
//   id: "as9fd7as97f6sad0",
//   version: "1.2.4",
// };

// const boundEvent: TxBoundEvent = {
//   start: "Start",
//   rate_min: "Rate Min",
//   rate_max: "Rate Max",
// };

// const unfreezeNode: TxUnfreezeNode = {
//   id: "s76fd9af9s8ad",
// };

// const registerNode: TxRegisterNode = {
//   id: "s0a9f780sa97f0sad",
//   entity_id: "saf967as986f784as67d5f",
//   expiration: 15000,
// };

// const unknown: TxUnknown = {
//   method_name: "HEIST",
// };

// const d = () => String(Date.now() - Math.round(Math.random() * 1e8));

// const MOCK_OASIS_EVENTS: OasisTransaction[] = [
//   { date: d(), register_entity: register },
//   { date: d(), deregister_entity: deregister },
//   { date: d(), register_node: registerNode },
//   { date: d(), unfreeze_node: unfreezeNode },
//   { date: d(), register_runtime: registerRuntime },
//   { date: d(), amend_commission_schedule: amend },
//   { date: d(), rate: rateEvent },
//   { date: d(), bound: boundEvent },
//   { date: d(), unknown_method: unknown },
// ];

/** ===========================================================================
 * Export
 * ============================================================================
 */

const OASIS = {
  fetchAccountBalances,
  fetchTransactions,
};

export default OASIS;
