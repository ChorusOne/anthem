import {
  deriveNetworkFromAddress,
  IOasisAccountBalancesQueryVariables,
  IOasisAccountHistoryQueryVariables,
  IOasisTransactionQueryVariables,
  IOasisTransactionsQueryVariables,
  IQuery,
  NETWORKS,
} from "@anthem/utils";
import { cache } from "a-simple-cache";
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
    interface FetchResponse {
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
    }

    const oasisValidators: FetchResponse = await (async () => {
      if (cache.isValid("oasis-validators")) {
        const cachedValue: FetchResponse | undefined = cache.get(
          "oasis-validators",
        );

        if (cachedValue) {
          return cachedValue;
        }
      }

      const fetchedValue = await Axios.get<FetchResponse>(
        "https://www.oasisscan.com/mainnet/validator/list",
      );

      const ONE_MINUTE = 60 * 1000;
      const ONE_HOUR = 60 * ONE_MINUTE;
      cache.set("oasis-validators", fetchedValue.data, 24 * ONE_HOUR);

      return fetchedValue.data;
    })();

    const oasisValidatorOverrides: {
      [address: string]: {
        name?: string;
        website?: string;
        icon?: string;
        email?: string;
        keybase?: string;
        twitter?: string;
      };
    } = {
      oasis1qzthup6qts0k689z2wy84yvk9ctnht66eyxl7268: {
        name: "Figment",
        website: "https://figment.io",
        icon:
          "https://s3.amazonaws.com/keybase_processed_uploads/bd5fb87f241bd78a9c4bceaaa849ca05_360_360.jpg",
      },
    };

    return (
      oasisValidators.data.list
        // .filter(validator => validator.active)
        .map(validator => ({
          address: validator.entityAddress,

          name:
            oasisValidatorOverrides[validator.entityAddress]?.name ??
            (validator.name || validator.entityAddress),

          commission: validator.commission,

          website:
            oasisValidatorOverrides[validator.entityAddress]?.website ??
            validator.website,

          iconUrl:
            oasisValidatorOverrides[validator.entityAddress]?.icon ??
            (validator.icon ||
              "https://www.oasisscan.com/_nuxt/img/d7112e0.png"),

          email:
            oasisValidatorOverrides[validator.entityAddress]?.email ??
            validator.email,
          keybase:
            oasisValidatorOverrides[validator.entityAddress]?.keybase ??
            validator.keybase,
          twitter:
            oasisValidatorOverrides[validator.entityAddress]?.twitter ??
            validator.twitter,

          active: validator.active || false,
        }))
    );
  },
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default OasisResolvers;
