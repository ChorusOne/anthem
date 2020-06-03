import { assertUnreachable } from "@anthem/utils";
import { Colors, H5 } from "@blueprintjs/core";
import * as Sentry from "@sentry/browser";
import { GraphQLGuardComponent } from "components/GraphQLGuardComponents";
import { COLORS } from "constants/colors";
import { CURRENCY_SETTING, FiatCurrency } from "constants/fiat";
import {
  CeloAccountHistoryProps,
  FiatPriceHistoryProps,
  GraphQLConfigProps,
  PortfolioHistoryProps,
  withCeloAccountHistory,
  withFiatPriceHistory,
  withGraphQLVariables,
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
import { getPortfolioTypeFromUrl } from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import { chartExportBuilder } from "tools/csv-utils";
import { formatCurrencyAmount } from "tools/currency-utils";
import { fromDateKey, getDateInFuture, toDateKey } from "tools/date-utils";
import { tFnString } from "tools/i18n-utils";
import CurrencySettingsToggle from "./CurrencySettingToggle";
import {
  Button,
  Centered,
  DashboardLoader,
  PanelMessageText,
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
  { displayLoadingMessage: boolean }
> {
  loadingTimer: Nullable<number> = null;

  constructor(props: IProps) {
    super(props);

    this.state = {
      displayLoadingMessage: false,
    };
  }

  componentDidMount() {
    if (this.props.celoAccountHistory.loading) {
      this.startLoadingTimer();
    }
  }

  componentWillUnmount() {
    this.cancelLoadingTimer();
  }

  componentDidUpdate() {
    if (this.props.celoAccountHistory.loading) {
      this.startLoadingTimer();
    }

    if (!this.props.celoAccountHistory.loading) {
      this.cancelLoadingTimer();
    }
  }

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

  render(): JSX.Element {
    const { displayLoadingMessage } = this.state;

    const { i18n, network, celoAccountHistory } = this.props;
    const { tString } = i18n;

    console.log(celoAccountHistory);

    return (
      <View style={{ position: "relative", height: "100%" }}>
        <GraphQLGuardComponent
          tString={tString}
          dataKey="celoAccountHistory"
          result={celoAccountHistory}
          errorComponent={<DashboardError tString={tString} />}
          loadingComponent={
            <DashboardLoader
              showPortfolioLoadingMessage={displayLoadingMessage}
            />
          }
        >
          <p>Celo Account History</p>
        </GraphQLGuardComponent>
      </View>
    );
  }
}

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
    CeloAccountHistoryProps,
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
  withCeloAccountHistory,
)(PortfolioLoadingContainer);
