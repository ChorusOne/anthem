import { H3 } from "@blueprintjs/core";
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
import { Line, PageContainer, PageTitle } from "ui/SharedComponents";

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
        <PageTitle data-cy="settings-page-title">
          Polkadot Staking Agent
        </PageTitle>
        <Line />
        <Title>Start earning now!</Title>
      </PageContainer>
    );
  }
}

/** ===========================================================================
 * Styles & Helpers
 * ============================================================================
 */

const Title = styled(H3)``;

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
