import { Colors, H5, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { GraphQLGuardComponentMultipleQueries } from "components/GraphQLGuardComponents";
import { Button, DashboardLoader, View } from "components/SharedComponents";
import { COLORS } from "constants/colors";
import { IThemeProps } from "containers/ThemeContainer";
import {
  AccountBalancesProps,
  AtomPriceDataProps,
  withAccountBalances,
  withAtomPriceData,
  withGraphQLVariables,
} from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import { DashboardError } from "pages/DashboardPage";
import React from "react";
import PieChart from "react-minimal-pie-chart";
import { connect } from "react-redux";
import styled from "styled-components";
import { composeWithProps } from "tools/context-utils";
import { getAccountBalances } from "tools/generic-utils";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class Balance extends React.Component<IProps, {}> {
  render(): JSX.Element {
    const {
      i18n,
      prices,
      address,
      settings,
      ledger,
      accountBalances,
    } = this.props;
    const { t, tString } = i18n;
    const { isDesktop, currencySetting } = settings;
    console.log(accountBalances);
    return (
      <GraphQLGuardComponentMultipleQueries
        tString={tString}
        loadingComponent={<DashboardLoader />}
        errorComponent={<DashboardError tString={tString} />}
        results={[
          [prices, "prices"],
          [accountBalances, "accountBalances"],
        ]}
      >
        {() => {
          const fiatConversionRate = prices.prices;
          const data = accountBalances.accountBalances;
          const { denom } = this.props.ledger.network;
          const balances = getAccountBalances(
            data,
            fiatConversionRate,
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
          } = balances;

          const renderBalanceItem = (crypto: string, fiat: string) => {
            if (currencySetting === "crypto") {
              return crypto;
            } else {
              return fiat;
            }
          };

          const SHOULD_SHOW_LEDGER_ACTIONS =
            isDesktop && ledger.network.name !== "OASIS";

          const BalanceLines = (
            <View>
              <BalanceLine>
                <Icon
                  icon={IconNames.DOT}
                  style={{ marginRight: 2 }}
                  color={COLORS.BALANCE_SHADE_ONE}
                />
                <BalanceTitle>{t("Available")}:</BalanceTitle>
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
                <BalanceTitle>{t("Staking")}:</BalanceTitle>
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
                <BalanceTitle>{t("Rewards")}:</BalanceTitle>
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
                <BalanceTitle>{t("Unbonding")}:</BalanceTitle>
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
                  <BalanceTitle>{t("Commission")}:</BalanceTitle>
                  <BalanceText data-cy="balance-commissions">
                    {renderBalanceItem(commissions, commissionsFiat)}
                  </BalanceText>
                </BalanceLine>
              )}
            </View>
          );

          return (
            <React.Fragment>
              <SummaryContainer>
                {Boolean(address) && (
                  <BalanceContainer>
                    {BalanceLines}
                    <BalanceTotalWrapper>
                      <BalanceTotalContainer
                        style={{ marginTop: isDesktop ? 0 : 24 }}
                      >
                        <Pie percentages={percentages} />
                        <BalanceCircle>
                          <BalanceTotalBox>
                            <BalanceTotalText data-cy="balance-total">
                              {renderBalanceItem(total, totalFiat)}
                            </BalanceTotalText>
                          </BalanceTotalBox>
                        </BalanceCircle>
                      </BalanceTotalContainer>
                    </BalanceTotalWrapper>
                  </BalanceContainer>
                )}
              </SummaryContainer>
              {SHOULD_SHOW_LEDGER_ACTIONS && (
                <ActionContainer>
                  <H5>{t("What do you want to do?")}</H5>
                  <DelegationControlsContainer>
                    <Button
                      data-cy="balances-delegation-button"
                      onClick={() => {
                        let fn;
                        if (this.props.ledger.connected) {
                          fn = this.props.openLedgerDialog;
                        } else {
                          fn = this.props.openSelectNetworkDialog;
                        }

                        fn({
                          signinType: "LEDGER",
                          ledgerAccessType: "PERFORM_ACTION",
                          ledgerActionType: "DELEGATE",
                        });
                      }}
                      style={{
                        marginRight: 16,
                      }}
                    >
                      {tString("Delegate")}
                    </Button>
                    <Button
                      data-cy="balances-rewards-claim-button"
                      onClick={() => {
                        let fn;
                        if (this.props.ledger.connected) {
                          fn = this.props.openLedgerDialog;
                        } else {
                          fn = this.props.openSelectNetworkDialog;
                        }

                        fn({
                          signinType: "LEDGER",
                          ledgerAccessType: "PERFORM_ACTION",
                          ledgerActionType: "CLAIM",
                        });
                      }}
                    >
                      {tString("Claim Rewards")}
                    </Button>
                  </DelegationControlsContainer>
                </ActionContainer>
              )}
            </React.Fragment>
          );
        }}
      </GraphQLGuardComponentMultipleQueries>
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
  position: relative;
`;

const BalanceCircle = styled.div`
  width: 150px;
  height: 150px;
  z-index: 15;
  position: absolute;
  top: -10px;
  left: -10px;
  transform: rotate(45deg);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BalanceTotalBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-45deg);
  width: 105px;
  height: 105px;
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
  height: 125px;
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

const Pie = ({ percentages }: { percentages: ReadonlyArray<number> }) => {
  const data = percentages.map((percentage: number, index: number) => ({
    value: percentage,
    color: pieColors[index],
  }));

  return (
    <PieChart
      style={{
        width: 130,
        marginBottom: 10,
      }}
      data={data}
    />
  );
};

/** ===========================================================================
 * Props
 * ============================================================================
 */

interface ComponentProps {
  address: string;
}

interface IProps
  extends ComponentProps,
    AtomPriceDataProps,
    AccountBalancesProps,
    ConnectProps {}

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

export default composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withAtomPriceData,
  withAccountBalances,
)(Balance);
