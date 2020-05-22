import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";
import { composeWithProps } from "tools/context-utils";

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
    const {
      addressInputRef,
      portfolioExpanded,
      transactionsExpanded,
      dashboardInputFocused,
    } = app;

    const ANY_INPUT_FOCUSED = isAnyInputFocused();

    if (ANY_INPUT_FOCUSED || ledgerDialog.dialogOpen) {
      return;
    }

    const { keyCode } = event;

    /* Keys: */
    const I = 73;

    if (keyCode === I) {
      /**
       * Focus the address input only if it is not focused, in which case
       * also prevent the default keypress behavior (to avoid typing i) in
       * the input field once the focus event occurs.
       */
      event.preventDefault();
      if (event.keyCode === I) {
        if (addressInputRef) {
          addressInputRef.focus();
        }
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
  ledgerDialog: Modules.selectors.ledger.ledgerDialogSelector(state),
});

const withProps = connect(mapStateToProps);

interface ComponentProps {
  pageTitle: string;
  renderBackSquare?: boolean;
}

type ConnectProps = ReturnType<typeof mapStateToProps>;

interface IProps extends ConnectProps, RouteComponentProps, ComponentProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withRouter,
  withProps,
)(KeyboardShortcutsComponent);
