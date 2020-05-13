import {
  PageContainerScrollable,
  PageTitle,
} from "components/SharedComponents";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import { composeWithProps } from "tools/context-utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class WalletPage extends React.Component<IProps, {}> {
  render(): JSX.Element {
    return (
      <PageContainerScrollable>
        <PageTitle data-cy="wallet-page-title">
          {this.props.i18n.tString("Wallet")}
        </PageTitle>
      </PageContainerScrollable>
    );
  }
}

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
});

const dispatchProps = {
  setLocale: Modules.actions.settings.setLocale,
};

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

const withProps = connect(mapStateToProps, dispatchProps);

interface ComponentProps {}

interface IProps extends ComponentProps, ConnectProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withProps)(WalletPage);
