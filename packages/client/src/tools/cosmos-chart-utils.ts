import { NetworkDefinition } from "@anthem/utils";
import { CosmosAccountHistoryQueryResult } from "graphql/queries";
import moment from "moment-timezone";
import { PortfolioChartData } from "ui/portfolio/CosmosPortfolio";
import {
  ChartData,
  ChartSeries,
  FiatPriceMap,
  WithdrawalEventDates,
} from "./chart-utils";
import { denomToUnit } from "./currency-utils";
import { toDateKey, toDateKeyBackOneDay } from "./date-utils";
import {
  add,
  addValuesInList,
  isLessThan,
  multiply,
  subtract,
} from "./math-utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface BalanceUnbondingOrDelegationItem {
  balance: string;
  timestamp: string;
}

interface ChartDataItem {
  timestamp: string;
  balance: string;
  fiatPrice: number;
}

export interface PortfolioHistoryChartData {
  availableChartData: ChartData;
  rewardsChartData: ChartData;
  rewardsDailySummary: ChartData;
  delegationsChartData: ChartData;
  unbondingChartData: ChartData;
  validatorRewardsChartData: ChartData;
  validatorDailySummary: ChartData;
}

/** ===========================================================================
 * Chart Utils
 * ============================================================================
 */

/**
 * Process all the portfolio API data to prepare it for rendering in the
 * chart.
 */
export const processPortfolioHistoryData = (
  accountHistory: CosmosAccountHistoryQueryResult,
  displayFiat: boolean,
  network: NetworkDefinition,
): PortfolioHistoryChartData | null => {
  if (!accountHistory || !accountHistory.cosmosAccountHistory) {
    return null;
  }

  const {
    balanceHistory,
    delegations,
    unbondings,
    delegatorRewards,
    validatorCommissions,
    fiatPriceHistory,
  } = accountHistory.cosmosAccountHistory;

  const fiatPriceMap: FiatPriceMap = fiatPriceHistory.reduce((map, price) => {
    return {
      ...map,
      [toDateKey(price.timestamp)]: price.price,
    };
  }, {});

  const firstBalance = balanceHistory[0];
  const startingDate = firstBalance && firstBalance.timestamp;

  // Process balanceHistory
  const adjustedBalances = populateMissingDatesInDataSeries(
    startingDate,
    balanceHistory,
    fiatPriceMap,
  );
  const availableChartData = mapBalancesToChartData(
    adjustedBalances,
    displayFiat,
    network,
  );

  // Process delegations
  const adjustedDelegations = populateMissingDatesInDataSeries(
    startingDate,
    delegations,
    fiatPriceMap,
  );
  const delegationsChartData = mapDelegationsToChartData(
    adjustedDelegations,
    displayFiat,
    network,
    true,
  );

  // Process unbondings
  const adjustedUnbondings = populateMissingDatesInDataSeries(
    startingDate,
    unbondings,
    fiatPriceMap,
  );
  const unbondingChartData = mapDelegationsToChartData(
    adjustedUnbondings,
    displayFiat,
    network,
  );

  // Process rewards
  const rewardsWithFiatPrices = delegatorRewards.map(rewards => ({
    ...rewards,
    fiatPrice: fiatPriceMap[toDateKey(rewards.timestamp)],
  }));
  const rewardsChartData = mapRewardsToChartData(
    rewardsWithFiatPrices,
    displayFiat,
    network,
    "REWARDS",
  );
  const rewardsDailySummary = mapRewardsToDailySummary(
    rewardsWithFiatPrices,
    displayFiat,
    network,
  );

  // Process commissions
  const commissionsWithFiatPrices = validatorCommissions.map(commissions => ({
    ...commissions,
    fiatPrice: fiatPriceMap[toDateKey(commissions.timestamp)],
  }));
  const validatorRewardsChartData = mapRewardsToChartData(
    commissionsWithFiatPrices,
    displayFiat,
    network,
    "COMMISSIONS",
  );
  const validatorDailySummary = mapRewardsToDailySummary(
    commissionsWithFiatPrices,
    displayFiat,
    network,
  );

  return {
    availableChartData,
    rewardsChartData,
    rewardsDailySummary,
    delegationsChartData,
    unbondingChartData,
    validatorRewardsChartData,
    validatorDailySummary,
  };
};

/**
 * Return data for rendering the portfolio balances chart.
 */
export const mapBalancesToChartData = (
  balanceHistory: ChartDataItem[],
  displayFiat: boolean,
  network: NetworkDefinition,
): ChartData => {
  const data: ChartSeries = {};

  balanceHistory.forEach(({ balance, timestamp, fiatPrice }) => {
    const x = denomToUnit(balance, network.denominationSize, Number);
    const value = displayFiat ? Number(fiatPrice) * x : x;
    const reward = Number(value);
    const time = toDateKey(timestamp);
    data[time] = reward;
  });

  return {
    type: "AVAILABLE",
    data,
    withdrawalsMap: {},
    withdrawalEventDates: {},
  };
};

/**
 * Maps the delegations data to chart data to render.
 */
export const mapDelegationsToChartData = (
  delegationsData: ChartDataItem[],
  displayFiat: boolean,
  network: NetworkDefinition,
  renderUnbondingLines: boolean = false,
): ChartData => {
  let lastRewards = "0";
  const data: ChartSeries = {};
  const withdrawalEventDates: WithdrawalEventDates = {};
  const withdrawalsMap: { [key: string]: string } = {};

  // Use a set to exclude multiple values recorded for one timestamp:
  let rewardsByTime: Set<string> = new Set();

  for (const { balance, timestamp, fiatPrice } of delegationsData) {
    const x = denomToUnit(balance, network.denominationSize, Number);
    const value = displayFiat ? multiply(fiatPrice, x, Number) : x;
    const time = toDateKey(timestamp);
    data[time] = value;

    if (isLessThan(balance, lastRewards)) {
      const diff = denomToUnit(
        subtract(lastRewards, balance),
        network.denominationSize,
      );
      const displayDiff = displayFiat ? multiply(fiatPrice, diff) : diff;
      withdrawalsMap[time] = displayDiff;
    }

    lastRewards = balance;

    // Update rewards by time array
    rewardsByTime = rewardsByTime.add(time);
  }

  const rewardsByTimeList = Array.from(rewardsByTime);

  /**
   * Map the withdrawal amount totals by date to the index of the
   * associated rewards data point to plot vertical lines for withdrawals.
   */
  Object.entries(withdrawalsMap).forEach(([key, value]) => {
    const index = rewardsByTimeList.indexOf(key);
    // @ts-ignore
    withdrawalEventDates[index] = value;
  });

  return {
    data,
    type: "STAKING",
    withdrawalsMap: renderUnbondingLines ? withdrawalsMap : {},
    withdrawalEventDates: renderUnbondingLines ? withdrawalEventDates : {},
  };
};

/**
 * Return data for rendering the portfolio rewards chart.
 */
export const mapRewardsToChartData = (
  rewardsData: ChartDataItem[],
  displayFiat: boolean,
  network: NetworkDefinition,
  type: "REWARDS" | "COMMISSIONS" | "STAKING",
): ChartData => {
  let lastRewards = 0;
  const data: ChartSeries = {};
  const withdrawalEventDates: WithdrawalEventDates = {};
  const withdrawalsMap: { [key: string]: string } = {};

  if (rewardsData.length === 0) {
    return { type, data, withdrawalEventDates, withdrawalsMap: {} };
  }

  /**
   * Create a map of all withdrawal amounts by date.
   */
  for (const { timestamp, balance, fiatPrice } of rewardsData) {
    const value = Number(balance);

    if (isLessThan(value, lastRewards)) {
      const denoms = subtract(lastRewards, value);
      const atoms = denomToUnit(denoms, network.denominationSize);

      const displayValue = displayFiat ? multiply(fiatPrice, atoms) : atoms;

      // Withdrawal
      const time = toDateKeyBackOneDay(timestamp);
      withdrawalsMap[time] = add(withdrawalsMap[time] || "0", displayValue);
    }

    lastRewards = value;
  }

  // Reset lastRewards back to zero
  lastRewards = 0;

  let lastValue = 0;
  let runningAtomTotal = 0;

  // Use a set to exclude multiple values recorded for one timestamp:
  let rewardsByTime: Set<string> = new Set();

  // Create a map of all earned rewards by date.
  for (const { balance, timestamp, fiatPrice } of rewardsData) {
    const atomReward = denomToUnit(balance, network.denominationSize, Number);

    /**
     * Determine the timestamp string based on the duration of the
     * available rewards history. If the history is less than a week
     * use the full timestamp otherwise convert it to the MM-DD-YYYY format.
     */
    const time = toDateKeyBackOneDay(timestamp);
    const diff = subtract(atomReward, lastValue, Number);
    lastValue = atomReward;

    // Only include positive diffs to exclude withdrawal events
    runningAtomTotal = runningAtomTotal + (diff > 0 ? diff : 0);

    // Optionally convert fiat after performing the other above adjustments
    const value = displayFiat
      ? multiply(runningAtomTotal, fiatPrice, Number)
      : runningAtomTotal;

    if (diff !== 0) {
      // Add the running total to the data
      data[time] = value;
      // Update rewards by time array
      rewardsByTime = rewardsByTime.add(time);
    }

    lastRewards = Number(balance);
  }

  const rewardsByTimeList = Array.from(rewardsByTime);

  // Map the withdrawal amount totals by date to the index of the
  // associated rewards data point to plot vertical lines for withdrawals.
  Object.entries(withdrawalsMap).forEach(([key, value]) => {
    const index = rewardsByTimeList.indexOf(key);
    // @ts-ignore
    // tslint:disable-next-line
    withdrawalEventDates[index] = value;
  });

  return { type, data, withdrawalEventDates, withdrawalsMap };
};

/**
 * Map rewards or commissions data and only include the final daily summary
 * value, not the cumulative total.
 */
export const mapRewardsToDailySummary = (
  rewardsHistory: ChartDataItem[],
  displayFiat: boolean,
  network: NetworkDefinition,
): ChartData => {
  const data: ChartSeries = {};

  rewardsHistory.forEach(({ balance, timestamp, fiatPrice }) => {
    const x = denomToUnit(balance, network.denominationSize, Number);
    const value = displayFiat ? Number(fiatPrice) * x : x;
    const reward = Number(value);
    const time = toDateKeyBackOneDay(timestamp);
    data[time] = reward;
  });

  return {
    type: "REWARDS",
    data,
    withdrawalsMap: {},
    withdrawalEventDates: {},
  };
};

/**
 * Combine all the portfolio graph results to assemble the total graph to
 * represent all ATOM holdings over time.
 */
export const getChartTotalGraph = (
  portfolioChartData: PortfolioChartData,
): ChartData => {
  const {
    availableChartData,
    delegationsChartData,
    unbondingChartData,
    validatorDailySummary,
    rewardsDailySummary,
  } = portfolioChartData;

  const combined: ChartSeries = {};

  for (const [timestamp, value] of Object.entries(availableChartData.data)) {
    const availableValue = value;
    const rewardsValue = rewardsDailySummary.data[timestamp];
    const delegationsValue = delegationsChartData.data[timestamp];
    const unbondingValue = unbondingChartData.data[timestamp];
    const commissionsValue = validatorDailySummary.data[timestamp];
    const values = [
      availableValue,
      rewardsValue,
      delegationsValue,
      unbondingValue,
      commissionsValue,
    ].filter(Boolean);

    combined[timestamp] = addValuesInList(values, Number);
  }

  return {
    type: "TOTAL",
    data: combined,
    withdrawalsMap: {},
    withdrawalEventDates: {},
  };
};

const populateMissingDatesInDataSeries = (
  startingDate: string,
  dataSet: readonly BalanceUnbondingOrDelegationItem[],
  fiatPriceMap: FiatPriceMap,
) => {
  const firstItem = dataSet[0];
  if (!firstItem) {
    return [];
  }

  const shouldStartWithZero = moment(startingDate).isBefore(
    firstItem.timestamp,
  );
  const startingBalance = shouldStartWithZero ? "0" : firstItem.balance;

  let currentBalance = startingBalance;

  const endingDate = new Date();

  const dataSetMap = {};
  for (const item of dataSet) {
    const { timestamp, balance } = item;
    const dateKey = toDateKey(timestamp);
    // @ts-ignore
    dataSetMap[dateKey] = balance;
  }

  let dateRange: readonly string[] = [];
  for (
    const d = new Date(startingDate);
    d <= new Date(endingDate);
    d.setDate(d.getDate() + 1)
  ) {
    dateRange = dateRange.concat(toDateKey(d));
  }

  let result: ChartDataItem[] = [];

  for (const date of dateRange) {
    if (date in dataSetMap) {
      // @ts-ignore
      currentBalance = dataSetMap[date];
    }

    result = [
      ...result,
      {
        timestamp: date,
        balance: currentBalance,
        fiatPrice: fiatPriceMap[date],
      },
    ];
  }

  return result;
};
