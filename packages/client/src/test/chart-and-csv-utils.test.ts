import { NETWORKS } from "@anthem/utils";
import { processPortfolioHistoryData } from "tools/cosmos-chart-utils";
import { chartExportBuilder } from "tools/csv-utils";
import cosmosAccountHistory from "../../../utils/src/client/data/cosmosAccountHistory.json";
import { fiatPriceHistory } from "../../../utils/src/client/data/fiatPriceHistory.json";

describe("chart-and-csv-utils", () => {
  test("processPortfolioHistoryData and chartExportBuilder utils", () => {
    const portfolioChartHistory: any = processPortfolioHistoryData(
      cosmosAccountHistory as any,
      false,
      NETWORKS.COSMOS,
      "uatom",
    );

    const result = chartExportBuilder({
      address: "cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd",
      network: NETWORKS.COSMOS,
      fiatPriceHistory,
      fiatCurrencySymbol: "USD",
      portfolioChartHistory,
      supportsFiatPrices: true,
      selectedDenom: { denom: "uatom", name: "ATOM" },
    });

    // console.log(result);

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

      // Sanity checks:
      expect(isNaN(rate)).toBeFalsy();
      expect(isNaN(total)).toBeFalsy();
      expect(isNaN(available)).toBeFalsy();
      expect(isNaN(staking)).toBeFalsy();
      expect(isNaN(unbonding)).toBeFalsy();
      expect(isNaN(dailyRewards)).toBeFalsy();
      expect(isNaN(rewardPool)).toBeFalsy();
      expect(isNaN(dailyCommissions)).toBeFalsy();
      expect(isNaN(commissionsPool)).toBeFalsy();

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
      .slice(7)
      .filter(Boolean);

    // Check that each row sums correctly
    for (const row of dataRows) {
      checkRow(row.split(","));
    }
  });
});
