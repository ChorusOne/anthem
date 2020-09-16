import {
  assertUnreachable,
  IApprovedProposal,
  ICeloGovernanceProposalHistory,
  ICeloTransaction,
  IExecutionProposal,
  IExpiredProposal,
  IQueuedProposal,
  IReferendumProposal,
  NetworkDefinition,
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
  withCeloGovernanceTransactions,
  withGraphQLVariables,
} from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import { SettingsState } from "modules/settings/store";
import { Vote } from "modules/transaction/store";
import React from "react";
import ReactMarkdown from "react-markdown";
import { connect } from "react-redux";
import styled from "styled-components";
import { copyTextToClipboard } from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import { denomToUnit } from "tools/currency-utils";
import {
  convertCeloEpochToDate,
  convertCeloEpochToTimestamp,
} from "tools/date-utils";
import { I18nProps } from "tools/i18n-utils";
import { addValuesInList, divide } from "tools/math-utils";
import { IThemeProps } from "ui/containers/ThemeContainer";
import { GraphQLGuardComponentMultipleQueries } from "ui/GraphQLGuardComponents";
import PageAddressBar from "ui/PageAddressBar";
import {
  Button,
  DashboardError,
  DashboardLoader,
  Link,
  Row,
  View,
} from "ui/SharedComponents";
import Toast from "ui/Toast";
import CeloTransactionListItem from "ui/transactions/CeloTransactionListItem";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

export interface GenericCeloProposal {
  proposalID: number;
  stage: string;
  proposer: string;
  deposit: number;
  queuedAtTimestamp: number;
  gist: string;
  title: string;
  description: string;
}

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
    const {
      i18n,
      ledger,
      settings,
      setAddress,
      transactions,
      celoGovernanceProposals,
    } = this.props;
    const { network } = ledger;

    return (
      <View>
        <PageAddressBar pageTitle="Governance" />
        <GraphQLGuardComponentMultipleQueries
          tString={i18n.tString}
          results={[
            [transactions, "celoGovernanceTransactions"],
            [celoGovernanceProposals, "celoGovernanceProposals"],
          ]}
          errorComponent={<DashboardError tString={i18n.tString} />}
          loadingComponent={<DashboardLoader />}
        >
          {([governanceHistory, proposalHistory]: [
            ICeloTransaction[],
            ICeloGovernanceProposalHistory,
          ]) => {
            const proposals = groupAndSortProposals(proposalHistory);
            return (
              <CeloGovernanceComponent
                i18n={i18n}
                network={network}
                settings={settings}
                proposals={proposals}
                setAddress={setAddress}
                address={ledger.address}
                handleVote={this.handleVote}
                handleUpvote={this.handleUpVote}
                governanceTransactionHistory={governanceHistory}
              />
            );
          }}
        </GraphQLGuardComponentMultipleQueries>
      </View>
    );
  }

  handleUpVote = (proposal: GenericCeloProposal) => {
    if (!this.props.ledger.connected) {
      this.props.setSigninNetworkName(this.props.network.name);
    }

    this.props.setGovernanceVoteDetails({ vote: null, proposal });

    // Open the ledger dialog
    this.props.openLedgerDialog({
      signinType: "LEDGER",
      ledgerAccessType: "PERFORM_ACTION",
      ledgerActionType: "VOTE_FOR_PROPOSAL",
    });
  };

  handleVote = (proposal: GenericCeloProposal, vote: Vote) => {
    if (!this.props.ledger.connected) {
      this.props.setSigninNetworkName(this.props.network.name);
    }

    this.props.setGovernanceVoteDetails({ vote, proposal });

    // Open the ledger dialog
    this.props.openLedgerDialog({
      signinType: "LEDGER",
      ledgerAccessType: "PERFORM_ACTION",
      ledgerActionType: "VOTE_FOR_PROPOSAL",
    });
  };
}

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IState {
  vote: Nullable<Vote>;
  selectedProposalID: Nullable<number>;
  selectedProposal: Nullable<GenericCeloProposal>;
}

interface CeloGovernanceComponentProps {
  address: string;
  i18n: I18nProps["i18n"];
  network: NetworkDefinition;
  settings: SettingsState;
  proposals: GenericCeloProposal[];
  governanceTransactionHistory: ICeloTransaction[];
  setAddress: typeof Modules.actions.ledger.setAddress;
  handleUpvote: (proposal: GenericCeloProposal) => void;
  handleVote: (proposal: GenericCeloProposal, vote: Vote) => void;
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
    const { selectedProposalID } = this.state;
    const {
      network,
      proposals,
      settings,
      governanceTransactionHistory,
    } = this.props;
    const { isDesktop } = settings;
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
              }}
            >
              <ProposalBanner>
                <ProposalTitleText style={{ flex: 1 }}>ID</ProposalTitleText>
                <ProposalTitleText style={{ flex: 3 }}>STAGE</ProposalTitleText>
                <ProposalTitleText style={{ flex: 4 }}>TITLE</ProposalTitleText>
                <ProposalTitleText style={{ flex: 2 }}>
                  {isDesktop ? "QUEUED AT TIME" : "QUEUED"}
                </ProposalTitleText>
              </ProposalBanner>
              <ProposalsList>
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
                        <Text style={{ flex: 4 }}>{x.title}</Text>
                        <Text style={{ flex: 2, fontSize: 12 }}>
                          {convertCeloEpochToDate(x.queuedAtTimestamp)}
                        </Text>
                      </ProposalRow>
                      <Collapse isOpen={x.proposalID === selectedProposalID}>
                        <ProposalDetails>
                          <ProposalDetailsRow>
                            {isDesktop && <Block />}
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
                            {isDesktop && <Block />}
                            <Text style={{ flex: 9 }}>
                              <b>Deposit:</b>{" "}
                              {denomToUnit(x.deposit, network.denominationSize)}{" "}
                              {network.denom}
                            </Text>
                          </ProposalDetailsRow>
                          <ProposalDetailsRow>
                            {isDesktop && <Block />}
                            <Text style={{ flex: 9 }}>
                              <b>Gist URL:</b>{" "}
                              <Link href={x.gist} style={{ fontSize: 12 }}>
                                {x.gist}
                              </Link>
                            </Text>
                          </ProposalDetailsRow>
                          <ProposalDetailsRow>
                            {isDesktop && <Block />}
                            <Text style={{ flex: 9 }}>
                              <b>Proposal Details:</b>
                            </Text>
                          </ProposalDetailsRow>
                          <ProposalDetailsRow>
                            {isDesktop && <Block />}
                            <Block style={{ flex: 9, paddingRight: 12 }}>
                              <ReactMarkdown source={x.description} />
                            </Block>
                          </ProposalDetailsRow>
                        </ProposalDetails>
                      </Collapse>
                    </ClickableRowWrapper>
                  );
                })}
              </ProposalsList>
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
            <H5 style={{ margin: 2, paddingLeft: 12 }}>
              Governance Transactions
            </H5>
            {governanceTransactionHistory.length ? (
              <TransactionsContainer>
                {governanceTransactionHistory.map(this.renderTransactionItem)}
              </TransactionsContainer>
            ) : (
              <TransactionsContainer>
                <Text style={{ marginTop: 6, marginLeft: 6 }}>
                  No governance transaction history exists.
                </Text>
              </TransactionsContainer>
            )}
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
        return (
          <View style={{ height: "100%", padding: 16 }}>
            <H5>Current Status of Proposal #{proposal.proposalID}:</H5>
            <DetailRowText>
              <Bold style={{ marginRight: 4 }}>Stage:</Bold>
              <i>{proposal.stage}</i>
            </DetailRowText>
            {proposal.__typename === "QueuedProposal" && (
              <DetailRowText>
                <Bold style={{ marginRight: 4 }}>Proposal Upvotes:</Bold>
                <Text>{proposal.upvotes.toFixed()}</Text>
              </DetailRowText>
            )}
            <DetailRowText>
              <Bold style={{ marginRight: 4 }}>Proposal Epoch:</Bold>
              <Text>{convertCeloEpochToTimestamp(proposal.proposalEpoch)}</Text>
            </DetailRowText>
            <DetailRowText>
              <Bold style={{ marginRight: 4 }}>Referendum Epoch:</Bold>
              <Text>
                {convertCeloEpochToTimestamp(proposal.referendumEpoch)}
              </Text>
            </DetailRowText>
            <DetailRowText>
              <Bold style={{ marginRight: 4 }}>Execution Epoch:</Bold>
              <Text>
                {convertCeloEpochToTimestamp(proposal.executionEpoch)}
              </Text>
            </DetailRowText>
            <DetailRowText>
              <Bold style={{ marginRight: 4 }}>Expiration Epoch:</Bold>
              <Text>
                {convertCeloEpochToTimestamp(proposal.expirationEpoch)}
              </Text>
            </DetailRowText>
            {proposal.__typename === "QueuedProposal" && (
              <Row style={{ marginTop: 24 }}>
                <Button onClick={() => this.handleUpVote(proposal)}>
                  Up Vote
                </Button>
              </Row>
            )}
          </View>
        );
      case "ExpiredProposal": {
        return (
          <View style={{ height: "100%", padding: 16 }}>
            <H5>Current Status of Proposal #{proposal.proposalID}:</H5>
            <DetailRowText>
              <Bold style={{ marginRight: 4 }}>Stage:</Bold>
              <i>{proposal.stage}</i>
            </DetailRowText>
            <DetailRowText>
              <Bold style={{ marginRight: 4 }}>Proposal Executed:</Bold>
              <i>{proposal.executed ? "Yes" : "No"}</i>
            </DetailRowText>
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
              <H5>Current Status of Proposal #{proposal.proposalID}:</H5>
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
            {proposal.__typename === "ReferendumProposal" && (
              <BottomSection>
                <Text style={{ fontWeight: "bold" }}>Your Vote:</Text>
                <Row
                  style={{
                    width: "75%",
                    margin: "auto",
                    marginTop: 12,
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
            )}
          </View>
        );
      default:
        return assertUnreachable(proposal);
    }
  };

  handleSelectProposal = (proposal: GenericCeloProposal) => {
    this.setState({
      selectedProposal: proposal,
      selectedProposalID: proposal.proposalID,
    });
  };

  handleVoteCheck = (vote: Vote) => {
    this.setState({ vote });
  };

  handleVote = () => {
    const { vote, selectedProposal } = this.state;
    if (!vote) {
      Toast.warn("Please select a vote.");
    } else if (!selectedProposal) {
      Toast.warn("Please select a proposal to vote.");
    } else {
      this.props.handleVote(selectedProposal, vote);
    }
  };

  handleUpVote = (proposal: GenericCeloProposal) => {
    this.props.handleUpvote(proposal);
  };

  renderTransactionItem = (transaction: ICeloTransaction) => {
    const { address, network, settings, i18n, setAddress } = this.props;
    const { t, tString, locale } = i18n;
    const { isDesktop, fiatCurrency } = settings;
    return (
      <CeloTransactionListItem
        t={t}
        locale={locale}
        tString={tString}
        address={address}
        network={network}
        isDetailView={false}
        isDesktop={isDesktop}
        key={transaction.hash}
        setAddress={setAddress}
        transaction={transaction}
        fiatCurrency={fiatCurrency}
        onCopySuccess={this.onCopySuccess}
      />
    );
  };

  onCopySuccess = (address: string) => {
    Toast.success(
      this.props.i18n.tString("Address {{address}} copied to clipboard", {
        address,
      }),
    );
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
  background: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.GRAY1 : Colors.GRAY5};
`;

const ProposalsList = styled.div`
  height: 250px;
  overflow-y: scroll;
  overflow-x: hidden;
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
  padding-bottom: 8px;
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
  height: 58%;
  width: 100%;
  padding: 16px;
`;

const BottomSection = styled.div`
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 16px;
  padding-right: 16px;
  height: 42%;
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
      <Row style={{ width: "100%", marginTop: 8, height: 35 }}>
        <VoteBox style={{ width: yes, background: COLORS.CHORUS }} />
        <VoteBox style={{ width: no, background: COLORS.ERROR }} />
        <VoteBox style={{ width: abstain, background: COLORS.DARK_TEXT }} />
        <VoteBox style={{ width: remaining, background: COLORS.DARK_GRAY }} />
      </Row>
      <Row style={{ marginTop: 8, justifyContent: "flex-start" }}>
        <Row style={{ marginRight: 10 }}>
          <Square style={{ background: COLORS.CHORUS }} />
          <Bold>Yes ({votes.yes.toFixed(2)}%)</Bold>
        </Row>
        <Row style={{ marginRight: 10 }}>
          <Square style={{ background: COLORS.ERROR }} />
          <Bold>No ({votes.no.toFixed(2)}%)</Bold>
        </Row>
        <Row style={{ marginRight: 10 }}>
          <Square style={{ background: COLORS.DARK_TEXT }} />
          <Bold>Abstain ({votes.abstain.toFixed(2)}%)</Bold>
        </Row>
        <Row style={{ marginRight: 10 }}>
          <Square style={{ background: COLORS.DARK_GRAY }} />
          <Bold>Remaining ({votes.remaining.toFixed(2)}%)</Bold>
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

const DetailRowText = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
`;

const TransactionsContainer = styled.div`
  padding: 8px;
  overflow-x: hidden;
  overflow-y: scroll;
  height: calc(100vh - 500px);
`;

/**
 * Group all of the proposal stages together and sort them by proposal ID.
 */
const groupAndSortProposals = (
  proposalHistory: ICeloGovernanceProposalHistory,
): GenericCeloProposal[] => {
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
  settings: Modules.selectors.settings(state),
  ledger: Modules.selectors.ledger.ledgerSelector(state),
  network: Modules.selectors.ledger.networkSelector(state),
});

const dispatchProps = {
  setAddress: Modules.actions.ledger.setAddress,
  openLedgerDialog: Modules.actions.ledger.openLedgerDialog,
  setSigninNetworkName: Modules.actions.ledger.setSigninNetworkName,
  openSelectNetworkDialog: Modules.actions.ledger.openSelectNetworkDialog,
  setGovernanceVoteDetails:
    Modules.actions.transaction.setGovernanceVoteDetails,
};

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
