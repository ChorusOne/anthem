import {
  ICeloValidatorGroup,
  ICosmosAccountBalancesType,
  IQuery,
} from "@anthem/utils";
import { Card, Collapse, H5, H6, Icon } from "@blueprintjs/core";
import { CopyIcon, NetworkLogoIcon } from "assets/images";
import {
  AccountBalancesProps,
  CeloValidatorsProps,
  FiatPriceDataProps,
  withAccountBalances,
  withCeloValidatorGroups,
  withFiatPriceData,
  withGraphQLVariables,
} from "graphql/queries";
import { VALIDATORS_LIST_SORT_FILTER } from "modules/app/store";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import {
  copyTextToClipboard,
  formatAddressString,
  getValidatorOperatorAddressMap,
} from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import AddressIconComponent from "ui/AddressIconComponent";
import { GraphQLGuardComponentMultipleQueries } from "ui/GraphQLGuardComponents";
import PageAddressBar from "ui/PageAddressBar";
import {
  Button,
  DashboardLoader,
  PageContainer,
  PageScrollableContent,
  View,
} from "ui/SharedComponents";
import {
  RowItem,
  RowItemHeader,
  SortFilterIcon,
  StakingRow,
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
      celoValidatorGroups,
      accountBalances,
      sortListAscending,
      validatorSortField,
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
            [celoValidatorGroups, "celoValidatorGroups"],
            [accountBalances, "accountBalances"],
            [prices, "prices"],
          ]}
        >
          {([validatorList, accountBalancesResponse, pricesResponse]: [
            IQuery["celoValidatorGroups"],
            ICosmosAccountBalancesType,
            IQuery["prices"],
          ]) => {
            // const balances = getAccountBalances(
            //   accountBalancesResponse.cosmos,
            //   pricesResponse,
            //   network,
            // );

            const validatorOperatorAddressMap = getValidatorOperatorAddressMap(
              validatorList,
              v => v.group,
            );

            // Sort the validators list based on the current sort settings
            const sortedValidatorsList = validatorList;

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
                          v.group === this.state.showValidatorDetailsAddress;

                        const copyAddress = () => copyTextToClipboard(v.group);

                        return (
                          <View key={v.group}>
                            <ValidatorRowExpandable
                              data-cy={`validator-${v.group}`}
                              onClick={() => this.handleClickValidator(v.group)}
                            >
                              <RowItem width={45}>
                                <AddressIconComponent
                                  networkName={network.name}
                                  address={v.group}
                                  validatorOperatorAddressMap={
                                    validatorOperatorAddressMap
                                  }
                                />
                              </RowItem>
                              <RowItem width={150}>
                                <H5 style={{ margin: 0 }}>{v.name}</H5>
                              </RowItem>
                              <RowItem width={150}>
                                <Text>
                                  {(+v.votingPowerFraction).toFixed(4)}
                                </Text>
                              </RowItem>
                              <RowItem width={150}>
                                <Text>
                                  {(
                                    v.capacityAvailable / v.totalCapacity
                                  ).toFixed(4)}
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
                                    <H6 style={{ margin: 0 }}>Group Address</H6>
                                  </RowItem>
                                  <RowItem width={150}>
                                    <Text>
                                      {formatAddressString(v.group, true)}
                                    </Text>
                                  </RowItem>
                                  <RowItem onClick={copyAddress}>
                                    <CopyIcon />
                                  </RowItem>
                                </ValidatorDetailRow>
                                <ValidatorDetailRow style={{ height: "auto" }}>
                                  <RowItem width={200}>
                                    <H6 style={{ margin: 0 }}>Voting Power</H6>
                                  </RowItem>
                                  <RowItem width={300}>
                                    <Text>{v.votingPower || "n/a"}</Text>
                                  </RowItem>
                                </ValidatorDetailRow>
                                <ValidatorDetailRow>
                                  <RowItem width={200}>
                                    <H6 style={{ margin: 0 }}>
                                      Voting Power Fraction
                                    </H6>
                                  </RowItem>
                                  <RowItem width={300}>
                                    <Text>{v.votingPowerFraction}</Text>
                                  </RowItem>
                                </ValidatorDetailRow>
                                <ValidatorDetailRow>
                                  <RowItem width={200}>
                                    <H6 style={{ margin: 0 }}>
                                      Capacity Available
                                    </H6>
                                  </RowItem>
                                  <RowItem width={300}>
                                    <Text>{v.capacityAvailable}</Text>
                                  </RowItem>
                                </ValidatorDetailRow>
                                <ValidatorDetailRow>
                                  <RowItem width={200}>
                                    <H6 style={{ margin: 0 }}>
                                      Total Capacity
                                    </H6>
                                  </RowItem>
                                  <RowItem width={225}>
                                    <Text>{v.totalCapacity}</Text>
                                  </RowItem>
                                  <RowItem width={100}>
                                    <Button
                                      style={{ marginBottom: 6 }}
                                      onClick={() => this.handleAddValidator(v)}
                                      data-cy="delegate-button"
                                    >
                                      Lock Gold
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
                    {/* <ValidatorDetailRow>
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
                    </StakingRowSummary> */}
                    {/* {delegations.map(staking => {
                      const { rewards, validator, percentage } = staking;
                      return (
                        <View key={validator.group}>
                          <StakingRow>
                            <RowItem width={45}>
                              <AddressIconComponent
                                networkName={network.name}
                                address={validator.group}
                                validatorOperatorAddressMap={
                                  validatorOperatorAddressMap
                                }
                              />
                            </RowItem>
                            <RowItem width={150}>
                              <H5 style={{ margin: 0 }}>
                                {validator.name}
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
                    })} */}
                  </Card>
                </View>
              </View>
            );
          }}
        </GraphQLGuardComponentMultipleQueries>
      </PageContainer>
    );
  }

  handleAddValidator = (validator: ICeloValidatorGroup) => {
    // TODO: Not implemented yet.
    // Set the selected validator in the transactions workflow
    // this.props.setDelegationValidatorSelection(validator);
    // Default the signin network to the current network, if the ledger
    // is not connected
    // if (!this.props.ledger.connected) {
    //   this.props.setSigninNetworkName(this.props.network.name);
    // }
    // Open the ledger dialog
    // this.props.openLedgerDialog({
    //   signinType: "LEDGER",
    //   ledgerAccessType: "PERFORM_ACTION",
    //   ledgerActionType: "DELEGATE",
    // });
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

  setSortFilter = (filter: VALIDATORS_LIST_SORT_FILTER) => () => {
    this.props.setValidatorListSortType(filter);
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
    FiatPriceDataProps,
    AccountBalancesProps,
    CeloValidatorsProps,
    ConnectProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withFiatPriceData,
  withAccountBalances,
  withCeloValidatorGroups,
)(ValidatorsListPage);
