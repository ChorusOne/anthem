import { Colors, H3, Icon } from "@blueprintjs/core";
import { Centered, Row, View } from "components/SharedComponents";
import { COLORS } from "constants/colors";
import { IThemeProps } from "containers/ThemeContainer";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import styled from "styled-components";
import { composeWithProps } from "tools/context-utils";
import AddressInputDashboardBar from "../components/AddressInputDashboardBar";
import CosmosTransactionDetail from "./CosmosTransactionDetail";

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
    return (
      <View>
        {this.renderTopBar()}
        {this.renderTransaction()}
      </View>
    );
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
  app: Modules.selectors.app.appSelector(state),
  ledger: Modules.selectors.ledger.ledgerSelector(state),
});

const dispatchProps = {
  setAddress: Modules.actions.ledger.setAddress,
};

const withProps = connect(mapStateToProps, dispatchProps);

interface ComponentProps {}

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

interface IProps extends ConnectProps, RouteComponentProps, ComponentProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withProps)(
  TransactionDetailLoadingContainer,
);
