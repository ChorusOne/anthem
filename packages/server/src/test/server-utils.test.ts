import {
  convertTimestampToUTC,
  filterSanityCheckHeights,
  formatTransactionResponse,
  getAveragePrice,
  mapSumToBalance,
  objectHasKeys,
  standardizeTimestamps,
} from "../tools/server-utils";
import { fiatPriceResponseData, transactionsResponseData } from "./test-data";

describe("Utils test", () => {
  test("formatTransactionResponse", () => {
    const result = transactionsResponseData.map(formatTransactionResponse);
    expect(result).toMatchSnapshot();
  });

  test("filterSanityCheckHeights", () => {
    const exampleResponse = [
      { height: 10000 },
      { height: 15968 },
      { height: 20000 },
      { height: 24580 },
      { height: 30000 },
      { height: 32475 },
      { height: 40000 },
      { height: 47894 },
      { height: 50000 },
      { height: 56372 },
      { height: 60000 },
    ];
    const result = exampleResponse.filter(filterSanityCheckHeights);
    expect(result).toEqual([
      { height: 15968 },
      { height: 24580 },
      { height: 32475 },
      { height: 47894 },
      { height: 56372 },
    ]);
  });

  test("mapSumToBalance", () => {
    const sums = [345, 689, 1928, 4982, 34432];
    for (const sum of sums) {
      const item = { sum };
      const result = mapSumToBalance(item);
      expect(result).toEqual({ ...item, balance: sum });
    }
  });

  test("objectHasKeys", () => {
    const obj = { a: "a", b: "b", c: "c" };
    let result = objectHasKeys(obj, ["a", "b", "c"]);
    expect(result).toBeTruthy();

    result = objectHasKeys(obj, ["a", "b"]);
    expect(result).toBeTruthy();

    result = objectHasKeys(obj, ["a", "b", "c", "d"]);
    expect(result).toBeFalsy();
  });

  test("convertTimestampToUTC", () => {
    const timestamps = [
      "2019-03-13T15:00:00.000Z",
      "2019-03-20T10:45:53.000Z",
      "2019-03-20T12:06:39.000Z",
      "2019-03-21T06:57:00.000Z",
      "2019-03-21T07:28:47.000Z",
    ];
    const result = timestamps.map(convertTimestampToUTC);
    expect(result).toMatchSnapshot();
  });

  test("standardizeTimestamps", () => {
    const timestamps = [
      { timestamp: "2019-03-13T15:00:00.000Z" },
      { timestamp: "2019-03-20T10:45:53.000Z" },
      { timestamp: "2019-03-20T12:06:39.000Z" },
      { timestamp: "2019-03-21T06:57:00.000Z" },
      { timestamp: "2019-03-21T07:28:47.000Z" },
    ];
    const result = standardizeTimestamps(timestamps);
    expect(result).toMatchSnapshot();
  });

  test("getAveragePrice", () => {
    const result = fiatPriceResponseData.map(getAveragePrice);
    expect(result).toMatchSnapshot();
  });
});
