import { Card, Colors, H5 } from "@blueprintjs/core";
import { AddressIcon, LedgerIcon } from "assets/images";
import { COLORS } from "constants/colors";
import { IThemeProps } from "containers/ThemeContainer";
import Analytics from "lib/analytics-lib";
import { SIGNIN_TYPE } from "modules/ledger/actions";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import styled, { CSSProperties } from "styled-components";
import { composeWithProps } from "tools/context-utils";
import { onPath } from "tools/generic-utils";
import Toast from "./Toast";
import { View } from "./SharedComponents";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class LoginStart extends React.Component<IProps, {}> {
  render(): JSX.Element {
    const enableThemedStyles = !this.onLoginPage();
    const { t } = this.props.i18n;

    return (
      <View>
        <H5
          style={{
            textAlign: "center",
            color: enableThemedStyles ? undefined : COLORS.DARK_TITLE,
          }}
        >
          {t("Please select a login option to begin")}
        </H5>
        <WrappedRow>
          <Card
            interactive
            data-cy="ledger-signin"
            className="ledger-login-card"
            onClick={this.handleChooseSelectNetwork}
            style={getCardButtonStyles(this.props.settings.isDesktop)}
          >
            <LedgerIcon />
            <LoginText className="login-text">
              {this.props.ledger.connected
                ? "Switch Network"
                : t("Sign in with Ledger")}
            </LoginText>
          </Card>
          <Card
            interactive
            data-cy="address-signin"
            className="address-login-card"
            onClick={this.handleSignInWithAddress}
            style={getCardButtonStyles(this.props.settings.isDesktop)}
          >
            <AddressIcon />
            <LoginText className="login-text">
              {this.props.ledger.address
                ? t("Change address")
                : t("Sign in with address")}
            </LoginText>
          </Card>
        </WrappedRow>
        <InfoTextBottom>
          {t(
            "Anthem currently supports staking on Cosmos. Connect your Ledger or enter a Cosmos address to start tracking your delegations.",
          )}
        </InfoTextBottom>
      </View>
    );
  }

  handleChooseSelectNetwork = () => {
    if (this.props.settings.isDesktop) {
      this.props.openSelectNetworkDialog({
        signinType: "LEDGER",
        ledgerAccessType: "SIGNIN",
        ledgerActionType: undefined,
      });
    } else {
      Toast.warn("Ledger integration is only available on desktop.");
    }
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
    return onPath(window.location.pathname, "/login");
  };
}

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

const getCardButtonStyles = (isDesktop: boolean): CSSProperties => {
  const dimensions = isDesktop
    ? {
        width: 190,
        height: 190,
      }
    : {
        width: 145,
        height: 145,
      };

  return {
    ...dimensions,
    margin: 12,
    borderRadius: 0,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    borderColor: COLORS.CARD_BORDER,
  };
};

const LoginText = styled.h4`
  margin-top: 24px;
  font-size: 14px;
  text-align: center;
  color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? COLORS.LIGHT_WHITE : COLORS.DARK_TITLE};

  &:hover {
    color: ${COLORS.PRIMARY};
  }
`;

const InfoTextBottom = styled.p`
  font-weight: 100;
  font-size: 16px;
  text-align: center;
  margin: auto;
  max-width: 415px;
  margin-top: 12px;
  color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.LIGHT_GRAY3 : COLORS.DARK_TITLE};

  @media (max-width: 1080px) {
    max-width: 325px;
  }
`;

const WrappedRow = styled.div`
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
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
});

const dispatchProps = {
  openLedgerDialog: Modules.actions.ledger.openLedgerDialog,
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

export default composeWithProps<ComponentProps>(withProps)(LoginStart);
