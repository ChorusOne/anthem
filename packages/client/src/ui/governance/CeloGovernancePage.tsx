import { Card, Elevation, H5 } from "@blueprintjs/core";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { composeWithProps } from "tools/context-utils";
import { IThemeProps } from "ui/containers/ThemeContainer";
import PageAddressBar from "ui/PageAddressBar";
import { PageContainerScrollable, Row } from "ui/SharedComponents";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IState {}

/** ===========================================================================
 * Celo Governance Page
 * ============================================================================
 */

class CeloGovernancePage extends React.Component<IProps, IState> {
  render(): Nullable<JSX.Element> {
    return (
      <PageContainerScrollable>
        <PageAddressBar pageTitle="Governance" />
        <ProposalsPanel>
          <Panel>
            <H5 style={{ margin: 2, paddingLeft: 12 }}>Proposals</H5>
            <Card
              elevation={Elevation.TWO}
              style={{ margin: 6, borderRadius: 0, height: 275 }}
            ></Card>
          </Panel>
          <Panel>
            <H5 style={{ margin: 2, paddingLeft: 12 }}>Proposal Details</H5>
            <Card
              elevation={Elevation.TWO}
              style={{ margin: 6, borderRadius: 0, height: 275 }}
            ></Card>
          </Panel>
        </ProposalsPanel>
        <Row style={{ marginTop: 12 }}>
          <Panel>
            <H5 style={{ margin: 2, paddingLeft: 12 }}>Events</H5>
            <Card
              elevation={Elevation.TWO}
              style={{ margin: 6, borderRadius: 0, height: 275 }}
            ></Card>
          </Panel>
        </Row>
      </PageContainerScrollable>
    );
  }
}

/** ===========================================================================
 * Styles
 * ============================================================================
 */

const Panel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 250px;
`;

const ProposalsPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

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
