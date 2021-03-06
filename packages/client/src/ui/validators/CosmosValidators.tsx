import {
  ICosmosAccountBalances,
  ICosmosValidator,
  IQuery,
} from "@anthem/utils";
import { Card, Collapse, H5, H6, Icon } from "@blueprintjs/core";
import { CopyIcon, NetworkLogoIcon } from "assets/images";
import { COLORS } from "constants/colors";
import {
  CosmosAccountBalancesProps,
  FiatPriceDataProps,
  RewardsByValidatorProps,
  StakingPoolProps,
  ValidatorsProps,
  withCosmosAccountBalances,
  withFiatPriceData,
  withGraphQLVariables,
  withRewardsByValidatorQuery,
  withStakingPool,
  withValidators,
} from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import {
  copyTextToClipboard,
  COSMOS_VALIDATORS_SORT_FILTER,
  deriveCurrentDelegationsInformation,
  formatAddressString,
  formatCommissionRate,
  getAccountBalances,
  getPercentageFromTotal,
  getValidatorOperatorAddressMap,
  sortValidatorsList,
} from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import { denomToUnit, formatCurrencyAmount } from "tools/currency-utils";
import AddressIconComponent from "ui/AddressIconComponent";
import { GraphQLGuardComponentMultipleQueries } from "ui/GraphQLGuardComponents";
import PageAddressBar from "ui/PageAddressBar";
import {
  Button,
  DashboardLoader,
  Link,
  PageContainer,
  PageScrollableContent,
  View,
} from "ui/SharedComponents";
import {
  RowItem,
  RowItemHeader,
  SortFilterIcon,
  StakingRow,
  StakingRowSummary,
  Text,
  ValidatorDetailRow,
  ValidatorDetails,
  ValidatorListCard,
  ValidatorRowExpandable,
} from "./ValidatorsListComponents";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IState {
  showValidatorDetailsAddress: string;
  sortValidatorsListAscending: boolean;
  validatorsListSortFilter: COSMOS_VALIDATORS_SORT_FILTER;
}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class CosmosValidatorsListPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      showValidatorDetailsAddress: "",
      sortValidatorsListAscending: false,
      validatorsListSortFilter: COSMOS_VALIDATORS_SORT_FILTER.CUSTOM_DEFAULT,
    };
  }

  render(): JSX.Element {
    const {
      sortValidatorsListAscending,
      validatorsListSortFilter,
    } = this.state;
    const {
      i18n,
      network,
      fiatPriceData,
      cosmosValidators,
      cosmosStakingPool,
      cosmosAccountBalances,
      cosmosRewardsByValidator,
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
            [cosmosValidators, "cosmosValidators"],
            [cosmosStakingPool, "cosmosStakingPool"],
            [cosmosAccountBalances, "cosmosAccountBalances"],
            [fiatPriceData, "fiatPriceData"],
            [cosmosRewardsByValidator, "cosmosRewardsByValidator"],
          ]}
        >
          {([
            validatorList,
            stakingPoolResponse,
            accountBalancesResponse,
            pricesResponse,
            rewardsByValidatorResponse,
          ]: [
            IQuery["cosmosValidators"],
            IQuery["cosmosStakingPool"],
            ICosmosAccountBalances,
            IQuery["fiatPriceData"],
            IQuery["cosmosRewardsByValidator"],
          ]) => {
            const balances = getAccountBalances(
              accountBalancesResponse,
              fiatPriceData.fiatPriceData.price,
              network,
              network.denom,
            );

            const stake = stakingPoolResponse.bonded_tokens || "";
            const validatorOperatorAddressMap = getValidatorOperatorAddressMap<
              ICosmosValidator
            >(validatorList, v => v.operator_address);

            // Sort the validators list based on the current sort settings
            const sortedValidatorsList = sortValidatorsList(
              validatorList,
              validatorsListSortFilter,
              sortValidatorsListAscending,
              stake,
            );

            const { total, delegations } = deriveCurrentDelegationsInformation(
              accountBalancesResponse.delegations,
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
                      onClick={this.handleSortList(
                        COSMOS_VALIDATORS_SORT_FILTER.NAME,
                      )}
                    >
                      <H5 style={{ margin: 0 }}>Validator</H5>
                      <SortFilterIcon
                        ascending={sortValidatorsListAscending}
                        active={
                          validatorsListSortFilter ===
                            COSMOS_VALIDATORS_SORT_FILTER.NAME ||
                          validatorsListSortFilter ===
                            COSMOS_VALIDATORS_SORT_FILTER.CUSTOM_DEFAULT
                        }
                      />
                    </RowItemHeader>
                    <RowItemHeader
                      width={150}
                      onClick={this.handleSortList(
                        COSMOS_VALIDATORS_SORT_FILTER.VOTING_POWER,
                      )}
                    >
                      <H5 style={{ margin: 0 }}>Voting Power</H5>
                      <SortFilterIcon
                        ascending={sortValidatorsListAscending}
                        active={
                          validatorsListSortFilter ===
                          COSMOS_VALIDATORS_SORT_FILTER.VOTING_POWER
                        }
                      />
                    </RowItemHeader>
                    <RowItemHeader
                      width={150}
                      onClick={this.handleSortList(
                        COSMOS_VALIDATORS_SORT_FILTER.COMMISSION,
                      )}
                    >
                      <H5 style={{ margin: 0 }}>Commission</H5>
                      <SortFilterIcon
                        ascending={sortValidatorsListAscending}
                        active={
                          validatorsListSortFilter ===
                          COSMOS_VALIDATORS_SORT_FILTER.COMMISSION
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
                              highlight={v.description.moniker === "Chorus One"}
                              data-cy={`validator-${v.operator_address}`}
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
                                      %
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
                                      %
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
                                      %
                                    </Text>
                                  </RowItem>
                                  <RowItem width={150}>
                                    <Button
                                      style={{ marginBottom: 6 }}
                                      onClick={() => this.handleAddValidator(v)}
                                      data-cy="delegate-button"
                                    >
                                      Stake
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
                            onClick={this.handleRewardsClaimAction}
                            data-cy="claim-commissions-button"
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
                      <RowItem width={75}>
                        <Text>100%</Text>
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

  handleSortList = (sortFilter: COSMOS_VALIDATORS_SORT_FILTER) => () => {
    const {
      validatorsListSortFilter,
      sortValidatorsListAscending,
    } = this.state;
    let sortDirection = true;
    if (sortFilter === validatorsListSortFilter) {
      sortDirection = !sortValidatorsListAscending;
    }

    this.setState({
      validatorsListSortFilter: sortFilter,
      sortValidatorsListAscending: sortDirection,
    });
  };

  handleAddValidator = (validator: ICosmosValidator) => {
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

  handleRewardsClaimAction = () => {
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
}

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  ledger: Modules.selectors.ledger.ledgerSelector(state),
  network: Modules.selectors.ledger.networkSelector(state),
});

const dispatchProps = {
  setLocale: Modules.actions.settings.setLocale,
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
    CosmosAccountBalancesProps,
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
  withCosmosAccountBalances,
  withRewardsByValidatorQuery,
)(CosmosValidatorsListPage);
