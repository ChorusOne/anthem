import * as Sentry from "@sentry/browser";
import {
  CosmosTransactionsProps,
  FiatPriceHistoryProps,
  ValidatorsProps,
} from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { composeWithProps } from "tools/context-utils";
import { Centered, PanelMessageText } from "ui/SharedComponents";
import CeloPortfolio from "./CeloPortfolio";
import CosmosPortfolio from "./CosmosPortfolio";
import OasisPortfolio from "./OasisPortfolio";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IState {
  hasError: boolean;
}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class PortfolioSwitchContainer extends React.Component<IProps, IState> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  constructor(props: IProps) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error: Error) {
    // Log the error to Sentry.
    Sentry.captureException(error);
  }

  componentDidUpdate(prevProps: IProps) {
    if (
      this.state.hasError &&
      this.props.ledger.network.name !== prevProps.ledger.network.name
    ) {
      this.setState({ hasError: false });
    }
  }

  render(): Nullable<JSX.Element> {
    if (this.state.hasError) {
      return (
        <Centered>
          <PanelMessageText>
            {this.props.i18n.tString("Error fetching data...")}
          </PanelMessageText>
        </Centered>
      );
    }

    const { network } = this.props.ledger;

    if (!network.supportsPortfolio) {
      return (
        <PanelMessageText>
          <b>{network.name}</b> portfolio history is not supported yet.
        </PanelMessageText>
      );
    }

    switch (network.name) {
      case "COSMOS":
        return <CosmosPortfolio fullSize={this.props.fullSize} />;
      case "OASIS":
        return <OasisPortfolio fullSize={this.props.fullSize} />;
      case "CELO":
        return <CeloPortfolio fullSize={this.props.fullSize} />;
      default:
        return null;
    }
  }
}

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  ledger: Modules.selectors.ledger.ledgerSelector(state),
});

const withProps = connect(mapStateToProps);

interface ComponentProps {
  fullSize: boolean;
}

type ConnectProps = ReturnType<typeof mapStateToProps>;

export type TransactionListProps = ConnectProps &
  FiatPriceHistoryProps &
  ValidatorsProps &
  RouteComponentProps;

interface IProps
  extends TransactionListProps,
    CosmosTransactionsProps,
    ComponentProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withProps)(
  PortfolioSwitchContainer,
);
