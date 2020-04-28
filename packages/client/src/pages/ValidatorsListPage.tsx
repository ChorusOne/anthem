import { IQuery } from "@anthem/utils";
import { GraphQLGuardComponent } from "components/GraphQLGuardComponents";
import {
  Line,
  PageContainer,
  PageTitle,
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
import { composeWithProps } from "tools/context-utils";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class ValidatorsListPage extends React.Component<IProps, {}> {
  render(): JSX.Element {
    const { validators, i18n } = this.props;
    return (
      <PageContainer>
        <PageTitle data-cy="validators-page-title">Validators</PageTitle>
        <Line style={{ marginBottom: 12 }} />
        <GraphQLGuardComponent
          dataKey="validators"
          result={validators}
          tString={i18n.tString}
        >
          {(validatorList: IQuery["validators"]) => {
            return (
              <View>
                {validatorList.map(v => (
                  <p>
                    <b>{v.description.moniker}</b> | {v.operator_address}
                  </p>
                ))}
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

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
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
