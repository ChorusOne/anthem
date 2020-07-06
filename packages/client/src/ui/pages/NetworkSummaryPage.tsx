import { NETWORK_NAME } from "@anthem/utils";
import { Card, Colors } from "@blueprintjs/core";
import { NetworkLogoIcon } from "assets/images";
import { withGraphQLVariables } from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import styled from "styled-components";
import { capitalizeString } from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import { formatCurrencyAmount } from "tools/currency-utils";
import { IThemeProps } from "ui/containers/ThemeContainer";
import PageAddressBar from "ui/PageAddressBar";
import { Button, PageContainer, PercentChangeText } from "ui/SharedComponents";

/**
 * Fixed data:
 */

interface INetwork {
  name: NETWORK_NAME;
  tokenPrice: Nullable<number>;
  lastDayChange: Nullable<string>;
  marketCapitalization: Nullable<number>;
  expectedReward: Nullable<number>;
  inflation: Nullable<number>;
  supportsLedger: boolean;
}

const NETWORKS: INetwork[] = [
  {
    name: "COSMOS",
    tokenPrice: 2.29,
    lastDayChange: "5.2",
    marketCapitalization: 800000000,
    expectedReward: 8,
    inflation: 7,
    supportsLedger: true,
  },
  {
    name: "TERRA",
    tokenPrice: 1.19,
    lastDayChange: "7.9",
    marketCapitalization: 3250000,
    expectedReward: 10,
    inflation: 5,
    supportsLedger: true,
  },
  {
    name: "KAVA",
    tokenPrice: 5.03,
    lastDayChange: "-2.4",
    marketCapitalization: 752122,
    expectedReward: 12,
    inflation: 10,
    supportsLedger: true,
  },
  {
    name: "CELO",
    tokenPrice: 1.83,
    lastDayChange: "-5",
    marketCapitalization: 12,
    expectedReward: 6.5,
    inflation: 3,
    supportsLedger: true,
  },
  {
    name: "OASIS",
    tokenPrice: null,
    lastDayChange: null,
    marketCapitalization: null,
    expectedReward: null,
    inflation: null,
    supportsLedger: false,
  },
];

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class NetworkSummaryPage extends React.Component<IProps> {
  render(): JSX.Element {
    const { settings } = this.props;
    const fiatSymbol = settings.fiatCurrency.symbol;
    return (
      <PageContainer>
        <PageAddressBar pageTitle="Network Summaries" />
        <Card>
          <HeaderRow>
            <ItemHeader style={{ width: 50 }}>
              <ColumnHeader />
            </ItemHeader>
            <ItemHeader>
              <ColumnHeader>
                <Title>NETWORK</Title>
              </ColumnHeader>
            </ItemHeader>
            <ItemHeader>
              <ColumnHeader>
                <Title>TOKEN PRICE</Title>
              </ColumnHeader>
            </ItemHeader>
            <ItemHeader>
              <ColumnHeader>
                <Title>24H CHANGE</Title>
              </ColumnHeader>
            </ItemHeader>
            <ItemHeader>
              <ColumnHeader>
                <Title>MARKET CAPITALIZATION</Title>
              </ColumnHeader>
            </ItemHeader>
            <ItemHeader>
              <ColumnHeader>
                <Title>EXPECTED REWARD</Title>
              </ColumnHeader>
            </ItemHeader>
            <ItemHeader>
              <ColumnHeader>
                <Title>INFLATION</Title>
              </ColumnHeader>
            </ItemHeader>
            <ItemHeader>
              <ColumnHeader>
                <Title>ADJUSTED REWARD</Title>
              </ColumnHeader>
            </ItemHeader>
            <ItemHeader />
          </HeaderRow>
          {Object.values(NETWORKS).map(network => {
            return (
              <Row key={network.name}>
                <Item style={{ width: 50 }}>
                  <NetworkLogoIcon network={network.name} />
                </Item>
                <Item>
                  <Text>
                    {network.name ? (
                      <b>{capitalizeString(network.name)}</b>
                    ) : (
                      "n/a"
                    )}
                  </Text>
                </Item>
                <Item>
                  <Text>
                    {network.tokenPrice ? (
                      <span>
                        ${network.tokenPrice} {fiatSymbol}
                      </span>
                    ) : (
                      "n/a"
                    )}
                  </Text>
                </Item>
                <Item>
                  <Text>
                    {network.lastDayChange ? (
                      <PercentChangeText value={network.lastDayChange} />
                    ) : (
                      "n/a"
                    )}
                  </Text>
                </Item>
                <Item>
                  <Text>
                    {network.marketCapitalization ? (
                      <span>
                        ${formatCurrencyAmount(network.marketCapitalization)}{" "}
                        {fiatSymbol}
                      </span>
                    ) : (
                      "n/a"
                    )}
                  </Text>
                </Item>
                <Item>
                  <Text>
                    {network.expectedReward ? (
                      <span>{network.expectedReward}%</span>
                    ) : (
                      "n/a"
                    )}
                  </Text>
                </Item>
                <Item>
                  <Text>
                    {network.inflation ? (
                      <span>{network.inflation}%</span>
                    ) : (
                      "n/a"
                    )}
                  </Text>
                </Item>
                <Item>
                  <Text>
                    {network.expectedReward && network.inflation ? (
                      <span>{network.expectedReward - network.inflation}%</span>
                    ) : (
                      "n/a"
                    )}
                  </Text>
                </Item>
                <Item>
                  {network.supportsLedger && (
                    <Button
                      onClick={() => this.handleConnectNetwork(network.name)}
                    >
                      Connect
                    </Button>
                  )}
                </Item>
              </Row>
            );
          })}
        </Card>
      </PageContainer>
    );
  }

  handleConnectNetwork = (name: NETWORK_NAME) => {
    this.props.setSigninNetworkName(name);
    this.props.openLedgerDialog({
      signinType: "LEDGER",
      ledgerAccessType: "SIGNIN",
    });
  };
}

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

const Row = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const HeaderRow = styled(Row)`
  padding-bottom: 12px;
  margin-bottom: 24px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.GRAY1 : Colors.GRAY5};
`;

const Title = styled.p`
  font-size: 14px;
  font-weight: bold;
`;

const Text = styled.p`
  margin: 0;
  font-weight: 200px;
`;

const ColumnHeader = styled.div``;

const ItemHeader = styled.div`
  width: 200px;
`;

const Item = styled.div`
  width: 200px;
`;

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  settings: Modules.selectors.settings(state),
  app: Modules.selectors.app.appSelector(state),
  ledger: Modules.selectors.ledger.ledgerSelector(state),
  address: Modules.selectors.ledger.addressSelector(state),
});

const dispatchProps = {
  openLedgerDialog: Modules.actions.ledger.openLedgerDialog,
  setSigninNetworkName: Modules.actions.ledger.setSigninNetworkName,
};

const withProps = connect(mapStateToProps, dispatchProps);

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

interface ComponentProps {}

interface IProps extends ComponentProps, ConnectProps, RouteComponentProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withProps,
  withRouter,
  withGraphQLVariables,
)(NetworkSummaryPage);
