import axios from "axios";
import fs from "fs";

import FIAT_CURRENCIES, {
  FiatCurrency,
} from "../src/server/sources/fiat-currencies";
import NETWORKS from "../src/server/sources/networks";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface CoinHistoryResponse {
  id: string;
  symbol: string;
  name: string;
  localization: { [key: string]: string };
  image: { [key: string]: string };
  market_data: {
    current_price: { [key: string]: number };
    market_cap: { [key: string]: number };
    total_volume: { [key: string]: number };
  };
}

interface PriceData {
  [key: string]: number;
}

interface PriceMap {
  [key: string]: PriceData;
}

type Nullable<T> = T | null;

/** ===========================================================================
 * Coin Price History Script
 * ----------------------------------------------------------------------------
 * Quick util for fetching the price data for ATOMs and saving it to a JSON
 * file.
 *
 * NOTE: To use this script uncomment the network you want to run it for from
 * the list below and then run the script.
 * ============================================================================
 */

// const NETWORK = "COSMOS";
const NETWORK = "KAVA";
// const NETWORK = "TERRA";

const COIN = NETWORKS[NETWORK].coinGeckoTicker;

const FILE_PATHS_BY_NETWORK = {
  COSMOS: "src/server/sources/atom-price-history-cosmos-hub-1.json",
  KAVA: "src/server/sources/price-history/kava.json",
  TERRA: "src/server/sources/price-history/terra.json",
};

const FILE_PATH = FILE_PATHS_BY_NETWORK[NETWORK];

const DATES_BY_NETWORK = {
  COSMOS: {
    START: new Date("02/22/2019"),
    END: new Date("04/25/2019"),
  },
  KAVA: {
    START: new Date("10/26/2019"),
    END: new Date("11/25/2019"),
  },
  TERRA: {
    START: new Date("02/22/2019"),
    END: new Date("04/25/2019"),
  },
};

const { START, END } = DATES_BY_NETWORK[NETWORK];

/**
 * Get a map of all the existing fiat currency symbols.
 */
const fiatCurrencyMap = FIAT_CURRENCIES.reduce(
  (symbols: ReadonlyArray<string>, fiat: FiatCurrency) => {
    return [...symbols, fiat.symbol];
  },
  [],
);

/**
 * Build a date range from the `INITIAL_DATE` to `NOW`.
 */
let dateRange: ReadonlyArray<Date> = [];
for (const d = new Date(START); d <= END; d.setDate(d.getDate() + 1)) {
  dateRange = dateRange.concat(new Date(d));
}

/**
 * Get a CoinGecko API URL for a given date.
 */
const getUrl = (date: string) => {
  return `https://api.coingecko.com/api/v3/coins/${COIN}/history?date=${date}`;
};

/**
 * Convert the date format to what CoinGecko wants: `DD/MM/YYYY`.
 *
 * @param d date
 * @returns formatted date string `DD/MM/YYYY`
 */
export const encodeDateFormat = (d: Date) => {
  const pad = (s: number) => (s < 10 ? `0${s}` : s);
  return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("-");
};

/**
 * Map the url list and convert the date strings.
 */
const urlList: ReadonlyArray<readonly [string, string]> = dateRange
  .map(encodeDateFormat)
  .map(d => [d, getUrl(d)]);

/**
 * Transform the result to the data we want to save.
 */
const transformResult = (response: CoinHistoryResponse): PriceData => {
  const result: { [key: string]: number } = {};
  const prices = response.market_data.current_price;

  for (const symbol of fiatCurrencyMap) {
    // tslint:disable-next-line
    result[symbol] = prices[symbol.toLowerCase() as keyof typeof prices];
  }

  return result;
};

/**
 * Fetch the price history from the CoinGecko API.
 */
const fetchCoinPriceHistory = async (
  urlData: readonly [string, string],
): Promise<Nullable<readonly [string, PriceData]>> => {
  const [date, url] = urlData;
  try {
    const result = await axios.get<CoinHistoryResponse>(url);
    const prices = transformResult(result.data);
    return [date, prices];
  } catch (err) {
    return null;
  }
};

/**
 * Batch the requests to avoid rate limiting from the API...
 */
const batchRequests = (
  requests: ReadonlyArray<any>,
): ReadonlyArray<ReadonlyArray<any>> => {
  const BATCH_SIZE = 5;

  let idx = 0;
  const batches: ReadonlyArray<any> = [];
  for (let i = 0; i < requests.length; i += BATCH_SIZE) {
    // @ts-ignore
    // tslint:disable-next-line
    batches[idx] = requests.slice(i, i + BATCH_SIZE);
    idx = idx + 1;
  }

  return batches;
};

/**
 * Fetch the price history for all the urls.
 */
const fetchAllHistory = async (
  urls: ReadonlyArray<readonly [string, string]>,
): Promise<PriceMap> => {
  const batchedRequests = batchRequests(urls);

  let count = 1;
  const results: PriceMap = {};
  const DELAY = 1000;

  for (const batch of batchedRequests) {
    console.log(`- Processing batch ${count} of ${batchedRequests.length}`);

    /* Add a delay */
    await new Promise((_: any) => setTimeout(_, DELAY));

    /* Fetch the batch */
    const result = await Promise.all(batch.map(fetchCoinPriceHistory));

    /* Add the results */
    for (const priceData of result) {
      if (priceData === null) {
        break;
      }

      const [date, prices] = priceData;

      /**
       * Iterate over all the results and combine them with the existing
       * prices data for each fiat currency.
       */
      Object.entries(prices).forEach(([fiatKey, price]) => {
        if (fiatKey in results) {
          // tslint:disable-next-line
          results[fiatKey] = {
            ...results[fiatKey],
            [date]: price,
          };
        } else {
          // tslint:disable-next-line
          results[fiatKey] = {
            [date]: price,
          };
        }
      });
    }

    /* Increment the count */
    count = count + 1;
  }

  return results;
};

/**
 * Write the result to disk.
 */
const writeResultFile = (result: PriceMap) => {
  const historyLength = Object.keys(result.USD).length;
  const currenciesLength = Object.keys(result).length;

  console.log(
    `\n- Saving ${historyLength} dates for ${currenciesLength} currencies!`,
  );
  fs.writeFileSync(FILE_PATH, JSON.stringify(result));
  console.log("- Complete!\n");
};

/**
 * Check if a date is valid.
 */
const isDateValid = (d: any): boolean => {
  return d instanceof Date && !isNaN(d as any);
};

/**
 * Validate the input dates.
 */
const validateDates = (start: Date, end: Date) => {
  if (!isDateValid(start) || !isDateValid(end)) {
    throw new Error(`Invalid date(s) received! ${start} - ${end}`);
  } else if (start === end) {
    throw new Error("Received the same starting and ending dates");
  } else if (start > end) {
    throw new Error(
      "Most recent history already recorded: received the same starting and ending dates",
    );
  }
};

/**
 * Run the script.
 */
(async () => {
  validateDates(START, END);

  console.log(
    `\n- Fetching price history for ${
      urlList.length
    } dates: from ${START.toDateString()} to ${END.toDateString()}`,
  );
  const priceHistory = await fetchAllHistory(urlList);
  writeResultFile(priceHistory);
})();
