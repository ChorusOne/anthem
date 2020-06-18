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
import { composeWithProps } from "tools/context-utils";
import { IThemeProps } from "ui/containers/ThemeContainer";
import KeyboardShortcutsComponent from "ui/KeyboardShortcutsComponent";
import LedgerDialogComponents from "ui/LedgerDialogWorkflow";
import LogoutAlertComponent from "ui/LogoutAlert";
import NotificationsBanner from "ui/NotificationsBanner";
import DashboardPage from "ui/pages/DashboardPage";
import GovernancePage from "ui/pages/GovernancePage";
import HelpPage from "ui/pages/HelpPage";
import LandingPage from "ui/pages/LandingPage";
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
    const { address, settings } = this.props;
    const SHOW_LANDING_PAGE = !address;
    // Alternate welcome page:
    // NOTE: To enable, also redirect to /welcome in the ledger logoutEpic
    // const SHOW_LANDING_PAGE = history.location.pathname === "/login";

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
            {/* <Route key={0} exact path="/login" component={LandingPage} /> */}
            {/* <Route key={1} path="/welcome" component={DashboardPage} /> */}
            <Route
              exact
              key={2}
              component={DashboardPage}
              path="/:path(total|available|staking|rewards|commissions)"
            />
            <Route
              key={3}
              path="/txs/*"
              component={TransactionDetailContainer}
            />
            <Route key={4} path="/delegate" component={ValidatorsPage} />
            <Route key={5} path="/governance" component={GovernancePage} />
            <Route key={6} path="/help" component={HelpPage} />
            <Route key={7} path="/settings" component={SettingsPage} />
            <Route
              key={7}
              component={() =>
                !!address ? (
                  <Redirect to="/total" />
                ) : (
                  <Redirect to="/welcome" />
                )
              }
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
