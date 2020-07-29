import { H2 } from "@blueprintjs/core";
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
import { Button, PageContainer } from "ui/SharedComponents";

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
        <ContentArea>
          <Title>
            Start earning 8.99% APR on Polkadot with our Staking Agent.
          </Title>
          <Text>
            The Chorus One Staking Agent optimizes your DOT returns on Polkadot
            by automatically diversifying across validators and periodically
            withdrawing staking rewards for you.*
          </Text>
          <Button style={{ marginTop: 24 }} onClick={this.handleActivateAgent}>
            <b>ACTIVATE AGENT</b>
          </Button>
        </ContentArea>
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
