import {
  CosmosTransactionDocument,
  ICosmosTransaction,
  IQuery,
} from "@anthem/utils";
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
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";
import { getTransactionHashFromUrl } from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import { GraphQLGuardComponentMultipleQueries } from "ui/GraphQLGuardComponents";
import { Centered, DashboardLoader, View } from "ui/SharedComponents";
import CosmosTransactionList from "./CosmosTransactionList";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class CosmosTransactionDetail extends React.PureComponent<IProps> {
  render(): JSX.Element {
    const { cosmosValidators, fiatPriceHistory, i18n, ledger } = this.props;
    const hash = getTransactionHashFromUrl(this.props.location.pathname);

    // Transaction may already exist in Apollo cache. Use this data first.
    const transactionMayExist = this.maybeFindTransactionInApolloCache(hash);
    if (transactionMayExist) {
      return (
        <View>
          <GraphQLGuardComponentMultipleQueries
            tString={i18n.tString}
            loadingComponent={<DashboardLoader />}
            results={[
              [cosmosValidators, "cosmosValidators"],
              [fiatPriceHistory, "fiatPriceHistory"],
            ]}
          >
            {() => this.renderTransaction(transactionMayExist)}
          </GraphQLGuardComponentMultipleQueries>
        </View>
      );
    } else {
      return (
        <View>
          <Query
            query={CosmosTransactionDocument}
            variables={{ hash, network: ledger.network.name }}
          >
            {(
              transaction: QueryResult<{
                transaction: IQuery["cosmosTransaction"];
              }>,
            ) => {
              return (
                <GraphQLGuardComponentMultipleQueries
                  tString={i18n.tString}
                  loadingComponent={<DashboardLoader />}
                  errorComponent={
                    <View>
                      <Centered
                        style={{ marginTop: 50, flexDirection: "column" }}
                      >
                        <p style={{ fontSize: 16 }}>
                          {this.props.i18n.t(
                            "Transaction could not be found for hash:",
                          )}
                        </p>
                        <p>{hash}</p>
                      </Centered>
                    </View>
                  }
                  results={[
                    [transaction, ["data", "cosmosTransaction"]],
                    [cosmosValidators, "cosmosValidators"],
                    [fiatPriceHistory, "fiatPriceHistory"],
                  ]}
                >
                  {([transactionResult]: readonly [ICosmosTransaction]) => {
                    return this.renderTransaction(transactionResult);
                  }}
                </GraphQLGuardComponentMultipleQueries>
              );
            }}
          </Query>
        </View>
      );
    }
  }

  renderTransaction = (transaction: ICosmosTransaction) => {
    return (
      <View>
        <CosmosTransactionList
          {...this.props}
          isDetailView
          transactionsPage={0}
          extraLiveTransactions={[]}
          transactions={transaction ? [transaction] : []}
        />
      </View>
    );
  };

  maybeFindTransactionInApolloCache = (
    hash: string,
  ): Nullable<ICosmosTransaction> => {
    const { transactions } = this.props;
    let result = null;

    if (transactions && transactions.cosmosTransactions) {
      result = transactions.cosmosTransactions.data.find(t => t.hash === hash);
    }

    return result || null;
  };
}

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  settings: Modules.selectors.settings(state),
  app: Modules.selectors.app.appSelector(state),
  ledger: Modules.selectors.ledger.ledgerSelector(state),
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

interface IProps
  extends ConnectProps,
    FiatPriceHistoryProps,
    ValidatorsProps,
    CosmosTransactionsProps,
    RouteComponentProps,
    ComponentProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withRouter,
  withProps,
  withGraphQLVariables,
  withValidators,
  withCosmosTransactions,
  withFiatPriceHistory,
)(CosmosTransactionDetail);
