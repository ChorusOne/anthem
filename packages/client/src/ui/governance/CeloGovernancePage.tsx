import {
  assertUnreachable,
  IApprovedProposal,
  ICeloGovernanceProposalHistory,
  IExecutionProposal,
  IExpiredProposal,
  IQueuedProposal,
  IReferendumProposal,
  withCeloGovernanceTransactions,
} from "@anthem/utils";
import {
  Card,
  Checkbox,
  Code,
  Collapse,
  Colors,
  Elevation,
  H5,
} from "@blueprintjs/core";
import { CopyIcon } from "assets/images";
import { COLORS } from "constants/colors";
import {
  CeloGovernanceProposalsProps,
  CeloGovernanceTransactionsProps,
  withCeloGovernanceProposals,
  withGraphQLVariables,
} from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  convertCeloEpochToTimestamp,
  copyTextToClipboard,
} from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import { addValuesInList, divide } from "tools/math-utils";
import { IThemeProps } from "ui/containers/ThemeContainer";
import { GraphQLGuardComponent } from "ui/GraphQLGuardComponents";
import PageAddressBar from "ui/PageAddressBar";
import {
  Button,
  DashboardError,
  DashboardLoader,
  Link,
  PageContainerScrollable,
  Row,
  View,
} from "ui/SharedComponents";
import Toast from "ui/Toast";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

type GovernanceProposalType =
  | IQueuedProposal
  | IApprovedProposal
  | IReferendumProposal
  | IExecutionProposal
  | IExpiredProposal;

/** ===========================================================================
 * Celo Governance Wrapper Component
 * ============================================================================
 */

class CeloGovernancePage extends React.Component<IProps, {}> {
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
          {(proposalHistory: ICeloGovernanceProposalHistory) => {
            const proposals = groupAndSortProposals(proposalHistory);
            return <CeloGovernanceComponent proposals={proposals} />;
          }}
        </GraphQLGuardComponent>
      </PageContainerScrollable>
    );
  }
}

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

type Vote = "yes" | "no" | "abstain";

interface IState {
  vote: Nullable<Vote>;
  selectedProposalID: Nullable<number>;
  selectedProposal: Nullable<GenericProposalHistory>;
}

interface CeloGovernanceComponentProps {
  proposals: GenericProposalHistory[];
}

/** ===========================================================================
 * Governance Component
 * ============================================================================
 */

class CeloGovernanceComponent extends React.Component<
  CeloGovernanceComponentProps,
  IState
> {
  constructor(props: CeloGovernanceComponentProps) {
    super(props);

    this.state = {
      vote: null,
      selectedProposal: null,
      selectedProposalID: null,
    };
  }

  componentDidMount() {
    const firstProposal = this.props.proposals[0];
    if (firstProposal) {
      this.setState({ selectedProposal: firstProposal });
    }
  }

  render() {
    const { selectedProposal, selectedProposalID } = this.state;
    const { proposals } = this.props;
    console.log(selectedProposal);
    return (
      <>
        <ProposalsPanel>
          <Panel>
            <H5 style={{ margin: 2, paddingLeft: 12 }}>Proposals</H5>
            <Card
              elevation={Elevation.TWO}
              style={{
                margin: 6,
                height: 275,
                padding: 0,
                borderRadius: 3,
                overflowY: "scroll",
              }}
            >
              <ProposalBanner>
                <ProposalTitleText style={{ flex: 1 }}>ID</ProposalTitleText>
                <ProposalTitleText style={{ flex: 3 }}>STAGE</ProposalTitleText>
                <ProposalTitleText style={{ flex: 4 }}>TITLE</ProposalTitleText>
                <ProposalTitleText style={{ flex: 2 }}>
                  EXPIRATION
                </ProposalTitleText>
              </ProposalBanner>
              {proposals.map(x => {
                return (
                  <ClickableRowWrapper
                    onClick={() => this.handleSelectProposal(x)}
                    key={x.proposalID}
                  >
                    <ProposalRow>
                      <Text style={{ flex: 1, paddingLeft: 2 }}>
                        {x.proposalID}
                      </Text>
                      <Text style={{ flex: 3 }}>{x.stage}</Text>
                      <Text style={{ flex: 4 }}>Title...</Text>
                      <Text style={{ flex: 2, fontSize: 12 }}>
                        {convertCeloEpochToTimestamp(x.queuedAtTimestamp)}
                      </Text>
                    </ProposalRow>
                    <Collapse isOpen={x.proposalID === selectedProposalID}>
                      <ProposalDetails>
                        <ProposalDetailsRow>
                          <Block />
                          <ProposerRow style={{ flex: 9 }}>
                            <Text>
                              <b>Proposer:</b>{" "}
                              <Code
                                onClick={() => {
                                  copyTextToClipboard(x.proposer);
                                }}
                              >
                                {x.proposer}
                              </Code>{" "}
                            </Text>
                            <CopyIcon
                              style={{ marginLeft: 6 }}
                              onClick={() => {
                                copyTextToClipboard(x.proposer);
                              }}
                            />
                          </ProposerRow>
                        </ProposalDetailsRow>
                        <ProposalDetailsRow>
                          <Block />
                          <Text style={{ flex: 9 }}>
                            <b>Details:</b>{" "}
                            <Link href={x.gist} style={{ fontSize: 12 }}>
                              {x.gist}
                            </Link>
                          </Text>
                        </ProposalDetailsRow>
                      </ProposalDetails>
                    </Collapse>
                  </ClickableRowWrapper>
                );
              })}
            </Card>
          </Panel>
          <Panel>
            <H5 style={{ margin: 2, paddingLeft: 12 }}>Proposal Details</H5>
            <Card
              elevation={Elevation.TWO}
              style={{ margin: 6, borderRadius: 3, padding: 0, height: 275 }}
            >
              {this.renderProposalDetailPanel()}
            </Card>
          </Panel>
        </ProposalsPanel>
        <View style={{ marginTop: 8 }}>
          <LinkText>
            Learn more about Celo governance{" "}
            <Link href="https://medium.com/chorus-one/an-overview-of-governance-on-celo-93ebc3aacf22">
              here
            </Link>
            .
          </LinkText>
        </View>
        <Row style={{ marginTop: 12 }}>
          <Panel>
            <H5 style={{ margin: 2, paddingLeft: 12 }}>Events</H5>
            <Card
              elevation={Elevation.TWO}
              style={{ margin: 6, borderRadius: 3, height: 275 }}
            ></Card>
          </Panel>
        </Row>
      </>
    );
  }

  renderProposalDetailPanel = () => {
    const { selectedProposal } = this.state;

    if (!selectedProposal) {
      return <Text>No proposals to view.</Text>;
    }

    const proposal = selectedProposal as GovernanceProposalType;
    switch (proposal.__typename) {
      case undefined: {
        return null;
      }
      case "QueuedProposal":
      case "ApprovedProposal":
      case "ExpiredProposal": {
        return (
          <View style={{ height: "100%", padding: 16 }}>
            <Text style={{ fontWeight: "bold" }}>
              Current Status of Proposal #{proposal.proposalID}:
            </Text>
            <Text style={{ marginTop: 8 }}>
              Stage: <i>{proposal.stage}</i>
            </Text>
          </View>
        );
      }
      case "ReferendumProposal":
      case "ExecutionProposal":
        const { yesVotes, noVotes, abstainVotes } = proposal;
        const total = addValuesInList(
          [yesVotes, noVotes, abstainVotes],
          Number,
        );
        const yes = divide(yesVotes, total, Number) * 100;
        const no = divide(noVotes, total, Number) * 100;
        const abstain = divide(abstainVotes, total, Number) * 100;
        return (
          <View style={{ height: "100%" }}>
            <TopSection>
              <Text style={{ fontWeight: "bold" }}>
                Current Status of Proposal #{proposal.proposalID}:
              </Text>
              <Text style={{ marginTop: 8 }}>
                Stage: <i>{proposal.stage}</i>
              </Text>
              <VotingBar
                votes={{
                  yes,
                  no,
                  abstain,
                  remaining: 0,
                }}
              />
            </TopSection>
            <BottomSection>
              <Text style={{ fontWeight: "bold" }}>Your Vote:</Text>
              <Row
                style={{
                  width: "75%",
                  margin: "auto",
                  justifyContent: "space-between",
                }}
              >
                <Checkbox
                  value="yes"
                  label="Yes"
                  onChange={() => this.handleVoteCheck("yes")}
                  checked={this.state.vote === "yes"}
                />
                <Checkbox
                  value="no"
                  label="No"
                  onChange={() => this.handleVoteCheck("no")}
                  checked={this.state.vote === "no"}
                />
                <Checkbox
                  value="abstain"
                  label="Abstain"
                  onChange={() => this.handleVoteCheck("abstain")}
                  checked={this.state.vote === "abstain"}
                />
              </Row>
              <Row>
                <Button onClick={this.handleVote}>Vote</Button>
              </Row>
            </BottomSection>
          </View>
        );
      default:
        return assertUnreachable(proposal);
    }
  };

  handleSelectProposal = (proposal: GenericProposalHistory) => {
    this.setState({
      selectedProposal: proposal,
      selectedProposalID: proposal.proposalID,
    });
  };

  handleVoteCheck = (vote: Vote) => {
    this.setState({ vote });
  };

  handleVote = () => {
    const { vote } = this.state;
    if (!vote) {
      Toast.warn("Please selected a vote.");
    } else {
      Toast.warn("Voting coming soon...");
    }
  };
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

const ProposalBanner = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
  height: 25px;
  padding-left: 8px;
  padding-right: 8px;
  color: ${COLORS.HEAVY_DARK_TEXT};
  background: ${Colors.GRAY4};
`;

const ClickableRowWrapper = styled.div`
  padding-top: 4px;
  border-bottom: 1px solid;
  border-bottom-color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.DARK_GRAY3 : Colors.LIGHT_GRAY1};

  &:hover {
    cursor: pointer;
    background: ${(props: { theme: IThemeProps }) =>
      props.theme.isDarkTheme ? Colors.DARK_GRAY3 : Colors.LIGHT_GRAY3};
  }
`;

const ProposalRow = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
  padding: 4px;
  padding-left: 8px;
  padding-right: 8px;
`;

const Block = styled.div`
  flex: 1;
`;

const LinkText = styled.i`
  font-size: 13px;
  margin-left: 12px;
`;

const ProposalDetails = styled.div`
  padding-top: 12px;
  padding-bottom: 12px;
  background: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.DARK_GRAY5 : Colors.LIGHT_GRAY3};
`;

const ProposalDetailsRow = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 8px;
  padding-right: 8px;
`;

const ProposerRow = styled.div`
  display: flex;
  align-items: center;
`;

const ProposalTitleText = styled.p`
  margin: 0;
  padding: 0;
  font-size: 12px;
  font-weight: bold;
`;

const Text = styled.p`
  margin: 0;
`;

const Bold = styled.p`
  margin: 0;
  font-weight: bold;
`;

const TopSection = styled.div`
  height: 60%;
  width: 100%;
  padding: 16px;
`;

const BottomSection = styled.div`
  padding: 16px;
  height: 40%;
  width: 100%;
  background: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.DARK_GRAY5 : Colors.LIGHT_GRAY3};
`;

interface VotingBarProps {
  votes: {
    yes: number;
    no: number;
    abstain: number;
    remaining: number;
  };
}

const VotingBar = (votingBarProps: VotingBarProps) => {
  const { votes } = votingBarProps;

  const yes = `${votes.yes}%`;
  const no = `${votes.no}%`;
  const abstain = `${votes.abstain}%`;
  const remaining = `${votes.remaining}%`;

  return (
    <View>
      <Row style={{ width: "100%", marginTop: 12, height: 45 }}>
        <VoteBox style={{ width: yes, background: COLORS.CHORUS }} />
        <VoteBox style={{ width: no, background: COLORS.ERROR }} />
        <VoteBox style={{ width: abstain, background: COLORS.DARK_TEXT }} />
        <VoteBox style={{ width: remaining, background: COLORS.DARK_GRAY }} />
      </Row>
      <Row style={{ marginTop: 12, justifyContent: "flex-start" }}>
        <Row style={{ marginRight: 10 }}>
          <Square style={{ background: COLORS.CHORUS }} />
          <Bold>Yes ({votes.yes}%)</Bold>
        </Row>
        <Row style={{ marginRight: 10 }}>
          <Square style={{ background: COLORS.ERROR }} />
          <Bold>No ({votes.no}%)</Bold>
        </Row>
        <Row style={{ marginRight: 10 }}>
          <Square style={{ background: COLORS.DARK_TEXT }} />
          <Bold>Abstain ({votes.abstain}%)</Bold>
        </Row>
        <Row style={{ marginRight: 10 }}>
          <Square style={{ background: COLORS.DARK_GRAY }} />
          <Bold>Remaining ({votes.remaining}%)</Bold>
        </Row>
      </Row>
    </View>
  );
};

const Square = styled.div`
  height: 12px;
  width: 12px;
  border-radius: 1px;
  margin-right: 10px;
`;

const VoteBox = styled.div`
  height: 100%;
`;

interface GenericProposalHistory {
  proposalID: number;
  stage: string;
  proposer: string;
  description: string;
  gist: string;
  queuedAtTimestamp: number;
}

/**
 * Group all of the proposal stages together and sort them by proposal ID.
 */
const groupAndSortProposals = (
  proposalHistory: ICeloGovernanceProposalHistory,
): GenericProposalHistory[] => {
  return Object.values(proposalHistory)
    .filter(x => Array.isArray(x))
    .flat()
    .sort((a, b) => {
      return b.proposalID - a.proposalID;
    });
};

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
    CeloGovernanceTransactionsProps,
    CeloGovernanceProposalsProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withCeloGovernanceProposals,
  withCeloGovernanceTransactions,
)(CeloGovernancePage);
