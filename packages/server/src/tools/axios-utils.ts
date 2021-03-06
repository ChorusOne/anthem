import { assertUnreachable, NETWORK_NAME } from "@anthem/utils";
import axios from "axios";
import moment from "moment";
import ENV from "../tools/server-env";
import { logger } from "../tools/server-utils";

/** ===========================================================================
 * Hosts
 * ============================================================================
 */

const CRYPTO_COMPARE = "https://min-api.cryptocompare.com";

const HOSTS = {
  CRYPTO_COMPARE,
  CELO: ENV.CELO_EXTRACTOR_API,
  OASIS: ENV.OASIS_EXTRACTOR_API,
  KAVA_LCD: ENV.KAVA_LCD_NODE,
  TERRA_LCD: ENV.TERRA_LCD_NODE,
  COSMOS_LCD: ENV.COSMOS_LCD_NODE,
};

const hostsList = Object.values(HOSTS);

/**
 * Find the host API given the network.
 */
export const getHostFromNetworkName = (network: NETWORK_NAME) => {
  switch (network) {
    case "COSMOS":
      return HOSTS.COSMOS_LCD;
    case "TERRA":
      return HOSTS.TERRA_LCD;
    case "KAVA":
      return HOSTS.KAVA_LCD;
    case "OASIS":
      return HOSTS.OASIS;
    case "CELO":
      return HOSTS.CELO;
    case "POLKADOT":
      return "";
    default:
      return assertUnreachable(network);
  }
};

/** ===========================================================================
 * Cache Util for Crypto Compare price data
 * ============================================================================
 */

/**
 * Only cache requests to the Crypto Compare API.
 */
const shouldCacheFiatQuery = (url: string) => {
  // TODO: Separate the caching logic in the future!
  return (
    url.includes(`${CRYPTO_COMPARE}/data/histoday?fsym=`) ||
    url.includes(`${CRYPTO_COMPARE}/data/v2/histohour?fsym=`)
  );
};

/**
 * Simple in-memory cache object.
 */
const cache = new Map();

/**
 * Cache a response for a url if the url is a request to the Crypto Compare
 * API. This caches the response data and the time it was recorded.
 */
const maybeCacheResponse = (url: string, response: any) => {
  try {
    const urlKey = url.slice(0, 25);
    logger.log(
      `[CRYPTO COMPARE CACHE]: Caching response for url: ${urlKey}...`,
    );
    cache.set(url, {
      time: Date.now(),
      response,
    });
  } catch (err) {
    logger.log(
      `[CRYPTO COMPARE CACHE]: Error caching response - ${err.message}`,
    );
  }
};

const differenceInHours = (dateOne: number, dateTwo: number) => {
  return moment(dateOne).diff(dateTwo, "hours");
};

const differenceInSeconds = (dateOne: number, dateTwo: number) => {
  return moment(dateOne).diff(dateTwo, "seconds");
};

/**
 * Return a cached response for a url if it exists. The cache is invalidated
 * every 8 hours.
 */
const fetchFromCacheIfExists = (url: string) => {
  const time = Date.now();

  if (cache.has(url)) {
    const cachedTime = cache.get(url).time;

    // Handle different cache timeouts based on the requested resource.
    if (url.includes("histoday")) {
      const hourDifference = differenceInHours(time, cachedTime);
      if (hourDifference > 24) {
        throw new Error(
          "Cache invalidated for historical price history entry - fetch again!",
        );
      }
    } else if (url.includes("histohour")) {
      const minuteDifference = differenceInSeconds(time, cachedTime);
      if (minuteDifference > 1) {
        throw new Error(
          "Cache invalidated for price quote entry - fetch again!",
        );
      }
    }

    const cachedResponse = cache.get(url).response;
    return cachedResponse;
  } else {
    throw new Error("No cached value - fetch it!");
  }
};

/** ===========================================================================
 * Axios Helper Class
 * ----------------------------------------------------------------------------
 * This is a wrapper class around axios which can provide some helpful
 * functionality, like retry logic.
 * ============================================================================
 */

class AxiosHelperClass {
  get = async <T extends any>(url: string, retryLimit = 0): Promise<T> => {
    try {
      const urlKey = url.slice(0, 25);
      const shouldCache = shouldCacheFiatQuery(url);
      if (shouldCache) {
        try {
          // Try to return the cached response early if it exists.
          const cachedResponse = fetchFromCacheIfExists(url);
          logger.log(
            `[CRYPTO COMPARE CACHE]: Returning cached response for url: ${urlKey}...`,
            true,
          );
          return cachedResponse;
        } catch (err) {
          logger.log(
            `[CRYPTO COMPARE CACHE]: No cached response found for url: ${urlKey} - fetching...`,
          );
        }
      }

      const result = await axios.get(url);
      const response = result.data;

      if (shouldCacheFiatQuery(url)) {
        maybeCacheResponse(url, response);
      }

      return response;
    } catch (err) {
      if (retryLimit === 0) {
        throw err;
      } else {
        return this.get(url, retryLimit - 1);
      }
    }
  };
}

const AxiosUtil = new AxiosHelperClass();

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { HOSTS, hostsList, AxiosUtil };
