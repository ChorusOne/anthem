import { Classes } from "@blueprintjs/core";
import LedgerDialogComponents from "components/LedgerDialogWorkflow";
import LogoutAlertComponent from "components/LogoutAlert";
import NotificationsBanner from "components/NotificationsBanner";
import SideMenuComponent from "components/SideMenu";
import TransactionDetail from "components/TransactionDetail";
import { COLORS } from "constants/colors";
import { IThemeProps } from "containers/ThemeContainer";
import ENV from "lib/client-env";
import Modules, { ReduxStoreState } from "modules/root";
import DashboardPage from "pages/DashboardPage";
import HelpPage from "pages/HelpPage";
import LandingPage from "pages/LandingPage";
import SettingsPage from "pages/SettingsPage";
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

/** ===========================================================================
 * React Component
 * ----------------------------------------------------------------------------
 * Routes configuration for the app.
 * ============================================================================
 */

class RoutesContainer extends React.Component<IProps> {
  render(): JSX.Element {
    const { history, address, settings } = this.props;
    const SHOW_LANDING_PAGE = history.location.pathname === "/login";

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
        <DevelopmentBanner />
        {settings.isDesktop && <NotificationsBanner />}
        <LedgerDialogComponents />
        <LogoutAlertComponent />
        <SideMenuComponent />
        <PageContainer>
          <Switch>
            <Route key={0} exact path="/login" component={LandingPage} />
            <Route key={1} path="/welcome" component={DashboardPage} />
            <Route
              key={2}
              exact
              path="/dashboard/*"
              component={DashboardPage}
            />
            <Route key={3} path="/txs/*" component={TransactionDetail} />
            <Route key={4} path="/help" component={HelpPage} />
            <Route key={5} path="/settings" component={SettingsPage} />
            <Route
              key={6}
              component={() =>
                !!address ? (
                  <Redirect to="/dashboard/total" />
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
