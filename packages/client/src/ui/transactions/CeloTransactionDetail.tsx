import {
  CeloTransactionDocument,
  ICeloTransaction,
  IQuery,
} from "@anthem/utils";
import {
  CeloTransactionsProps,
  FiatPriceHistoryProps,
  withCeloTransactions,
  withFiatPriceHistory,
  withGraphQLVariables,
} from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";
import { composeWithProps } from "tools/context-utils";
import { GraphQLGuardComponentMultipleQueries } from "ui/GraphQLGuardComponents";
import { Centered, DashboardLoader, View } from "ui/SharedComponents";
import Toast from "ui/Toast";
import CeloTransactionListItem from "./CeloTransactionListItem";
import CosmosTransactionList from "./CosmosTransactionList";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class CeloTransactionDetailLoadingContainer extends React.PureComponent<
  IProps
> {
  render(): JSX.Element {
    const { fiatPriceHistory, i18n, ledger } = this.props;
    const txHash = this.props.location.pathname
      .replace("/txs/", "")
      .toLowerCase();

    // Transaction may already exist in Apollo cache. Use this data first.
    const transactionMayExist = this.maybeFindTransactionInApolloCache(txHash);
    if (transactionMayExist) {
      return (
        <View>
          <GraphQLGuardComponentMultipleQueries
            tString={i18n.tString}
            loadingComponent={<DashboardLoader />}
            results={[[fiatPriceHistory, "fiatPriceHistory"]]}
          >
            {() => this.renderTransaction(transactionMayExist)}
          </GraphQLGuardComponentMultipleQueries>
        </View>
      );
    } else {
      return (
        <View>
          <Query
            query={CeloTransactionDocument}
            variables={{ txHash, network: ledger.network.name }}
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
                        <p>{txHash}</p>
                      </Centered>
                    </View>
                  }
                  results={[
                    [transaction, ["data", "transaction"]],
                    [fiatPriceHistory, "fiatPriceHistory"],
                  ]}
                >
                  {([transactionResult]: readonly [ICeloTransaction]) => {
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

  renderTransaction = (transaction: ICeloTransaction) => {
    const { ledger, settings, i18n, setAddress } = this.props;
    const { network, address } = ledger;
    const { t, tString, locale } = i18n;
    const { isDesktop, fiatCurrency } = settings;
    return (
      <CeloTransactionListItem
        isDetailView
        t={t}
        tString={tString}
        locale={locale}
        address={address}
        network={network}
        isDesktop={isDesktop}
        key={transaction.hash}
        setAddress={setAddress}
        transaction={transaction}
        fiatCurrency={fiatCurrency}
        onCopySuccess={this.onCopySuccess}
      />
    );
  };

  maybeFindTransactionInApolloCache = (
    hash: string,
  ): Nullable<ICeloTransaction> => {
    const { transactions } = this.props;
    let result = null;

    if (transactions && transactions.celoTransactions) {
      result = transactions.celoTransactions.data.find(t => t.hash === hash);
    }

    return result || null;
  };

  onCopySuccess = (address: string) => {
    Toast.success(
      this.props.i18n.tString("Address {{address}} copied to clipboard", {
        address,
      }),
    );
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
    CeloTransactionsProps,
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
  withCeloTransactions,
  withFiatPriceHistory,
)(CeloTransactionDetailLoadingContainer);
