import {
  deriveNetworkFromAddress,
  ICeloAccountBalancesQueryVariables,
  ICeloAccountHistoryQueryVariables,
  ICeloGovernanceTransactionsQueryVariables,
  ICeloTransactionQueryVariables,
  ICeloTransactionsQueryVariables,
  IQuery,
  NETWORKS,
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
  celoAccountBalances: async (
    _: void,
    args: ICeloAccountBalancesQueryVariables,
  ): Promise<IQuery["celoAccountBalances"]> => {
    const { address } = args;
    const network = NETWORKS.CELO;
    return CELO.fetchAccountBalances(address, network);
  },

  celoAccountHistory: async (
    _: void,
    args: ICeloAccountHistoryQueryVariables,
  ): Promise<IQuery["celoAccountHistory"]> => {
    const { address } = args;
    const network = deriveNetworkFromAddress(address);
    console.log(network);
    blockUnsupportedNetworks(network, new Set(["CELO"]), "portfolio");
    return CELO.fetchAccountHistory(address, network);
  },

  celoTransactions: async (
    _: void,
    args: ICeloTransactionsQueryVariables,
  ): Promise<IQuery["celoTransactions"]> => {
    const { address, startingPage, pageSize } = args;
    const network = deriveNetworkFromAddress(address);
    blockUnsupportedNetworks(network, new Set(["CELO"]), "transactions");
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

  celoGovernanceTransactions: async (
    _: void,
    args: ICeloGovernanceTransactionsQueryVariables,
  ): Promise<IQuery["celoGovernanceTransactions"]> => {
    return CELO.fetchGovernanceTransactions(args.address);
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

  celoGovernanceProposals: async (): Promise<
    IQuery["celoGovernanceProposals"]
  > => {
    return CELO.fetchGovernanceProposals();
  },
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default CeloResolvers;
