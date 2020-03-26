import { Alert, Classes, Intent } from "@blueprintjs/core";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { composeWithProps } from "tools/context-utils";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class LogoutAlertComponent extends React.Component<IProps, {}> {
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  render(): JSX.Element {
    const { tString } = this.props.i18n;
    return (
      <Alert
        canEscapeKeyCancel
        canOutsideClickCancel
        intent={Intent.DANGER}
        style={{ borderRadius: 0 }}
        cancelButtonText={tString("Cancel")}
        confirmButtonText={tString("Logout")}
        onCancel={this.props.closeLogoutMenu}
        onConfirm={this.props.confirmLogout}
        isOpen={this.props.logoutMenuOpen}
        className={this.props.settings.isDarkTheme ? Classes.DARK : ""}
      >
        <AlertTitle>{tString("Are you sure you want to logout?")}</AlertTitle>
        <AlertText>
          {tString("Any addresses you have entered will be cleared.")}
        </AlertText>
      </Alert>
    );
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (!this.props.logoutMenuOpen) {
      return;
    }

    // Enter key:
    if (event.keyCode === 13) {
      this.props.confirmLogout();
    }
  };
}

/** ===========================================================================
 * Styled Components
 * ============================================================================
 */

const AlertTitle = styled.h3``;

const AlertText = styled.p`
  margin-top: 12px;
  font-weight: 100;
`;

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  logoutMenuOpen: Modules.selectors.ledger.ledgerLogoutMenuSelector(state),
  settings: Modules.selectors.settings(state),
});

const dispatchProps = {
  confirmLogout: Modules.actions.ledger.confirmLogout,
  closeLogoutMenu: Modules.actions.ledger.closeLogoutMenu,
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
  LogoutAlertComponent,
);
