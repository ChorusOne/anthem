import { IQuery } from "@anthem/utils";
import { Card, H5 } from "@blueprintjs/core";
import AddressIconComponent from "components/AddressIconComponent";
import { GraphQLGuardComponent } from "components/GraphQLGuardComponents";
import PageAddressBar from "components/PageAddressBar";
import {
  PageContainer,
  PageScrollableContent,
  View,
} from "components/SharedComponents";
import {
  ValidatorsProps,
  withGraphQLVariables,
  withValidators,
} from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  formatCommissionRate,
  formatVotingPower,
  getValidatorOperatorAddressMap,
} from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class ValidatorsListPage extends React.Component<IProps, {}> {
  render(): JSX.Element {
    const { i18n, network, validators } = this.props;
    const STAKED = "184117466747846";
    return (
      <PageContainer>
        <PageAddressBar pageTitle="Validators" />
        <GraphQLGuardComponent
          dataKey="validators"
          result={validators}
          tString={i18n.tString}
        >
          {(validatorList: IQuery["validators"]) => {
            console.log(validatorList);
            const validatorOperatorAddressMap = getValidatorOperatorAddressMap(
              validatorList,
            );
            return (
              <View>
                <ValidatorRow style={{ paddingLeft: 20 }}>
                  <RowItem width={40} />
                  <RowItem width={200}>
                    <H5>Validator</H5>
                  </RowItem>
                  <RowItem width={125}>
                    <H5>Voting Power</H5>
                  </RowItem>
                  <RowItem width={125}>
                    <H5>Commission</H5>
                  </RowItem>
                </ValidatorRow>
                <Card style={{ width: 600 }}>
                  <PageScrollableContent>
                    {validatorList.map(v => (
                      <ValidatorRow key={v.operator_address}>
                        <RowItem width={40}>
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
                        <RowItem width={125}>
                          <p style={{ margin: 0 }}>
                            {formatVotingPower(v.tokens, STAKED)}%
                          </p>
                        </RowItem>
                        <RowItem width={125}>
                          <p style={{ margin: 0 }}>
                            {formatCommissionRate(
                              v.commission.commission_rates.rate,
                            )}
                            %
                          </p>
                        </RowItem>
                      </ValidatorRow>
                    ))}
                  </PageScrollableContent>
                </Card>
              </View>
            );
          }}
        </GraphQLGuardComponent>
      </PageContainer>
    );
  }
}

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

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

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  network: Modules.selectors.ledger.networkSelector(state),
});

const dispatchProps = {
  setLocale: Modules.actions.settings.setLocale,
};

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

const withProps = connect(mapStateToProps, dispatchProps);

interface ComponentProps {}

interface IProps extends ComponentProps, ValidatorsProps, ConnectProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withValidators,
)(ValidatorsListPage);
