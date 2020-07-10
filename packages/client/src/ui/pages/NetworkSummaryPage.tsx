import { INetworkSummary, NETWORK_NAME } from "@anthem/utils";
import { Card, Colors } from "@blueprintjs/core";
import { NetworkLogoIcon } from "assets/images";
import {
  NetworkSummariesDataProps,
  withGraphQLVariables,
  withNetworkSummariesData,
} from "graphql/queries";
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
import { GraphQLGuardComponent } from "ui/GraphQLGuardComponents";
import PageAddressBar from "ui/PageAddressBar";
import {
  Button,
  DashboardError,
  DashboardLoader,
  PageContainer,
  PercentChangeText,
} from "ui/SharedComponents";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class NetworkSummaryPage extends React.Component<IProps> {
  render(): JSX.Element {
    const { networkSummaries, i18n } = this.props;
    const { tString } = i18n;

    return (
      <PageContainer>
        <PageAddressBar pageTitle="Network Summaries" />
        <GraphQLGuardComponent
          tString={tString}
          dataKey="networkSummaries"
          result={networkSummaries}
          errorComponent={<DashboardError tString={tString} />}
          loadingComponent={<DashboardLoader />}
        >
          {(summaries: INetworkSummary[]) => {
            return (
              <Scrollable>
                <Card style={{ minWidth: 1050 }}>
                  <HeaderRow>
                    <ItemHeader style={{ minWidth: 45 }}>
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
                  {summaries.map(summary => {
                    const name = summary.name as NETWORK_NAME;
                    return (
                      <Row key={name}>
                        <Item style={{ minWidth: 45 }}>
                          <NetworkLogoIcon network={name} />
                        </Item>
                        <Item>
                          <Text>
                            {name ? <b>{capitalizeString(name)}</b> : "n/a"}
                          </Text>
                        </Item>
                        <Item>
                          <Text>
                            {summary.tokenPrice ? (
                              <span>
                                ${formatCurrencyAmount(summary.tokenPrice, 2)}
                              </span>
                            ) : (
                              "n/a"
                            )}
                          </Text>
                        </Item>
                        <Item>
                          <Text>
                            {summary.lastDayChange ? (
                              <PercentChangeText
                                value={summary.lastDayChange}
                              />
                            ) : (
                              "n/a"
                            )}
                          </Text>
                        </Item>
                        <Item>
                          <Text>
                            {summary.marketCapitalization ? (
                              <span>
                                $
                                {formatCurrencyAmount(
                                  summary.marketCapitalization,
                                )}
                              </span>
                            ) : (
                              "n/a"
                            )}
                          </Text>
                        </Item>
                        <Item>
                          <Text>
                            {summary.expectedReward ? (
                              <span>{summary.expectedReward.toFixed(2)}%</span>
                            ) : (
                              "n/a"
                            )}
                          </Text>
                        </Item>
                        <Item>
                          <Text>
                            {summary.inflation ? (
                              <span>{summary.inflation.toFixed(2)}%</span>
                            ) : (
                              "n/a"
                            )}
                          </Text>
                        </Item>
                        <Item>
                          <Text>
                            {summary.expectedReward && summary.inflation ? (
                              <span>
                                {(
                                  summary.expectedReward - summary.inflation
                                ).toFixed(2)}
                                %
                              </span>
                            ) : (
                              "n/a"
                            )}
                          </Text>
                        </Item>
                        <Item>
                          {summary.supportsLedger && (
                            <Button
                              onClick={() => this.handleConnectNetwork(name)}
                            >
                              Connect
                            </Button>
                          )}
                        </Item>
                      </Row>
                    );
                  })}
                </Card>
              </Scrollable>
            );
          }}
        </GraphQLGuardComponent>
      </PageContainer>
    );
  }

  handleConnectNetwork = (name: NETWORK_NAME) => {
    this.props.setSigninNetworkName(name);
    this.props.openLedgerDialog({
      signinType: "INITIAL_SETUP",
      ledgerAccessType: "SIGNIN",
    });
  };
}

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

const Scrollable = styled.div`
  overflow-x: scroll;
`;

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
  min-width: 125px;
`;

const Item = styled.div`
  min-width: 125px;
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

interface IProps
  extends ComponentProps,
    ConnectProps,
    NetworkSummariesDataProps,
    RouteComponentProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withProps,
  withRouter,
  withGraphQLVariables,
  withNetworkSummariesData,
)(NetworkSummaryPage);
