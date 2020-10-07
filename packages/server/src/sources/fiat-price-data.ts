import {
  assertUnreachable,
  NETWORK_NAME,
  NetworkDefinition,
  NETWORKS,
} from "@anthem/utils";
import moment from "moment-timezone";
import { AxiosUtil, HOSTS } from "../tools/axios-utils";
import ENV from "../tools/server-env";
import { convertTimestampToUTC, getAveragePrice } from "../tools/server-utils";
import cosmosPriceHistory from "./price-history/cosmos.json";
import kavaPriceHistory from "./price-history/kava.json";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

export interface Price {
  time: number;
  close: number;
  high: number;
  low: number;
  open: number;
  volumefrom: number;
  volumeto: number;
}

/** ===========================================================================
 * Crypto Compare API Utils
 * ----------------------------------------------------------------------------
 * Ref: https://min-api.cryptocompare.com/documentation
 *
 * This fetches historical price data from the Crypto Compare API, and fills
 * in earlier history since February Cosmos launch (pre-exchange data) with
 * hard-coded data from Coin Gecko API.
 * ============================================================================
 */

/**
 * Return the raw price data.
 */
const fetchPortfolioFiatPriceHistory = async (
  fiat: string,
  network: NetworkDefinition,
): Promise<Array<{ timestamp: string; price: number }>> => {
  // NOTE: This date is hard-coded to the initial launch time frame of the COSMOS
  // network and is not relevant for other networks. It should probably be
  // refactored into a configuration detail in the network definitions.
  const requestLimit = moment(new Date()).diff(new Date("04-22-2019"), "days");
  const crypto = network.cryptoCompareTicker;
  const url = `${HOSTS.CRYPTO_COMPARE}/data/histoday?fsym=${crypto}&tsym=${fiat}&limit=${requestLimit}&api_key=${ENV.CRYPTO_COMPARE_API_KEY}`;
  const result: any = await AxiosUtil.get(url);
  const backfilledPrices = getBackFillPricesForNetwork(network, fiat);

  const normalizedPrices = result.Data.filter(
    (price: Price) => price.open !== 0,
  ).map((price: Price) => ({
    price: getAveragePrice(price),
    timestamp: convertTimestampToUTC(price.time * 1000),
  }));

  const finalResult = backfilledPrices.concat(normalizedPrices);
  return finalResult;
};

/**
 * Fetch price data for a currency pair.
 */
const fetchPriceData = async (crypto: string, fiat: string) => {
  const from = crypto.toUpperCase();
  const to = fiat.toUpperCase();
  const url = `${HOSTS.CRYPTO_COMPARE}/data/pricemultifull?fsyms=${from}&tsyms=${to}&api_key=${ENV.CRYPTO_COMPARE_API_KEY}`;
  const result: any = await AxiosUtil.get(url);

  const data = result.RAW;
  const values = data[from][to];

  return {
    price: values.PRICE,
    lastDayChange: values.CHANGEPCT24HOUR,
  };
};

const convertBackfilledPrices = (data: { [key: string]: number }) => {
  return Object.entries(data).map(([date, price]) => {
    return {
      price,
      timestamp: convertTimestampToUTC(new Date(date)),
    };
  });
};

/**
 * Get pre-launch fiat price data.
 */
const getBackFillPricesForNetwork = (
  network: NetworkDefinition,
  fiat: string,
): any[] => {
  const { name } = network;
  switch (name) {
    case "COSMOS":
      const prices =
        cosmosPriceHistory[fiat as keyof typeof cosmosPriceHistory];
      return convertBackfilledPrices(prices);

    case "KAVA":
      // TODO: Fix Kava data
      // return kavaPriceHistory[fiat as keyof typeof kavaPriceHistory];
      return [];

    // NOTE: Coin Gecko has no earlier price history for Terra!
    case "TERRA":
      return [];

    // NOTE: Not supported yet
    case "OASIS":
      return [];

    // NOTE: Not supported yet
    case "CELO":
      return [];

    // NOTE: Not supported yet
    case "POLKADOT":
      return [];

    default:
      return assertUnreachable(name);
  }
};

interface NetworkPriceData {
  name: NETWORK_NAME;
  tokenPrice: number | null;
  lastDayChange: number | null;
  marketCapitalization: number | null;
}

/**
 * Get the fiat price data for a network for the network summary.
 */
const getPriceDataForNetwork = async (
  fiat: string,
): Promise<NetworkPriceData[]> => {
  const fiatSymbol = fiat.toUpperCase();
  const networks = Object.values(NETWORKS).filter(n => n.supportsFiatPrices);
  const cryptoSymbols = networks.map(n => n.cryptoCompareTicker).join(",");

  const url = `${HOSTS.CRYPTO_COMPARE}/data/pricemultifull?fsyms=${cryptoSymbols}&tsyms=${fiatSymbol}&api_key=${ENV.CRYPTO_COMPARE_API_KEY}`;

  // Fetch the price change
  const response: any = await AxiosUtil.get(url);
  const data = response.RAW;

  const result = Object.values(NETWORKS).map(network => {
    const { cryptoCompareTicker } = network;
    if (cryptoCompareTicker in data) {
      const values = data[cryptoCompareTicker][fiat];
      return {
        name: network.name,
        tokenPrice: values.PRICE,
        lastDayChange: values.CHANGEPCT24HOUR,
        marketCapitalization: values.MKTCAP,
      };
    } else {
      return {
        name: network.name,
        tokenPrice: null,
        lastDayChange: null,
        marketCapitalization: null,
      };
    }
  });

  return result;
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

const EXCHANGE_DATA_API = {
  fetchPortfolioFiatPriceHistory,
  fetchPriceData,
  getPriceDataForNetwork,
};

export default EXCHANGE_DATA_API;
