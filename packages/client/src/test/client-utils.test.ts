import { NETWORKS } from "@anthem/utils";
import { ApolloError } from "apollo-client";
import {
  abbreviateAddress,
  adaptRawTransactionData,
  canRenderGraphQL,
  capitalizeString,
  formatAddressString,
  formatCommissionRate,
  formatVotingPower,
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
  sortValidatorsChorusOnTop,
  trimZeroes,
  wait,
} from "tools/client-utils";
import accountBalances from "../../../utils/src/client/data/accountBalances.json";
import { cosmosTransactions } from "../../../utils/src/client/data/cosmosTransactions.json";
import { fiatPriceHistory } from "../../../utils/src/client/data/fiatPriceHistory.json";
import prices from "../../../utils/src/client/data/prices.json";
import { rewardsByValidator } from "../../../utils/src/client/data/rewardsByValidator.json";
import { validators } from "../../../utils/src/client/data/validators.json";
import { MOCK_BLOCKCHAIN_TRANSACTION_RESULT } from "./data/mock-blockchain-transactions-result";

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
    const result = sortValidatorsChorusOnTop(validators);
    expect(result[0].description.moniker).toBe("Chorus One");
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
      cosmosTransactions.data[0].timestamp,
      priceMap,
    );
    expect(result).toMatchInlineSnapshot(`2.17075`);

    result = getPriceFromTransactionTimestamp(
      cosmosTransactions.data[1].timestamp,
      priceMap,
    );
    expect(result).toMatchInlineSnapshot(`2.17075`);

    result = getPriceFromTransactionTimestamp(
      cosmosTransactions.data[2].timestamp,
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
      // @ts-ignore
      accountBalances.accountBalances.cosmos,
      prices.prices,
      NETWORKS.COSMOS,
    );
    expect(result).toMatchInlineSnapshot(`
      Object {
        "balance": "348.59",
        "balanceFiat": "920.27",
        "commissions": "4,969.98",
        "commissionsFiat": "13,120.75",
        "delegations": "5,000.00",
        "delegationsFiat": "13,200.00",
        "percentages": Array [
          3.3574336217298053,
          48.157536838781525,
          0.6166118797208389,
          0,
          47.86841765976783,
        ],
        "rewards": "64.02",
        "rewardsFiat": "169.01",
        "total": "10,382.59",
        "totalFiat": "27,410.04",
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

  test("formatCommissionRate", () => {
    expect(formatCommissionRate("0.0025000000")).toBe("0.25");
    expect(formatCommissionRate("0.00750")).toBe("0.75");
    expect(formatCommissionRate("0.08")).toBe("8.00");
    expect(formatCommissionRate("0.075000000000")).toBe("7.50");
    expect(formatCommissionRate("0.075250000000")).toBe("7.53");
  });

  test("formatVotingPower", () => {
    const total = "184117466747846";
    expect(formatVotingPower("74843655191", total)).toMatchInlineSnapshot(
      `"0.04"`,
    );
    expect(formatVotingPower("5601876912537", total)).toMatchInlineSnapshot(
      `"3.04"`,
    );
    expect(formatVotingPower("1604729095336", total)).toMatchInlineSnapshot(
      `"0.87"`,
    );
    expect(formatVotingPower("67605300547", total)).toMatchInlineSnapshot(
      `"0.04"`,
    );
    expect(formatVotingPower("252362566166", total)).toMatchInlineSnapshot(
      `"0.14"`,
    );
  });

  test.todo("adaptRawTransactionData", () => {
    // TODO: Perform assertions...
    // const result = adaptRawTransactionData(
    //   MOCK_BLOCKCHAIN_TRANSACTION_RESULT,
    //   "cosmoshub-3",
    // );
  });
});
