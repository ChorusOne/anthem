import { NetworkDefinition } from "@anthem/utils";
import { Colors } from "@blueprintjs/core";
import { COLORS } from "constants/colors";
import { CURRENCY_SETTING, FiatCurrency } from "constants/fiat";
import { ALL_POSSIBLE_CHART_TABS } from "./client-utils";
import { formatCurrencyAmount } from "./currency-utils";
import { fromDateKey, getDateInFuture, toDateKey } from "./date-utils";
import { tFnString } from "./i18n-utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

export interface ChartSeries {
  [key: string]: number;
}

export interface ChartData {
  type: ALL_POSSIBLE_CHART_TABS;
  data: ChartSeries;
  withdrawalEventDates: WithdrawalEventDates;
  withdrawalsMap: { [key: string]: string };
}

export interface WithdrawalEventDates {
  [key: string]: number;
}

export interface FiatPriceMap {
  [key: string]: number;
}

/** ===========================================================================
 * Highcharts Utils
 * ============================================================================
 */

interface ChartOptionsArgs {
  network: NetworkDefinition;
  fiatCurrency: FiatCurrency;
  currencySetting: CURRENCY_SETTING;
  isDarkTheme: boolean;
  chartData: ChartData;
  tString: tFnString;
  fullSize: boolean;
}

// Derive the chart options for the portfolio chart.
export const getHighchartsChartOptions = (
  optionsArgs: ChartOptionsArgs,
): Highcharts.Options => {
  const {
    tString,
    network,
    fullSize,
    chartData,
    isDarkTheme,
    fiatCurrency,
    currencySetting,
  } = optionsArgs;
  const { data, withdrawalEventDates } = chartData;

  // Get chart values
  const xAxisValues = Object.keys(data);
  const yAxisValues = Object.values(data);

  // Get themed chart colors
  const themedColor = isDarkTheme ? Colors.LIGHT_GRAY5 : Colors.DARK_GRAY1;
  const themedAxisColor = isDarkTheme ? Colors.DARK_GRAY5 : Colors.LIGHT_GRAY1;

  const fontStyles = {
    color: themedColor,
    fontSize: "12px",
    fontFamily: "ColfaxWebNormal, Helvetica, sans-serif",
  };

  const options: Highcharts.Options = {
    title: {
      text: undefined,
    },
    chart: {
      marginLeft: 76,
      backgroundColor: "transparent",
      height: fullSize ? window.innerHeight - 250 : 225,
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, COLORS.CHART_GRADIENT_STOP],
            [1, COLORS.CHART_GRADIENT_START],
          ],
        },
      },
    },
    tooltip: {
      borderWidth: 1,
      borderColor: COLORS.BALANCE_SHADE_THREE,
      formatter() {
        return formatTooltipLabel({
          tString,
          network,
          x: this.x,
          y: this.y,
          fiatCurrency,
          currencySetting,
          chartType: chartData.type,
          xIndexPosition: this.point.x,
          withdrawalDateSet: withdrawalEventDates,
        });
      },
    },
    series: [
      {
        lineColor: COLORS.CHART_LINE,
        type: "area",
        data: yAxisValues,
        marker: {
          enabled: false,
          states: {
            hover: {
              fillColor: COLORS.CHART_FOCUS,
            },
          },
        },
      },
    ],
    yAxis: {
      // endOnTick scales the axis to the data
      endOnTick: false,
      gridLineColor: themedAxisColor,
      labels: {
        style: fontStyles,
      },
      title: {
        style: {
          color: themedColor,
        },
        text:
          currencySetting === "fiat" ? fiatCurrency.symbol : network.descriptor,
      },
    },
    xAxis: {
      lineColor: themedAxisColor,
      type: "datetime",
      tickInterval: 30,
      categories: xAxisValues,
      crosshair: {
        color: COLORS.CHART_CROSSHAIR,
      },
      labels: {
        style: fontStyles,
        formatter() {
          // Adjust date format for x-axis label
          const date = fromDateKey(String(this.value));
          return date.format("MMM DD");
        },
      },
      plotLines: withdrawalEventDates
        ? Object.keys(withdrawalEventDates).map(xValue => {
            return {
              width: 1,
              value: Number(xValue),
              dashStyle: "LongDashDotDot",
              color: COLORS.CHART_PLOT_LINE,
            };
          })
        : undefined,
    },
  };

  return options;
};

interface TooltipArguments {
  x: number;
  y: number;
  network: NetworkDefinition;
  xIndexPosition: number;
  currencySetting: CURRENCY_SETTING;
  fiatCurrency: FiatCurrency;
  chartType: ALL_POSSIBLE_CHART_TABS;
  tString: tFnString;
  withdrawalDateSet?: WithdrawalEventDates;
}

// Helper to render the text label for the chart tooltip.
const formatTooltipLabel = ({
  x,
  y,
  tString,
  network,
  chartType,
  fiatCurrency,
  xIndexPosition,
  currencySetting,
  withdrawalDateSet,
}: TooltipArguments): string => {
  const date = toDateKey(x);
  const yValue = formatCurrencyAmount(String(y));
  const { symbol } = fiatCurrency;
  const currency =
    currencySetting === "fiat" ? `${symbol}` : network.descriptor;

  let optionalWithdrawalMessage = "";
  if (withdrawalDateSet) {
    // Get withdrawalAmount
    const withdrawalValue = withdrawalDateSet[xIndexPosition];
    let withdrawalAmount = "";
    if (withdrawalValue) {
      withdrawalAmount = formatCurrencyAmount(String(withdrawalValue));
    }

    // Unbondings become available 21 days in the future
    const unbondingDateFormatted = getDateInFuture(new Date(x), 21);

    // Determine action type
    const actionVerb =
      chartType === "STAKING" ? tString("Unbonded") : tString("Withdrew");

    // Get additional message for unbondings
    const optionalUnbondingMsg =
      chartType === "STAKING"
        ? `<br>Available on ${unbondingDateFormatted}`
        : "";

    // Mark withdrawal points
    const isWithdrawalPoint = xIndexPosition in withdrawalDateSet;
    optionalWithdrawalMessage = isWithdrawalPoint
      ? `<br><b>${actionVerb} ${withdrawalAmount} ${currency} ${optionalUnbondingMsg}</b>`
      : "";
  }

  // Assemble string label
  const label = `${date}<br><b>${yValue} ${currency}</b>${optionalWithdrawalMessage}`;

  return label;
};
