import {
  ERRORS,
  ICosmosBalanceHistory,
  ICosmosTransaction,
  IMsgDelegate,
  ITxMsg,
  NETWORK_NAME,
  NetworkDefinition,
} from "@anthem/utils";
import * as Sentry from "@sentry/node";
import chalk from "chalk";
import { NextFunction, Request, Response } from "express";
import { GraphQLError } from "graphql";
import moment from "moment-timezone";
import { identity, ifElse, lensProp, over } from "ramda";
import { Price } from "../sources/fiat-price-data";
import ENV from "./server-env";

/** ===========================================================================
 * Server Utils for logging and error handling
 * ============================================================================
 */

class Logger {
  log = (message: string, logInAllEnvironments: boolean = false) => {
    if (ENV.DEVELOPMENT || logInAllEnvironments) {
      console.log(message);
    }
  };

  error = (error: any, logInAllEnvironments: boolean = false) => {
    if (ENV.DEVELOPMENT || logInAllEnvironments) {
      console.error(error);
    }
  };
}

export const logger = new Logger();

/**
 * Helper to log and format errors thrown when handling requests.
 */
export const requestErrorHandler = (error: GraphQLError): GraphQLError => {
  if (ENV.ENABLE_LOGGING) {
    console.log(chalk.red("Request Failed:"));
    console.log(chalk.red(`- ${JSON.stringify(error)}\n`));
  }

  // Report error to Sentry
  Sentry.captureException(error);

  return error;
};

/**
 * Send a message to Sentry.
 */
export const logSentryMessage = (message: string) => {
  Sentry.captureMessage(message);
};

/**
 * Logger util for standard logging for server requests.
 */
export const requestLogger = (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  if (ENV.ENABLE_LOGGING) {
    const { body } = req;
    const { operationName, variables } = body;

    // Don't log introspection query (clutter):
    if (Boolean(operationName) && operationName !== "IntrospectionQuery") {
      console.log(chalk.blue("Request Received:"));
      console.log(
        `- Query: ${operationName}\n- Variables: ${JSON.stringify(
          variables,
        )}\n`,
      );
    }
  }

  return next();
};

/** ===========================================================================
 * Utils
 * ============================================================================
 */

// Associate amount value to amounts key
const updateFn = over(lensProp("value"), (msg: IMsgDelegate) => ({
  ...msg,
  amounts: msg.amount,
}));

// Update amount key if it is an array
const updateAmounts = ifElse(
  ({ value }: ITxMsg) => {
    const { amount } = value as IMsgDelegate;
    return Boolean(amount && Array.isArray(amount));
  },
  updateFn,
  identity,
);

/**
 * Format the transaction response data.
 */
export const formatTransactionResponse = ({
  log,
  msgs,
  ...rest
}: any): ICosmosTransaction => ({
  ...rest,
  msgs: msgs.map(updateAmounts),
  log: Array.isArray(log) ? log : [log],
});

/**
 * Remove sanity check heights from the results, all the sanity check
 * heights are at 10_000 height intervals.
 */
export const filterSanityCheckHeights = (response: { height: number }) => {
  return response.height % 10000 !== 0;
};

/**
 * Convert response values with a sum field to a balance field
 * for consistency in response data.
 */
export const mapSumToBalance = (item: { sum: number }): { balance: number } => {
  return { ...item, balance: item.sum };
};

/**
 * Verify an object contains all of the given keys.
 */
export const hasKeys = (obj: any, keys: ReadonlyArray<string>): boolean => {
  for (const key of keys) {
    if (!(key in obj)) {
      return false;
    }
  }
  return true;
};

const DATE_FORMAT = "MMM-DD-YYYY";

/**
 * Get a date key based on the month/day/year.
 */
export const toDateKey = (date: string) => {
  return moment(date).format(DATE_FORMAT);
};

/**
 * Transform balances response capturing only the end of day values.
 */
export const gatherEndOfDayBalanceValues = (
  balances: ICosmosBalanceHistory[],
) => {
  const result: ICosmosBalanceHistory[] = [];
  const dates = new Set<string>();

  for (let i = balances.length - 1; i >= 0; i--) {
    const x = balances[i];
    const date = toDateKey(x.timestamp);

    // Key must account for the denom:
    const key = `${date}-${x.denom}`;
    if (!dates.has(key)) {
      result.push(x);
      dates.add(key);
    }
  }

  const endOfDayValues = result.reverse();
  return endOfDayValues;
};

/**
 * Convert a timestamp to UTC.
 */
export const convertTimestampToUTC = (timestamp: string | number | Date) => {
  const UTC_ISO = moment(new Date(timestamp))
    .tz("Etc/UTC")
    .toISOString();

  return UTC_ISO;
};

interface TimestampContainingType {
  timestamp: string;
}

/**
 * Convert all timestamps to the same ISO string format.
 */
export const standardizeTimestamps = (item: TimestampContainingType[]): any => {
  return item
    .filter((x: TimestampContainingType) => Boolean(x.timestamp))
    .map((x: TimestampContainingType) => {
      // Force timestamp to UTC and convert to string
      const ISO = convertTimestampToUTC(new Date(x.timestamp));
      return {
        ...x,
        timestamp: ISO,
      };
    });
};

/**
 * Calculate the OHLC average price for the price data.
 */
export const getAveragePrice = (price: Price) => {
  const { open, high, low, close } = price;
  return (open + high + low + close) / 4;
};

/**
 * Validate a pagination param. Param must be a non-decimal positive
 * whole number.
 */
export const validatePaginationParams = (param: any, defaultValue: number) => {
  const candidate = Number(param);
  if (!isNaN(candidate) && candidate % 1 === 0 && candidate > 0) {
    return candidate;
  } else {
    return defaultValue;
  }
};

/**
 * Block networks based on feature flag support.
 */
export const blockUnsupportedNetworks = (
  network: NetworkDefinition,
  allowedNetworkNames: Set<NETWORK_NAME>,
  feature?: "portfolio" | "transactions" | "balances",
) => {
  /**
   * This can occur when the app network is switching and components are in
   * process of handling updates. More logic could be added to the react-apollo
   * query setup to avoid querying certain APIs if the network doesn't match.
   */
  if (!allowedNetworkNames.has(network.name)) {
    throw new Error(
      `Invalid network argument supplied for this resolver API. Received: ${network.name}. (NOTE: This is probably OK and not a bug).`,
    );
  }

  if (!feature) {
    return;
  }

  switch (feature) {
    case "portfolio":
      if (!network.supportsPortfolio) {
        throw new Error(ERRORS.NETWORK_NOT_SUPPORTED(network));
      }
      break;
    case "balances":
      if (!network.supportsBalances) {
        throw new Error(ERRORS.NETWORK_NOT_SUPPORTED(network));
      }
      break;
    case "transactions":
      if (!network.supportsTransactionsHistory) {
        throw new Error(ERRORS.NETWORK_NOT_SUPPORTED(network));
      }
      break;
  }
};
