import { AVAILABLE_NETWORKS, NETWORK_NAME } from "@anthem/utils";
import { Card, Icon } from "@blueprintjs/core";
import { NetworkLogoIcon } from "assets/images";
import { COLORS } from "constants/colors";
import { SIGNIN_TYPE } from "modules/ledger/actions";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import Analytics from "tools/analytics-utils";
import { capitalizeString, onPath } from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import { LedgerHelpText } from "./LedgerHelpText";
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

        <MyLedgerDoesntWork />
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

const MyLedgerDoesntWorkLink = styled.div`
  color: #106ba3;
  padding-top: 22px;
  font-size: 18px;
  text-align: center;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

const MyLedgerDoesntWorkModalWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 25;

  display: flex;
  justify-content: center;
  align-items: center;

  > .inner {
    position: relative;
    height: 100%;
    width: 100%;
    max-width: 600px;
    max-height: 700px;
    background: white;

    display: flex;
    justify-content: center;
    align-items: flex-end;

    > .inner-inner {
      width: 100%;
      height: calc(100% - 32px);

      overflow-y: scroll;
      overflow-x: hidden;

      padding: 0 24px 24px 24px;

      font-size: 18px;

      p {
        margin: 24px 0;
      }

      img {
        max-width: 100%;
        box-shadow: 0 0 14px rgba(0, 0, 0, 0.14);
      }

      a {
        color: blue;

        &:hover {
          opacity: 0.8;
        }
      }

      > *:first-child {
        margin-top: 0 !important;
      }
    }
  }

  .close-icon {
    position: absolute;
    top: 4px;
    right: 3px;
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }
  }
`;

const MyLedgerDoesntWork = () => {
  const [shouldShowModal, setShouldShowModal] = useState(false);

  return (
    <>
      <MyLedgerDoesntWorkLink
        onClick={() => setShouldShowModal(true)}
        style={{ fontWeight: "bold" }}
      >
        Is your ledger not working?
      </MyLedgerDoesntWorkLink>

      {shouldShowModal && (
        <MyLedgerDoesntWorkModal setShouldShowModal={setShouldShowModal} />
      )}
    </>
  );
};

const MyLedgerDoesntWorkModal = ({
  setShouldShowModal,
}: {
  setShouldShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) =>
  ReactDOM.createPortal(
    <MyLedgerDoesntWorkModalWrapper onClick={event => event.stopPropagation()}>
      <div className="inner">
        <Icon
          onClick={() => setShouldShowModal(false)}
          className="close-icon"
          icon="cross"
          iconSize={24}
        />

        <div className="inner-inner">
          <LedgerHelpText />
        </div>
      </div>
    </MyLedgerDoesntWorkModalWrapper>,
    document.body,
  );

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
