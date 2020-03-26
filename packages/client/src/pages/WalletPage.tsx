import React from "react";
import { connect } from "react-redux";

import { PageContainer, PageTitle } from "components/SharedComponents";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import { composeWithProps } from "tools/context-utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

/** ===========================================================================
 * React Component
 * ============================================================================
 */

const WalletPage: React.FC<IProps> = (props: IProps) => {
  return (
    <PageContainer>
      <PageTitle data-cy="wallet-page-title">
        {props.i18n.tString("Wallet")}
      </PageTitle>
    </PageContainer>
  );
};

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

export default composeWithProps<ComponentProps>(withProps)(WalletPage);
