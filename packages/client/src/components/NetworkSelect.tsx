import { Card } from "@blueprintjs/core";
import { NetworkLogoIcon } from "assets/images";
import { COLORS } from "constants/colors";
import { AVAILABLE_NETWORKS, NETWORK_NAME } from "constants/networks";
import Analytics from "lib/analytics-lib";
import { SIGNIN_TYPE } from "modules/ledger/actions";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import styled, { CSSProperties } from "styled-components";
import { composeWithProps } from "tools/context-utils";
import { capitalizeString, onPath } from "tools/generic-utils";
import { Row, View } from "./SharedComponents";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class NetworkSelectComponent extends React.Component<IProps, {}> {
  render(): JSX.Element {
    const enableThemedStyles = !this.onLoginPage();
    return (
      <View>
        <p
          style={{
            color: enableThemedStyles ? undefined : COLORS.DARK_TITLE,
          }}
        >
          Choose a network to connect to:
        </p>
        <Row
          style={{
            marginTop: 50,
          }}
        >
          {AVAILABLE_NETWORKS.map(network => {
            return (
              <NetworkSelect
                enableThemedStyles
                key={network.name}
                network={network.name}
                onClick={this.handleConnectNetwork(network.name)}
              />
            );
          })}
        </Row>
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
    if (this.onLoginPage()) {
      Analytics.loginStart(type);
    } else {
      Analytics.loginUpdate(type);
    }
  };

  onLoginPage = () => {
    return onPath("/login", window.location.pathname);
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
            marginTop: 12,
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

const cardButtonStyles: CSSProperties = {
  width: 150,
  height: 150,
  margin: 12,
  borderRadius: 0,
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  borderColor: COLORS.CARD_BORDER,
};

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

const withProps = connect(
  mapStateToProps,
  dispatchProps,
);

interface ComponentProps {}

interface IProps extends ComponentProps, ConnectProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withProps)(
  NetworkSelectComponent,
);
