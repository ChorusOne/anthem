import * as Sentry from "@sentry/browser";
import { Centered } from "components/SharedComponents";
import TransactionListContainer from "components/TransactionListContainer";
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

class TransactionSwitchContainer extends React.Component<IProps, IState> {
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
          <p style={{ fontSize: 16, fontWeight: 500 }}>
            {this.props.i18n.tString("Error fetching data...")}
          </p>
        </Centered>
      );
    }

    const { network } = this.props.ledger;

    if (!network.supportsTransactionsHistory) {
      return (
        <Centered style={{ flexDirection: "column" }}>
          <p>
            <b>{network.name}</b> transaction history is not supported yet.
          </p>
        </Centered>
      );
    }

    switch (network.name) {
      case "COSMOS":
        return <TransactionListContainer />;
      case "OASIS":
        return null;
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

interface ComponentProps {}

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
  TransactionSwitchContainer,
);
