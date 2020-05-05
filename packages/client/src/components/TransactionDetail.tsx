import { IQuery, ITransaction, TransactionDocument } from "@anthem/utils";
import { Colors, H3, Icon } from "@blueprintjs/core";
import { GraphQLGuardComponentMultipleQueries } from "components/GraphQLGuardComponents";
import {
  Centered,
  DashboardLoader,
  Row,
  View,
} from "components/SharedComponents";
import { COLORS } from "constants/colors";
import { IThemeProps } from "containers/ThemeContainer";
import {
  FiatPriceHistoryProps,
  TransactionsProps,
  ValidatorsProps,
  withFiatPriceHistory,
  withGraphQLVariables,
  withTransactions,
  withValidators,
} from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import styled from "styled-components";
import { composeWithProps } from "tools/context-utils";
import AddressInputDashboardBar from "./AddressInputDashboardBar";
import TransactionList from "./TransactionList";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class TransactionDetailLoadingContainer extends React.PureComponent<IProps> {
  addressInput: Nullable<HTMLInputElement> = null;

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  render(): JSX.Element {
    const { validators, fiatPriceHistory, i18n, ledger } = this.props;
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
            results={[
              [validators, "validators"],
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
            query={TransactionDocument}
            variables={{ txHash, network: ledger.network.name }}
          >
            {(
              transaction: QueryResult<{ transaction: IQuery["transaction"] }>,
            ) => {
              return (
                <GraphQLGuardComponentMultipleQueries
                  tString={i18n.tString}
                  loadingComponent={<DashboardLoader />}
                  errorComponent={
                    <View>
                      {this.renderTopBar()}
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
                    [validators, "validators"],
                    [fiatPriceHistory, "fiatPriceHistory"],
                  ]}
                >
                  {([transactionResult]: readonly [ITransaction]) => {
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

  renderTopBar = () => {
    return (
      <TopBar>
        <Row style={{ marginTop: 12, marginBottom: 8 }}>
          <BackSquare onClick={this.props.history.goBack}>
            <Icon icon="chevron-left" />
          </BackSquare>
          <H3
            style={{ fontWeight: "bold", margin: 0 }}
            data-cy="transaction-detail-page-title"
          >
            {this.props.i18n.t("Transaction Detail")}
          </H3>
        </Row>
        <AddressInputDashboardBar assignInputRef={this.assignInputRef} />
      </TopBar>
    );
  };

  renderTransaction = (transaction: ITransaction) => {
    return (
      <View>
        {this.renderTopBar()}
        <TransactionList
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
  ): Nullable<ITransaction> => {
    const { transactions } = this.props;
    let result = null;

    if (transactions && transactions.transactionsPagination) {
      result = transactions.transactionsPagination.data.find(
        t => t.hash === hash,
      );
    }

    return result || null;
  };

  handleKeyDown = (event: KeyboardEvent) => {
    if (this.props.app.dashboardInputFocused) {
      return;
    }

    const { keyCode } = event;

    /* Keys: */
    const I = 73;

    if (keyCode === I) {
      /**
       * Focus the address input only if it is not focused, in which case
       * also prevent the default keypress behavior (to avoid typing i) in
       * the input field once the focus event occurs.
       */
      event.preventDefault();
      if (event.keyCode === I) {
        if (this.addressInput) {
          this.addressInput.focus();
        }
      }
    }
  };

  assignInputRef = (ref: HTMLInputElement) => {
    this.addressInput = ref;
  };
}

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

const TopBar = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 25px;
  margin-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${(props: { theme: IThemeProps }) => {
    return props.theme.isDarkTheme ? COLORS.ADDRESS_LINE : Colors.LIGHT_GRAY1;
  }};
`;

const BackSquare = styled.div`
  width: 32px;
  height: 32px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid none;

  :hover {
    cursor: pointer;
    border-width: 1px;
    border-style: solid;
    border-color: ${(props: { theme: IThemeProps }) => {
      return props.theme.isDarkTheme ? COLORS.ADDRESS_LINE : Colors.LIGHT_GRAY1;
    }};
  }
`;

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
};

const withProps = connect(mapStateToProps, dispatchProps);

interface ComponentProps {}

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

interface IProps
  extends ConnectProps,
    FiatPriceHistoryProps,
    ValidatorsProps,
    TransactionsProps,
    RouteComponentProps,
    ComponentProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withValidators,
  withTransactions,
  withFiatPriceHistory,
)(TransactionDetailLoadingContainer);
