import PageAddressBar from "components/PageAddressBar";
import { Centered, View } from "components/SharedComponents";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { composeWithProps } from "tools/context-utils";
import CosmosTransactionDetail from "./CosmosTransactionDetail";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class TransactionDetailLoadingContainer extends React.PureComponent<IProps> {
  render(): JSX.Element {
    return (
      <View>
        <PageAddressBar
          renderBackSquare
          pageTitle={this.props.i18n.tString("Transaction Detail")}
        />
        {this.renderTransaction()}
      </View>
    );
  }

  renderTransaction = () => {
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
        return <CosmosTransactionDetail />;
      case "OASIS":
        return null;
      default:
        return null;
    }
  };
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

interface IProps extends ConnectProps, RouteComponentProps, ComponentProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withProps)(
  TransactionDetailLoadingContainer,
);
