import moment from "moment-timezone";

/** ===========================================================================
 * Date & Time Utils
 * ============================================================================
 */

type GenericDateFormat = string | number | Date;

const UTC_TIMEZONE = "Etc/UTC";
const DATE_FORMAT = "MMM DD, YYYY";

const setTimeZone = (date: any) => {
  // If the date is provided in the DATE_FORMAT then specify this format
  // so moment can understand.
  if (date.length === 12) {
    return moment.tz(date, DATE_FORMAT, UTC_TIMEZONE);
  }

  return moment.tz(date, UTC_TIMEZONE);
};

/**
 * Convert a date to a string date key.
 */
export const toDateKey = (date: GenericDateFormat) => {
  const tz = setTimeZone(date);
  return tz.format(DATE_FORMAT);
};

/**
 * Convert a date to a string date key, on the previous day. We adjust
 * backwards by 1 minute because the Cosmos Extractor extracts rewards
 * values on the first bloch height of every day, but we need to 'adjust'
 * these values backwards because they actually represent the rewards
 * accumulated at the end of the previous day. This first block will occur
 * within 5-10 seconds of the start of the day, so by adjusting backwards
 * by 1 minute this should adjust this timestamp backwards to the previous
 * day.
 */
export const toDateKeyBackOneDay = (date: GenericDateFormat) => {
  const tz = setTimeZone(date).subtract(1, "minutes");
  return tz.format(DATE_FORMAT);
};

/**
 * Get a date from a date key.
 */
export const fromDateKey = (date: string) => {
  return moment(date, DATE_FORMAT);
};

/**
 * Format a date.
 */
export const formatDate = (timestamp: GenericDateFormat): string => {
  return moment(timestamp).format(DATE_FORMAT);
};

/**
 * Format a time.
 */
export const formatTime = (timestamp: GenericDateFormat): string => {
  return moment(timestamp).format("HH:mm:ss");
};

/**
 * Format a fiat price date.
 */
export const formatFiatPriceDate = (date: GenericDateFormat) => {
  return moment(date).format("MM-DD-YYYY");
};

/**
 * Get a date some das in the future.
 */
export const getDateInFuture = (date: Date, daysInFuture: number) => {
  return moment(date)
    .add(daysInFuture, "days")
    .format(DATE_FORMAT);
};
