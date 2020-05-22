import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";
import { copyTextToClipboard } from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import { KeyActionMap } from "./KeyboardShortcutsPopover";

/** ===========================================================================
 * KeyboardShortcutsComponent
 * ============================================================================
 */

class KeyboardShortcutsComponent extends React.PureComponent<IProps> {
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  render() {
    return null;
  }

  handleKeyDown = (event: KeyboardEvent) => {
    const { app, ledgerDialog } = this.props;
    const { addressInputRef } = app;

    const ANY_INPUT_FOCUSED = isAnyInputFocused();
    if (ANY_INPUT_FOCUSED || ledgerDialog.dialogOpen) {
      return;
    }

    const { keyCode, ctrlKey, altKey, shiftKey, metaKey } = event;
    const anyExtraKeyPress = ctrlKey || altKey || shiftKey || metaKey;

    // Allow accept keypress events with no additional keys held down
    if (anyExtraKeyPress) {
      return;
    }

    const { P, T, I, S, C, Q } = KeyActionMap;

    switch (keyCode) {
      case P.keyCode: {
        this.props.togglePortfolioSize();
        break;
      }
      case T.keyCode: {
        this.props.toggleTransactionsSize();
        break;
      }
      case I.keyCode: {
        /**
         * Focus the address input only if it is not focused, in which case
         * also prevent the default keypress behavior (to avoid typing i) in
         * the input field once the focus event occurs.
         */
        event.preventDefault();
        if (addressInputRef) {
          addressInputRef.focus();
        }
        break;
      }
      case S.keyCode: {
        event.preventDefault();
        this.props.openLedgerDialog({
          signinType: "ADDRESS",
          ledgerAccessType: "SIGNIN",
        });
        break;
      }
      case Q.keyCode: {
        this.props.openLogoutMenu();
        break;
      }
      case C.keyCode: {
        copyTextToClipboard(this.props.address);
        break;
      }
      default: {
        break;
      }
    }
  };
}

/**
 * Check if the current active element is an input element.
 */
const isAnyInputFocused = () => {
  const { activeElement } = document;
  if (activeElement) {
    return activeElement.tagName === "INPUT";
  }
  return false;
};

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  app: Modules.selectors.app.appSelector(state),
  address: Modules.selectors.ledger.addressSelector(state),
  ledgerDialog: Modules.selectors.ledger.ledgerDialogSelector(state),
});

const dispatchProps = {
  openLedgerDialog: Modules.actions.ledger.openLedgerDialog,
  openLogoutMenu: Modules.actions.ledger.openLogoutMenu,
  togglePortfolioSize: Modules.actions.app.togglePortfolioSize,
  toggleTransactionsSize: Modules.actions.app.toggleTransactionsSize,
};

const withProps = connect(mapStateToProps, dispatchProps);

interface ComponentProps {
  pageTitle: string;
  renderBackSquare?: boolean;
}

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

interface IProps extends ConnectProps, RouteComponentProps, ComponentProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withRouter,
  withProps,
)(KeyboardShortcutsComponent);
