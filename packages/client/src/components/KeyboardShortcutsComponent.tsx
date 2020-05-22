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
  addressInput: Nullable<HTMLInputElement> = null;

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
    if (this.props.app.dashboardInputFocused) {
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
        if (this.addressInput) {
          this.addressInput.focus();
        }
      }
    }
  };

  assignInputRef = (ref: HTMLInputElement) => {
    this.addressInput = ref;
  };
}

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  app: Modules.selectors.app.appSelector(state),
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
