import {
  assertUnreachable,
  IQuery,
  NETWORK_NAME,
  NetworkDefinition,
  NETWORKS,
} from "@anthem/utils";
import moment from "moment-timezone";
import ENV from "../../tools/server-env";
import {
  convertTimestampToUTC,
  getAveragePrice,
} from "../../tools/server-utils";
import { AxiosUtil, HOSTS } from "../axios-utils";
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
 * Fetch currency exchange price data for a currency pair.
 */
const fetchExchangeRate = async (
  currencyId: string,
  versusId: string,
): Promise<IQuery["prices"]> => {
  const versus = versusId.toUpperCase();
  const currency = currencyId.toUpperCase();

  const url = `${HOSTS.CRYPTO_COMPARE}/data/price?fsym=${currency}&tsyms=${versus}`;

  // The API may fail from time to time, add a retry allowance:
  const result = await AxiosUtil.get(url, 2);

  return {
    price: result[versus],
  };
};

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
  const result = await AxiosUtil.get(url);
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
  const result = await AxiosUtil.get(url);

  const data = result.RAW;
  const values = data[from][to];

  return {
    price: values.PRICE,
    lastDayChange: values.CHANGEPCT24HOUR,
  };
};

/**
 * Fetch 24hr percent price change for a currency pair.
 */
const fetchDailyPercentChangeInPrice = async (
  crypto: string,
  fiat: string,
): Promise<string> => {
  // Validate the input
  const from = crypto.toUpperCase();
  const to = fiat.toUpperCase();

  const url = `${HOSTS.CRYPTO_COMPARE}/data/v2/histohour?fsym=${from}&tsym=${to}&limit=24&api_key=${ENV.CRYPTO_COMPARE_API_KEY}`;

  // Fetch the price change
  const result = await AxiosUtil.get(url);

  const prices: ReadonlyArray<Price> = result.Data.Data;

  // Get the average price 24 hours ago and now
  const average = (price: Price) => (price.high + price.low) / 2;
  const priceThen = average(prices[0]);
  const priceNow = average(prices[prices.length - 1]);

  // Determine the percent change
  const change = (priceNow - priceThen) / priceNow;
  const percentage = change * 100;

  // Format
  return percentage.toFixed(2);
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

    default:
      assertUnreachable(name);
      return [];
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
  const response = await AxiosUtil.get(url);
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
  fetchDailyPercentChangeInPrice,
  fetchPortfolioFiatPriceHistory,
  fetchExchangeRate,
  getPriceDataForNetwork,
  fetchPriceData,
};

export default EXCHANGE_DATA_API;
