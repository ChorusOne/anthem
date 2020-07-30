import {
  Card,
  Classes,
  Code,
  Dialog,
  H6,
  Icon,
  Spinner,
} from "@blueprintjs/core";
import { NetworkLogoIcon } from "assets/images";
import { COLORS } from "constants/colors";
import {
  DotTransactionStage,
  DotTransactionType,
} from "modules/polkadot/store";
import Modules, { ReduxStoreState } from "modules/root";
import React from "react";
import { connect } from "react-redux";
import styled, { CSSProperties } from "styled-components";
import { abbreviateAddress, copyTextToClipboard } from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import {
  Button,
  Centered,
  Line,
  Link,
  TextInput,
  View,
} from "ui/SharedComponents";
import { DotAccount } from "./pages/PolkadotPage";
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
    const { dialogOpen, interactionType, stage } = polkadot;
    const { isDesktop, isDarkTheme } = settings;
    const dimensions = getDialogDimensions(isDesktop);
    const dialogMobilePosition = getMobileDialogPositioning(isDesktop);
    const style = {
      ...dimensions,
      ...dialogMobilePosition,
      borderRadius: 0,
    };
    const title = getDialogTitle(interactionType, stage);
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
    const { account, polkadot } = this.props;
    const { controllerKey, stashKey } = account;
    const { interactionType, stage } = polkadot;
    if (stage === "SETUP") {
      if (interactionType === "ACTIVATE") {
        return (
          <View>
            <Text>
              To activate the Polkadot staking agent we will first need to
              generate your personal Staking Agent key and associate your
              account with it.
            </Text>
            <SubText>
              <b>Note:</b> This will grant Chorus One limited rights to carry
              out staking-related transactions on your behalf. At no point will
              Chorus One have custody of your funds or be able to transfer your
              funds. You can revoke these rights at any point through Anthem or
              by resetting the Controller key in any other way. Learn more about
              the Staking Agent <Link href="http://chorus.one">here</Link>.
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
                    <BalanceLabel>Your Agent's Account:</BalanceLabel>
                    <Balance>1000</Balance>
                  </BalanceRow>
                  <BalanceRow style={{ marginTop: 8 }}>
                    <BalanceLabel>Your Staked Balance:</BalanceLabel>
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
                  <BalanceLabel>Your Account:</BalanceLabel>
                  <Balance>1000</Balance>
                </BalanceRow>
                <BalanceRow style={{ marginTop: 8 }}>
                  <BalanceLabel>Your Available Balance:</BalanceLabel>
                  <Balance>1000</Balance>
                </BalanceRow>
              </View>
            </Row>
            <SmallText>
              Unstaking tokens requires 28 eras (~28 days) to pass before tokens
              become liquid. Learn more{" "}
              <Link href="https://chorus.one">here</Link>.
            </SmallText>
            {this.renderConfirmArrow("Unstake Funds", this.handleStake)}
          </View>
        );
      }
    } else if (stage === "SIGN") {
      return (
        <View>
          <H6>Please confirm the transaction with your wallet.</H6>
          <TransactionLoading>
            <Spinner />
            <SubText>Waiting for signature...</SubText>
          </TransactionLoading>
          <Line />
          <View style={{ marginTop: 24 }}>
            <BalanceRow>
              <BalanceLabel>Your Stash Account:</BalanceLabel>
              <DisplayAddress address={stashKey} />
            </BalanceRow>
            <BalanceRow>
              <SubText style={{ marginTop: 2 }}>
                Where your funds are custodied
              </SubText>
            </BalanceRow>
            <BalanceRow style={{ marginTop: 8 }}>
              <BalanceLabel>Your New Controller Account:</BalanceLabel>
              <DisplayAddress address={controllerKey} />
            </BalanceRow>
            <BalanceRow>
              <SubText style={{ marginTop: 2 }}>
                The key of your automated staking agent
              </SubText>
            </BalanceRow>
          </View>
        </View>
      );
    } else if (stage === "CONFIRMED") {
      return (
        <View>
          <H6>Transaction Confirmed!</H6>
          <TransactionLoading>
            <ArrowButton>
              <Icon icon="tick" color={COLORS.LIGHT_WHITE} />
            </ArrowButton>
            <SubText>Your staking agent will update your stake now.</SubText>
          </TransactionLoading>
          <Line />
          <View style={{ marginTop: 24 }}>
            <BalanceRow>
              <BalanceLabel>Your Stash Account:</BalanceLabel>
              <DisplayAddress address={stashKey} />
            </BalanceRow>
            <BalanceRow>
              <SubText style={{ marginTop: 2 }}>
                Where your funds are custodied
              </SubText>
            </BalanceRow>
            <BalanceRow style={{ marginTop: 8 }}>
              <BalanceLabel>Your New Controller Account:</BalanceLabel>
              <DisplayAddress address={controllerKey} />
            </BalanceRow>
            <BalanceRow>
              <SubText style={{ marginTop: 2 }}>
                The key of your automated staking agent
              </SubText>
            </BalanceRow>
          </View>
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
    this.props.setTransactionStage("SIGN");
  };

  handleStake = () => {
    console.log("Handling stake action");
    Toast.warn("Handling stake action");
    this.props.setTransactionStage("SIGN");
  };

  handleUnstake = () => {
    console.log("Handling unstake action");
    Toast.warn("Handling unstake action");
    this.props.setTransactionStage("SIGN");
  };
}

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

const getDialogTitle = (
  interactionType: DotTransactionType,
  stage: DotTransactionStage,
) => {
  if (stage === "SETUP") {
    if (interactionType === "ACTIVATE") {
      return "Activate the Polkadot Staking Agent";
    } else if (interactionType === "ADD_FUNDS") {
      return "Add Funds to the Staking Agent";
    } else if (interactionType === "REMOVE_FUNDS") {
      return "Remove Staked Funds";
    }
  } else if (stage === "SIGN") {
    return "Sign Transaction";
  } else if (stage === "CONFIRMED") {
    return "Transaction Confirmed";
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

const SmallText = styled.p`
  margin-top: 24px;
  font-weight: 100;
`;

const TransactionLoading = styled(Centered)`
  height: 125px;
  padding-top: 24px;
  padding-bottom: 24px;
  flex-direction: column;
`;

const DisplayAddress = ({ address }: { address: string }) => {
  const endIndex = address.length - 12;
  const cutAddress = `${address.slice(0, 12)}...${address.slice(endIndex)}`;
  return (
    <AddressText onClick={() => copyTextToClipboard(address)}>
      {cutAddress}
    </AddressText>
  );
};

const AddressText = styled.p`
  font-size: 12px;

  :hover {
    cursor: pointer;
    color: ${COLORS.CHORUS_MINT};
  }
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
  setTransactionStage: Modules.actions.polkadot.setTransactionStage,
};

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

interface ComponentProps {
  account: DotAccount;
}

interface IProps extends ComponentProps, ConnectProps {}

const withProps = connect(mapStateToProps, dispatchProps);

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withProps)(PolkadotDialog);
