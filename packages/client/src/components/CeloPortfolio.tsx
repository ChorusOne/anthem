import { GraphQLGuardComponent } from "components/GraphQLGuardComponents";
import {
  CeloAccountHistoryProps,
  FiatPriceHistoryProps,
  GraphQLConfigProps,
  withCeloAccountHistory,
  withFiatPriceHistory,
  withGraphQLVariables,
} from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import { DashboardError } from "pages/DashboardPage";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { ChartData } from "tools/chart-utils";
import { composeWithProps } from "tools/context-utils";
import { DashboardLoader, View } from "./SharedComponents";

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

  render(): JSX.Element {
    const { displayLoadingMessage } = this.state;
    const { i18n, celoAccountHistory } = this.props;
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
