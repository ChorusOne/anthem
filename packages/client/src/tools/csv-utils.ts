import {
  CoinDenom,
  coinDenomToName,
  IFiatPrice,
  NetworkDefinition,
} from "@anthem/utils";
import { ChartData } from "./chart-utils";
import {
  getFiatPriceHistoryMap,
  isGraphQLResponseDataEmpty,
} from "./client-utils";
import {
  getChartTotalGraph,
  PortfolioHistoryChartData,
} from "./cosmos-chart-utils";
import { add, multiply, subtract } from "./math-utils";

/** ===========================================================================
 * CSV Utils
 * ============================================================================
 */

// Process the chart data and create a string CSV value for download.
export const chartExportBuilder = ({
  address,
  network,
  fiatPriceHistory,
  fiatCurrencySymbol,
  portfolioChartHistory,
  supportsFiatPrices,
  selectedDenom,
}: {
  address: string;
  network: NetworkDefinition;
  fiatCurrencySymbol: string;
  fiatPriceHistory: IFiatPrice[];
  portfolioChartHistory: PortfolioHistoryChartData;
  supportsFiatPrices: boolean;
  selectedDenom: CoinDenom;
}): string => {
  const {
    availableChartData,
    rewardsChartData,
    delegationsChartData,
    unbondingChartData,
    validatorRewardsChartData,
    validatorDailySummary,
  } = portfolioChartHistory;
  const chartTotal = getChartTotalGraph(portfolioChartHistory);

  const INCLUDE_VALIDATOR_COMMISSIONS = !isGraphQLResponseDataEmpty(
    validatorRewardsChartData.data,
  );

  const fiatPriceMap = getFiatPriceHistoryMap(fiatPriceHistory, "MMM DD, YYYY");

  const setFiatValue = (value: string | number) => {
    if (supportsFiatPrices) {
      return String(value);
    } else {
      return "n/a";
    }
  };

  // Map balances by day timestamp to help join balances and rewards data.
  const balanceMapByTime = availableChartData.data;

  const { denom } = selectedDenom;
  const coin = coinDenomToName(denom);

  // Create the CSV Header.
  let CSV_HEADERS: ReadonlyArray<string> = [
    "Timestamp",
    `Exchange Rate (${fiatCurrencySymbol}:${coin})`,
    `Total Balance (${coin})`,
    `Available Balance (${coin})`,
    `Staked Balance (${coin})`,
    `Unbonded Balance (${coin})`,
    `Daily Rewards (${coin})`,
    `Daily Rewards (${fiatCurrencySymbol})`,
    `Accumulated Rewards (${coin})`,
    `Reward Withdrawals (${coin})`,
    `Reward Pool (${coin})`,
  ];

  // Add validator CSV headers if applicable.
  if (INCLUDE_VALIDATOR_COMMISSIONS) {
    CSV_HEADERS = CSV_HEADERS.concat([
      `Daily Commissions (${coin})`,
      `Daily Commissions (${fiatCurrencySymbol})`,
      `Accumulated Commissions (${coin})`,
      `Commission Withdrawals (${coin})`,
      `Commissions Pool (${coin})`,
    ]);
  }

  // Add info text about the address and network
  const ADDRESS_INFO = `Account history data for ${network.name} address ${address}.\n`;
  const DENOM_INFO = `Displaying account history for ${coin} denomination.\n`;
  const FIAT_PRICE_INFO = !supportsFiatPrices
    ? "Fiat exchange rate history is not supported for this denomination.\n"
    : "";
  const INFO = `${ADDRESS_INFO}${DENOM_INFO}${FIAT_PRICE_INFO}\n`;

  // Add disclaimer at the top of the CSV:
  const DISCLAIMER = `[DISCLAIMER]: This CSV account history is a best approximation of the account balances and rewards data over time. It is not a perfect history and uses a 3rd party price feed for exchange price data.\n\n`;

  // Assemble CSV file string with headers
  let CSV = `${INFO}${DISCLAIMER}${CSV_HEADERS.join(",")}\n`;

  // const currentRewards = 0;
  let accumulatedWithdrawals = 0;
  let rewardsPool = 0;
  let lastRewards = 0;

  // Get a map of all the validator commissions data by timestamp for lookup
  // in the next function.
  const validatorFieldsMap = getValidatorRewardsCSVFields(
    validatorRewardsChartData,
  );

  // Iterate all the rewards data rows and build up CSV data set.
  Object.entries(rewardsChartData.data).forEach(([timestamp, atomRewards]) => {
    const time = timestamp;
    const fiatPrice = fiatPriceMap[timestamp];

    // Get the withdrawal amount data.
    let withdrawalsATOM = "";
    if (
      rewardsChartData.withdrawalsMap &&
      timestamp in rewardsChartData.withdrawalsMap
    ) {
      withdrawalsATOM = rewardsChartData.withdrawalsMap[timestamp];

      accumulatedWithdrawals = add(
        accumulatedWithdrawals,
        withdrawalsATOM,
        Number,
      );
    }

    // Calculate rewards values.
    const accumulatedRewards = rewardsChartData.data[timestamp];
    const currentRewards = subtract(accumulatedRewards, lastRewards, Number);
    lastRewards = accumulatedRewards;
    const fiatRewards = multiply(currentRewards, fiatPrice);
    rewardsPool = subtract(atomRewards, accumulatedWithdrawals, Number);

    // Get the associated balance for this reward.
    let balanceValue: number = 0;
    if (time in balanceMapByTime) {
      balanceValue = balanceMapByTime[time] || 0;
    }

    const withdrawals = Boolean(withdrawalsATOM) ? withdrawalsATOM : "";

    let delegationsValue = 0;
    if (time in delegationsChartData.data) {
      delegationsValue = delegationsChartData.data[time];
    }

    let unbondingsValue = 0;
    if (time in unbondingChartData.data) {
      unbondingsValue = unbondingChartData.data[time];
    }

    // Handle possible values for validator addresses.
    let validatorFields = null;
    let validatorCommissions = 0;

    if (INCLUDE_VALIDATOR_COMMISSIONS && timestamp in validatorFieldsMap) {
      validatorFields = validatorFieldsMap[timestamp];
      validatorCommissions = validatorDailySummary.data[timestamp];
    }

    // Get total ATOM amount.
    const totalValue = chartTotal.data[timestamp];

    // Add regular CSV fields.
    let CSV_DATA: ReadonlyArray<string> = [
      timestamp.replace(",", ""),
      setFiatValue(fiatPrice),
      totalValue,
      balanceValue,
      delegationsValue,
      unbondingsValue,
      currentRewards,
      setFiatValue(fiatRewards),
      accumulatedRewards,
      withdrawals,
      rewardsPool,
    ].map(String);

    // Add validator CSV fields if they exist.
    if (validatorFields) {
      validatorCommissions = Number(validatorFields.atomRewards);
      const validatorCommissionsFiat = multiply(
        validatorCommissions,
        fiatPrice,
      );

      CSV_DATA = CSV_DATA.concat([
        String(validatorCommissions),
        setFiatValue(validatorCommissionsFiat),
        validatorFields.accumulatedRewards,
        validatorFields.withdrawals,
        validatorFields.commissionsPool,
      ]);
    }

    // Append the row to the CSV object.
    CSV += `${CSV_DATA.join(",")}\n`;
  });

  return CSV;
};

// Create a map of the validator commissions data by timestamp for fast
// lookup for the method which builds the CSV data.
const getValidatorRewardsCSVFields = (
  validatorRewardsATOM: ChartData,
): {
  [key: string]: {
    accumulatedRewards: string;
    atomRewards: string;
    withdrawals: string;
    commissionsPool: string;
  };
} => {
  let result = {};
  let commissionsPool = 0;
  let accumulatedWithdrawals = 0;
  let currentCommissions = 0;
  let lastCommissions = 0;

  Object.entries(validatorRewardsATOM.data).forEach(
    ([timestamp, atomCommissions]) => {
      currentCommissions = subtract(atomCommissions, lastCommissions, Number);
      lastCommissions = atomCommissions;

      // Get the withdrawal amount data.
      let withdrawalsATOM = "";
      if (
        validatorRewardsATOM.withdrawalsMap &&
        timestamp in validatorRewardsATOM.withdrawalsMap
      ) {
        withdrawalsATOM = validatorRewardsATOM.withdrawalsMap[timestamp];

        accumulatedWithdrawals = add(
          accumulatedWithdrawals,
          withdrawalsATOM,
          Number,
        );
      }

      commissionsPool = subtract(
        atomCommissions,
        accumulatedWithdrawals,
        Number,
      );

      const withdrawals = Boolean(withdrawalsATOM) ? withdrawalsATOM : "";

      const validatorFields = {
        accumulatedRewards: String(atomCommissions),
        atomRewards: String(currentCommissions),
        withdrawals: String(withdrawals),
        commissionsPool: String(commissionsPool),
      };

      result = {
        ...result,
        [timestamp]: validatorFields,
      };
    },
  );

  return result;
};
