import { NetworkDefinition } from "@anthem/utils";
import {
  Button,
  Card,
  Colors,
  Elevation,
  H5,
  H6,
  Icon,
  Menu,
  MenuItem,
  Popover,
  Position,
} from "@blueprintjs/core";
import axios from "axios";
import { COLORS } from "constants/colors";
import {
  CosmosAccountHistoryProps,
  CosmosAccountHistoryQueryResult,
  withCosmosAccountHistory,
  withGraphQLVariables,
} from "graphql/queries";
import { History } from "history";
import Analytics from "lib/analytics-lib";
import ENV from "lib/client-env";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import styled from "styled-components";
import {
  getChartTabsForNetwork,
  getPortfolioTypeFromUrl,
  isChartTabValidForNetwork,
  onActiveRoute,
  onActiveTab,
} from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import AddressInputDashboardBar from "ui/AddressInputDashboardBar";
import BalancesSwitchContainer from "ui/balances/BalancesSwitchContainer";
import { IThemeProps } from "ui/containers/ThemeContainer";
import PortfolioSwitchContainer from "ui/portfolio/PortfolioSwitchContainer";
import { View } from "ui/SharedComponents";
import Toast from "ui/Toast";
import TransactionSwitchContainer from "ui/transactions/TransactionSwitchContainer";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class DashboardPage extends React.Component<IProps> {
  componentDidMount() {
    const { network } = this.props.ledger;
    const tab = window.location.pathname.split("/")[2];
    const validTab = tab && isChartTabValidForNetwork(tab, network);
    if (validTab) {
      this.props.setActiveChartTab(validTab);
    }
  }

  render(): JSX.Element {
    const { ledger, i18n, app, settings } = this.props;
    const { t, tString } = i18n;
    const { network } = ledger;
    const { portfolioExpanded, transactionsExpanded } = app;
    const { isDesktop, currencySetting, fiatCurrency } = settings;

    const HIDE_TOP_PANEL = transactionsExpanded;
    const IS_PORTFOLIO_EXPANDED = portfolioExpanded;
    const DISPLAY_TRANSACTIONS = !portfolioExpanded;
    const TRANSACTIONS_SUPPORTED = network.supportsTransactionsHistory;

    const PortfolioPanel = (
      <Card elevation={Elevation.TWO} style={getPortfolioCardStyles()}>
        <Row style={{ marginBottom: 10 }}>
          <H5 style={{ margin: 0 }}>{tString("Portfolio")}</H5>
          {isDesktop && (
            <ExpandCollapseIcon onClick={this.props.togglePortfolioSize} />
          )}
        </Row>
        <PortfolioSwitchContainer fullSize={portfolioExpanded} />
      </Card>
    );

    const BalancesPanel = (
      <Card elevation={Elevation.TWO} style={getBalanceCardStyles()}>
        <Row>
          <H5 style={{ margin: 0 }}>
            {tString("Balance")} (
            {currencySetting === "crypto"
              ? ledger.network.descriptor
              : fiatCurrency.symbol}
            )
          </H5>
        </Row>
        <BalancesSwitchContainer />
      </Card>
    );

    return (
      <View>
        {this.renderDashboardNavigationLinks()}
        {HIDE_TOP_PANEL ? null : IS_PORTFOLIO_EXPANDED ? (
          PortfolioPanel
        ) : (
          <PortfolioBalanceView>
            {PortfolioPanel}
            {BalancesPanel}
          </PortfolioBalanceView>
        )}
        {DISPLAY_TRANSACTIONS && (
          <View style={{ flex: 1 }}>
            <Row style={{ alignItems: "center" }}>
              <H5 style={{ marginTop: 15, marginBottom: 15, marginLeft: 15 }}>
                {t("Recent Transactions and Events")}
              </H5>
              {isDesktop && TRANSACTIONS_SUPPORTED && (
                <View>
                  <Button
                    text="Download All"
                    onClick={this.fetchAndDownloadTransactionHistory}
                  />
                  <Button
                    icon="fullscreen"
                    style={{ marginLeft: 4, marginRight: 12 }}
                    onClick={this.props.toggleTransactionsSize}
                  />
                </View>
              )}
            </Row>
            <TransactionsContainer fullSize={transactionsExpanded}>
              <TransactionSwitchContainer />
            </TransactionsContainer>
          </View>
        )}
      </View>
    );
  }

  renderDashboardNavigationLinks = () => {
    const {
      address,
      ledger,
      history,
      settings,
      location,
      cosmosAccountHistory,
    } = this.props;
    const { network } = ledger;
    const { pathname } = location;

    const commissionsTabAvailable = shouldShowCommissionsLink(
      cosmosAccountHistory,
    );

    const tabs = getChartTabsForNetwork(network, commissionsTabAvailable);

    if (settings.isDesktop) {
      return (
        <TopBar>
          {this.props.app.transactionsExpanded ? (
            <DashboardNavigationBar />
          ) : (
            <DashboardNavigationBar>
              {Object.values(tabs).map(title => (
                <DashboardNavigationLink
                  key={title}
                  title={title}
                  network={network}
                  address={address}
                  pathname={pathname}
                  localizedTitle={title}
                />
              ))}
            </DashboardNavigationBar>
          )}
          <AddressInputDashboardBar />
        </TopBar>
      );
    } else {
      return (
        <View style={{ marginTop: 15, marginBottom: 15 }}>
          <Popover
            content={
              <Menu>
                {Object.values(tabs).map(title =>
                  getMobileDashboardNavigationLink({
                    title,
                    address,
                    history,
                    network,
                    pathname,
                    localizedTitle: title,
                  }),
                )}
              </Menu>
            }
            position={Position.BOTTOM}
          >
            <Button
              rightIcon="caret-down"
              text={this.getMobileTitle()}
              data-cy="mobile-dashboard-navigation-menu"
            />
          </Popover>
        </View>
      );
    }
  };

  getMobileTitle = () => {
    const { location, i18n } = this.props;
    const { tString } = i18n;
    const portfolioType = getPortfolioTypeFromUrl(location.pathname);

    if (portfolioType) {
      const tabToText = {
        TOTAL: tString("Total"),
        AVAILABLE: tString("Available"),
        REWARDS: tString("Rewards"),
        STAKING: tString("Staking"),
        VOTING: tString("Staking"),
        COMMISSIONS: tString("Commission"),
        CUSD: "cUSD",
      };

      const tabTitle = tabToText[portfolioType];

      return `${tString("Viewing")}: ${tabTitle}`;
    }

    return "";
  };

  fetchAndDownloadTransactionHistory = async () => {
    try {
      const { address, ledger } = this.props;
      const { name } = ledger.network;

      // Provide a toast message
      Toast.warn("Starting transaction history download...");

      // Track action
      Analytics.downloadTransactions();

      // Fetch transaction history
      const response = await axios.get(
        `${ENV.SERVER_URL}/api/tx-history/${name}/${address}`,
      );

      // Convert to a JSON string
      const json = encodeURIComponent(JSON.stringify(response.data, null, 2));
      const dataString = `data:text/json;charset=utf-8,${json}`;

      // Create a document node to download
      const downloadAnchorNode = document.createElement("a");
      const fileName = `${name.toLowerCase()}-transactions-${address}.json`;
      downloadAnchorNode.setAttribute("href", dataString);
      downloadAnchorNode.setAttribute("download", fileName);
      document.body.appendChild(downloadAnchorNode);

      // Download the file and remove the link
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      Toast.success("Transaction history saved!");
    } catch (err) {
      Toast.danger("Failed to download transaction history.");
    }
  };
}

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

const TopBar = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 34px;
  margin-bottom: 14px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${(props: { theme: IThemeProps }) => {
    return props.theme.isDarkTheme ? COLORS.ADDRESS_LINE : Colors.LIGHT_GRAY1;
  }};
`;

const DashboardNavigationBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const PortfolioBalanceView = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: ${(props: { theme: IThemeProps }) =>
    props.theme.isDesktop ? "row" : "column"};
`;

const getPortfolioCardStyles = () => ({
  flex: 2,
  margin: 6,
  borderRadius: 0,
  minHeight: 325,
});

const getBalanceCardStyles = () => ({
  flex: 1,
  margin: 6,
  borderRadius: 0,
  minHeight: 325,
});

interface INavItemProps {
  title: string;
  address: string;
  pathname: string;
  localizedTitle: string;
  network: NetworkDefinition;
}

const TransactionsContainer = styled.div`
  padding: 8px;
  overflow-x: hidden;
  overflow-y: scroll;

  height: ${(props: { theme: IThemeProps } & { fullSize: boolean }) =>
    props.theme.isDesktop
      ? `calc(100vh - ${props.fullSize ? "175px" : "515px"})`
      : "100%"};
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const ExpandCollapseIcon = ({ onClick }: { onClick: () => void }) => (
  <Icon
    iconSize={12}
    icon="fullscreen"
    onClick={onClick}
    color={COLORS.LIGHT_GRAY}
    data-cy="expand-collapse-icon"
    className="expand-collapse-icon"
    style={{ marginLeft: 8, marginRight: 8 }}
  />
);

const DashboardNavigationLink = ({
  title,
  address,
  network,
  pathname,
  localizedTitle,
}: INavItemProps) => {
  const active = onActiveTab(pathname, title);
  const path = `${title.toLowerCase()}?address=${address}`;
  const onClickFunction = () => runAnalyticsForTab(title);
  return (
    <Link
      to={path}
      onClick={onClickFunction}
      data-cy={`${title.toLowerCase()}-navigation-link`}
    >
      <NavLinkContainer active={active}>
        {active ? (
          <H6 style={{ color: COLORS.CTA, fontWeight: "bold" }}>
            {localizedTitle}
          </H6>
        ) : (
          <H6 style={{ fontWeight: "bold" }}>{localizedTitle}</H6>
        )}
      </NavLinkContainer>
    </Link>
  );
};

const NavLinkContainer = styled.div`
  height: 30px;
  padding-left: 12px;
  padding-right: 12px;

  border-bottom: ${(props: { active: boolean }) =>
    props.active ? `5px solid ${COLORS.CTA}` : "5px solid none"};

  &:hover {
    cursor: pointer;
  }
`;

const getMobileDashboardNavigationLink = ({
  title,
  address,
  network,
  history,
  pathname,
  localizedTitle,
}: INavItemProps & { history: History }) => {
  const active = onActiveRoute(pathname, localizedTitle);
  const path = `/${network.name.toLowerCase()}/${title.toLowerCase()}?address=${address}`;
  const onClickFunction = () => {
    history.push(path);
    runAnalyticsForTab(title);
  };
  return (
    <MenuItem
      key={title}
      text={localizedTitle}
      onClick={onClickFunction}
      color={active ? COLORS.CHORUS : undefined}
      data-cy={`${title.toLowerCase()}-navigation-link`}
    />
  );
};

const runAnalyticsForTab = (title: string): void => {
  if (title === "TOTAL") {
    Analytics.viewPortfolioBalances();
  } else if (title === "REWARDS") {
    Analytics.viewPortfolioRewards();
  }
};

const shouldShowCommissionsLink = (
  cosmosAccountHistory: CosmosAccountHistoryQueryResult,
) => {
  return !!(
    cosmosAccountHistory &&
    cosmosAccountHistory.cosmosAccountHistory &&
    cosmosAccountHistory.cosmosAccountHistory.validatorCommissions &&
    cosmosAccountHistory.cosmosAccountHistory.validatorCommissions.length
  );
};

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  settings: Modules.selectors.settings(state),
  app: Modules.selectors.app.appSelector(state),
  ledger: Modules.selectors.ledger.ledgerSelector(state),
  address: Modules.selectors.ledger.addressSelector(state),
});

const dispatchProps = {
  setActiveChartTab: Modules.actions.app.setActiveChartTab,
  togglePortfolioSize: Modules.actions.app.togglePortfolioSize,
  toggleTransactionsSize: Modules.actions.app.toggleTransactionsSize,
};

const withProps = connect(mapStateToProps, dispatchProps);

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

interface ComponentProps {}

interface IProps
  extends ComponentProps,
    ConnectProps,
    CosmosAccountHistoryProps,
    RouteComponentProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withRouter,
  withCosmosAccountHistory,
)(DashboardPage);
