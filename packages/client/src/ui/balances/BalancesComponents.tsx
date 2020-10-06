import {
  coinDenomToName,
  ICeloAccountBalances,
  ICosmosAccountBalances,
  IOasisAccountBalances,
  NetworkDefinition,
} from "@anthem/utils";
import { Collapse, Colors, H5, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { COLORS } from "constants/colors";
import { CURRENCY_SETTING } from "constants/fiat";
import {
  CeloAccountBalancesProps,
  CosmosAccountBalancesProps,
  FiatPriceDataProps,
  OasisAccountBalancesProps,
  withCeloAccountBalances,
  withCosmosAccountBalances,
  withFiatPriceData,
  withGraphQLVariables,
  withOasisAccountBalances,
} from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import PieChart from "react-minimal-pie-chart";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getAccountBalances, getPercentage } from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import { denomToUnit, formatCurrencyAmount } from "tools/currency-utils";
import { tFnString } from "tools/i18n-utils";
import { addValuesInList, isGreaterThan } from "tools/math-utils";
import { IThemeProps } from "ui/containers/ThemeContainer";
import { GraphQLGuardComponentMultipleQueries } from "ui/GraphQLGuardComponents";
import {
  Button,
  DashboardError,
  DashboardLoader,
  Row,
  View,
} from "ui/SharedComponents";

/** ===========================================================================
 * Cosmos SDK Networks Account Balances
 * ============================================================================
 */

class CosmosBalancesContainer extends React.Component<
  CosmosBalanceContainerProps,
  {}
> {
  render(): JSX.Element {
    const {
      i18n,
      settings,
      ledger,
      fiatPriceData,
      cosmosAccountBalances,
    } = this.props;
    const { tString } = i18n;
    const { network } = ledger;
    const { isDesktop, currencySetting } = settings;

    return (
      <GraphQLGuardComponentMultipleQueries
        allowErrorResponses
        tString={tString}
        loadingComponent={<DashboardLoader />}
        errorComponent={<DashboardError tString={tString} />}
        results={[
          [cosmosAccountBalances, "cosmosAccountBalances"],
          [fiatPriceData, "fiatPriceData"],
        ]}
      >
        {() => {
          // Handle if balances request failed
          if (cosmosAccountBalances.error) {
            return <DashboardError tString={tString} />;
          }

          const data = cosmosAccountBalances.cosmosAccountBalances;
          if (data) {
            if (network.name === "TERRA") {
              return (
                <CosmosMultiDenominationBalances
                  balances={data}
                  network={network}
                  tString={tString}
                  isDesktop={isDesktop}
                  currencySetting={currencySetting}
                  price={fiatPriceData.fiatPriceData.price}
                  handleSendReceive={this.handleSendReceiveAction}
                />
              );
            }

            return (
              <CosmosBalancesComponent
                balances={data}
                network={network}
                tString={tString}
                isDesktop={isDesktop}
                currencySetting={currencySetting}
                price={fiatPriceData.fiatPriceData.price}
                handleSendReceive={this.handleSendReceiveAction}
              />
            );
          }

          return (
            <DashboardError tString={tString} text="No balance data exists" />
          );
        }}
      </GraphQLGuardComponentMultipleQueries>
    );
  }

  handleSendReceiveAction = () => {
    let actionFunction;
    if (this.props.ledger.connected) {
      actionFunction = this.props.openLedgerDialog;
    } else {
      actionFunction = this.props.openSelectNetworkDialog;
    }

    actionFunction({
      signinType: "LEDGER",
      ledgerAccessType: "PERFORM_ACTION",
      ledgerActionType: "SEND",
    });
  };
}

interface CosmosComponentBalancesProps {
  network: NetworkDefinition;
  balances: ICosmosAccountBalances;
  price: number;
  currencySetting: CURRENCY_SETTING;
  isDesktop: boolean;
  tString: tFnString;
  handleSendReceive: () => void;
}

/** ===========================================================================
 * Cosmos Multi-Balance Component
 * ============================================================================
 */

interface CosmosMultiDenominationBalancesState {
  activeDenom: string;
}

class CosmosMultiDenominationBalances extends React.Component<
  CosmosComponentBalancesProps,
  CosmosMultiDenominationBalancesState
> {
  constructor(props: CosmosComponentBalancesProps) {
    super(props);

    this.state = {
      activeDenom: props.network.denom,
    };
  }

  render(): JSX.Element {
    const {
      network,
      isDesktop,
      balances,
      price,
      tString,
      handleSendReceive,
      currencySetting,
    } = this.props;
    const SHOULD_SHOW_LEDGER_ACTIONS = isDesktop && network.supportsLedger;
    return (
      <>
        <SummaryContainer
          style={{
            padding: 0,
            height: 230,
            marginTop: 12,
            overflowY: "scroll",
          }}
        >
          {network.denomsList.map(denom => {
            const balancesResult = getAccountBalances(
              balances,
              price,
              network,
              denom,
              2,
            );

            const {
              balance,
              rewards,
              delegations,
              unbonding,
              commissions,
              total,
              balanceFiat,
              delegationsFiat,
              rewardsFiat,
              unbondingFiat,
              commissionsFiat,
              totalFiat,
              percentages,
            } = balancesResult;

            const renderBalanceItem = (crypto: string, fiat: string) => {
              if (denom !== network.denom) {
                return crypto;
              }

              if (currencySetting === "crypto") {
                return crypto;
              } else {
                return fiat;
              }
            };

            const denomName = coinDenomToName(denom);

            return (
              <MultiDenomBalance key={denom}>
                <MultiDenomTitle
                  onClick={() => this.setState({ activeDenom: denom })}
                >
                  <Row style={{ justifyContent: "space-between" }}>
                    <View>
                      <b style={{ margin: 0 }}>{denomName}</b>
                    </View>
                    <Row>
                      <b>{total}</b>
                      <Icon
                        icon="caret-down"
                        style={{ marginLeft: 4 }}
                        color={Colors.LIGHT_GRAY1}
                      />
                    </Row>
                  </Row>
                </MultiDenomTitle>
                <Collapse isOpen={denom === this.state.activeDenom}>
                  <MultiDenomBalanceDetail>
                    <BalanceContainer>
                      <View>
                        <BalanceLine>
                          <Icon
                            icon={IconNames.DOT}
                            style={{ marginRight: 2 }}
                            color={COLORS.BALANCE_SHADE_ONE}
                          />
                          <BalanceTitle>{tString("Available")}:</BalanceTitle>
                          <BalanceText data-cy="balance-available">
                            {renderBalanceItem(balance, balanceFiat)}
                          </BalanceText>
                        </BalanceLine>
                        <BalanceLine>
                          <Icon
                            color={COLORS.BALANCE_SHADE_TWO}
                            style={{ marginRight: 2 }}
                            icon={IconNames.DOT}
                          />
                          <BalanceTitle>{tString("Staking")}:</BalanceTitle>
                          <BalanceText data-cy="balance-delegations">
                            {renderBalanceItem(delegations, delegationsFiat)}
                          </BalanceText>
                        </BalanceLine>
                        <BalanceLine>
                          <Icon
                            color={COLORS.BALANCE_SHADE_THREE}
                            style={{ marginRight: 2 }}
                            icon={IconNames.DOT}
                          />
                          <BalanceTitle>{tString("Rewards")}:</BalanceTitle>
                          <BalanceText data-cy="balance-rewards">
                            {renderBalanceItem(rewards, rewardsFiat)}
                          </BalanceText>
                        </BalanceLine>
                        <BalanceLine>
                          <Icon
                            color={COLORS.BALANCE_SHADE_FIVE}
                            style={{ marginRight: 2 }}
                            icon={IconNames.DOT}
                          />
                          <BalanceTitle>{tString("Unbonding")}:</BalanceTitle>
                          <BalanceText data-cy="balance-unbonding">
                            {renderBalanceItem(unbonding, unbondingFiat)}
                          </BalanceText>
                        </BalanceLine>
                        {commissions !== "0" && (
                          <BalanceLine>
                            <Icon
                              color={COLORS.BALANCE_SHADE_FIVE}
                              style={{ marginRight: 2 }}
                              icon={IconNames.DOT}
                            />
                            <BalanceTitle>
                              {tString("Commission")}:
                            </BalanceTitle>
                            <BalanceText data-cy="balance-commissions">
                              {renderBalanceItem(commissions, commissionsFiat)}
                            </BalanceText>
                          </BalanceLine>
                        )}
                      </View>
                      <View style={{ paddingTop: 8 }}>
                        <BalancePieChart
                          small
                          percentages={percentages}
                          total={renderBalanceItem(total, totalFiat)}
                        />
                      </View>
                    </BalanceContainer>
                  </MultiDenomBalanceDetail>
                </Collapse>
              </MultiDenomBalance>
            );
          })}
        </SummaryContainer>
        {SHOULD_SHOW_LEDGER_ACTIONS && (
          <SmallActionContainer>
            <Link to="/cosmos/delegate">
              <Button
                style={{ width: 125, marginRight: 12 }}
                onClick={() => null}
                data-cy="stake-button"
              >
                Stake
              </Button>
            </Link>
            <Button
              style={{ width: 125 }}
              onClick={handleSendReceive}
              data-cy="send-receive-button"
            >
              Send/Receive
            </Button>
          </SmallActionContainer>
        )}
      </>
    );
  }
}

const MultiDenomTitle = styled.div`
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 4px;
  padding-bottom: 4px;

  :hover {
    cursor: pointer;
  }
`;

const MultiDenomBalance = styled.div`
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.DARK_GRAY5 : Colors.LIGHT_GRAY3};
`;

const MultiDenomBalanceDetail = styled.div`
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 20px;
  padding-right: 20px;
  background: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.DARK_GRAY5 : Colors.LIGHT_GRAY3};
`;

const SmallActionContainer = styled.div`
  height: 55px;
  display: flex;
  align-items: center;
  padding-right: 12px;
  flex-direction: row;
  justify-content: flex-end;
  background: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.DARK_GRAY3 : Colors.LIGHT_GRAY3};
`;

/** ===========================================================================
 * Cosmos Single-Balance Component
 * ============================================================================
 */

class CosmosBalancesComponent extends React.Component<
  CosmosComponentBalancesProps
> {
  render(): JSX.Element {
    const {
      price,
      network,
      tString,
      balances,
      isDesktop,
      currencySetting,
      handleSendReceive,
    } = this.props;

    const fiatConversionRate = price;
    const balancesResult = getAccountBalances(
      balances,
      fiatConversionRate,
      network,
      network.denom,
      2,
    );

    const {
      balance,
      rewards,
      delegations,
      unbonding,
      commissions,
      total,
      balanceFiat,
      delegationsFiat,
      rewardsFiat,
      unbondingFiat,
      commissionsFiat,
      totalFiat,
      percentages,
    } = balancesResult;

    const renderBalanceItem = (crypto: string, fiat: string) => {
      if (currencySetting === "crypto") {
        return crypto;
      } else {
        return fiat;
      }
    };

    const SHOULD_SHOW_LEDGER_ACTIONS = isDesktop && network.supportsLedger;

    return (
      <React.Fragment>
        <SummaryContainer>
          <BalanceContainer>
            <View>
              <BalanceLine>
                <Icon
                  icon={IconNames.DOT}
                  style={{ marginRight: 2 }}
                  color={COLORS.BALANCE_SHADE_ONE}
                />
                <BalanceTitle>{tString("Available")}:</BalanceTitle>
                <BalanceText data-cy="balance-available">
                  {renderBalanceItem(balance, balanceFiat)}
                </BalanceText>
              </BalanceLine>
              <BalanceLine>
                <Icon
                  color={COLORS.BALANCE_SHADE_TWO}
                  style={{ marginRight: 2 }}
                  icon={IconNames.DOT}
                />
                <BalanceTitle>{tString("Staking")}:</BalanceTitle>
                <BalanceText data-cy="balance-delegations">
                  {renderBalanceItem(delegations, delegationsFiat)}
                </BalanceText>
              </BalanceLine>
              <BalanceLine>
                <Icon
                  color={COLORS.BALANCE_SHADE_THREE}
                  style={{ marginRight: 2 }}
                  icon={IconNames.DOT}
                />
                <BalanceTitle>{tString("Rewards")}:</BalanceTitle>
                <BalanceText data-cy="balance-rewards">
                  {renderBalanceItem(rewards, rewardsFiat)}
                </BalanceText>
              </BalanceLine>
              <BalanceLine>
                <Icon
                  color={COLORS.BALANCE_SHADE_FIVE}
                  style={{ marginRight: 2 }}
                  icon={IconNames.DOT}
                />
                <BalanceTitle>{tString("Unbonding")}:</BalanceTitle>
                <BalanceText data-cy="balance-unbonding">
                  {renderBalanceItem(unbonding, unbondingFiat)}
                </BalanceText>
              </BalanceLine>
              {commissions !== "0" && (
                <BalanceLine>
                  <Icon
                    color={COLORS.BALANCE_SHADE_FIVE}
                    style={{ marginRight: 2 }}
                    icon={IconNames.DOT}
                  />
                  <BalanceTitle>{tString("Commission")}:</BalanceTitle>
                  <BalanceText data-cy="balance-commissions">
                    {renderBalanceItem(commissions, commissionsFiat)}
                  </BalanceText>
                </BalanceLine>
              )}
            </View>
            <BalancePieChart
              percentages={percentages}
              total={renderBalanceItem(total, totalFiat)}
            />
          </BalanceContainer>
        </SummaryContainer>
        {SHOULD_SHOW_LEDGER_ACTIONS && (
          <ActionContainer>
            <H5>{tString("What do you want to do?")}</H5>
            <DelegationControlsContainer>
              <Link to="/cosmos/delegate">
                <Button
                  style={{ width: 125, marginRight: 12 }}
                  onClick={() => null}
                  data-cy="stake-button"
                >
                  Stake
                </Button>
              </Link>
              <Button
                style={{ width: 125 }}
                onClick={handleSendReceive}
                data-cy="send-receive-button"
              >
                Send/Receive
              </Button>
            </DelegationControlsContainer>
          </ActionContainer>
        )}
      </React.Fragment>
    );
  }
}

/** ===========================================================================
 * Celo Account Balances
 * ============================================================================
 */

class CeloBalancesContainer extends React.Component<
  CeloBalanceContainerProps,
  {}
> {
  render(): JSX.Element {
    const {
      i18n,
      fiatPriceData,
      ledger,
      celoAccountBalances,
      settings,
    } = this.props;
    const { tString } = i18n;
    const { network } = ledger;
    const { currencySetting } = settings;

    return (
      <GraphQLGuardComponentMultipleQueries
        allowErrorResponses
        tString={tString}
        loadingComponent={<DashboardLoader />}
        errorComponent={<DashboardError tString={tString} />}
        results={[
          [celoAccountBalances, "celoAccountBalances"],
          [fiatPriceData, "fiatPriceData"],
        ]}
      >
        {() => {
          // Handle if balances request failed
          if (celoAccountBalances.error) {
            return <DashboardError tString={tString} />;
          }

          const data = celoAccountBalances.celoAccountBalances;

          if (data) {
            return (
              <CeloBalancesComponent
                balances={data}
                network={network}
                currencySetting={currencySetting}
                price={fiatPriceData.fiatPriceData.price}
                handleSendReceiveAction={this.handleSendReceiveAction}
              />
            );
          }

          return (
            <DashboardError tString={tString} text="No balance data exists" />
          );
        }}
      </GraphQLGuardComponentMultipleQueries>
    );
  }

  handleSendReceiveAction = () => {
    // return Toast.warn("Celo Ledger Transactions are coming soon.");

    let actionFunction;
    if (this.props.ledger.connected) {
      actionFunction = this.props.openLedgerDialog;
    } else {
      actionFunction = this.props.openSelectNetworkDialog;
    }

    actionFunction({
      signinType: "LEDGER",
      ledgerAccessType: "PERFORM_ACTION",
      ledgerActionType: "SEND",
    });
  };
}

interface CeloComponentBalancesProps {
  price: number;
  network: NetworkDefinition;
  balances: ICeloAccountBalances;
  currencySetting: CURRENCY_SETTING;
  handleSendReceiveAction: () => void;
}

class CeloBalancesComponent extends React.Component<
  CeloComponentBalancesProps
> {
  render(): JSX.Element {
    const {
      price,
      network,
      balances,
      currencySetting,
      handleSendReceiveAction,
    } = this.props;
    const fiatPrice = price;
    const displayFiat = currencySetting === "fiat";

    const {
      availableGoldBalance,
      totalLockedGoldBalance,
      // nonVotingLockedGoldBalance,
      // votingLockedGoldBalance,
      pendingWithdrawalBalance,
      celoUSDValue,
    } = balances;

    const denomSize = network.denominationSize;

    // Helper to render Celo currency values
    const renderCurrency = (value: string, convertToFiat = displayFiat) => {
      let result = denomToUnit(value, denomSize, Number);
      if (convertToFiat) {
        result = fiatPrice * result;
      }
      return formatCurrencyAmount(result);
    };

    const total = addValuesInList([
      availableGoldBalance,
      totalLockedGoldBalance,
      pendingWithdrawalBalance,
    ]);

    const percentages: number[] = [
      getPercentage(availableGoldBalance, total),
      getPercentage(totalLockedGoldBalance, total),
      getPercentage(pendingWithdrawalBalance, total),
    ];

    return (
      <>
        <SummaryContainer>
          <BalanceContainer>
            <View>
              <BalanceLine>
                <Icon
                  icon={IconNames.DOT}
                  style={{ marginRight: 2 }}
                  color={COLORS.BALANCE_SHADE_ONE}
                />
                <BalanceTitle>Available:</BalanceTitle>
                <BalanceText data-cy="celo-gold-balance-available">
                  {renderCurrency(availableGoldBalance)}
                </BalanceText>
              </BalanceLine>
              <BalanceLine>
                <Icon
                  icon={IconNames.DOT}
                  style={{ marginRight: 2 }}
                  color={COLORS.BALANCE_SHADE_TWO}
                />
                <BalanceTitle>Locked:</BalanceTitle>
                <BalanceText data-cy="celo-gold-balance-locked">
                  {renderCurrency(totalLockedGoldBalance)}
                </BalanceText>
              </BalanceLine>
              <BalanceLine>
                <Icon
                  icon={IconNames.DOT}
                  style={{ marginRight: 2 }}
                  color={COLORS.BALANCE_SHADE_THREE}
                />
                <BalanceTitle>Pending:</BalanceTitle>
                <BalanceText data-cy="celo-gold-balance-pending">
                  {renderCurrency(pendingWithdrawalBalance)}
                </BalanceText>
              </BalanceLine>
              <BalanceLine>
                <Icon
                  icon={IconNames.DOT}
                  style={{ marginRight: 2 }}
                  color={COLORS.BALANCE_SHADE_FOUR}
                />
                <BalanceTitle>cUSD:</BalanceTitle>
                <BalanceText data-cy="celo-usd-balance-available">
                  {renderCurrency(celoUSDValue, false)}
                </BalanceText>
              </BalanceLine>
            </View>
            <BalancePieChart
              percentages={percentages}
              total={renderCurrency(total)}
            />
          </BalanceContainer>
        </SummaryContainer>
        <ActionContainer>
          <H5>Celo Ledger Transactions</H5>
          <DelegationControlsContainer>
            <Link to="/celo/delegate">
              <Button
                onClick={() => null}
                data-cy="stake-button"
                style={{ width: 125, marginRight: 12 }}
              >
                Vote
              </Button>
            </Link>
            <Button
              style={{ width: 125 }}
              data-cy="send-receive-button"
              onClick={handleSendReceiveAction}
            >
              Send/Receive
            </Button>
          </DelegationControlsContainer>
        </ActionContainer>
      </>
    );
  }
}

/** ===========================================================================
 * Oasis Account Balances
 * ============================================================================
 */

class OasisBalancesContainer extends React.Component<
  OasisBalanceContainerProps,
  {}
> {
  render(): JSX.Element {
    const { i18n, fiatPriceData, ledger, oasisAccountBalances } = this.props;
    const { tString } = i18n;
    const { network } = ledger;

    return (
      <GraphQLGuardComponentMultipleQueries
        allowErrorResponses
        tString={tString}
        loadingComponent={<DashboardLoader />}
        errorComponent={<DashboardError tString={tString} />}
        results={[
          [oasisAccountBalances, "oasisAccountBalances"],
          [fiatPriceData, "fiatPriceData"],
        ]}
      >
        {() => {
          // Handle if balances request failed
          if (oasisAccountBalances.error) {
            return <DashboardError tString={tString} />;
          }

          const data = oasisAccountBalances.oasisAccountBalances;

          if (data) {
            return (
              <OasisBalancesComponent
                balances={data}
                network={network}
                handleStake={this.handleStake}
                handleTransfer={this.handleTransfer}
                handleUndelegate={this.handleUndelegate}
              />
            );
          }

          return (
            <DashboardError tString={tString} text="No balance data exists" />
          );
        }}
      </GraphQLGuardComponentMultipleQueries>
    );
  }

  handleTransfer = () => {
    let actionFunction;
    if (this.props.ledger.connected) {
      actionFunction = this.props.openLedgerDialog;
    } else {
      actionFunction = this.props.openSelectNetworkDialog;
    }

    actionFunction({
      signinType: "LEDGER",
      ledgerActionType: "SEND",
      ledgerAccessType: "PERFORM_ACTION",
    });
  };

  handleStake = () => {
    let actionFunction;
    if (this.props.ledger.connected) {
      actionFunction = this.props.openLedgerDialog;
    } else {
      actionFunction = this.props.openSelectNetworkDialog;
    }

    actionFunction({
      signinType: "LEDGER",
      ledgerActionType: "DELEGATE",
      ledgerAccessType: "PERFORM_ACTION",
    });
  };

  handleUndelegate = () => {
    let actionFunction;
    if (this.props.ledger.connected) {
      actionFunction = this.props.openLedgerDialog;
    } else {
      actionFunction = this.props.openSelectNetworkDialog;
    }

    actionFunction({
      signinType: "LEDGER",
      ledgerActionType: "UNDELEGATE",
      ledgerAccessType: "PERFORM_ACTION",
    });
  };
}

interface OasisBalancesComponentProps {
  network: NetworkDefinition;
  balances: IOasisAccountBalances;
  handleStake: () => void;
  handleTransfer: () => void;
  handleUndelegate: () => void;
}

class OasisBalancesComponent extends React.Component<
  OasisBalancesComponentProps
> {
  render(): JSX.Element {
    const {
      balances,
      network,
      handleStake,
      handleTransfer,
      handleUndelegate,
    } = this.props;

    const { available, staked, unbonding, rewards } = balances;

    const stakedBalance = staked.balance;
    const unbondingBalance = unbonding.balance;
    const denomSize = network.denominationSize;

    // Helper to render Celo currency values
    const renderCurrency = (value: string) => {
      return formatCurrencyAmount(denomToUnit(value, denomSize));
    };

    const total = addValuesInList([
      available,
      stakedBalance,
      unbondingBalance,
      rewards,
    ]);

    const percentages: number[] = [
      getPercentage(available, total),
      getPercentage(rewards, total),
      getPercentage(stakedBalance, total),
      getPercentage(unbondingBalance, total),
    ];

    /**
     * NOTE: For Oasis only the balances exist currently so these are
     * centered in the panel using extra padding and margin.
     */

    const ENABLE_LEDGER = true;

    return (
      <>
        <SummaryContainer>
          <BalanceContainer style={{ paddingLeft: 12, paddingRight: 12 }}>
            <View>
              <BalanceLine style={{ marginTop: 6 }}>
                <Icon
                  icon={IconNames.DOT}
                  style={{ marginRight: 2 }}
                  color={COLORS.BALANCE_SHADE_ONE}
                />
                <BalanceTitle>Available:</BalanceTitle>
                <BalanceText data-cy="oasis-balance-available">
                  {renderCurrency(available)}
                </BalanceText>
              </BalanceLine>
              <BalanceLine style={{ marginTop: 6 }}>
                <Icon
                  icon={IconNames.DOT}
                  style={{ marginRight: 2 }}
                  color={COLORS.BALANCE_SHADE_TWO}
                />
                <BalanceTitle>Staked:</BalanceTitle>
                <BalanceText data-cy="oasis-balance-staked">
                  {renderCurrency(stakedBalance)}
                </BalanceText>
              </BalanceLine>
              <BalanceLine style={{ marginTop: 6 }}>
                <Icon
                  icon={IconNames.DOT}
                  style={{ marginRight: 2 }}
                  color={COLORS.BALANCE_SHADE_THREE}
                />
                <BalanceTitle>Debonding:</BalanceTitle>
                <BalanceText data-cy="oasis-balance-unbonding">
                  {renderCurrency(unbondingBalance)}
                </BalanceText>
              </BalanceLine>
              <BalanceLine style={{ marginTop: 6 }}>
                <Icon
                  icon={IconNames.DOT}
                  style={{ marginRight: 2 }}
                  color={COLORS.BALANCE_SHADE_FIVE}
                />
                <BalanceTitle>Rewards:</BalanceTitle>
                <BalanceText data-cy="oasis-balance-rewards">
                  {renderCurrency(rewards)}
                </BalanceText>
              </BalanceLine>
              {/* <BalanceLine style={{ marginTop: 6 }}>
                <Icon
                  icon={IconNames.DOT}
                  style={{ marginRight: 2 }}
                  color={COLORS.BALANCE_SHADE_FIVE}
                />
                <BalanceTitle>Commissions:</BalanceTitle>
                <BalanceText data-cy="oasis-balance-commissions">
                  n/a
                </BalanceText>
              </BalanceLine> */}
            </View>
            <BalancePieChart
              percentages={percentages}
              total={renderCurrency(total)}
            />
          </BalanceContainer>
        </SummaryContainer>
        <ActionContainer>
          <H5>Ledger Support: coming soon!</H5>
          {ENABLE_LEDGER && (
            <DelegationControlsContainer>
              <Button onClick={handleTransfer} data-cy="oasis-transfer-button">
                Transfer
              </Button>
              <Button
                style={{ marginLeft: 12 }}
                onClick={handleStake}
                data-cy="oasis-delegate-button"
              >
                Stake
              </Button>
              {isGreaterThan(stakedBalance, 0) && (
                <Button
                  style={{ marginLeft: 12 }}
                  onClick={handleUndelegate}
                  data-cy="oasis-undelegate-button"
                >
                  Unstake
                </Button>
              )}
            </DelegationControlsContainer>
          )}
        </ActionContainer>
      </>
    );
  }
}

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

const SummaryContainer = styled.div`
  height: 135px;
`;

const BalanceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: ${(props: { theme: IThemeProps }) =>
    props.theme.isDesktop ? "row" : "column"};

  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

const BalanceLine = styled.div`
  margin-top: 4px;
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    align-items: start;
    justify-content: left;
  }
`;

const BalanceTitle = styled.p`
  margin: 0;
  padding: 0;
  font-size: 14px;
  width: 102px;
  font-weight: bold;
`;

const BalanceText = styled.p`
  margin: 0;
  padding: 0;
  font-size: 14px;
`;

const BalanceTotalWrapper = styled.div`
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const BalanceTotalContainer = styled.div`
  margin: 0;
  padding: 0;
  padding-right: 8px;
  position: relative;
  background: ${(props: { theme: IThemeProps }) =>
    props.theme.isDesktop ? 0 : 24};
`;

const BalanceCircle = styled.div<{ small: boolean }>`
  width: ${props => (props.small ? 105 : 125)}px;
  height: ${props => (props.small ? 105 : 125)}px;
  z-index: 15;
  position: absolute;
  top: -2px;
  left: -2px;
  transform: rotate(45deg);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BalanceTotalBox = styled.div<{ small: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-45deg);
  width: ${props => (props.small ? 85 : 105)}px;
  height: ${props => (props.small ? 85 : 105)}px;
  border-width: 5px;
  border-radius: 50%;
  border-style: solid;
  border-color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.DARK_GRAY3 : Colors.LIGHT_GRAY1};
  background: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.DARK_GRAY5 : Colors.LIGHT_GRAY3};
`;

const BalanceTotalText = styled.p`
  margin: 0;
  padding: 0;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
`;

const ActionContainer = styled.div`
  margin-top: 4px;
  height: 157px;
  padding: 12px;
  padding-top: 20px;
  padding-bottom: 0;
  background: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.DARK_GRAY3 : Colors.LIGHT_GRAY3};
`;

const DelegationControlsContainer = styled.div`
  padding-top: 10px;
  display: flex;
  align-items: center;
`;

const pieColors: ReadonlyArray<COLORS> = [
  COLORS.BALANCE_SHADE_ONE,
  COLORS.BALANCE_SHADE_TWO,
  COLORS.BALANCE_SHADE_THREE,
  COLORS.BALANCE_SHADE_FOUR,
  COLORS.BALANCE_SHADE_FIVE,
];

const Pie = ({
  small,
  percentages,
}: {
  small: boolean;
  percentages: ReadonlyArray<number>;
}) => {
  const data = percentages.map((percentage: number, index: number) => ({
    value: percentage,
    color: pieColors[index],
  }));

  return (
    <PieChart
      style={{
        marginBottom: 10,
        width: small ? 100 : 121,
      }}
      data={data}
    />
  );
};

const BalancePieChart = ({
  small,
  percentages,
  total,
}: {
  small?: boolean;
  percentages: number[];
  total: string;
}) => {
  return (
    <BalanceTotalWrapper>
      <BalanceTotalContainer>
        <Pie small={!!small} percentages={percentages} />
        <BalanceCircle small={!!small}>
          <BalanceTotalBox small={!!small}>
            <BalanceTotalText data-cy="balance-total">{total}</BalanceTotalText>
          </BalanceTotalBox>
        </BalanceCircle>
      </BalanceTotalContainer>
    </BalanceTotalWrapper>
  );
};

/** ===========================================================================
 * Props
 * ============================================================================
 */

interface ComponentProps {
  // address: string;
}

interface IProps extends ComponentProps, FiatPriceDataProps, ConnectProps {}

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  settings: Modules.selectors.settings(state),
  ledger: Modules.selectors.ledger.ledgerSelector(state),
});

const dispatchProps = {
  openLedgerDialog: Modules.actions.ledger.openLedgerDialog,
  openSelectNetworkDialog: Modules.actions.ledger.openSelectNetworkDialog,
};

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

const withProps = connect(mapStateToProps, dispatchProps);

/** ===========================================================================
 * Export
 * ============================================================================
 */

interface CosmosBalanceContainerProps
  extends IProps,
    CosmosAccountBalancesProps {}

export const CosmosBalances = composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withFiatPriceData,
  withCosmosAccountBalances,
)(CosmosBalancesContainer);

interface CeloBalanceContainerProps extends IProps, CeloAccountBalancesProps {}

export const CeloBalances = composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withFiatPriceData,
  withCeloAccountBalances,
)(CeloBalancesContainer);

interface OasisBalanceContainerProps
  extends IProps,
    OasisAccountBalancesProps {}

export const OasisBalances = composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withFiatPriceData,
  withOasisAccountBalances,
)(OasisBalancesContainer);
