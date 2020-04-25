import { NETWORKS } from "@anthem/utils";
import { ApolloError } from "apollo-client";
import {
  abbreviateAddress,
  canRenderGraphQL,
  capitalizeString,
  formatAddressString,
  formatValidatorsList,
  getAccountBalances,
  getBlockExplorerUrlForTransaction,
  getFiatPriceHistoryMap,
  getPortfolioTypeFromUrl,
  getPriceFromTransactionTimestamp,
  getQueryParamsFromUrl,
  getValidatorNameFromAddress,
  getValidatorOperatorAddressMap,
  identity,
  isGraphQLResponseDataEmpty,
  justFormatChainString,
  mapRewardsToAvailableRewards,
  onActiveRoute,
  onPath,
  race,
  trimZeroes,
  wait,
} from "tools/generic-utils";
import accountBalances from "../../../utils/src/client/data/accountBalances.json";
import { fiatPriceHistory } from "../../../utils/src/client/data/fiatPriceHistory.json";
import prices from "../../../utils/src/client/data/prices.json";
import { rewardsByValidator } from "../../../utils/src/client/data/rewardsByValidator.json";
import { transactions } from "../../../utils/src/client/data/transactions.json";
import { validators } from "../../../utils/src/client/data/validators.json";

describe("utils", () => {
  test("abbreviateAddress", () => {
    expect(
      abbreviateAddress("cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd"),
    ).toMatchInlineSnapshot(`"cosmos15...49um7trd"`);

    expect(
      abbreviateAddress("cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd", 5),
    ).toMatchInlineSnapshot(`"cosmos15...m7trd"`);

    expect(
      abbreviateAddress("cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd", 7),
    ).toMatchInlineSnapshot(`"cosmos15...9um7trd"`);
  });

  test("capitalizeString", () => {
    expect(capitalizeString("APPLES")).toBe("Apples");
    expect(capitalizeString("Banana")).toBe("Banana");
    expect(capitalizeString("oranGES")).toBe("Oranges");
    expect(capitalizeString("pEACHES")).toBe("Peaches");
    expect(capitalizeString("apples AND BANANAS")).toBe("Apples and bananas");
  });

  test("formatValidatorsList", () => {
    const result = formatValidatorsList(validators);
    expect(result[0].description.moniker).toBe("Chorus One");
    expect(result[1].description.moniker).toBe("Certus One");
  });

  test("getBlockExplorerUrlForTransaction", () => {
    let result = getBlockExplorerUrlForTransaction(
      "5C8E06175EE62495A4A2DE82AA0AD8F5E0E11EFC825A7673C1638966E97ABCA0",
      "COSMOS",
    );
    expect(result).toMatchInlineSnapshot(
      `"https://www.mintscan.io/txs/5C8E06175EE62495A4A2DE82AA0AD8F5E0E11EFC825A7673C1638966E97ABCA0"`,
    );

    result = getBlockExplorerUrlForTransaction(
      "5C8E06175EE62495A4A2DE82AA0AD8F5E0E11EFC825A7673C1638966E97ABCA0",
      "KAVA",
    );
    expect(result).toMatchInlineSnapshot(
      `"https://kava.mintscan.io/txs/5C8E06175EE62495A4A2DE82AA0AD8F5E0E11EFC825A7673C1638966E97ABCA0"`,
    );

    result = getBlockExplorerUrlForTransaction(
      "5C8E06175EE62495A4A2DE82AA0AD8F5E0E11EFC825A7673C1638966E97ABCA0",
      "TERRA",
    );
    expect(result).toMatchInlineSnapshot(
      `"https://terra.stake.id/?#/tx/5C8E06175EE62495A4A2DE82AA0AD8F5E0E11EFC825A7673C1638966E97ABCA0"`,
    );
  });

  test("getFiatPriceHistoryMap", () => {
    const result = getFiatPriceHistoryMap(fiatPriceHistory);
    for (const price of Object.values(result)) {
      expect(typeof price).toBe("number");
    }
  });

  test("getPriceFromTransactionTimestamp", () => {
    const priceMap = getFiatPriceHistoryMap(fiatPriceHistory);
    let result = getPriceFromTransactionTimestamp(
      transactions[0].timestamp,
      priceMap,
    );
    expect(result).toMatchInlineSnapshot(`2.17075`);

    result = getPriceFromTransactionTimestamp(
      transactions[1].timestamp,
      priceMap,
    );
    expect(result).toMatchInlineSnapshot(`2.17075`);

    result = getPriceFromTransactionTimestamp(
      transactions[2].timestamp,
      priceMap,
    );
    expect(result).toMatchInlineSnapshot(`3.5997500000000002`);
  });

  test("getValidatorOperatorAddressMap", () => {
    const result = getValidatorOperatorAddressMap(validators);
    for (const [key, value] of Object.entries(result)) {
      expect(key).toBe(value.operator_address);
    }
  });

  test("getValidatorNameFromAddress", () => {
    const validatorMap = getValidatorOperatorAddressMap(validators);
    const result = getValidatorNameFromAddress(
      validatorMap,
      "cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd",
      "COSMOS",
    );

    // @ts-ignore
    expect(result.description.moniker).toBe("Chorus One");
  });

  test("isGraphQLResponseDataEmpty", () => {
    expect(isGraphQLResponseDataEmpty()).toBeTruthy();
    expect(isGraphQLResponseDataEmpty(undefined)).toBeTruthy();
    expect(isGraphQLResponseDataEmpty({})).toBeTruthy();
    expect(isGraphQLResponseDataEmpty({ data: {} })).toBeFalsy();
  });

  test("justFormatChainString", () => {
    expect(justFormatChainString("cosmoshub-1")).toBe("Cosmos Hub 1");
    expect(justFormatChainString("cosmoshub-2")).toBe("Cosmos Hub 2");
    expect(justFormatChainString("cosmoshub-3")).toBe("Cosmos Hub 3");
  });

  test("mapRewardsToAvailableRewards", () => {
    const result = mapRewardsToAvailableRewards(
      rewardsByValidator,
      NETWORKS.COSMOS,
    );
    for (const reward of result) {
      expect(+reward.amount > 1).toBeTruthy();
    }
  });

  test("onPath", () => {
    expect(
      onPath("https://anthem.chorus.one/dashboard/rewards", "rewards"),
    ).toBeTruthy();

    expect(
      onPath("https://anthem.chorus.one/dashboard/rewards", "staking"),
    ).toBeFalsy();
  });

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

  test("getAccountBalances", () => {
    const result = getAccountBalances(
      accountBalances.accountBalances,
      prices.prices,
      "uatom",
    );
    expect(result).toMatchInlineSnapshot(`
      Object {
        "balance": "348.59",
        "balanceFiat": "794.79",
        "commissions": "2,393.86",
        "commissionsFiat": "5,458.01",
        "delegations": "5,000.00",
        "delegationsFiat": "11,400.00",
        "percentages": Array [
          4.484583822134841,
          64.32421906145976,
          0.39453265704926765,
          0,
          30.79666445935613,
        ],
        "rewards": "30.67",
        "rewardsFiat": "69.92",
        "total": "7,773.12",
        "totalFiat": "17,722.72",
        "unbonding": "0",
        "unbondingFiat": "0",
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

  test("race", async () => {
    try {
      await race<any>(
        async () =>
          new Promise(resolve => setTimeout(() => resolve(null), 5000)),
      );
    } catch (error) {
      expect(error).toBe("race timeout occurred");
    }

    expect(
      await race<any>(
        async () => new Promise(resolve => setTimeout(() => resolve(null), 50)),
      ),
    ).toBe(null);
  });

  test("wait", async () => {
    const then = Date.now();
    await wait(500);
    const expected = then + 500;
    expect(Date.now() - expected < 10).toBeTruthy();
  });
});
