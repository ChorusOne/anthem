import {
  IOasisValidator,
  IOasisValidatorsQuery,
  useOasisAccountBalancesQuery,
  useOasisValidatorsQuery,
} from "@anthem/utils";
import client from "graphql/apollo-client";

import { Card, Collapse, H5, H6, Icon, Spinner } from "@blueprintjs/core";
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
import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  copyTextToClipboard,
  formatAddressString,
  formatCommissionRate,
  getPercentageFromTotal,
} from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import { denomToUnit, formatCurrencyAmount } from "tools/currency-utils";
import PageAddressBar from "ui/PageAddressBar";
import {
  Button,
  Centered,
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
 * React Component
 * ============================================================================
 */
interface ComponentProps {}
interface IProps
  extends ComponentProps,
    ValidatorsProps,
    StakingPoolProps,
    FiatPriceDataProps,
    CosmosAccountBalancesProps,
    RewardsByValidatorProps,
    ConnectProps {}

const TxIcon = styled.img`
  width: 32px;
  border-radius: 50%;

  :hover {
    cursor: auto;
  }
`;

type SortKey = Exclude<keyof IOasisValidator, "__typename">;
export const sanitizeOasisValidators = (
  validatorsData: IOasisValidatorsQuery | undefined,
  currentSortKey: SortKey | undefined,
  currentSortDirection: "asc" | "desc",
) => {
  const validatorsHashmap: { [key: string]: IOasisValidator } = (
    validatorsData?.oasisValidators || []
  ).reduce(
    (acc, validator) => ({ ...acc, [validator.address]: validator }),
    {},
  );

  const sortedValidators = [
    ...(validatorsData?.oasisValidators || []).filter(
      ({ address: validatorAddress }) =>
        validatorAddress === HIGHLIGHTED_VALIDATOR,
    ),

    ...(validatorsData?.oasisValidators || [])
      .filter(
        ({ address: validatorAddress }) =>
          validatorAddress !== HIGHLIGHTED_VALIDATOR,
      )
      .sort((a, b) => {
        const factor = currentSortDirection === "desc" ? 1 : -1;
        return (
          factor *
          ((a[currentSortKey || "name"] || "") <
          (b[currentSortKey || "name"] || "")
            ? 1
            : -1)
        );
      }),
  ];

  return { sortedValidators, validatorsHashmap };
};

export const useOasisValidators = (
  currentSortKey: SortKey | undefined,
  currentSortDirection: "asc" | "desc",
) => {
  const { data: validatorsData } = useOasisValidatorsQuery({ client });
  return sanitizeOasisValidators(
    validatorsData,
    currentSortKey,
    currentSortDirection,
  );
};

const HIGHLIGHTED_VALIDATOR = "oasis1qpn83e8hm3gdhvpfv66xj3qsetkj3ulmkugmmxn3";

const OasisValidatorsListPage = ({
  network,
  address,
  setDelegationValidatorSelection,
  ledger,
  openLedgerDialog,
  setSigninNetworkName,
}: IProps) => {
  const [expandedValidator, setExpandedValidator] = useState<null | string>(
    null,
  );
  const [currentSortKey, setSortKey] = useState<SortKey>("name");
  const [currentSortDirection, setSortDirection] = useState<"asc" | "desc">(
    "asc",
  );

  const { sortedValidators, validatorsHashmap } = useOasisValidators(
    currentSortKey,
    currentSortDirection,
  );

  const onSort = (sortKey: SortKey) => {
    if (currentSortKey === sortKey) {
      setSortDirection(current => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortDirection("asc");
    }

    setSortKey(sortKey);
  };

  const { loading, data, error } = useOasisAccountBalancesQuery({
    skip: !address,
    variables: {
      address,
    },
    client,
  });

  if (loading && !data?.oasisAccountBalances) {
    return (
      <Centered style={{ marginTop: 40 }}>
        <Spinner />
      </Centered>
    );
  }

  if (error && !data?.oasisAccountBalances) {
    return (
      <Centered>
        <p style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>
          Error fetching data...
        </p>
      </Centered>
    );
  }

  return (
    <PageContainer>
      <PageAddressBar pageTitle="Staking" />

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

            <RowItemHeader width={470} onClick={() => onSort("name")}>
              <H5 style={{ margin: 0 }}>Validator</H5>
              <SortFilterIcon
                ascending={currentSortDirection === "asc"}
                active={currentSortKey === "name"}
              />
            </RowItemHeader>

            <RowItemHeader width={80} onClick={() => onSort("commission")}>
              <H5 style={{ margin: 0 }}>Commission</H5>
              <SortFilterIcon
                ascending={currentSortDirection === "asc"}
                active={currentSortKey === "commission"}
              />
            </RowItemHeader>
          </StakingRow>

          <ValidatorListCard style={{ padding: 8 }}>
            <PageScrollableContent>
              {sortedValidators.map(validator => {
                const isExpanded = expandedValidator === validator.address;

                return (
                  <View key={validator.address}>
                    <ValidatorRowExpandable
                      highlight={validator.address === HIGHLIGHTED_VALIDATOR}
                      data-cy={`validator-${validator.address}`}
                      onClick={() =>
                        setExpandedValidator(
                          isExpanded ? null : validator.address,
                        )
                      }
                    >
                      <RowItem width={45}>
                        <TxIcon src={validator.iconUrl || undefined} />
                      </RowItem>

                      <RowItem width={470}>
                        <H5 style={{ margin: 0 }}>{validator.name}</H5>
                      </RowItem>

                      <RowItem width={80}>
                        <Text>
                          {formatCommissionRate(String(validator.commission))}%
                        </Text>
                      </RowItem>

                      <RowItem>
                        <Icon icon={isExpanded ? "caret-up" : "caret-down"} />
                      </RowItem>
                    </ValidatorRowExpandable>

                    <Collapse isOpen={isExpanded}>
                      <ValidatorDetails>
                        <ValidatorDetailRow>
                          <RowItem width={200}>
                            <H6 style={{ margin: 0 }}>Operator Address</H6>
                          </RowItem>
                          <RowItem width={150}>
                            <Text>
                              {formatAddressString(validator.address, true)}
                            </Text>
                          </RowItem>
                          <RowItem
                            onClick={() =>
                              copyTextToClipboard(validator.address)
                            }
                          >
                            <CopyIcon />
                          </RowItem>
                        </ValidatorDetailRow>

                        <ValidatorDetailRow>
                          <RowItem width={200}>
                            <H6 style={{ margin: 0 }}>Website</H6>
                          </RowItem>
                          <RowItem width={300}>
                            {validator.website ? (
                              <Link href={validator.website}>
                                {validator.website}
                              </Link>
                            ) : (
                              "-"
                            )}
                          </RowItem>
                        </ValidatorDetailRow>

                        <ValidatorDetailRow>
                          <RowItem width={200}>
                            <H6 style={{ margin: 0 }}>Fee</H6>
                          </RowItem>
                          <RowItem width={150}>
                            <Text>
                              {formatCommissionRate(
                                String(validator.commission),
                              )}
                              %
                            </Text>
                          </RowItem>
                          <RowItem width={150}>
                            <Button
                              style={{ marginBottom: 6 }}
                              onClick={() => {
                                setDelegationValidatorSelection(
                                  validator as any,
                                );

                                if (!ledger.connected) {
                                  setSigninNetworkName(network.name);
                                }

                                openLedgerDialog({
                                  signinType: "LEDGER",
                                  ledgerAccessType: "PERFORM_ACTION",
                                  ledgerActionType: "DELEGATE",
                                });
                              }}
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
                <Text>
                  {formatCurrencyAmount(
                    denomToUnit(
                      data?.oasisAccountBalances?.available || 0,
                      network.denominationSize,
                    ),
                  )}
                </Text>
              </RowItem>
            </ValidatorDetailRow>

            <ValidatorDetailRow>
              <RowItem width={125}>
                <H6 style={{ margin: 0 }}>REWARDS</H6>
              </RowItem>

              <RowItem width={125}>
                <Text>{data?.oasisAccountBalances?.rewards || 0}</Text>
              </RowItem>

              {/* <RowItem width={200}>
                <Button
                  onClick={() => console.log("withdraw")}
                  data-cy="claim-rewards-button"
                >
                  Withdraw Rewards
                </Button>
              </RowItem> */}
            </ValidatorDetailRow>

            <ValidatorDetailRow>
              <RowItem width={125}>
                <H6 style={{ margin: 0 }}>UNBONDING</H6>
              </RowItem>
              <RowItem width={125}>
                <Text>
                  {formatCurrencyAmount(
                    denomToUnit(
                      data?.oasisAccountBalances?.unbonding?.balance || 0,
                      network.denominationSize,
                    ),
                  )}
                </Text>
              </RowItem>
            </ValidatorDetailRow>

            <ValidatorDetailRow>
              <RowItem width={125}>
                <H6 style={{ margin: 0 }}>STAKED</H6>
              </RowItem>
              <RowItem width={125}>
                <Text>
                  {formatCurrencyAmount(
                    denomToUnit(
                      data?.oasisAccountBalances?.staked.balance || 0,
                      network.denominationSize,
                    ),
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
                  {formatCurrencyAmount(
                    denomToUnit(
                      data?.oasisAccountBalances?.staked.balance || 0,
                      network.denominationSize,
                    ),
                  )}
                </Text>
              </RowItem>
              <RowItem width={75}>
                <Text>100%</Text>
              </RowItem>
            </StakingRowSummary>

            {data?.oasisAccountBalances?.delegations?.map(delegation => {
              console.log(delegation.validator);

              return (
                <View key={delegation.validator}>
                  <StakingRow>
                    <RowItem width={45}>
                      <TxIcon
                        src={
                          validatorsHashmap[delegation.validator]?.iconUrl ||
                          undefined
                        }
                      />
                    </RowItem>
                    <RowItem width={150}>
                      <H5
                        style={{
                          margin: 0,
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {validatorsHashmap[delegation.validator]?.name ||
                          delegation.validator}
                      </H5>
                    </RowItem>
                    <RowItem width={100}>
                      <Text>
                        {formatCurrencyAmount(
                          denomToUnit(
                            delegation.amount,
                            network.denominationSize,
                          ),
                        )}
                      </Text>
                    </RowItem>
                    <RowItem width={75}>
                      <Text>
                        {getPercentageFromTotal(
                          delegation.amount || "0",
                          data?.oasisAccountBalances?.staked.balance || "0",
                        )}
                        %
                      </Text>
                    </RowItem>
                    <RowItem width={75}>
                      <Button
                        style={{ borderRadius: "50%" }}
                        onClick={() => {
                          setDelegationValidatorSelection(
                            delegation.validator as any,
                          );

                          if (!ledger.connected) {
                            setSigninNetworkName(network.name);
                          }

                          openLedgerDialog({
                            signinType: "LEDGER",
                            ledgerAccessType: "PERFORM_ACTION",
                            ledgerActionType: "DELEGATE",
                          });
                        }}
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
    </PageContainer>
  );
};

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  ledger: Modules.selectors.ledger.ledgerSelector(state),
  network: Modules.selectors.ledger.networkSelector(state),
  address: Modules.selectors.ledger.addressSelector(state),
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

export const OasisValidators = composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withValidators,
  withStakingPool,
  withFiatPriceData,
  withCosmosAccountBalances,
  withRewardsByValidatorQuery,
)(OasisValidatorsListPage);
