import { IOasisAccountHistory, NetworkDefinition } from "@anthem/utils";
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
import { GraphQLGuardComponent } from "ui/GraphQLGuardComponents";
import { DashboardError } from "ui/pages/DashboardPage";
import CurrencySettingsToggle from "../CurrencySettingToggle";
import {
  Button,
  Centered,
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
            const chartData = getChartData(accountHistory, network);
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
                    {t("No data exists yet.")}
                  </p>
                </View>
              );
            }

            const { activeChartTab } = app;
            switch (activeChartTab) {
              case "REWARDS":
              case "STAKING":
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
                return (
                  <View>
                    <Row style={{ justifyContent: "space-between" }}>
                      {this.props.settings.isDesktop && (
                        <Button
                          category="SECONDARY"
                          data-cy="csv-download-button"
                          onClick={this.handleDownloadCSV}
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

  handleDownloadCSV = () => {
    return null;
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

const getChartData = (
  accountHistory: IOasisAccountHistory[],
  network: NetworkDefinition,
): ChartData => {
  const series: { [key: string]: number } = {};

  for (const x of accountHistory) {
    const key = toDateKey(x.date);
    series[key] = denomToUnit(x.balance, network.denominationSize, Number);
  }

  return {
    type: "AVAILABLE",
    data: series,
    withdrawalEventDates: {},
    withdrawalsMap: {},
  };
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
