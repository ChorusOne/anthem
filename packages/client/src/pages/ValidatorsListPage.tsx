import { ICosmosAccountBalancesType, IQuery, IValidator } from "@anthem/utils";
import { Card, Collapse, Colors, H5, H6, Icon } from "@blueprintjs/core";
import { CopyIcon, NetworkLogoIcon } from "assets/images";
import AddressIconComponent from "components/AddressIconComponent";
import { GraphQLGuardComponentMultipleQueries } from "components/GraphQLGuardComponents";
import PageAddressBar from "components/PageAddressBar";
import {
  Button,
  DashboardLoader,
  Link,
  PageContainer,
  PageScrollableContent,
  View,
} from "components/SharedComponents";
import Toast from "components/Toast";
import { COLORS } from "constants/colors";
import { IThemeProps } from "containers/ThemeContainer";
import {
  AccountBalancesProps,
  FiatPriceDataProps,
  RewardsByValidatorProps,
  StakingPoolProps,
  ValidatorsProps,
  withAccountBalances,
  withFiatPriceData,
  withGraphQLVariables,
  withRewardsByValidatorQuery,
  withStakingPool,
  withValidators,
} from "graphql/queries";
import { VALIDATORS_LIST_SORT_FILTER } from "modules/app/store";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  copyTextToClipboard,
  deriveCurrentDelegationsInformation,
  formatAddressString,
  formatCommissionRate,
  getAccountBalances,
  getPercentageFromTotal,
  getValidatorOperatorAddressMap,
  sortValidatorsList,
} from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import {
  denomToUnit,
  formatCurrencyAmount,
  unitToDenom,
} from "tools/currency-utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IState {
  showValidatorDetailsAddress: string;
}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class ValidatorsListPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      showValidatorDetailsAddress: "",
    };
  }

  render(): JSX.Element {
    const {
      i18n,
      prices,
      network,
      validators,
      stakingPool,
      accountBalances,
      sortListAscending,
      validatorSortField,
      rewardsByValidator,
    } = this.props;

    // Render a fallback message if network does not support validators list UI
    if (!network.supportsValidatorsList) {
      return (
        <div style={{ marginTop: 50, marginLeft: 5 }}>
          <p style={{ fontSize: 16 }}>
            Validators list is not supported yet for {network.name} network.
          </p>
        </div>
      );
    }

    return (
      <PageContainer>
        <PageAddressBar pageTitle="Staking" />
        <GraphQLGuardComponentMultipleQueries
          loadingComponent={<DashboardLoader style={{ marginTop: 150 }} />}
          tString={i18n.tString}
          results={[
            [validators, "validators"],
            [stakingPool, "stakingPool"],
            [accountBalances, "accountBalances"],
            [prices, "prices"],
            [rewardsByValidator, "rewardsByValidator"],
          ]}
        >
          {([
            validatorList,
            stakingPoolResponse,
            accountBalancesResponse,
            pricesResponse,
            rewardsByValidatorResponse,
          ]: [
            IQuery["validators"],
            IQuery["stakingPool"],
            ICosmosAccountBalancesType,
            IQuery["prices"],
            IQuery["rewardsByValidator"],
          ]) => {
            const balances = getAccountBalances(
              accountBalancesResponse.cosmos,
              pricesResponse,
              network,
            );

            const stake = stakingPoolResponse.bonded_tokens || "";
            const validatorOperatorAddressMap = getValidatorOperatorAddressMap(
              validatorList,
            );

            // Sort the validators list based on the current sort settings
            const sortedValidatorsList = sortValidatorsList(
              validatorList,
              validatorSortField,
              sortListAscending,
              stake,
            );

            const { total, delegations } = deriveCurrentDelegationsInformation(
              rewardsByValidatorResponse,
              validatorList,
              network,
            );

            return (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <View>
                  <StakingRow style={{ paddingLeft: 14 }}>
                    <RowItem width={45}>
                      <NetworkLogoIcon network={network.name} />
                    </RowItem>
                    <RowItemHeader
                      width={150}
                      onClick={this.setSortFilter(
                        VALIDATORS_LIST_SORT_FILTER.NAME,
                      )}
                    >
                      <H5 style={{ margin: 0 }}>Validator</H5>
                      <SortFilterIcon
                        ascending={sortListAscending}
                        active={
                          validatorSortField ===
                            VALIDATORS_LIST_SORT_FILTER.NAME ||
                          validatorSortField ===
                            VALIDATORS_LIST_SORT_FILTER.CUSTOM_DEFAULT
                        }
                      />
                    </RowItemHeader>
                    <RowItemHeader
                      width={150}
                      onClick={this.setSortFilter(
                        VALIDATORS_LIST_SORT_FILTER.VOTING_POWER,
                      )}
                    >
                      <H5 style={{ margin: 0 }}>Voting Power</H5>
                      <SortFilterIcon
                        ascending={sortListAscending}
                        active={
                          validatorSortField ===
                          VALIDATORS_LIST_SORT_FILTER.VOTING_POWER
                        }
                      />
                    </RowItemHeader>
                    <RowItemHeader
                      width={150}
                      onClick={this.setSortFilter(
                        VALIDATORS_LIST_SORT_FILTER.COMMISSION,
                      )}
                    >
                      <H5 style={{ margin: 0 }}>Commission</H5>
                      <SortFilterIcon
                        ascending={sortListAscending}
                        active={
                          validatorSortField ===
                          VALIDATORS_LIST_SORT_FILTER.COMMISSION
                        }
                      />
                    </RowItemHeader>
                  </StakingRow>
                  <ValidatorListCard style={{ padding: 8 }}>
                    <PageScrollableContent>
                      {sortedValidatorsList.map(v => {
                        const expanded =
                          v.operator_address ===
                          this.state.showValidatorDetailsAddress;

                        const copyAddress = () =>
                          copyTextToClipboard(v.operator_address);

                        return (
                          <View key={v.operator_address}>
                            <ValidatorRowExpandable
                              onClick={() =>
                                this.handleClickValidator(v.operator_address)
                              }
                            >
                              <RowItem width={45}>
                                <AddressIconComponent
                                  networkName={network.name}
                                  address={v.operator_address}
                                  validatorOperatorAddressMap={
                                    validatorOperatorAddressMap
                                  }
                                />
                              </RowItem>
                              <RowItem width={150}>
                                <H5 style={{ margin: 0 }}>
                                  {v.description.moniker}
                                </H5>
                              </RowItem>
                              <RowItem width={150}>
                                <Text>
                                  {getPercentageFromTotal(v.tokens, stake)}%
                                </Text>
                              </RowItem>
                              <RowItem width={150}>
                                <Text>
                                  {formatCommissionRate(
                                    v.commission.commission_rates.rate,
                                  )}
                                  %
                                </Text>
                              </RowItem>
                              <RowItem>
                                <Icon
                                  icon={expanded ? "caret-up" : "caret-down"}
                                />
                              </RowItem>
                            </ValidatorRowExpandable>
                            <Collapse isOpen={expanded}>
                              <ValidatorDetails>
                                <ValidatorDetailRow>
                                  <RowItem width={200}>
                                    <H6 style={{ margin: 0 }}>
                                      Operator Address
                                    </H6>
                                  </RowItem>
                                  <RowItem width={150}>
                                    <Text>
                                      {formatAddressString(
                                        v.operator_address,
                                        true,
                                      )}
                                    </Text>
                                  </RowItem>
                                  <RowItem onClick={copyAddress}>
                                    <CopyIcon />
                                  </RowItem>
                                </ValidatorDetailRow>
                                <ValidatorDetailRow>
                                  <RowItem width={200}>
                                    <H6 style={{ margin: 0 }}>Website</H6>
                                  </RowItem>
                                  <RowItem width={300}>
                                    <Link href={v.description.website}>
                                      {v.description.website || "n/a"}
                                    </Link>
                                  </RowItem>
                                </ValidatorDetailRow>
                                <ValidatorDetailRow style={{ height: "auto" }}>
                                  <RowItem width={200}>
                                    <H6 style={{ margin: 0 }}>Description</H6>
                                  </RowItem>
                                  <RowItem width={300}>
                                    <Text style={{ fontSize: 12 }}>
                                      {v.description.details || "n/a"}
                                    </Text>
                                  </RowItem>
                                </ValidatorDetailRow>
                                <ValidatorDetailRow>
                                  <RowItem width={200}>
                                    <H6 style={{ margin: 0 }}>Fee</H6>
                                  </RowItem>
                                  <RowItem width={300}>
                                    <Text>
                                      {formatCommissionRate(
                                        v.commission.commission_rates.rate,
                                      )}
                                    </Text>
                                  </RowItem>
                                </ValidatorDetailRow>
                                <ValidatorDetailRow>
                                  <RowItem width={200}>
                                    <H6 style={{ margin: 0 }}>Max. Fee</H6>
                                  </RowItem>
                                  <RowItem width={300}>
                                    <Text>
                                      {formatCommissionRate(
                                        v.commission.commission_rates.max_rate,
                                      )}
                                    </Text>
                                  </RowItem>
                                </ValidatorDetailRow>
                                <ValidatorDetailRow>
                                  <RowItem width={200}>
                                    <H6 style={{ margin: 0 }}>
                                      Max. Daily Fee Change
                                    </H6>
                                  </RowItem>
                                  <RowItem width={150}>
                                    <Text>
                                      {formatCommissionRate(
                                        v.commission.commission_rates
                                          .max_change_rate,
                                      )}
                                    </Text>
                                  </RowItem>
                                  <RowItem width={150}>
                                    <Button
                                      style={{ marginBottom: 6 }}
                                      onClick={() => this.handleAddValidator(v)}
                                      data-cy="add-validator-button"
                                    >
                                      Add Validator
                                    </Button>
                                  </RowItem>
                                </ValidatorDetailRow>
                              </ValidatorDetails>
                            </Collapse>
                          </View>
                        );
                      })}
                    </PageScrollableContent>
                  </ValidatorListCard>
                </View>
                <View style={{ marginLeft: 16 }}>
                  <StakingRow style={{ paddingLeft: 14 }}>
                    <RowItemHeader width={125}>
                      <H5 style={{ margin: 0 }}>Balance</H5>
                    </RowItemHeader>
                    <RowItemHeader width={125}>
                      <H5 style={{ margin: 0 }}>Amount</H5>
                    </RowItemHeader>
                  </StakingRow>
                  <Card style={{ padding: 8, width: 475 }}>
                    <ValidatorDetailRow>
                      <RowItem width={125}>
                        <H6 style={{ margin: 0 }}>AVAILABLE</H6>
                      </RowItem>
                      <RowItem width={125}>
                        <Text>{balances.balance}</Text>
                      </RowItem>
                    </ValidatorDetailRow>
                    <ValidatorDetailRow>
                      <RowItem width={125}>
                        <H6 style={{ margin: 0 }}>REWARDS</H6>
                      </RowItem>
                      <RowItem width={125}>
                        <Text>{balances.rewards}</Text>
                      </RowItem>
                      <RowItem width={200}>
                        <Button
                          onClick={this.handleRewardsClaimAction}
                          data-cy="claim-rewards-button"
                        >
                          Withdraw Rewards
                        </Button>
                      </RowItem>
                    </ValidatorDetailRow>
                    {balances.commissions !== "0" && (
                      <ValidatorDetailRow>
                        <RowItem width={125}>
                          <H6 style={{ margin: 0 }}>COMMISSIONS</H6>
                        </RowItem>
                        <RowItem width={125}>
                          <Text>{balances.commissions}</Text>
                        </RowItem>
                        <RowItem width={200}>
                          <Button
                            onClick={this.handleCommissionsClaimAction}
                            data-cy="claim-rewards-button"
                          >
                            Withdraw Commissions
                          </Button>
                        </RowItem>
                      </ValidatorDetailRow>
                    )}
                    <ValidatorDetailRow>
                      <RowItem width={125}>
                        <H6 style={{ margin: 0 }}>UNBONDING</H6>
                      </RowItem>
                      <RowItem width={125}>
                        <Text>{balances.unbonding}</Text>
                      </RowItem>
                    </ValidatorDetailRow>
                  </Card>
                  <StakingRow style={{ paddingLeft: 14 }}>
                    <RowItem width={45} />
                    <RowItemHeader width={150}>
                      <H5 style={{ margin: 0 }}>Your Validators</H5>
                    </RowItemHeader>
                    <RowItemHeader width={100}>
                      <H5 style={{ margin: 0 }}>Amount</H5>
                    </RowItemHeader>
                    <RowItemHeader width={75}>
                      <H5 style={{ margin: 0 }}>Ratio</H5>
                    </RowItemHeader>
                  </StakingRow>
                  <Card style={{ padding: 8, width: 475 }}>
                    <StakingRowSummary>
                      <RowItem width={45}>
                        <NetworkLogoIcon network={network.name} />
                      </RowItem>
                      <RowItem width={150}>
                        <H5 style={{ margin: 0 }}>STAKING</H5>
                      </RowItem>
                      <RowItem width={100}>
                        <Text>{total}</Text>
                      </RowItem>
                    </StakingRowSummary>
                    {delegations.map(staking => {
                      const { rewards, validator, percentage } = staking;
                      return (
                        <View key={validator.operator_address}>
                          <StakingRow>
                            <RowItem width={45}>
                              <AddressIconComponent
                                networkName={network.name}
                                address={validator.operator_address}
                                validatorOperatorAddressMap={
                                  validatorOperatorAddressMap
                                }
                              />
                            </RowItem>
                            <RowItem width={150}>
                              <H5 style={{ margin: 0 }}>
                                {validator.description.moniker}
                              </H5>
                            </RowItem>
                            <RowItem width={100}>
                              <Text>
                                {formatCurrencyAmount(
                                  denomToUnit(
                                    rewards,
                                    network.denominationSize,
                                  ),
                                )}
                              </Text>
                            </RowItem>
                            <RowItem width={75}>
                              <Text>{percentage}%</Text>
                            </RowItem>
                            <RowItem width={75}>
                              <Button
                                style={{ borderRadius: "50%" }}
                                onClick={() =>
                                  this.handleAddValidator(validator)
                                }
                              >
                                <Icon icon="plus" color={COLORS.LIGHT_WHITE} />
                              </Button>
                            </RowItem>
                          </StakingRow>
                        </View>
                      );
                    })}
                  </Card>
                </View>
              </View>
            );
          }}
        </GraphQLGuardComponentMultipleQueries>
      </PageContainer>
    );
  }

  handleAddValidator = (validator: IValidator) => {
    // Set the selected validator in the transactions workflow
    this.props.setDelegationValidatorSelection(validator);

    // Default the signin network to the current network, if the ledger
    // is not connected
    if (!this.props.ledger.connected) {
      this.props.setSigninNetworkName(this.props.network.name);
    }

    // Open the ledger dialog
    this.props.openLedgerDialog({
      signinType: "LEDGER",
      ledgerAccessType: "PERFORM_ACTION",
      ledgerActionType: "DELEGATE",
    });
  };

  handleCommissionsClaimAction = () => {
    Toast.warn("Coming soon!");
  };

  handleRewardsClaimAction = () => {
    // let actionFunction;
    // if (this.props.ledger.connected) {
    //   actionFunction = this.props.openLedgerDialog;
    // } else {
    //   actionFunction = this.props.openSelectNetworkDialog;
    // }

    if (!this.props.ledger.connected) {
      this.props.setSigninNetworkName(this.props.network.name);
    }

    this.props.openLedgerDialog({
      signinType: "LEDGER",
      ledgerAccessType: "PERFORM_ACTION",
      ledgerActionType: "CLAIM",
    });
  };

  handleClickValidator = (address: string) => {
    if (this.state.showValidatorDetailsAddress === address) {
      this.setState({ showValidatorDetailsAddress: "" });
    } else {
      this.setState({ showValidatorDetailsAddress: address });
    }
  };

  setSortFilter = (filter: VALIDATORS_LIST_SORT_FILTER) => () => {
    this.props.setValidatorListSortType(filter);
  };
}

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

const ValidatorListCard = styled(Card)`
  padding: 8px;
  width: ${(props: { theme: IThemeProps }) =>
    props.theme.isDesktop ? "550px" : "auto"};
`;

const ValidatorRowBase = styled.div`
  padding: 6px;
  display: flex;
  align-items: center;
  flex-direction: row;
`;

const StakingRow = styled(ValidatorRowBase)`
  height: 70px;
`;

const StakingRowSummary = styled(StakingRow)`
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.DARK_GRAY5 : Colors.LIGHT_GRAY5};
`;

const ValidatorRowExpandable = styled(ValidatorRowBase)`
  height: 70px;

  &:hover {
    cursor: pointer;
  }
`;

const ValidatorDetailRow = styled(ValidatorRowBase)`
  height: 35px;
  margin-top: 2px;
  margin-bottom: 2px;
`;

const ValidatorDetails = styled.div`
  padding-top: 4px;
  padding-bottom: 4px;
  background: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.DARK_GRAY3 : Colors.LIGHT_GRAY3};
`;

const RowItem = styled.div<{ width?: number }>`
  padding-left: 4px;
  padding-right: 4px;
  width: ${props => (props.width ? `${props.width}px` : "auto")};
`;

const RowItemHeader = styled(RowItem)`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;

  &:hover {
    cursor: pointer;

    h5 {
      color: ${COLORS.LIGHT_GRAY};
    }
  }
`;

const Text = styled.p`
  margin: 0;
  text-align: left;
`;

const SortFilterIcon = ({
  active,
  ascending,
}: {
  active: boolean;
  ascending: boolean;
}) => {
  return active ? (
    <Icon color={COLORS.PRIMARY} icon={ascending ? "caret-down" : "caret-up"} />
  ) : null;
};

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  ledger: Modules.selectors.ledger.ledgerSelector(state),
  network: Modules.selectors.ledger.networkSelector(state),
  sortListAscending: Modules.selectors.app.appSelector(state)
    .sortValidatorsListAscending,
  validatorSortField: Modules.selectors.app.appSelector(state)
    .validatorsListSortFilter,
});

const dispatchProps = {
  setLocale: Modules.actions.settings.setLocale,
  setValidatorListSortType: Modules.actions.app.setValidatorListSortType,
  openLedgerDialog: Modules.actions.ledger.openLedgerDialog,
  setSigninNetworkName: Modules.actions.ledger.setSigninNetworkName,
  openSelectNetworkDialog: Modules.actions.ledger.openSelectNetworkDialog,
  setDelegationValidatorSelection:
    Modules.actions.transaction.setDelegationValidatorSelection,
};

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

const withProps = connect(mapStateToProps, dispatchProps);

interface ComponentProps {}

interface IProps
  extends ComponentProps,
    ValidatorsProps,
    StakingPoolProps,
    FiatPriceDataProps,
    AccountBalancesProps,
    RewardsByValidatorProps,
    ConnectProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withValidators,
  withStakingPool,
  withFiatPriceData,
  withAccountBalances,
  withRewardsByValidatorQuery,
)(ValidatorsListPage);
