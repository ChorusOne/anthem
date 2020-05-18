import { IQuery } from "@anthem/utils";
import { Card, H5, Icon } from "@blueprintjs/core";
import { NetworkLogoIcon } from "assets/images";
import AddressIconComponent from "components/AddressIconComponent";
import { GraphQLGuardComponentMultipleQueries } from "components/GraphQLGuardComponents";
import PageAddressBar from "components/PageAddressBar";
import {
  DashboardLoader,
  PageContainer,
  PageScrollableContent,
  View,
} from "components/SharedComponents";
import { COLORS } from "constants/colors";
import { IThemeProps } from "containers/ThemeContainer";
import {
  StakingPoolProps,
  ValidatorsProps,
  withGraphQLVariables,
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
  defaultSortValidatorsList,
  formatCommissionRate,
  formatVotingPower,
  getValidatorOperatorAddressMap,
  sortValidatorsList,
} from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class ValidatorsListPage extends React.Component<IProps, {}> {
  render(): JSX.Element {
    const {
      i18n,
      network,
      validators,
      stakingPool,
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
        <PageAddressBar pageTitle="Validators" />
        <GraphQLGuardComponentMultipleQueries
          loadingComponent={<DashboardLoader style={{ marginTop: 150 }} />}
          tString={i18n.tString}
          results={[
            [validators, "validators"],
            [stakingPool, "stakingPool"],
          ]}
        >
          {([validatorList, stakingPoolResponse]: [
            IQuery["validators"],
            IQuery["stakingPool"],
          ]) => {
            const stake = stakingPoolResponse.bonded_tokens || "";
            const validatorOperatorAddressMap = getValidatorOperatorAddressMap(
              validatorList,
            );
            const list = sortValidatorsList(
              validatorList,
              validatorSortField,
              sortListAscending,
              stake,
            );
            return (
              <View>
                <ValidatorRow style={{ paddingLeft: 14 }}>
                  <RowItem width={45}>
                    <NetworkLogoIcon network={network.name} />
                  </RowItem>
                  <RowItemHeader
                    width={200}
                    onClick={this.setSortFilter(
                      VALIDATORS_LIST_SORT_FILTER.NAME,
                    )}
                  >
                    <H5 style={{ margin: 0 }}>Validator</H5>
                    <SortFilterIcon
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
                      active={
                        validatorSortField ===
                        VALIDATORS_LIST_SORT_FILTER.COMMISSION
                      }
                    />
                  </RowItemHeader>
                </ValidatorRow>
                <ValidatorListCard style={{ padding: 8 }}>
                  <PageScrollableContent>
                    {list.map(v => (
                      <ValidatorRow key={v.operator_address}>
                        <RowItem width={45}>
                          <AddressIconComponent
                            networkName={network.name}
                            address={v.operator_address}
                            validatorOperatorAddressMap={
                              validatorOperatorAddressMap
                            }
                          />
                        </RowItem>
                        <RowItem width={200}>
                          <H5 style={{ margin: 0 }}>{v.description.moniker}</H5>
                        </RowItem>
                        <RowItem width={150}>
                          <b style={{ margin: 0 }}>
                            {formatVotingPower(v.tokens, stake)}%
                          </b>
                        </RowItem>
                        <RowItem width={150}>
                          <b style={{ margin: 0 }}>
                            {formatCommissionRate(
                              v.commission.commission_rates.rate,
                            )}
                            %
                          </b>
                        </RowItem>
                      </ValidatorRow>
                    ))}
                  </PageScrollableContent>
                </ValidatorListCard>
              </View>
            );
          }}
        </GraphQLGuardComponentMultipleQueries>
      </PageContainer>
    );
  }

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
    props.theme.isDesktop ? "600px" : "auto"};
`;

const ValidatorRow = styled.div`
  height: 70px;
  padding: 6px;
  display: flex;
  align-items: center;
  flex-direction: row;
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

const SortFilterIcon = ({ active }: { active: boolean }) =>
  active ? <Icon color={COLORS.PRIMARY} icon="caret-down" /> : null;

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  network: Modules.selectors.ledger.networkSelector(state),
  sortListAscending: Modules.selectors.app.appSelector(state)
    .sortValidatorsListAscending,
  validatorSortField: Modules.selectors.app.appSelector(state)
    .validatorsListSortFilter,
});

const dispatchProps = {
  setLocale: Modules.actions.settings.setLocale,
  setValidatorListSortType: Modules.actions.app.setValidatorListSortType,
};

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

const withProps = connect(mapStateToProps, dispatchProps);

interface ComponentProps {}

interface IProps
  extends ComponentProps,
    ValidatorsProps,
    StakingPoolProps,
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
)(ValidatorsListPage);
