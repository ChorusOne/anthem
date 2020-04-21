import { ApolloError } from "apollo-client";
import {
  abbreviateAddress,
  canRenderGraphQL,
  formatAddressString,
  getAccountBalances,
  getBlockExplorerUrlForTransaction,
  getPortfolioTypeFromUrl,
  getQueryParamsFromUrl,
  identity,
  onActiveRoute,
  trimZeroes,
} from "tools/generic-utils";
import accountBalances from "../../../utils/src/client/data/accountBalances.json";
import prices from "../../../utils/src/client/data/prices.json";

describe("utils", () => {
  test("onActiveRoute matches routes correctly", () => {
    expect(onActiveRoute("/dashboard", "Dashboard")).toBeTruthy();
    expect(onActiveRoute("/wallet", "Wallet")).toBeTruthy();
    expect(onActiveRoute("/governance", "Governance")).toBeTruthy();

    expect(onActiveRoute("/wallet", "Dashboard")).toBeFalsy();
    expect(onActiveRoute("/settings", "Dashboard")).toBeFalsy();
    expect(onActiveRoute("/help", "helped")).toBeFalsy();
  });

  test("getQueryParamsFromUrl", () => {
    const address = "90as7fd890a7fd90";
    const network = "kava";

    let result = getQueryParamsFromUrl(`?address=${address}`);
    expect(result).toEqual({
      address,
    });

    result = getQueryParamsFromUrl(`?address=${address}&network=${network}`);
    expect(result).toEqual({
      address,
      network,
    });
  });

  test("identity", () => {
    expect(identity(true)).toBe(true);
    expect(identity(false)).toBe(false);
    expect(identity("hello")).toBe("hello");
    expect(identity([1, 2, 3])).toEqual([1, 2, 3]);
  });

  // test("getMintScanUrlForTx", () => {
  //   const hash =
  //     "94a02c86b8dbddfe0d777918fdcad85c25df7ee34223c4056aef763ca01bcde6";
  //   const result = getBlockExplorerUrlForTransaction(hash);
  //   expect(result).toMatchInlineSnapshot(
  //     `"https://www.mintscan.io/txs/94a02c86b8dbddfe0d777918fdcad85c25df7ee34223c4056aef763ca01bcde6"`,
  //   );
  // });

  test("getAccountBalances", () => {
    const result = getAccountBalances(
      accountBalances.accountBalances,
      prices.prices,
      "uatom",
    );
    expect(result).toMatchInlineSnapshot(`
      Object {
        "balance": "11,755.13",
        "balanceUSD": "25,273.52",
        "commissions": "2,164.41",
        "commissionsUSD": "4,653.48",
        "delegations": "5,000.00",
        "delegationsUSD": "10,750.00",
        "percentages": Array [
          62.043110499630245,
          26.38981055700623,
          0.14342031469617697,
          0,
          11.42365862866735,
        ],
        "rewards": "27.17",
        "rewardsUSD": "58.42",
        "total": "18,946.71",
        "totalUSD": "40,735.42",
        "unbonding": "0",
        "unbondingUSD": "0",
      }
    `);
  });

  test("canRender", () => {
    // @ts-ignore
    const error: ApolloError = {};

    let result = canRenderGraphQL({ loading: false, data: {} });
    expect(result).toBeTruthy();

    result = canRenderGraphQL({ loading: false, error });
    expect(result).toBeFalsy();

    result = canRenderGraphQL({ loading: true });
    expect(result).toBeFalsy();
  });

  test("getPortfolioTypeFromUrl", () => {
    let result = getPortfolioTypeFromUrl("dashboard/available");
    expect(result).toBe("AVAILABLE");

    result = getPortfolioTypeFromUrl("dashboard/rewards");
    expect(result).toBe("REWARDS");

    result = getPortfolioTypeFromUrl("dashboard/settings");
    expect(result).toBe(null);
  });

  test("trimZeroes", () => {
    let result = trimZeroes("0.0007560000");
    expect(result).toBe("0.000756");

    result = trimZeroes("0.00075600900");
    expect(result).toBe("0.000756009");

    result = trimZeroes("0.0407560000");
    expect(result).toBe("0.040756");

    result = trimZeroes("0.00075600001");
    expect(result).toBe("0.00075600001");
  });

  test("formatAddressString", () => {
    const address = "cosmos1yeygh0y8rfyufdczhzytcl3pehsnxv9d3wsnlg";
    let result = formatAddressString(address, false);
    expect(result).toMatchInlineSnapshot(
      `"cosmos1yeygh0y8rfyufdczhzytcl3pehsnxv9d3wsnlg"`,
    );

    result = formatAddressString(address, true);
    expect(result).toMatchInlineSnapshot(`"cosmos1y...9d3wsnlg"`);

    result = formatAddressString(address, true, 6);
    expect(result).toMatchInlineSnapshot(`"cosmos1y...3wsnlg"`);

    result = formatAddressString(address, false, 12);
    expect(result).toMatchInlineSnapshot(
      `"cosmos1yeygh0y8rfyufdczhzytcl3pehsnxv9d3wsnlg"`,
    );
  });

  test("abbreviateAddress", () => {
    const address = "cosmos1yeygh0y8rfyufdczhzytcl3pehsnxv9d3wsnlg";
    let result = abbreviateAddress(address);
    expect(result).toMatchInlineSnapshot(`"cosmos1y...9d3wsnlg"`);

    result = abbreviateAddress(address, 10);
    expect(result).toMatchInlineSnapshot(`"cosmos1y...xv9d3wsnlg"`);
  });
});
