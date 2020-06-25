import {
  assertUnreachable,
  IOasisAccountHistory,
  NetworkDefinition,
} from "@anthem/utils";
import * as Sentry from "@sentry/browser";
import { FiatCurrency } from "constants/fiat";
import {
  FiatPriceHistoryProps,
  GraphQLConfigProps,
  OasisAccountHistoryProps,
  withFiatPriceHistory,
  withGraphQLVariables,
  withOasisAccountHistory,
} from "graphql/queries";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { PORTFOLIO_CHART_TYPES } from "i18n/english";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { ChartData, getHighchartsChartOptions } from "tools/chart-utils";
import { capitalizeString } from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import { denomToUnit } from "tools/currency-utils";
import { toDateKey } from "tools/date-utils";
import { addValuesInList } from "tools/math-utils";
import { GraphQLGuardComponent } from "ui/GraphQLGuardComponents";
import Toast from "ui/Toast";
import CurrencySettingsToggle from "../CurrencySettingToggle";
import {
  Button,
  DashboardError,
  DashboardLoader,
  Row,
  View,
} from "../SharedComponents";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class OasisPortfolio extends React.PureComponent<
  IProps,
  { displayLoadingMessage: boolean }
> {
  loadingTimer: Nullable<number> = null;
  chartRef: any = null;

  constructor(props: IProps) {
    super(props);

    this.state = {
      displayLoadingMessage: false,
    };
  }

  componentDidMount() {
    if (this.props.oasisAccountHistory.loading) {
      this.startLoadingTimer();
    }
  }

  componentWillUnmount() {
    this.cancelLoadingTimer();
  }

  componentDidUpdate() {
    if (this.props.oasisAccountHistory.loading) {
      this.startLoadingTimer();
    }

    if (!this.props.oasisAccountHistory.loading) {
      this.cancelLoadingTimer();
    }
  }

  render(): JSX.Element | null {
    const { displayLoadingMessage } = this.state;
    const {
      app,
      i18n,
      settings,
      network,
      fullSize,
      oasisAccountHistory,
    } = this.props;
    const { t, tString } = i18n;
    const { fiatCurrency, currencySetting, isDarkTheme } = settings;

    return (
      <View style={{ position: "relative", height: "100%" }}>
        <GraphQLGuardComponent
          tString={tString}
          dataKey="oasisAccountHistory"
          result={oasisAccountHistory}
          errorComponent={<DashboardError tString={tString} />}
          loadingComponent={
            <DashboardLoader
              showPortfolioLoadingMessage={displayLoadingMessage}
            />
          }
        >
          {(accountHistory: IOasisAccountHistory[]) => {
            const chartData = getChartData(
              accountHistory,
              network,
              app.activeChartTab,
            );

            if (!chartData) {
              return null;
            }

            const options = getHighchartsChartOptions({
              tString,
              network,
              fullSize,
              chartData,
              isDarkTheme,
              fiatCurrency,
              currencySetting,
            });

            const noData = Object.keys(chartData.data).length === 0;
            if (noData) {
              return (
                <View style={{ paddingTop: 110 }}>
                  <p style={{ margin: 0, textAlign: "center" }}>
                    No account history data exists yet.
                  </p>
                </View>
              );
            }

            const { activeChartTab } = app;
            switch (activeChartTab) {
              case "COMMISSIONS":
                return (
                  <View style={{ paddingTop: 110 }}>
                    <p style={{ margin: 0, textAlign: "center" }}>
                      {capitalizeString(activeChartTab)} account history is not
                      supported yet for Oasis.
                    </p>
                  </View>
                );
              case "TOTAL":
              case "AVAILABLE":
              case "REWARDS":
              case "STAKING":
                return (
                  <View>
                    <Row style={{ justifyContent: "space-between" }}>
                      {this.props.settings.isDesktop && (
                        <Button
                          category="SECONDARY"
                          data-cy="csv-download-button"
                          onClick={() => this.handleDownloadCSV(accountHistory)}
                        >
                          {i18n.t("Download CSV")}
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
              default: {
                console.warn(
                  `Unexpected activeChartTab received: ${activeChartTab}`,
                );
                return null;
              }
            }
          }}
        </GraphQLGuardComponent>
      </View>
    );
  }

  handleDownloadCSV = (accountHistory: IOasisAccountHistory[]) => {
    try {
      const data = getOasisCSV(
        this.props.address,
        accountHistory,
        this.props.network,
        this.props.settings.fiatCurrency,
      );
      this.props.downloadDataToFile(data);
    } catch (err) {
      Sentry.captureException(err);
      Toast.warn("Failed to download account history...");
    }
  };

  startLoadingTimer = () => {
    const LOADING_THRESHOLD_DELAY = 3000; // 3 seconds
    this.loadingTimer = setTimeout(() => {
      this.setState({ displayLoadingMessage: true });
    }, LOADING_THRESHOLD_DELAY);
  };

  cancelLoadingTimer = () => {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
    }

    this.setState({ displayLoadingMessage: false });
  };

  assignChartRef = (ref: any) => {
    this.chartRef = ref;
  };
}

/** ===========================================================================
 * Chart Utils
 * ============================================================================
 */

/**
 * Function to build the Oasis chart data. Currently available is the only
 * chart which is supported.
 */
const getChartData = (
  accountHistory: IOasisAccountHistory[],
  network: NetworkDefinition,
  type: PORTFOLIO_CHART_TYPES,
): Nullable<ChartData> => {
  const series: { [key: string]: number } = {};

  for (const x of accountHistory) {
    let value = "";
    switch (type) {
      case "TOTAL":
        value = addValuesInList([
          x.balance,
          x.rewards,
          x.staked_balance.balance,
          x.debonding_balance.balance,
        ]);
        break;
      case "AVAILABLE":
        value = x.balance;
        break;
      case "REWARDS":
        value = x.rewards;
        break;
      case "STAKING":
        value = x.staked_balance.balance;
        break;
      case "COMMISSIONS":
        // Commissions are not supported yet
        return null;
      default:
        console.warn(`Unexpected activeChartTab received: ${type}`);
        assertUnreachable(type);
    }

    const key = toDateKey(x.date);
    const result = denomToUnit(value, network.denominationSize, Number);
    series[key] = result;
  }

  return {
    type: "AVAILABLE",
    data: series,
    withdrawalEventDates: {},
    withdrawalsMap: {},
  };
};

/**
 * Function to build the Oasis CSV export.
 */
const getOasisCSV = (
  address: string,
  accountHistory: IOasisAccountHistory[],
  network: NetworkDefinition,
  fiatCurrencySymbol: FiatCurrency,
) => {
  const coin = network.descriptor;

  // Create the CSV Header.
  const CSV_HEADERS: string[] = [
    "Date",
    `Exchange Rate (${fiatCurrencySymbol.symbol}:${coin})`,
    `Total Balance (${coin})`,
    `Available Balance (${coin})`,
    `Staked Balance (${coin})`,
    `Accumulated Rewards (${coin})`,
  ];

  // Add info text about the address and network
  const ADDRESS_INFO = `Account history data for ${network.name} address ${address}.\n\n`;

  // Assemble CSV file string with headers
  let CSV = `${ADDRESS_INFO}${CSV_HEADERS.join(",")}\n`;

  for (const x of accountHistory) {
    const dateKey = toDateKey(x.date, true);
    const balance = denomToUnit(x.balance, network.denominationSize, String);
    const staked = denomToUnit(
      x.staked_balance.balance,
      network.denominationSize,
      String,
    );
    const debonding = denomToUnit(
      x.debonding_balance.balance,
      network.denominationSize,
      String,
    );
    const rewards = denomToUnit(x.rewards, network.denominationSize, String);
    const total = addValuesInList([balance, staked, debonding, rewards]);

    // Create the CSV row
    const row = [
      dateKey,
      "n/a", // Fiat balances not supported for Oasis yet
      total,
      balance,
      staked, // Staked balance not supported for Oasis yet
      rewards, // Rewards not supported for Oasis yet
    ].join(",");

    // Add the row to the CSV
    CSV += `${row}\n`;
  }

  return CSV;
};

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  settings: Modules.selectors.settings(state),
  app: Modules.selectors.app.appSelector(state),
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
  downloadDataToFile: (CSV: string) => void;
}

interface IProps
  extends ComponentProps,
    ConnectProps,
    RouteComponentProps,
    GraphQLConfigProps,
    OasisAccountHistoryProps,
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
  withOasisAccountHistory,
)(OasisPortfolio);
