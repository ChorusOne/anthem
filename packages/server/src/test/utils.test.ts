import NETWORKS_LIST from "../server/sources/networks";
import {
  convertTimestampToUTC,
  deriveNetworkFromAddress,
  filterSanityCheckHeights,
  formatTransactionResponse,
  getAveragePrice,
  getNetworkDefinitionFromIdentifier,
  getValidatorAddressFromDelegatorAddress,
  mapSumToBalance,
  objectHasKeys,
  standardizeTimestamps,
} from "../tools/utils";
import { fiatPriceResponseData, transactionsResponseData } from "./test-data";

describe("Utils test", () => {
  test("formatTransactionResponse", () => {
    const result = transactionsResponseData.map(formatTransactionResponse);
    expect(result).toMatchSnapshot();
  });

  test("getValidatorAddressFromDelegatorAddress", () => {
    const addr = "cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd";
    let result = getValidatorAddressFromDelegatorAddress(addr, "COSMOS");
    expect(result).toBe("cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707");

    result = getValidatorAddressFromDelegatorAddress("sadf", "COSMOS");
    expect(result).toBe(null);
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

  test("deriveNetworkFromAddress", () => {
    let result = deriveNetworkFromAddress(
      "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
    );
    expect(result).toEqual(NETWORKS_LIST.COSMOS);

    result = deriveNetworkFromAddress(
      "terra1sszc3mgur52wuln2t3slh796mgceweqlp7zkky",
    );
    expect(result).toEqual(NETWORKS_LIST.TERRA);

    result = deriveNetworkFromAddress(
      "kava1wu8m65vqazssv2rh8rthv532hzggfr3hgtcx6j",
    );
    expect(result).toEqual(NETWORKS_LIST.KAVA);

    expect(() => deriveNetworkFromAddress("blegh")).toThrow();
  });

  test("getNetworkDefinitionFromIdentifier", () => {
    let result = getNetworkDefinitionFromIdentifier("COSMOS");
    expect(result).toEqual(NETWORKS_LIST.COSMOS);

    result = getNetworkDefinitionFromIdentifier("TERRA");
    expect(result).toEqual(NETWORKS_LIST.TERRA);

    result = getNetworkDefinitionFromIdentifier("KAVA");
    expect(result).toEqual(NETWORKS_LIST.KAVA);

    expect(() => getNetworkDefinitionFromIdentifier("blegh")).toThrow();
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
