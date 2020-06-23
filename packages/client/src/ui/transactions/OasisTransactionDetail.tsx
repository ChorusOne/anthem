import {
  IOasisTransaction,
  IQuery,
  OasisTransactionDocument,
} from "@anthem/utils";
import {
  FiatPriceHistoryProps,
  OasisTransactionsProps,
  withFiatPriceHistory,
  withGraphQLVariables,
  withOasisTransactions,
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
import OasisTransactionListItem from "./OasisTransactionListItem";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class OasisTransactionDetailLoadingContainer extends React.PureComponent<
  IProps
> {
  render(): JSX.Element {
    const { fiatPriceHistory, i18n } = this.props;
    const hash = this.props.location.pathname.replace("/txs/", "");

    // Transaction may already exist in Apollo cache. Use this data first.
    const transactionMayExist = this.maybeFindTransactionInApolloCache(hash);
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
          <Query query={OasisTransactionDocument} variables={{ hash }}>
            {(
              transaction: QueryResult<{
                transaction: IQuery["oasisTransaction"];
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
                    [transaction, ["data", "oasisTransaction"]],
                    [fiatPriceHistory, "fiatPriceHistory"],
                  ]}
                >
                  {([transactionResult]: readonly [IOasisTransaction]) => {
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

  renderTransaction = (transaction: IOasisTransaction) => {
    const { ledger, settings, i18n, setAddress } = this.props;
    const { network, address } = ledger;
    const { t, tString, locale } = i18n;
    const { isDesktop, fiatCurrency } = settings;
    return (
      <OasisTransactionListItem
        t={t}
        isDetailView
        locale={locale}
        tString={tString}
        address={address}
        network={network}
        isDesktop={isDesktop}
        key={transaction.date}
        setAddress={setAddress}
        transaction={transaction}
        fiatCurrency={fiatCurrency}
        onCopySuccess={this.onCopySuccess}
      />
    );
  };

  maybeFindTransactionInApolloCache = (
    hash: string,
  ): Nullable<IOasisTransaction> => {
    return null;
    // const { transactions } = this.props;
    // let result = null;

    // if (transactions && transactions.oasisTransactions) {
    //   result = transactions.oasisTransactions.data.find(t => t.hash === hash);
    // }

    // return result || null;
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
    OasisTransactionsProps,
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
  withOasisTransactions,
  withFiatPriceHistory,
)(OasisTransactionDetailLoadingContainer);
