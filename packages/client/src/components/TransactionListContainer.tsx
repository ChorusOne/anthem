import * as Sentry from "@sentry/browser";
import { GraphQLGuardComponentMultipleQueries } from "components/GraphQLGuardComponents";
import { Centered, DashboardLoader } from "components/SharedComponents";
import {
  CosmosTransactionsProps,
  FiatPriceHistoryProps,
  ValidatorsProps,
  withCosmosTransactions,
  withFiatPriceHistory,
  withGraphQLVariables,
  withValidators,
} from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import { DashboardError } from "pages/DashboardPage";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { composeWithProps } from "tools/context-utils";
import TransactionList from "./TransactionList";

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

class TransactionListContainer extends React.Component<IProps, IState> {
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

    const {
      i18n,
      ledger,
      validators,
      transactions,
      fiatPriceHistory,
    } = this.props;
    const { tString } = i18n;
    const { network } = ledger;

    if (!network.supportsTransactionsHistory) {
      return (
        <Centered style={{ flexDirection: "column" }}>
          <p>
            <b>{network.name}</b> transaction history is not supported yet.
          </p>
        </Centered>
      );
    }

    return (
      <GraphQLGuardComponentMultipleQueries
        tString={tString}
        loadingComponent={<DashboardLoader />}
        errorComponent={<DashboardError tString={tString} />}
        results={[
          [transactions, "cosmosTransactions"],
          [validators, "validators"],
          [fiatPriceHistory, "fiatPriceHistory"],
        ]}
      >
        {() => {
          return (
            <TransactionList
              {...this.props}
              transactions={transactions.cosmosTransactions.data}
              moreResultsExist={
                transactions.cosmosTransactions.moreResultsExist
              }
            />
          );
        }}
      </GraphQLGuardComponentMultipleQueries>
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
  ledger: Modules.selectors.ledger.ledgerSelector(state),
  transactionsPage: Modules.selectors.transaction.transactionsPage(state),
  extraLiveTransactions: Modules.selectors.transaction.liveTransactionsRecordSelector(
    state,
  ),
});

const dispatchProps = {
  setAddress: Modules.actions.ledger.setAddress,
  setTransactionsPage: Modules.actions.transaction.setTransactionsPage,
  removeLocalCopyOfTransaction:
    Modules.actions.transaction.removeLocalCopyOfTransaction,
};

const withProps = connect(mapStateToProps, dispatchProps);

interface ComponentProps {}

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

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

export default composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withValidators,
  withCosmosTransactions,
  withFiatPriceHistory,
)(TransactionListContainer);
