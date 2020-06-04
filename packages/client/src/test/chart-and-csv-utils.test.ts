import { NETWORKS } from "@anthem/utils";
import { processPortfolioHistoryData } from "tools/cosmos-chart-utils";
import { chartExportBuilder } from "tools/csv-utils";
import { fiatPriceHistory } from "../../../utils/src/client/data/fiatPriceHistory.json";
import portfolioHistory from "../../../utils/src/client/data/portfolioHistory.json";

describe("chart-and-csv-utils", () => {
  test("processPortfolioHistoryData and chartExportBuilder utils", () => {
    const portfolioChartHistory: any = processPortfolioHistoryData(
      portfolioHistory as any,
      false,
      NETWORKS.COSMOS,
    );

    const result = chartExportBuilder({
      address: "cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd",
      network: NETWORKS.COSMOS,
      fiatPriceHistory,
      fiatCurrencySymbol: "USD",
      portfolioChartHistory,
    });

    // Perform assertions on a row of CSV data
    const checkRow = (row: string[]) => {
      // Get row values
      const [
        date,
        rate,
        total,
        available,
        staking,
        unbonding,
        dailyRewards,
        dailyRewardsFiat,
        accumulatedRewards,
        rewardWithdrawals,
        rewardPool,
        dailyCommissions,
        dailyCommissionsFiat,
        accumulatedCommissions,
        commissionWithdrawals,
        commissionsPool,
      ] = row.map(Number);

      // Check fiat rewards
      expect((rate * dailyRewards).toFixed(2)).toBe(
        dailyRewardsFiat.toFixed(2),
      );

      // Check fiat commissions
      expect((rate * dailyCommissions).toFixed(2)).toBe(
        dailyCommissionsFiat.toFixed(2),
      );

      if (isNaN(total)) {
        console.log(row);
      }

      // Check total calculation
      expect(
        (
          available +
          staking +
          unbonding +
          rewardPool +
          commissionsPool
        ).toFixed(2),
      ).toBe(total.toFixed(2));
    };

    // Get all the rows of data
    const dataRows = result
      .split("\n")
      .slice(5)
      .filter(Boolean);

    // Check that each row sums correctly
    for (const row of dataRows) {
      checkRow(row.split(","));
    }
  });
});
