import { Classes } from "@blueprintjs/core";
import { COLORS } from "constants/colors";
import ENV from "lib/client-env";
import Modules, { ReduxStoreState } from "modules/root";
import React from "react";
import { connect } from "react-redux";
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from "react-router-dom";
import styled from "styled-components";
import { getQueryParamsFromUrl } from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import { IThemeProps } from "ui/containers/ThemeContainer";
import GovernanceSwitchContainer from "ui/governance/GovernanceSwitchContainer";
import KeyboardShortcutsComponent from "ui/KeyboardShortcutsComponent";
import LedgerDialogComponents from "ui/LedgerDialogWorkflow";
import LogoutAlertComponent from "ui/LogoutAlert";
import NotificationsBanner from "ui/NotificationsBanner";
import DashboardPage from "ui/pages/DashboardPage";
import HelpPage from "ui/pages/HelpPage";
import LandingPage from "ui/pages/LandingPage";
import NetworkSummaryPage from "ui/pages/NetworkSummaryPage";
import SettingsPage from "ui/pages/SettingsPage";
import SideMenuComponent from "ui/SideMenu";
import TransactionDetailContainer from "ui/transactions/TransactionDetailContainer";
import ValidatorsPage from "ui/validators/ValidatorsSwitchContainer";

/** ===========================================================================
 * React Component
 * ----------------------------------------------------------------------------
 * Routes configuration for the app.
 * ============================================================================
 */

class RoutesContainer extends React.Component<IProps> {
  render(): JSX.Element {
    const { address, network, history, settings } = this.props;
    const { search, pathname } = history.location;
    const SHOW_LANDING_PAGE = pathname === "/login" && !address;
    const params = getQueryParamsFromUrl(search);

    let shouldRedirect = !address;
    if ("address" in params && !SHOW_LANDING_PAGE) {
      shouldRedirect = false;
    }

    if (SHOW_LANDING_PAGE) {
      return (
        <DefaultContainer>
          <DevelopmentBanner />
          <LedgerDialogComponents />
          <Switch>
            <Route key={0} exact path="/login" component={LandingPage} />
            <Route key={1} component={() => <Redirect to="/login" />} />
          </Switch>
        </DefaultContainer>
      );
    }

    return (
      <FixedAppBackgroundPage
        className={settings.isDarkTheme ? Classes.DARK : ""}
      >
        <KeyboardShortcutsComponent />
        <DevelopmentBanner />
        {settings.isDesktop && <NotificationsBanner />}
        <LedgerDialogComponents />
        <LogoutAlertComponent />
        <SideMenuComponent />
        <PageContainer>
          <Switch>
            <Route key={0} path="/networks" component={NetworkSummaryPage} />
            <Route key={1} path="/help" component={HelpPage} />
            {/* if there's no address, redirect anything else back to /networks */}
            {shouldRedirect && (
              <Route key={2} component={() => <Redirect to="/networks" />} />
            )}
            <Route
              exact
              key={3}
              component={DashboardPage}
              path="/:network/:path(total|available|staking|voting|rewards|commissions|cusd)"
            />
            <Route
              key={4}
              path="/:network/txs/*"
              component={TransactionDetailContainer}
            />
            <Route
              key={5}
              path="/:network/delegate"
              component={ValidatorsPage}
            />
            <Route
              key={6}
              path="/:network/governance"
              component={GovernanceSwitchContainer}
            />
            <Route key={7} path="/settings" component={SettingsPage} />
            <Route
              key={8}
              component={() => (
                <Redirect to={`/${network.name.toLowerCase()}/total`} />
              )}
            />
          </Switch>
        </PageContainer>
      </FixedAppBackgroundPage>
    );
  }
}

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

const DefaultContainer = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  background-color: ${COLORS.WHITE};
`;

export const FixedAppBackgroundPage = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  overflow-x: hidden;
  position: absolute;
  min-width: ${(props: { theme: IThemeProps }) =>
    props.theme.isDesktop ? 1250 : undefined};
  background-color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? COLORS.DARK_THEME_BACKGROUND : COLORS.WHITE};
`;

const PageContainer = styled.div`
  padding: ${(props: { theme: IThemeProps }) =>
    props.theme.isDesktop ? "20px" : "15px"};
  padding-top: ${(props: { theme: IThemeProps }) =>
    props.theme.isDesktop ? "10px" : "5px"};
  margin-top: ${(props: { theme: IThemeProps }) =>
    props.theme.isDesktop ? "0px" : "55px"};
  margin-left: ${(props: { theme: IThemeProps }) =>
    props.theme.isDesktop ? "250px" : "0px"};
`;

const DevelopmentBanner = () => {
  return ENV.ENABLE_MOCK_APIS ? (
    <DevLabel>
      <DevLabelText>Offline Development Enabled</DevLabelText>
    </DevLabel>
  ) : null;
};

const DevLabel = styled.div`
  z-index: 100;
  position: fixed;
  right: 0;
  bottom: 0;
  height: 20px;
  padding: 2px;
  padding-left: 4px;
  padding-right: 4px;
  display: flex;
  align-items: center;
  background: #ffdf75;
`;

const DevLabelText = styled.p`
  margin: 0;
  font-size: 11px;
  color: black;
  font-weight: bold;
  text-align: center;
`;

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  settings: Modules.selectors.settings(state),
  address: Modules.selectors.ledger.addressSelector(state),
  network: Modules.selectors.ledger.networkSelector(state),
});

type ConnectProps = ReturnType<typeof mapStateToProps>;

const withProps = connect(mapStateToProps);

interface ComponentProps {}

interface IProps extends ComponentProps, RouteComponentProps, ConnectProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withProps,
  withRouter,
)(RoutesContainer);
