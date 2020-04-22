import { IMsgDelegate, ITransaction, ITxMsg } from "@anthem/utils";
import moment from "moment-timezone";
import { identity, ifElse, lensProp, over } from "ramda";
import { Price } from "../server/sources/exchange-data";

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
