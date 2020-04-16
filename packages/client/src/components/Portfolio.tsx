import { Colors, H5 } from "@blueprintjs/core";
import * as Sentry from "@sentry/browser";
import { GraphQLGuardComponent } from "components/GraphQLGuardComponents";
import { COLORS } from "constants/colors";
import { CURRENCY_SETTING, FiatCurrency } from "constants/fiat";
import {
  FiatPriceHistoryProps,
  GraphQLConfigProps,
  PortfolioHistoryProps,
  withFiatPriceHistory,
  withGraphQLVariables,
  withPortfolioHistoryDataQuery,
} from "graphql/queries";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { PORTFOLIO_CHART_TYPES } from "i18n/english";
import Analytics from "lib/analytics-lib";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import moment from "moment-timezone";
import { DashboardError } from "pages/DashboardPage";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { throttle } from "throttle-debounce";
import {
  ChartData,
  getChartTotalGraph,
  processPortfolioHistoryData,
  WithdrawalEventDates,
} from "tools/chart-utils";
import { composeWithProps } from "tools/context-utils";
import { chartExportBuilder } from "tools/csv-utils";
import { formatCurrencyAmount } from "tools/currency-utils";
import { fromDateKey, getDateInFuture, toDateKey } from "tools/date-utils";
import {
  assertUnreachable,
  getPortfolioTypeFromUrl,
} from "tools/generic-utils";
import { tFnString } from "tools/i18n-utils";
import CurrencySettingsToggle from "./CurrencySettingToggle";
import {
  Button,
  Centered,
  DashboardLoader,
  Row,
  View,
} from "./SharedComponents";
import Toast from "./Toast";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

export interface PortfolioChartData {
  availableChartData: ChartData;
  rewardsChartData: ChartData;
  rewardsDailySummary: ChartData;
  delegationsChartData: ChartData;
  unbondingChartData: ChartData;
  validatorRewardsChartData: ChartData;
  validatorDailySummary: ChartData;
}

interface IState {
  portfolioChartData: Nullable<PortfolioChartData>;
}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class PortfolioLoadingContainer extends React.PureComponent<
  IProps,
  { hasError: boolean }
> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  constructor(props: IProps) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error: Error) {
    // Log the error to Sentry.
    Sentry.captureException(error);
  }

  render(): JSX.Element {
    if (this.state.hasError) {
      return (
        <Centered>
          <p style={{ fontSize: 16, fontWeight: 500 }}>
            {this.props.i18n.tString("Error fetching data...")}
          </p>
        </Centered>
      );
    }

    const { i18n, network, portfolioHistory } = this.props;
    const { tString } = i18n;

    if (network.name !== "COSMOS") {
      return (
        <Centered style={{ flexDirection: "column", marginTop: -25 }}>
          <p>
            <b>{network.name}</b> portfolio is not supported yet.
          </p>
        </Centered>
      );
    }

    return (
      <GraphQLGuardComponent
        tString={tString}
        dataKey="portfolioHistory"
        result={portfolioHistory}
        errorComponent={<DashboardError tString={tString} />}
        loadingComponent={<DashboardLoader />}
      >
        <Portfolio {...this.props} />
      </GraphQLGuardComponent>
    );
  }
}

class Portfolio extends React.PureComponent<IProps, IState> {
  currentWindowWidth = window.innerWidth;
  chartRef: any = null;
  throttledPortfolioCalculationFunction: () => void;
  throttledPortfolioRedrawFunction: (fullSizeChanged?: boolean) => void;

  constructor(props: IProps) {
    super(props);

    this.throttledPortfolioRedrawFunction = throttle(
      250,
      this.ridiculouslyForcePortfolioToRedraw,
    );

    this.throttledPortfolioCalculationFunction = throttle(
      250,
      this.calculatePortfolioData,
    );

    this.state = {
      portfolioChartData: null,
    };
  }

  componentDidMount() {
    this.throttledPortfolioCalculationFunction();

    window.addEventListener("resize", () =>
      this.throttledPortfolioRedrawFunction(),
    );
  }

  componentWillUnmount() {
    window.removeEventListener("resize", () =>
      this.throttledPortfolioRedrawFunction(),
    );
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (this.props.fullSize && !nextProps.fullSize) {
      this.throttledPortfolioRedrawFunction(true);
    }
  }

  componentDidUpdate(prevProps: IProps) {
    // If address data or currencySetting changed, update the portfolio data
    if (
      prevProps.portfolioHistory !== this.props.portfolioHistory ||
      prevProps.settings.currencySetting !== this.props.settings.currencySetting
    ) {
      this.throttledPortfolioCalculationFunction();
    }
  }

  render(): Nullable<JSX.Element> {
    if (this.state.portfolioChartData === null) {
      return null;
    }

    return this.renderChart();
  }

  renderChart = () => {
    const { i18n, settings, location, fullSize } = this.props;
    const { t, tString } = i18n;
    const { fiatCurrency, currencySetting, isDarkTheme } = settings;

    const chartData = this.getChartValues();

    if (chartData) {
      const noData = Object.keys(chartData.data).length === 0;

      if (noData) {
        // Get a relevant message to display for an empty portfolio graph.
        const portfolioType = getPortfolioTypeFromUrl(location.pathname);
        const getEmptyGraphMessage = (type: PORTFOLIO_CHART_TYPES): string => {
          switch (type) {
            case "TOTAL":
            case "AVAILABLE":
              return tString("No ATOM balance exists yet.");
            case "REWARDS":
              return tString(
                "Please note that rewards data will not start accumulating until rewards balances are 1µatom or greater.",
              );
            case "STAKING":
              return tString("No staking balance exists yet.");
            case "COMMISSIONS":
              return tString("No commissions data exists yet.");
            default:
              return assertUnreachable(type);
          }
        };

        return (
          <Centered style={{ flexDirection: "column" }}>
            <H5>{t("No data exists yet.")}</H5>
            <p style={{ textAlign: "center" }}>
              {getEmptyGraphMessage(portfolioType as PORTFOLIO_CHART_TYPES)}
            </p>
          </Centered>
        );
      }

      const options = getHighchartsChartOptions({
        tString,
        fullSize,
        chartData,
        isDarkTheme,
        fiatCurrency,
        currencySetting,
      });

      return (
        <View>
          <Row style={{ justifyContent: "space-between" }}>
            {this.props.settings.isDesktop && (
              <Button
                category="SECONDARY"
                data-cy="csv-download-button"
                onClick={this.handleDownloadCSV}
              >
                {t("Download CSV")}
              </Button>
            )}
            <View>
              <CurrencySettingsToggle />
            </View>
          </Row>
          <HighchartsReact
            options={options}
            highcharts={Highcharts}
            ref={this.assignChartRef}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  ridiculouslyForcePortfolioToRedraw = (fullSizeChanged = false) => {
    // Only react to width changes.
    const widthResized = window.innerWidth !== this.currentWindowWidth;
    this.currentWindowWidth = window.innerWidth;

    if (widthResized || fullSizeChanged) {
      /**
       * Seemingly HighchartsReact does not redraw easily when other elements
       * change size or the window resizes. So the chart would get fixed to
       * some dimension and not change when resize events happened, even
       * though they seem to expose this "reflow" API to allow that to happen.
       *
       * So what happens here is we just set the portfolioData to null to
       * un-render the chart and then reset the data again to render the chart
       * again after an event occurs where the chart should redraw.
       */
      const { portfolioChartData } = this.state;
      this.setState(
        {
          portfolioChartData: null,
        },
        () => this.setState({ portfolioChartData }),
      );
    }
  };

  assignChartRef = (ref: any) => {
    this.chartRef = ref;
  };

  calculatePortfolioData = () => {
    const { settings, portfolioHistory } = this.props;

    if (portfolioHistory && portfolioHistory.portfolioHistory) {
      const { validatorCommissions } = portfolioHistory.portfolioHistory;

      const portfolioType = getPortfolioTypeFromUrl(window.location.pathname);
      const onCommissionsTab = portfolioType === "COMMISSIONS";
      const noCommissionsExist = validatorCommissions.length === 0;

      /**
       * If the commissions tab is active but an address loads without commissions
       * data, redirect to the /rewards tab instead. This is actually crap
       * because it just generates a navigation side effect in the middle of
       * this function. This should be moved into an epic and handled properly,
       * but this is a little tricky because it depends on the GraphQL data
       * loading for the new address.
       */
      if (noCommissionsExist && onCommissionsTab) {
        this.props.history.push("/dashboard/rewards");
      }

      const displayFiat = settings.currencySetting === "fiat";
      const result = processPortfolioHistoryData(
        this.props.portfolioHistory,
        displayFiat,
      );

      this.setState({ portfolioChartData: result });
    }
  };

  getChartValues = (): Nullable<ChartData> => {
    const { location } = this.props;
    const { portfolioChartData } = this.state;

    if (portfolioChartData) {
      const portfolioType = getPortfolioTypeFromUrl(location.pathname);
      if (portfolioType === "TOTAL") {
        return getChartTotalGraph(portfolioChartData);
      } else if (portfolioType === "AVAILABLE") {
        return portfolioChartData.availableChartData;
      } else if (portfolioType === "REWARDS") {
        return portfolioChartData.rewardsChartData;
      } else if (portfolioType === "STAKING") {
        return portfolioChartData.delegationsChartData;
      } else if (portfolioType === "COMMISSIONS") {
        return portfolioChartData.validatorRewardsChartData;
      }
    }

    return null;
  };

  handleDownloadCSV = () => {
    try {
      const { address, network, settings, portfolioHistory } = this.props;
      const fiatCurrencySymbol = settings.fiatCurrency.symbol;

      // Calculate the portfolio data again, but force displayFiat to
      // false to get the crypto balances.
      const portfolioData = processPortfolioHistoryData(
        portfolioHistory,
        false,
      );

      if (
        portfolioData &&
        portfolioHistory &&
        portfolioHistory.portfolioHistory
      ) {
        const { fiatPriceHistory } = portfolioHistory.portfolioHistory;
        const CSV = chartExportBuilder({
          address,
          network,
          fiatPriceHistory,
          fiatCurrencySymbol,
          portfolioChartHistory: portfolioData,
        });

        // Download the CSV data
        this.downloadToFile(CSV);

        // Track download event
        Analytics.downloadCSV();
      } else {
        Toast.warn(this.props.i18n.tString("No data found..."));
      }
    } catch (err) {
      Toast.danger(this.props.i18n.tString("Failed to download CSV data..."));
    }
  };

  downloadToFile = (CSV: string) => {
    // Create the file name
    const dateStringPrefix = moment(Date.now()).format("MM-DD-YYYY");
    const fileName = `anthem-cosmos-data-${dateStringPrefix}.csv`;

    try {
      const hiddenElement = document.createElement("a");

      hiddenElement.href = `data:text/csv;charset=utf-8,${encodeURI(CSV)}`;
      hiddenElement.target = "_blank";
      hiddenElement.download = fileName;

      const div = document.getElementById("csv-download-container");

      if (div) {
        div.appendChild(hiddenElement);
        hiddenElement.click();
        hiddenElement.remove();
      } else {
        throw new Error("CSV div container could not be found");
      }
    } catch (err) {
      throw err;
    }
  };
}

/** ===========================================================================
 * Highcharts Utils
 * ============================================================================
 */

interface ChartOptionsArgs {
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
    chartData,
    isDarkTheme,
    fiatCurrency,
    currencySetting,
    tString,
    fullSize,
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
        text: currencySetting === "fiat" ? fiatCurrency.symbol : "ATOM",
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
  xIndexPosition: number;
  currencySetting: CURRENCY_SETTING;
  fiatCurrency: FiatCurrency;
  chartType: PORTFOLIO_CHART_TYPES;
  tString: tFnString;
  withdrawalDateSet?: WithdrawalEventDates;
}

// Helper to render the text label for the chart tooltip.
const formatTooltipLabel = ({
  x,
  y,
  xIndexPosition,
  currencySetting,
  fiatCurrency,
  chartType,
  tString,
  withdrawalDateSet,
}: TooltipArguments): string => {
  const date = toDateKey(x);
  const yValue = formatCurrencyAmount(String(y));
  const { symbol } = fiatCurrency;
  const currency = currencySetting === "fiat" ? `${symbol}` : "ATOM";

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

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  settings: Modules.selectors.settings(state),
  network: Modules.selectors.ledger.networkSelector(state),
  address: Modules.selectors.ledger.addressSelector(state),
});

const dispatchProps = {
  updateSetting: Modules.actions.settings.updateSetting,
};

const withProps = connect(mapStateToProps, dispatchProps);

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

interface ComponentProps {
  fullSize: boolean;
}

interface IProps
  extends ComponentProps,
    ConnectProps,
    RouteComponentProps,
    GraphQLConfigProps,
    PortfolioHistoryProps,
    FiatPriceHistoryProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withRouter,
  withProps,
  withGraphQLVariables,
  withFiatPriceHistory,
  withPortfolioHistoryDataQuery,
)(PortfolioLoadingContainer);
