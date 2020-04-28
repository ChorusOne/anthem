import { PageContainer, PageTitle } from "components/SharedComponents";
import { ValidatorsProps, withValidators } from "graphql/queries";
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
    console.log("Validators:");
    console.log(this.props.validators);
    return (
      <PageContainer>
        <PageTitle data-cy="validators-page-title">Validators</PageTitle>
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
  withValidators,
)(ValidatorsListPage);
