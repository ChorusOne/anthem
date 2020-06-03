import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";
import { copyTextToClipboard } from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

// Source of truth for supported keyboard keys:
export type KEYBOARD_SHORTCUT_KEYS =
  | "P"
  | "T"
  | "I"
  | "S"
  | "C"
  | "Q"
  | "BACK_TICK";

export interface KeyboardShortcutMetadata {
  key: KEYBOARD_SHORTCUT_KEYS;
  keyCode: number;
  action: string;
}

export const KeyActionMap: {
  [key in KEYBOARD_SHORTCUT_KEYS]: KeyboardShortcutMetadata;
} = {
  I: {
    key: "I",
    keyCode: 73,
    action: "Focus address input",
  },
  S: {
    key: "S",
    keyCode: 83,
    action: "Open address login modal",
  },
  C: {
    key: "C",
    keyCode: 67,
    action: "Copy current address",
  },
  P: {
    key: "P",
    keyCode: 80,
    action: "Toggle portfolio full size",
  },
  T: {
    key: "T",
    keyCode: 84,
    action: "Toggle transactions full size",
  },
  Q: {
    key: "Q",
    keyCode: 81,
    action: "Open logout menu",
  },
  BACK_TICK: {
    // @ts-ignore display ` symbol instead
    key: "`",
    keyCode: 192,
    action: "Toggle theme setting (back tick key)",
  },
};

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
    const {
      app,
      address,
      settings,
      ledgerDialog,
      updateSetting,
      openLogoutMenu,
      openLedgerDialog,
      togglePortfolioSize,
      toggleTransactionsSize,
    } = this.props;
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

    const { P, T, I, S, C, Q, BACK_TICK } = KeyActionMap;

    switch (keyCode) {
      case P.keyCode: {
        togglePortfolioSize();
        break;
      }
      case T.keyCode: {
        toggleTransactionsSize();
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
        openLedgerDialog({
          signinType: "ADDRESS",
          ledgerAccessType: "SIGNIN",
        });
        break;
      }
      case Q.keyCode: {
        openLogoutMenu();
        break;
      }
      case C.keyCode: {
        copyTextToClipboard(address);
        break;
      }
      case BACK_TICK.keyCode: {
        const { isDarkTheme } = settings;
        const theme = !isDarkTheme;
        updateSetting({
          isDarkTheme: theme,
          darkThemeEnabled: theme,
        });
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
  settings: Modules.selectors.settings(state),
  app: Modules.selectors.app.appSelector(state),
  address: Modules.selectors.ledger.addressSelector(state),
  ledgerDialog: Modules.selectors.ledger.ledgerDialogSelector(state),
});

const dispatchProps = {
  updateSetting: Modules.actions.settings.updateSetting,
  openLedgerDialog: Modules.actions.ledger.openLedgerDialog,
  openLogoutMenu: Modules.actions.ledger.openLogoutMenu,
  togglePortfolioSize: Modules.actions.app.togglePortfolioSize,
  toggleTransactionsSize: Modules.actions.app.toggleTransactionsSize,
};

const withProps = connect(mapStateToProps, dispatchProps);

interface ComponentProps {}

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
