import { IMsgDelegate, ITransaction, ITxMsg } from "@anthem/utils";
import * as Sentry from "@sentry/node";
import chalk from "chalk";
import { NextFunction, Request, Response } from "express";
import { GraphQLError } from "graphql";
import moment from "moment-timezone";
import { identity, ifElse, lensProp, over } from "ramda";
import { Price } from "../server/sources/exchange-data";
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

    console.log(operationName);

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
}: any): ITransaction => ({
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
export const objectHasKeys = (
  obj: any,
  keys: ReadonlyArray<string>,
): boolean => {
  for (const key of keys) {
    if (!(key in obj)) {
      return false;
    }
  }
  return true;
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
