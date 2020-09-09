import { AVAILABLE_NETWORKS, NETWORK_NAME } from "@anthem/utils";
import { Card } from "@blueprintjs/core";
import { NetworkLogoIcon } from "assets/images";
import { COLORS } from "constants/colors";
import Analytics from "lib/analytics-lib";
import { SIGNIN_TYPE } from "modules/ledger/actions";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import styled, { CSSProperties } from "styled-components";
import { capitalizeString, onPath } from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import { View } from "./SharedComponents";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class NetworkSelectComponent extends React.Component<IProps, {}> {
  render(): JSX.Element {
    const enableThemedStyles = !this.onLandingPage();
    const color = enableThemedStyles ? undefined : COLORS.DARK_TITLE;
    return (
      <View>
        <p style={{ color }}>Choose a network to connect to:</p>
        <NetworkGrid>
          {Object.values(AVAILABLE_NETWORKS).map(network => {
            return (
              <NetworkSelect
                enableThemedStyles
                key={network.name}
                network={network.name}
                onClick={this.handleConnectNetwork(network.name)}
              />
            );
          })}
        </NetworkGrid>
      </View>
    );
  }

  handleConnectNetwork = (networkName: NETWORK_NAME) => () => {
    this.props.setAccessNetwork(networkName);
    this.handleSignInWithLedger();
  };

  handleSignInWithLedger = () => {
    const accessType = this.props.ledgerDialog.ledgerAccessType || "SIGNIN";
    this.trackLogin("LEDGER");
    this.props.openLedgerDialog({
      signinType: "LEDGER",
      ledgerAccessType: accessType,
    });
  };

  handleSignInWithAddress = () => {
    this.trackLogin("ADDRESS");
    this.props.openLedgerDialog({
      signinType: "ADDRESS",
      ledgerAccessType: "SIGNIN",
    });
  };

  trackLogin = (type: SIGNIN_TYPE) => {
    if (this.onLandingPage()) {
      Analytics.loginStart(type);
    } else {
      Analytics.loginUpdate(type);
    }
  };

  onLandingPage = () => {
    return onPath("/landing", window.location.pathname);
  };
}

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

const NetworkSelectButton = styled.div`
  width: 75px;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

interface NetworkSelectProps {
  network: NETWORK_NAME;
  enableThemedStyles: boolean;
  onClick: () => void;
}

const NetworkSelect = (props: NetworkSelectProps) => {
  return (
    <Card
      interactive
      style={cardButtonStyles}
      onClick={props.onClick}
      className="address-login-card"
      data-cy={`${props.network}-network-login`}
    >
      <NetworkSelectButton>
        <NetworkLogoIcon styles={{ width: 60 }} network={props.network} />
        <p
          style={{
            marginTop: 8,
            marginBottom: 2,
            fontWeight: "bold",
            color: props.enableThemedStyles ? undefined : COLORS.DARK_TITLE,
          }}
        >
          {capitalizeString(props.network)}
        </p>
      </NetworkSelectButton>
    </Card>
  );
};

const cardButtonStyles: React.CSSProperties = {
  width: 115,
  height: 115,
  margin: 12,
  borderRadius: 0,
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  borderColor: COLORS.CARD_BORDER,
};

const NetworkGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  settings: Modules.selectors.settings(state),
  ledger: Modules.selectors.ledger.ledgerSelector(state),
  ledgerDialog: Modules.selectors.ledger.ledgerDialogSelector(state),
});

const dispatchProps = {
  openLedgerDialog: Modules.actions.ledger.openLedgerDialog,
  setAccessNetwork: Modules.actions.ledger.setSigninNetworkName,
  openSelectNetworkDialog: Modules.actions.ledger.openSelectNetworkDialog,
};

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

const withProps = connect(mapStateToProps, dispatchProps);

interface ComponentProps {}

interface IProps extends ComponentProps, ConnectProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withProps)(
  NetworkSelectComponent,
);
