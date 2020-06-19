import { ICeloGovernanceProposal } from "@anthem/utils";
import { Card, Elevation, H5 } from "@blueprintjs/core";
import {
  CeloGovernanceProposalsProps,
  withCeloGovernanceProposals,
  withGraphQLVariables,
} from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { composeWithProps } from "tools/context-utils";
import { GraphQLGuardComponent } from "ui/GraphQLGuardComponents";
import PageAddressBar from "ui/PageAddressBar";
import {
  DashboardError,
  DashboardLoader,
  PageContainerScrollable,
  Row,
  View,
} from "ui/SharedComponents";

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
    const { celoGovernanceProposals, i18n } = this.props;

    return (
      <PageContainerScrollable>
        <PageAddressBar pageTitle="Governance" />
        <GraphQLGuardComponent
          tString={i18n.tString}
          dataKey="celoGovernanceProposals"
          result={celoGovernanceProposals}
          errorComponent={<DashboardError tString={i18n.tString} />}
          loadingComponent={<DashboardLoader />}
        >
          {(proposals: ICeloGovernanceProposal[]) => {
            console.log(proposals);
            return (
              <>
                <ProposalsPanel>
                  <Panel>
                    <H5 style={{ margin: 2, paddingLeft: 12 }}>Proposals</H5>
                    <Card
                      elevation={Elevation.TWO}
                      style={{ margin: 6, borderRadius: 0, height: 275 }}
                    >
                      {proposals.map(x => {
                        return (
                          <View key={x.proposalID} style={{ marginTop: 12 }}>
                            <ProposalRow>
                              <Text>
                                <b>Proposal ID:</b> {x.proposalID}
                              </Text>
                            </ProposalRow>
                            <ProposalRow>
                              <Text>
                                <b>Stage:</b> {x.stage}
                              </Text>
                            </ProposalRow>
                            <ProposalRow>
                              <Text>
                                <b>Proposer:</b> {x.proposer}
                              </Text>
                            </ProposalRow>
                            <ProposalRow>
                              <Text>
                                <b>Details:</b> {x.gist}
                              </Text>
                            </ProposalRow>
                          </View>
                        );
                      })}
                    </Card>
                  </Panel>
                  <Panel>
                    <H5 style={{ margin: 2, paddingLeft: 12 }}>
                      Proposal Details
                    </H5>
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
              </>
            );
          }}
        </GraphQLGuardComponent>
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

const ProposalRow = styled.div`
  /* display: flex; */
  /* align-items: center;
  justify-content: center; */
`;

const Text = styled.p`
  margin: 0;
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

interface IProps
  extends ComponentProps,
    ConnectProps,
    CeloGovernanceProposalsProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withCeloGovernanceProposals,
)(CeloGovernancePage);
