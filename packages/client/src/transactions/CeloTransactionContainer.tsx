import { GraphQLGuardComponentMultipleQueries } from "components/GraphQLGuardComponents";
import { DashboardLoader } from "components/SharedComponents";
import {
  CeloTransactionsProps,
  withCeloTransactions,
  withGraphQLVariables,
} from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import { DashboardError } from "pages/DashboardPage";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { composeWithProps } from "tools/context-utils";
import CeloTransactionList from "./CeloTransactionList";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class CeloTransactionsContainer extends React.Component<IProps, {}> {
  render(): Nullable<JSX.Element> {
    const { i18n, transactions } = this.props;
    const { tString } = i18n;
    return (
      <GraphQLGuardComponentMultipleQueries
        tString={tString}
        loadingComponent={<DashboardLoader />}
        errorComponent={<DashboardError tString={tString} />}
        results={[[transactions, "celoTransactions"]]}
      >
        {() => {
          return (
            <CeloTransactionList
              {...this.props}
              transactions={transactions.celoTransactions.data}
              moreResultsExist={transactions.celoTransactions.moreResultsExist}
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

export type TransactionListProps = ConnectProps & RouteComponentProps;

interface IProps
  extends TransactionListProps,
    CeloTransactionsProps,
    ComponentProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withCeloTransactions,
)(CeloTransactionsContainer);
