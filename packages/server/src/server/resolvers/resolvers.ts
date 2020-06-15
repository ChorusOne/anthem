import {
  ERRORS,
  getNetworkDefinitionFromIdentifier,
  getNetworkDefinitionFromTicker,
  IDailyPercentChangeQueryVariables,
  IFiatPriceHistoryQueryVariables,
  IPricesQueryVariables,
  IQuery,
  NetworkDefinition,
} from "@anthem/utils";
import UnionResolvers from "../resolve-types";
import FIAT_CURRENCIES from "../sources/fiat-currencies";
import EXCHANGE_DATA_API from "../sources/fiat-price-data";
import CeloResolvers from "./celo-resolvers";
import CosmosResolvers from "./cosmos-resolvers";
import OasisResolvers from "./oasis-resolvers";

/** ===========================================================================
 * Utils and Types
 * ============================================================================
 */

export interface PaginationParams {
  address: string;
  network: NetworkDefinition;
  startingPage: number;
  pageSize: number;
}

/** ===========================================================================
 * Resolvers
 * ============================================================================
 */

const resolvers = {
  ...UnionResolvers,

  Query: {
    // Add network resolvers:
    ...OasisResolvers,
    ...CosmosResolvers,
    ...CeloResolvers,

    // Add fiat price resolvers:
    prices: async (
      _: void,
      args: IPricesQueryVariables,
    ): Promise<IQuery["prices"]> => {
      const { currency, versus } = args;
      const network = getNetworkDefinitionFromTicker(currency);

      if (!network.supportsFiatPrices) {
        throw new Error(ERRORS.NETWORK_NOT_SUPPORTED(network));
      }

      return EXCHANGE_DATA_API.fetchExchangeRate(currency, versus);
    },

    fiatPriceHistory: async (
      _: void,
      args: IFiatPriceHistoryQueryVariables,
    ): Promise<IQuery["fiatPriceHistory"]> => {
      const { fiat } = args;
      const network = getNetworkDefinitionFromIdentifier(args.network);

      if (!network.supportsFiatPrices) {
        throw new Error(ERRORS.NETWORK_NOT_SUPPORTED(network));
      }

      return EXCHANGE_DATA_API.fetchPortfolioFiatPriceHistory(fiat, network);
    },

    dailyPercentChange: async (
      _: void,
      args: IDailyPercentChangeQueryVariables,
    ): Promise<IQuery["dailyPercentChange"]> => {
      const { currency, fiat } = args;
      const network = getNetworkDefinitionFromTicker(currency);

      if (!network.supportsFiatPrices) {
        throw new Error(ERRORS.NETWORK_NOT_SUPPORTED(network));
      }

      return EXCHANGE_DATA_API.fetchDailyPercentChangeInPrice(currency, fiat);
    },

    fiatCurrencies: async (_: void): Promise<IQuery["fiatCurrencies"]> => {
      return FIAT_CURRENCIES;
    },
  },
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default resolvers;
