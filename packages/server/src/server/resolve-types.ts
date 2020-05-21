import {
  assertUnreachable,
  IOasisTransactionEventData,
  IOasisTransactionType,
} from "@anthem/utils";
import { hasKeys } from "../tools/server-utils";

/** ===========================================================================
 * Union Type Resolvers
 * ----------------------------------------------------------------------------
 * Helper resolvers for resolving union types.
 *
 * See: https://www.apollographql.com/docs/apollo-server/features/unions-interfaces/
 * for more details.
 *
 * NOTE: If you happen to add new union type resolvers here, you may also need
 * to add them to the same resolver in the mock Apollo Client setup in the
 * client/ package to enable to the mock development app mode to continue to
 * work correctly. See the graphql/mocks.ts file for details on this.
 * ============================================================================
 */

/**
 * Cosmos Transaction Resolver:
 */
const TxMsgValue = {
  __resolveType(x: any) {
    if ("amount" in x && x.amount.length) {
      return "MsgSend";
    }

    if (
      hasKeys(x, [
        "amount",
        "delegator_address",
        "validator_src_address",
        "validator_dst_address",
      ])
    ) {
      return "MsgBeginRedelegate";
    }

    if (
      hasKeys(x, [
        "shares_amount",
        "delegator_address",
        "validator_src_address",
        "validator_dst_address",
      ])
    ) {
      return "MsgBeginRedelegateLegacy";
    }

    if (hasKeys(x, ["amount", "delegator_address", "validator_address"])) {
      return "MsgDelegate";
    }

    if (hasKeys(x, ["delegator_address", "validator_address"])) {
      return "MsgWithdrawDelegationReward";
    }

    if (hasKeys(x, ["delegator_address", "withdraw_address"])) {
      return "MsgModifyWithdrawAddress";
    }

    if (hasKeys(x, ["validator_address"])) {
      return "MsgWithdrawValidatorCommission";
    }

    if (hasKeys(x, ["proposal_id", "voter", "option"])) {
      return "MsgVote";
    }

    if (
      hasKeys(x, [
        "title",
        "description",
        "proposal_type",
        "proposer",
        "initial_deposit",
      ])
    ) {
      return "MsgSubmitProposal";
    }

    return null;
  },
};

/**
 * Account Balances Resolver:
 */
const AccountBalanceResponseType = {
  __resolveType(x: any) {
    const PROXY_FOR_CELO = "totalLockedGoldBalance" in x;
    if (PROXY_FOR_CELO) {
      return "CeloAccountBalances";
    } else {
      return "CosmosAccountBalances";
    }
  },
};

/**
 * Oasis Transaction Resolver:
 */
const OasisTransactionEvent = {
  __resolveType(event: IOasisTransactionEventData) {
    const { type } = event;

    switch (type) {
      case IOasisTransactionType.Burn:
        return "OasisBurnEvent";
      case IOasisTransactionType.Transfer:
        return "OasisTransferEvent";
      case IOasisTransactionType.EscrowAdd:
        return "OasisEscrowAddEvent";
      case IOasisTransactionType.EscrowTake:
        return "OasisEscrowTakeEvent";
      case IOasisTransactionType.EscrowReclaim:
        return "OasisEscrowReclaimEvent";
      case IOasisTransactionType.RegisterEntity:
        return "OasisRegisterEntityEvent";
      case IOasisTransactionType.UnfreezeNode:
        return "OasisUnfreezeNodeEvent";
      case IOasisTransactionType.RegisterNode:
        return "OasisRegisterNodeEvent";
      case IOasisTransactionType.RegisterRuntime:
        return "OasisRegisterRuntimeEvent";
      case IOasisTransactionType.RateEvent:
        return "OasisRateEvent";
      case IOasisTransactionType.BoundEvent:
        return "OasisBoundEvent";
      case IOasisTransactionType.AmendCommissionSchedule:
        return "OasisAmendCommissionScheduleEvent";
      case IOasisTransactionType.UnknownEvent:
        return "OasisUnknownEvent";
      default:
        assertUnreachable(type);
    }
  },
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

const UnionResolvers = {
  TxMsgValue,
  OasisTransactionEvent,
  AccountBalanceResponseType,
};

export default UnionResolvers;
