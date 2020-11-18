import {
  deriveNetworkFromAddress,
  IOasisAccountBalancesQueryVariables,
  IOasisAccountHistoryQueryVariables,
  IOasisTransactionQueryVariables,
  IOasisTransactionsQueryVariables,
  IQuery,
  NETWORKS,
} from "@anthem/utils";
import Axios from "axios";
import OASIS from "../sources/oasis";
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

  oasisValidators: async () => {
    const result = await Axios.get<{
      code: 0;
      data: {
        active: number;
        delegators: number;
        inactive: number;
        list: Array<{
          active: boolean;
          balance: string;
          bound: any;
          bounds: any;
          commission: number;
          delegators: number;
          description: string | null;
          email: string | null;
          entityAddress: string;
          entityId: string;
          escrow: string;
          escrowAmountStatus: any;
          escrowChange24: string;
          escrowPercent: number;
          escrowSharesStatus: any;
          icon: string;
          keybase: any;
          name: string;
          nodeAddress: string;
          nodeId: string;
          nodes: any;
          nonce: number;
          proposals: number;
          rank: number;
          rates: any;
          score: number;
          signs: number;
          status: boolean;
          totalShares: string;
          twitter: string;
          uptime: string;
          website: string;
        }>;
      };
    }>("https://www.oasisscan.com/mainnet/validator/list");

    return result.data.data.list
      .filter(validator => validator.active)
      .map(validator => ({
        address: validator.nodeAddress,
        name: validator.name || validator.nodeAddress,
        commission: validator.commission,
        website: validator.website,
        iconUrl:
          validator.icon || "https://www.oasisscan.com/_nuxt/img/d7112e0.png",
      }));
  },
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default OasisResolvers;
