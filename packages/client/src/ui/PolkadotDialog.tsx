import { Classes, Dialog, H6 } from "@blueprintjs/core";
import { NetworkLogoIcon } from "assets/images";
import Modules, { ReduxStoreState } from "modules/root";
import React from "react";
import { connect } from "react-redux";
import styled, { CSSProperties } from "styled-components";
import { composeWithProps } from "tools/context-utils";
import { View } from "ui/SharedComponents";

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
    const { settings } = this.props;
    const { isDesktop, isDarkTheme } = settings;
    const dimensions = getDialogDimensions(isDesktop);
    const dialogMobilePosition = getMobileDialogPositioning(isDesktop);
    return (
      <Dialog
        autoFocus
        usePortal
        enforceFocus
        canOutsideClickClose
        style={{
          ...dimensions,
          ...dialogMobilePosition,
          borderRadius: 0,
        }}
        // icon={<NetworkLogoIcon network="POLKADOT" />}
        icon="bank-account"
        title={"Polkadot Staking Agent"}
        isOpen={true}
        onClose={this.handleCloseDialog}
        className={isDarkTheme ? Classes.DARK : ""}
        canEscapeKeyClose={true}
      >
        <View className={Classes.DIALOG_BODY} style={{ position: "relative" }}>
          {this.renderSetup()}
        </View>
      </Dialog>
    );
  }

  renderSetup = () => {
    return (
      <View>
        <H6 style={{ margin: 0 }}>Let's setup your Staking Agent.</H6>
        <Text>Cool!</Text>
      </View>
    );
  };

  setCanEscapeKeyCloseDialog = (canClose: boolean) => {
    this.setState({ canEscapeKeyCloseDialog: canClose });
  };

  handleCloseDialog = () => {
    console.log("Handling close dialog");
  };
}

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

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
  margin: 0;
  padding: 0;
`;

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  settings: Modules.selectors.settings(state),
  address: Modules.selectors.ledger.ledgerSelector(state).address,
});

const dispatchProps = {};

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

interface ComponentProps {}

interface IProps extends ComponentProps, ConnectProps {}

const withProps = connect(mapStateToProps, dispatchProps);

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withProps)(PolkadotDialog);
