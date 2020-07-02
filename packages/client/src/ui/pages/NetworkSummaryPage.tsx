import { NetworkDefinition } from "@anthem/utils";
import { Button } from "@blueprintjs/core";
import { withGraphQLVariables } from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import styled from "styled-components";
import { composeWithProps } from "tools/context-utils";
import LoginStart from "ui/LoginStart";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class NetworkSummaryPage extends React.Component<IProps> {
  render(): JSX.Element {
    // const { address, ledger, i18n, app, settings } = this.props;
    return (
      <DashboardDefaultView>
        <WelcomeTitle>Welcome to Anthem!</WelcomeTitle>
        <LoginStart />
        <Link to="/login">
          <Button icon="arrow-left" style={{ marginTop: 24 }}>
            Exit to Landing Page
          </Button>
        </Link>
      </DashboardDefaultView>
    );
  }
}

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const DashboardDefaultView = styled.div`
  margin-top: -30px;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const WelcomeTitle = styled.h1``;

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

const dispatchProps = {};

const withProps = connect(mapStateToProps, dispatchProps);

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

interface ComponentProps {}

interface IProps extends ComponentProps, ConnectProps, RouteComponentProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withProps,
  withRouter,
  withGraphQLVariables,
)(NetworkSummaryPage);
