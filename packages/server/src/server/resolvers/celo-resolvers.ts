import {
  deriveNetworkFromAddress,
  ICeloAccountHistoryQueryVariables,
  ICeloTransactionQueryVariables,
  ICeloTransactionsQueryVariables,
  IQuery,
} from "@anthem/utils";
import {
  blockUnsupportedNetworks,
  validatePaginationParams,
} from "../../tools/server-utils";
import CELO from "../sources/celo";

/** =======================================================================
 * Celo Resolvers
 * ========================================================================
 */

const CeloResolvers = {
  celoAccountHistory: async (
    _: void,
    args: ICeloAccountHistoryQueryVariables,
  ): Promise<IQuery["celoAccountHistory"]> => {
    const { address } = args;
    const network = deriveNetworkFromAddress(address);
    blockUnsupportedNetworks(network, "portfolio");
    return CELO.fetchAccountHistory(address, network);
  },

  celoTransactions: async (
    _: void,
    args: ICeloTransactionsQueryVariables,
  ): Promise<IQuery["celoTransactions"]> => {
    const { address, startingPage, pageSize } = args;
    const network = deriveNetworkFromAddress(address);
    blockUnsupportedNetworks(network, "transactions");
    const size = validatePaginationParams(pageSize, 25);
    const start = validatePaginationParams(startingPage, 1);
    const params = {
      address,
      network,
      pageSize: size,
      startingPage: start,
    };
    return CELO.fetchTransactions(params);
  },

  celoTransaction: async (
    _: void,
    args: ICeloTransactionQueryVariables,
  ): Promise<IQuery["celoTransaction"]> => {
    return CELO.fetchTransaction(args.hash);
  },

  celoSystemBalances: async (): Promise<IQuery["celoSystemBalances"]> => {
    return CELO.fetchSystemBalances();
  },

  celoSystemHistory: async (): Promise<IQuery["celoSystemHistory"]> => {
    return CELO.fetchSystemHistory();
  },

  celoValidatorGroups: async (): Promise<IQuery["celoValidatorGroups"]> => {
    return CELO.fetchValidatorGroups();
  },
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default CeloResolvers;
