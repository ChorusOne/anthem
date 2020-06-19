import { Card, Elevation, H5 } from "@blueprintjs/core";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import { composeWithProps } from "tools/context-utils";
import BalancesSwitchContainer from "ui/balances/BalancesSwitchContainer";
import { PageContainerScrollable, PageTitle, Row } from "ui/SharedComponents";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IState {}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class CeloGovernancePage extends React.Component<IProps, IState> {
  render(): Nullable<JSX.Element> {
    const { i18n } = this.props;
    return (
      <PageContainerScrollable>
        <PageTitle data-cy="governance-page-title">
          {i18n.tString("Governance")}
        </PageTitle>
        <Card
          elevation={Elevation.TWO}
          style={{ flex: 1, margin: 6, borderRadius: 0, minHeight: 325 }}
        >
          <Row>
            <H5 style={{ margin: 0 }}>Proposals</H5>
          </Row>
          <BalancesSwitchContainer />
        </Card>
      </PageContainerScrollable>
    );
  }
}

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  ledger: Modules.selectors.ledger.ledgerSelector(state),
});

const dispatchProps = {};

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

const withProps = connect(mapStateToProps, dispatchProps);

interface ComponentProps {}

interface IProps extends ComponentProps, ConnectProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withProps)(CeloGovernancePage);
