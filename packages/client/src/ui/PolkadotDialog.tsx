import { Card, Classes, Dialog, H6, Icon } from "@blueprintjs/core";
import { NetworkLogoIcon } from "assets/images";
import { COLORS } from "constants/colors";
import { DotTransactionType } from "modules/polkadot/store";
import Modules, { ReduxStoreState } from "modules/root";
import React from "react";
import { connect } from "react-redux";
import styled, { CSSProperties } from "styled-components";
import { composeWithProps } from "tools/context-utils";
import { Button, Link, TextInput, View } from "ui/SharedComponents";
import Toast from "./Toast";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IState {
  amount: string;
}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class PolkadotDialog extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      amount: "",
    };
  }

  render(): JSX.Element {
    const { settings, polkadot } = this.props;
    const { dialogOpen, interactionType } = polkadot;
    const { isDesktop, isDarkTheme } = settings;
    const dimensions = getDialogDimensions(isDesktop);
    const dialogMobilePosition = getMobileDialogPositioning(isDesktop);
    const style = {
      ...dimensions,
      ...dialogMobilePosition,
      borderRadius: 0,
    };
    const title = getDialogTitle(interactionType);
    return (
      <Dialog
        autoFocus
        usePortal
        enforceFocus
        canEscapeKeyClose
        canOutsideClickClose
        style={style}
        icon="bank-account"
        title={title}
        isOpen={dialogOpen}
        onClose={this.handleCloseDialog}
        className={isDarkTheme ? Classes.DARK : ""}
      >
        <View className={Classes.DIALOG_BODY} style={{ position: "relative" }}>
          {this.renderDialog()}
        </View>
      </Dialog>
    );
  }

  renderDialog = () => {
    const { interactionType } = this.props.polkadot;
    if (interactionType === "ACTIVATE") {
      return (
        <View>
          <Text>
            To activate the Polkadot staking agent we will first need to
            generate your personal Staking Agent key and associate your account
            with it.
          </Text>
          <SubText>
            <b>Note:</b> This will grant Chorus One limited rights to carry out
            staking-related transactions on your behalf. At no point will Chorus
            One have custody of your funds or be able to transfer your funds.
            You can revoke these rights at any point through Anthem or by
            resetting the Controller key in any other way. Learn more about the
            Staking Agent <Link href="http://chorus.one">here</Link>.
          </SubText>
          {this.renderConfirmArrow("Create Agent", this.handleActivate)}
        </View>
      );
    } else if (interactionType === "ADD_FUNDS") {
      return (
        <View>
          <H6>
            How much DOT do you want to add to the Chorus One Staking Agent?
          </H6>
          <Card>
            <Row>
              <Row>
                <NetworkLogoIcon network="POLKADOT" />
                <View style={{ marginLeft: 12 }}>
                  <TextInput
                    label="Enter an amount in DOT"
                    data-cy="funding-amount-input"
                    value={this.state.amount}
                    onChange={this.handleInputChange}
                    placeholder="Funding Amount"
                  />
                </View>
              </Row>
              <View>
                <BalanceRow>
                  <BalanceLabel>Your Account:</BalanceLabel>
                  <Balance>1000</Balance>
                </BalanceRow>
                <BalanceRow style={{ marginTop: 8 }}>
                  <BalanceLabel>Your Available Balance:</BalanceLabel>
                  <Balance>1000</Balance>
                </BalanceRow>
              </View>
            </Row>
          </Card>
          <ArrowButton>
            <Icon icon="arrow-down" color={COLORS.LIGHT_WHITE} />
          </ArrowButton>
          <Row style={{ paddingLeft: 20, paddingRight: 20 }}>
            <View />
            <View style={{ marginTop: 24 }}>
              <BalanceRow>
                <BalanceLabel>Your Agent's Account:</BalanceLabel>
                <Balance>1000</Balance>
              </BalanceRow>
              <BalanceRow style={{ marginTop: 8 }}>
                <BalanceLabel>Your Staked Balance:</BalanceLabel>
                <Balance>1000</Balance>
              </BalanceRow>
            </View>
          </Row>
          {this.renderConfirmArrow("Fund Agent", this.handleStake)}
        </View>
      );
    } else if (interactionType === "REMOVE_FUNDS") {
      return (
        <View>
          <H6>How much DOT do you want to unstake?</H6>
          {this.renderConfirmArrow("Unstake Funds", this.handleUnstake)}
        </View>
      );
    }

    return null;
  };

  renderConfirmArrow = (text: string, callback: () => void) => {
    return (
      <Button
        data-cy="polkadot-dialog-confirmation-button"
        onClick={callback}
        style={{
          right: 0,
          bottom: -16,
          position: "absolute",
        }}
      >
        {text}
      </Button>
    );
  };

  handleInputChange = (amount: string) => {
    this.setState({ amount });
  };

  handleCloseDialog = () => {
    this.props.closePolkadotDialog();
  };

  handleActivate = () => {
    console.log("Handling activate action");
    Toast.warn("Handling activate action");
  };

  handleStake = () => {
    console.log("Handling stake action");
    Toast.warn("Handling stake action");
  };

  handleUnstake = () => {
    console.log("Handling unstake action");
    Toast.warn("Handling unstake action");
  };
}

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

const getDialogTitle = (interactionType: DotTransactionType) => {
  if (interactionType === "ACTIVATE") {
    return "Activate the Polkadot Staking Agent";
  } else if (interactionType === "ADD_FUNDS") {
    return "Add Funds to the Staking Agent";
  } else if (interactionType === "REMOVE_FUNDS") {
    return "Remove Staked Funds";
  }

  return "Polkadot Staking Agent";
};

const getDialogDimensions = (isDesktop: boolean) => {
  return isDesktop
    ? {
        width: 515,
        height: 425,
      }
    : {
        width: "95vw",
        height: "auto",
        minHeight: 400,
      };
};

const getMobileDialogPositioning = (isDesktop: boolean): CSSProperties => {
  const mobileStyles: CSSProperties = {
    position: "absolute",
    top: 45,
  };

  if (isDesktop) {
    return {};
  } else {
    return mobileStyles;
  }
};

const Text = styled.p`
  font-size: 17px;
  margin-top: 18px;
  font-weight: 100;
`;

const BalanceLabel = styled.p`
  margin: 0;
  font-weight: bold;
`;

const Balance = styled.p`
  margin: 0;
  margin-left: 6px;
`;

const SubText = styled.p`
  margin: 0;
  padding: 0;
  font-size: 12px;
  margin-top: 24px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BalanceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ArrowButton = styled.div`
  z-index: 50;
  width: 38px;
  height: 38px;
  margin: auto;
  margin-top: -12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${COLORS.PRIMARY};
`;

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  settings: Modules.selectors.settings(state),
  polkadot: Modules.selectors.polkadot.polkadotSelector(state),
  address: Modules.selectors.ledger.ledgerSelector(state).address,
});

const dispatchProps = {
  closePolkadotDialog: Modules.actions.polkadot.closePolkadotDialog,
};

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

interface ComponentProps {}

interface IProps extends ComponentProps, ConnectProps {}

const withProps = connect(mapStateToProps, dispatchProps);

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withProps)(PolkadotDialog);
