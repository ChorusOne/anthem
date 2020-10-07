import {
  deriveNetworkFromAddress,
  IOasisAccountBalancesQueryVariables,
  IOasisAccountHistoryQueryVariables,
  IOasisTransactionQueryVariables,
  IOasisTransactionsQueryVariables,
  IQuery,
  NETWORKS,
} from "@anthem/utils";
import OASIS from "../server/sources/oasis";
import {
  blockUnsupportedNetworks,
  validatePaginationParams,
} from "../tools/server-utils";

/** =======================================================================
 * Oasis Resolvers
 * ========================================================================
 */

const OasisResolvers = {
  oasisAccountBalances: async (
    _: void,
    args: IOasisAccountBalancesQueryVariables,
  ): Promise<IQuery["oasisAccountBalances"]> => {
    const { address } = args;
    const network = NETWORKS.OASIS;
    return OASIS.fetchAccountBalances(address, network);
  },

  oasisAccountHistory: async (
    _: void,
    args: IOasisAccountHistoryQueryVariables,
  ): Promise<IQuery["oasisAccountHistory"]> => {
    const { address } = args;
    const network = deriveNetworkFromAddress(address);
    blockUnsupportedNetworks(network, new Set(["OASIS"]), "portfolio");
    return OASIS.fetchAccountHistory(address, network);
  },

  oasisTransactions: async (
    _: void,
    args: IOasisTransactionsQueryVariables,
  ): Promise<IQuery["oasisTransactions"]> => {
    const { address, startingPage, pageSize } = args;
    const network = deriveNetworkFromAddress(address);
    blockUnsupportedNetworks(network, new Set(["OASIS"]), "transactions");
    const size = validatePaginationParams(pageSize, 25);
    const start = validatePaginationParams(startingPage, 1);
    const params = {
      address,
      network,
      pageSize: size,
      startingPage: start,
    };
    return OASIS.fetchTransactions(params);
  },

  oasisTransaction: async (
    _: void,
    args: IOasisTransactionQueryVariables,
  ): Promise<IQuery["oasisTransaction"]> => {
    return OASIS.fetchTransaction(args.hash);
  },
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default OasisResolvers;
