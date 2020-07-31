import {
  Card,
  Code,
  H2,
  Icon,
  Spinner,
  Switch,
  Tooltip,
} from "@blueprintjs/core";
import { COLORS } from "constants/colors";
import { FiatCurrenciesProps, withGraphQLVariables } from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { copyTextToClipboard } from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import PageAddressBar from "ui/PageAddressBar";
import PolkadotDialog from "ui/PolkadotDialog";
import {
  Button,
  Centered,
  Link,
  PageContainer,
  TextInput,
} from "ui/SharedComponents";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IState {
  stake: string;
  enableAutomaticStaking: boolean;
}

/** ===========================================================================
 * React Component
 * ----------------------------------------------------------------------------
 * Polkadot Staking Agent component for the Chorus One Polkadot hackathon.
 * ============================================================================
 */

class PolkadotPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      stake: "",
      enableAutomaticStaking: true,
    };
  }

  componentDidMount() {
    // No-op
  }

  componentWillUnmount() {
    // No-op
  }

  componentDidUpdate(prevProps: IProps) {
    /**
     * Reinitialize if the address changes.
     */
    if (this.props.address !== prevProps.address) {
      this.props.fetchAccount();
    }
  }

  render(): JSX.Element {
    const { account, loading, error, newUser } = this.props.polkadot;
    const { stake, enableAutomaticStaking } = this.state;
    if (loading || !account) {
      return (
        <Centered style={{ marginTop: 125 }}>
          <Spinner />
        </Centered>
      );
    } else if (error) {
      return (
        <Centered style={{ marginTop: 125 }}>
          <p style={{ fontSize: 16 }}>{error}</p>
        </Centered>
      );
    }

    const { balance, controllerKey } = account;

    return (
      <PageContainer>
        <PolkadotDialog
          stake={stake}
          account={account}
          enableAutomaticStaking={enableAutomaticStaking}
        />
        <PageAddressBar pageTitle="Polkadot Staking Agent" />
        <Row>
          <ContentArea style={{ paddingTop: 18 }}>
            <Title>
              Start earning 8.99% APR on Polkadot with our Staking Agent.
            </Title>
            <Text>
              The Chorus One Staking Agent optimizes your DOT returns on
              Polkadot by automatically diversifying across validators and
              periodically withdrawing staking rewards for you.<b>*</b>
            </Text>
            <Button
              style={{ marginTop: 24 }}
              onClick={() => (newUser ? this.handleActivateAgent() : null)}
            >
              {newUser ? <b>ACTIVATE AGENT</b> : <b>AGENT ACTIVATED</b>}
            </Button>
          </ContentArea>
          <ContentArea>
            <HeaderRow>
              <RowItem>
                <HeaderTitle>BALANCE</HeaderTitle>
              </RowItem>
              <RowItem>
                <HeaderTitle>AMOUNT</HeaderTitle>
              </RowItem>
            </HeaderRow>
            <Card style={{ paddingTop: 8, paddingBottom: 8 }}>
              <DotRow>
                <RowItem>
                  <b>AVAILABLE DOT</b>
                </RowItem>
                <RowItem>{balance}</RowItem>
              </DotRow>
              <DotRow>
                <RowItem>
                  <b>STAKED DOT</b>
                </RowItem>
                <RowItem>5,001.02</RowItem>
              </DotRow>
              <StakeControlsRow style={{ marginTop: 18, paddingLeft: 145 }}>
                <StakeButton>
                  <Button
                    category="DANGER"
                    style={{ borderRadius: "50%" }}
                    onClick={this.handleUnStakeDot}
                  >
                    <Icon icon="minus" color={COLORS.LIGHT_WHITE} />
                  </Button>
                  <ButtonText>UNSTAKE</ButtonText>
                </StakeButton>
                <TextInput
                  data-cy="Stake Input"
                  placeholder="DOTs"
                  value={this.state.stake}
                  onChange={this.handleInput}
                  style={{ marginLeft: 12, marginRight: 12, width: 65 }}
                />
                <StakeButton>
                  <Button
                    style={{ borderRadius: "50%" }}
                    onClick={this.handleStakeDot}
                  >
                    <Icon icon="plus" color={COLORS.LIGHT_WHITE} />
                  </Button>
                  <ButtonText>STAKE</ButtonText>
                </StakeButton>
              </StakeControlsRow>
              <DotRow style={{ marginTop: 24 }}>
                <RowItem>
                  <Tooltip
                    position="bottom"
                    content={
                      <span>
                        Rewards will be re-staked automatically by the agent.
                      </span>
                    }
                  >
                    <SpecialTextRow>
                      <SpecialText>AUTOMATIC RE-STAKING</SpecialText>
                      <Icon
                        icon="help"
                        iconSize={12}
                        style={{ position: "absolute", top: -8, right: -12 }}
                      />
                    </SpecialTextRow>
                  </Tooltip>
                </RowItem>
                <RowItem>
                  <Switch
                    data-cy="re-stake-switch"
                    onChange={this.toggleAutomaticReStaking}
                    checked={this.state.enableAutomaticStaking}
                    label={this.state.enableAutomaticStaking ? "ON" : "OFF"}
                  />
                </RowItem>
              </DotRow>
            </Card>
          </ContentArea>
        </Row>
        <Disclaimer>
          <b>*</b> Activating the Staking Agent will enable Chorus One to carry
          out staking-related transactions on your behalf saving you time and
          gas fees in the process. In the MVP version, the Staking Agent will
          ensure you are optimally staking by maintaining an updated list of
          Chorus One validators. To learn more, check out the introduction
          article <Link href="https://chorus.one">here</Link>.
          <br />
          <br />
          <b>Controller key:</b>{" "}
          <ClickSpan>
            <Code
              style={{ fontSize: 14 }}
              onClick={() => copyTextToClipboard(controllerKey)}
            >
              {controllerKey}
            </Code>
          </ClickSpan>
        </Disclaimer>
      </PageContainer>
    );
  }

  toggleAutomaticReStaking = () => {
    this.setState(({ enableAutomaticStaking }) => ({
      enableAutomaticStaking: !enableAutomaticStaking,
    }));
  };

  handleInput = (stake: string) => {
    this.setState({ stake });
  };

  handleUnStakeDot = () => {
    this.props.openPolkadotDialog("REMOVE_FUNDS");
  };

  handleStakeDot = () => {
    this.props.openPolkadotDialog("ADD_FUNDS");
  };

  handleActivateAgent = () => {
    this.props.openPolkadotDialog("ACTIVATE");
  };
}

/** ===========================================================================
 * Styles & Helpers
 * ============================================================================
 */

const Title = styled(H2)``;

const ContentArea = styled.div`
  padding: 12px;
  width: 500px;
`;

const Text = styled.p`
  font-size: 15px;
  font-weight: 200;
  margin-top: 18px;
`;

const Disclaimer = styled.p`
  position: absolute;
  bottom: 75px;
  padding-right: 75px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-right: 25px;
`;

const DotRow = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

// @ts-ignore
const HeaderRow = styled(DotRow)`
  padding-left: 20px;
  padding-right: 20px;
`;

const StakeControlsRow = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: row;
`;

const HeaderTitle = styled.p`
  font-weight: bold;
  font-size: 12px;
`;

const StakeButton = styled.div`
  width: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ButtonText = styled.p`
  margin-top: 8px;
  font-size: 12px;
  font-weight: bold;
`;

const RowItem = styled.div`
  width: 250px;
`;

const SpecialTextRow = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  flex-direction: row;
`;

const SpecialText = styled.p`
  font-size: 12px;
  font-weight: 200;
`;

const ClickSpan = styled.span`
  :hover {
    cursor: pointer;
  }
`;

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  polkadot: Modules.selectors.polkadot.polkadotSelector(state),
  address: Modules.selectors.ledger.ledgerSelector(state).address,
});

const dispatchProps = {
  fetchAccount: Modules.actions.polkadot.fetchAccount,
  openPolkadotDialog: Modules.actions.polkadot.openPolkadotDialog,
};

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

const withProps = connect(mapStateToProps, dispatchProps);

interface ComponentProps {}

interface IProps extends ComponentProps, ConnectProps, FiatCurrenciesProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
)(PolkadotPage);
