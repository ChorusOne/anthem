import { IOasisAccountHistory } from "@anthem/utils";
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
import { composeWithProps } from "tools/context-utils";
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
    const { i18n, settings, oasisAccountHistory, fullSize } = this.props;
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
            console.log("OASIS account history:");

            const chartData = getChartData(accountHistory);
            const options = getHighchartsChartOptions({
              tString,
              fullSize,
              chartData,
              isDarkTheme,
              fiatCurrency,
              currencySetting,
            });

            console.log(chartData);

            const noData = Object.keys(chartData.data).length > 1;
            if (noData) {
              return (
                <Centered style={{ flexDirection: "column" }}>
                  <p style={{ textAlign: "center" }}>
                    {t("No data exists yet.")}
                  </p>
                </Centered>
              );
            }

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

const getChartData = (accountHistory: IOasisAccountHistory[]): ChartData => {
  const series: { [key: string]: number } = {};

  for (const x of accountHistory) {
    const key = toDateKey(x.date);
    series[key] = +x.balance;
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
