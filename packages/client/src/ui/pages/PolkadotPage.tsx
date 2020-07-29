import { Card, H2 } from "@blueprintjs/core";
import {
  FiatCurrenciesProps,
  withFiatCurrencies,
  withGraphQLVariables,
} from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { composeWithProps } from "tools/context-utils";
import PageAddressBar from "ui/PageAddressBar";
import { Button, Link, PageContainer } from "ui/SharedComponents";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IState {}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class PolkadotPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    // No-op
  }

  componentWillUnmount() {
    // No-op
  }

  render(): JSX.Element {
    return (
      <PageContainer>
        <PageAddressBar pageTitle="Polkadot Staking Agent" />
        <Row>
          <ContentArea>
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
              onClick={this.handleActivateAgent}
            >
              <b>ACTIVATE AGENT</b>
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
            <Card>
              <DotRow>
                <RowItem>
                  <b>AVAILABLE DOT</b>
                </RowItem>
                <RowItem>20</RowItem>
              </DotRow>
              <DotRow>
                <RowItem>
                  <b>STAKED DOT</b>
                </RowItem>
                <RowItem>5,001.02</RowItem>
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
        </Disclaimer>
      </PageContainer>
    );
  }

  handleActivateAgent = () => {
    console.log("Activating Agent...");
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

const HeaderRow = styled(DotRow)`
  padding-left: 20px;
  padding-right: 20px;
`;

const HeaderTitle = styled.p`
  font-weight: bold;
  font-size: 12px;
`;

const RowItem = styled.div`
  width: 250px;
`;

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  address: Modules.selectors.ledger.ledgerSelector(state).address,
});

const dispatchProps = {};

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
  withFiatCurrencies,
)(PolkadotPage);
