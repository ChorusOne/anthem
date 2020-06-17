import {
  ICeloAccountBalances,
  ICeloValidatorGroup,
  IQuery,
} from "@anthem/utils";
import { Card, Collapse, H5, H6, Icon } from "@blueprintjs/core";
import { CopyIcon, NetworkLogoIcon } from "assets/images";
import { COLORS } from "constants/colors";
import {
  CeloAccountBalancesProps,
  CeloValidatorsProps,
  FiatPriceDataProps,
  withCeloAccountBalances,
  withCeloValidatorGroups,
  withFiatPriceData,
  withGraphQLVariables,
} from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import {
  CELO_VALIDATORS_LIST_SORT_FILTER,
  copyTextToClipboard,
  formatAddressString,
  getCeloVotesAvailablePercentage,
  getPercentageFromTotal,
  getValidatorOperatorAddressMap,
  sortCeloValidatorsList,
} from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import { denomToUnit, formatCurrencyAmount } from "tools/currency-utils";
import { divide, GenericNumberType, subtract } from "tools/math-utils";
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

export enum SORT_DIRECTION {
  ASCENDING = "ASCENDING",
  DESCENDING = "DESCENDING",
}

interface IState {
  showValidatorDetailsAddress: string;
  sortValidatorsListAscending: boolean;
  validatorsListSortFilter: CELO_VALIDATORS_LIST_SORT_FILTER;
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
      sortValidatorsListAscending: true,
      validatorsListSortFilter: CELO_VALIDATORS_LIST_SORT_FILTER.CUSTOM_DEFAULT,
    };
  }

  render(): JSX.Element {
    const {
      sortValidatorsListAscending,
      validatorsListSortFilter,
    } = this.state;
    const {
      i18n,
      prices,
      network,
      celoValidatorGroups,
      celoAccountBalances,
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
            [celoAccountBalances, "celoAccountBalances"],
            [prices, "prices"],
          ]}
        >
          {([validatorList, accountBalancesResponse, pricesResponse]: [
            IQuery["celoValidatorGroups"],
            ICeloAccountBalances,
            IQuery["prices"],
          ]) => {
            const {
              delegations,
              availableGoldBalance,
              totalLockedGoldBalance,
              nonVotingLockedGoldBalance,
              votingLockedGoldBalance,
              pendingWithdrawalBalance,
              celoUSDValue,
            } = accountBalancesResponse;

            const validatorOperatorAddressMap = getValidatorOperatorAddressMap<
              ICeloValidatorGroup
            >(validatorList, v => v.group.toUpperCase());

            // Sort the validators list based on the current sort settings
            const sortedValidatorsList = sortCeloValidatorsList(
              validatorList,
              validatorsListSortFilter,
              sortValidatorsListAscending,
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
                        CELO_VALIDATORS_LIST_SORT_FILTER.NAME,
                      )}
                    >
                      <H5 style={{ margin: 0 }}>Validator</H5>
                      <SortFilterIcon
                        ascending={sortValidatorsListAscending}
                        active={
                          validatorsListSortFilter ===
                            CELO_VALIDATORS_LIST_SORT_FILTER.NAME ||
                          validatorsListSortFilter ===
                            CELO_VALIDATORS_LIST_SORT_FILTER.CUSTOM_DEFAULT
                        }
                      />
                    </RowItemHeader>
                    <RowItemHeader
                      width={150}
                      onClick={this.handleSortList(
                        CELO_VALIDATORS_LIST_SORT_FILTER.VOTING_POWER,
                      )}
                    >
                      <H5 style={{ margin: 0 }}>Voting Capacity</H5>
                      <SortFilterIcon
                        ascending={sortValidatorsListAscending}
                        active={
                          validatorsListSortFilter ===
                          CELO_VALIDATORS_LIST_SORT_FILTER.VOTING_POWER
                        }
                      />
                    </RowItemHeader>
                    <RowItemHeader
                      width={150}
                      onClick={this.handleSortList(
                        CELO_VALIDATORS_LIST_SORT_FILTER.OPEN_VOTES,
                      )}
                    >
                      <H5 style={{ margin: 0 }}>Open Votes</H5>
                      <SortFilterIcon
                        ascending={sortValidatorsListAscending}
                        active={
                          validatorsListSortFilter ===
                          CELO_VALIDATORS_LIST_SORT_FILTER.OPEN_VOTES
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

                        const votingCapacityPercentage = getCeloVotesAvailablePercentage(
                          v.capacityAvailable,
                          v.votingPower,
                        );

                        const x = renderCurrencyValue(
                          "50231328840559524177741",
                          network.denominationSize,
                        );
                        console.log(x);

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
                                <H5 style={{ margin: 0 }}>
                                  {v.name || "(no name set)"}
                                </H5>
                              </RowItem>
                              <RowItem width={150}>
                                <Text>{adjustValue(v.capacityAvailable)}</Text>
                              </RowItem>
                              <RowItem width={150}>
                                <Text>
                                  {votingCapacityPercentage.toFixed(2)}%
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
                                    <H6 style={{ margin: 0 }}>Active Votes</H6>
                                  </RowItem>
                                  <RowItem width={300}>
                                    <Text>{adjustValue(v.votingPower)}</Text>
                                  </RowItem>
                                </ValidatorDetailRow>
                                <ValidatorDetailRow>
                                  <RowItem width={200}>
                                    <H6 style={{ margin: 0 }}>
                                      Votes Receivable
                                    </H6>
                                  </RowItem>
                                  <RowItem width={300}>
                                    <Text>
                                      {adjustValue(
                                        subtract(
                                          v.capacityAvailable,
                                          v.votingPower,
                                        ),
                                      )}
                                    </Text>
                                  </RowItem>
                                </ValidatorDetailRow>
                                <ValidatorDetailRow>
                                  <RowItem width={200}>
                                    <H6 style={{ margin: 0 }}>
                                      Total Capacity
                                    </H6>
                                  </RowItem>
                                  <RowItem width={225}>
                                    <Text>{adjustValue(v.totalCapacity)}</Text>
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
                    <ValidatorDetailRow>
                      <RowItem width={125}>
                        <H6 style={{ margin: 0 }}>AVAILABLE</H6>
                      </RowItem>
                      <RowItem width={125}>
                        <Text>
                          {renderCurrencyValue(
                            availableGoldBalance,
                            network.denominationSize,
                          )}
                        </Text>
                      </RowItem>
                    </ValidatorDetailRow>
                    <ValidatorDetailRow>
                      <RowItem width={125}>
                        <H6 style={{ margin: 0 }}>TOTAL LOCKED</H6>
                      </RowItem>
                      <RowItem width={125}>
                        <Text>
                          {renderCurrencyValue(
                            totalLockedGoldBalance,
                            network.denominationSize,
                          )}
                        </Text>
                      </RowItem>
                      {/* <RowItem width={200}>
                        <Button
                          onClick={this.handleRewardsClaimAction}
                          data-cy="claim-rewards-button"
                        >
                          Withdraw Rewards
                        </Button>
                      </RowItem> */}
                    </ValidatorDetailRow>
                    <ValidatorDetailRow>
                      <RowItem width={125}>
                        <H6 style={{ margin: 0 }}>VOTING</H6>
                      </RowItem>
                      <RowItem width={125}>
                        <Text>
                          {renderCurrencyValue(
                            votingLockedGoldBalance,
                            network.denominationSize,
                          )}
                        </Text>
                      </RowItem>
                    </ValidatorDetailRow>
                    <ValidatorDetailRow>
                      <RowItem width={125}>
                        <H6 style={{ margin: 0 }}>NON-VOTING</H6>
                      </RowItem>
                      <RowItem width={125}>
                        <Text>
                          {renderCurrencyValue(
                            nonVotingLockedGoldBalance,
                            network.denominationSize,
                          )}
                        </Text>
                      </RowItem>
                    </ValidatorDetailRow>
                    <ValidatorDetailRow>
                      <RowItem width={125}>
                        <H6 style={{ margin: 0 }}>PENDING</H6>
                      </RowItem>
                      <RowItem width={125}>
                        <Text>
                          {renderCurrencyValue(
                            pendingWithdrawalBalance,
                            network.denominationSize,
                          )}
                        </Text>
                      </RowItem>
                    </ValidatorDetailRow>
                    <ValidatorDetailRow>
                      <RowItem width={125}>
                        <H6 style={{ margin: 0 }}>cUSD</H6>
                      </RowItem>
                      <RowItem width={125}>
                        <Text>
                          {renderCurrencyValue(
                            celoUSDValue,
                            network.denominationSize,
                          )}
                        </Text>
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
                        <Text>
                          {renderCurrencyValue(
                            totalLockedGoldBalance,
                            network.denominationSize,
                          )}
                        </Text>
                      </RowItem>
                      <RowItem width={75}>
                        <Text>100.00%</Text>
                      </RowItem>
                    </StakingRowSummary>
                    {delegations.map(delegation => {
                      const {
                        group,
                        totalVotes,
                        // activeVotes,
                        // pendingVotes,
                      } = delegation;

                      // Find the associated validator group
                      const validatorGroup = validatorOperatorAddressMap.get(
                        group.toUpperCase(),
                      );

                      if (!validatorGroup) {
                        return null;
                      }

                      return (
                        <View key={group}>
                          <StakingRow>
                            <RowItem width={45}>
                              <AddressIconComponent
                                networkName={network.name}
                                address={group}
                                validatorOperatorAddressMap={
                                  validatorOperatorAddressMap
                                }
                              />
                            </RowItem>
                            <RowItem width={150}>
                              <H5 style={{ margin: 0 }}>
                                {validatorGroup.name}
                              </H5>
                            </RowItem>
                            <RowItem width={100}>
                              <Text>
                                {renderCurrencyValue(
                                  totalVotes,
                                  network.denominationSize,
                                )}
                              </Text>
                            </RowItem>
                            <RowItem width={75}>
                              <Text>
                                {getPercentageFromTotal(
                                  totalVotes,
                                  totalLockedGoldBalance,
                                )}
                                %
                              </Text>
                            </RowItem>
                            <RowItem width={75}>
                              <Button
                                style={{ borderRadius: "50%" }}
                                onClick={() =>
                                  this.handleAddValidator(validatorGroup)
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

  handleSortList = (sortFilter: CELO_VALIDATORS_LIST_SORT_FILTER) => () => {
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
}

const adjustValue = (value: GenericNumberType) => {
  const x = divide(Number(value), 10e17, Number);
  return formatCurrencyAmount(x);
};

// Helper to render Celo currency values
const renderCurrencyValue = (value: string, denomSize: number) => {
  return formatCurrencyAmount(denomToUnit(value, denomSize));
};

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
    FiatPriceDataProps,
    CeloAccountBalancesProps,
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
  withCeloAccountBalances,
  withCeloValidatorGroups,
)(ValidatorsListPage);
