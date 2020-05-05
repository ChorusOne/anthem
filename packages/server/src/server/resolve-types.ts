import { objectHasKeys } from "../tools/server-utils";

/** ===========================================================================
 * __resolverType Methods
 * ----------------------------------------------------------------------------
 * Helper resolvers for resolving union types.
 *
 * See: https://www.apollographql.com/docs/apollo-server/features/unions-interfaces/
 * for more details.
 * ============================================================================
 */

/**
 * Cosmos TxMsgValue resolver:
 */
const TxMsgValue = {
  __resolveType(obj: any) {
    if ("amount" in obj && obj.amount.length) {
      return "MsgSend";
    }

    if (
      objectHasKeys(obj, [
        "amount",
        "delegator_address",
        "validator_src_address",
        "validator_dst_address",
      ])
    ) {
      return "MsgBeginRedelegate";
    }

    if (
      objectHasKeys(obj, [
        "shares_amount",
        "delegator_address",
        "validator_src_address",
        "validator_dst_address",
      ])
    ) {
      return "MsgBeginRedelegateLegacy";
    }

    if (
      objectHasKeys(obj, ["amount", "delegator_address", "validator_address"])
    ) {
      return "MsgDelegate";
    }

    if (objectHasKeys(obj, ["delegator_address", "validator_address"])) {
      return "MsgWithdrawDelegationReward";
    }

    if (objectHasKeys(obj, ["delegator_address", "withdraw_address"])) {
      return "MsgModifyWithdrawAddress";
    }

    if (objectHasKeys(obj, ["validator_address"])) {
      return "MsgWithdrawValidatorCommission";
    }

    if (objectHasKeys(obj, ["proposal_id", "voter", "option"])) {
      return "MsgVote";
    }

    if (
      objectHasKeys(obj, [
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
 *
 * TODO: Complete this.
 */
const OasisTransactionData = {
  __resolveType(obj: any) {
    return "OasisTransferEvent";
  },
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

const UnionResolvers = { TxMsgValue, OasisTransactionData };

export default UnionResolvers;
