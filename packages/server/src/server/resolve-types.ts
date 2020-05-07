import {
  assertUnreachable,
  IOasisTransactionEvent,
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
 * ============================================================================
 */

/**
 * Cosmos Transaction Resolver:
 */
const TxMsgValue = {
  __resolveType(obj: any) {
    if ("amount" in obj && obj.amount.length) {
      return "MsgSend";
    }

    if (
      hasKeys(obj, [
        "amount",
        "delegator_address",
        "validator_src_address",
        "validator_dst_address",
      ])
    ) {
      return "MsgBeginRedelegate";
    }

    if (
      hasKeys(obj, [
        "shares_amount",
        "delegator_address",
        "validator_src_address",
        "validator_dst_address",
      ])
    ) {
      return "MsgBeginRedelegateLegacy";
    }

    if (hasKeys(obj, ["amount", "delegator_address", "validator_address"])) {
      return "MsgDelegate";
    }

    if (hasKeys(obj, ["delegator_address", "validator_address"])) {
      return "MsgWithdrawDelegationReward";
    }

    if (hasKeys(obj, ["delegator_address", "withdraw_address"])) {
      return "MsgModifyWithdrawAddress";
    }

    if (hasKeys(obj, ["validator_address"])) {
      return "MsgWithdrawValidatorCommission";
    }

    if (hasKeys(obj, ["proposal_id", "voter", "option"])) {
      return "MsgVote";
    }

    if (
      hasKeys(obj, [
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
 * Oasis Transaction Resolver:
 */
const OasisTransactionEvent = {
  __resolveType(event: IOasisTransactionEvent) {
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
      default:
        assertUnreachable(type);
    }
  },
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

const UnionResolvers = { TxMsgValue, OasisTransactionEvent };

export default UnionResolvers;
