import moment from "moment-timezone";

/** ===========================================================================
 * Date & Time Utils
 * ============================================================================
 */

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

export const toDateKey = (date: string | number | Date) => {
  const tz = setTimeZone(date);
  return tz.format(DATE_FORMAT);
};

export const toDateKeyBackOneDay = (date: string | number | Date) => {
  const tz = setTimeZone(date).subtract(60, "minutes");
  return tz.format(DATE_FORMAT);
};

export const fromDateKey = (date: string) => {
  return moment(date, DATE_FORMAT);
};

export const formatDate = (timestamp: string | number | Date): string => {
  return moment(timestamp).format(DATE_FORMAT);
};

export const formatTime = (timestamp: number): string => {
  return moment(timestamp).format("HH:mm:ss");
};

export const formatFiatPriceDate = (date: string | number | Date) => {
  return moment(date).format("MM-DD-YYYY");
};

export const getDateInFuture = (date: Date, daysInFuture: number) => {
  return moment(date)
    .add(daysInFuture, "days")
    .format(DATE_FORMAT);
};
