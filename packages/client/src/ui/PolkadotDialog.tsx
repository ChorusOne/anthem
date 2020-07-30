import { Classes, Dialog, H6 } from "@blueprintjs/core";
import { DotTransactionType } from "modules/polkadot/store";
import Modules, { ReduxStoreState } from "modules/root";
import React from "react";
import { connect } from "react-redux";
import styled, { CSSProperties } from "styled-components";
import { composeWithProps } from "tools/context-utils";
import { Button, Link, View } from "ui/SharedComponents";
import Toast from "./Toast";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IState {}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class PolkadotDialog extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {};
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
          {this.renderConfirmArrow("Activate Agent", this.handleActivate)}
        </View>
      );
    } else if (interactionType === "ADD_FUNDS") {
      return "Add Funds to the Staking Agent";
    } else if (interactionType === "REMOVE_FUNDS") {
      return "Remove Staked Funds";
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

  setCanEscapeKeyCloseDialog = (canClose: boolean) => {
    this.setState({ canEscapeKeyCloseDialog: canClose });
  };

  handleCloseDialog = () => {
    this.props.closePolkadotDialog();
  };

  handleActivate = () => {
    console.log("Handling activate action");
    Toast.warn("Handling activate action");
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
  font-size: 16px;
  margin-top: 18px;
  font-weight: 100;
`;

const SubText = styled.p`
  margin: 0;
  padding: 0;
  font-size: 12px;
  margin-top: 24px;
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
