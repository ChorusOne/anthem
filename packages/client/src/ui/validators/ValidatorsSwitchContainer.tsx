import * as Sentry from "@sentry/browser";
import { CosmosTransactionsProps } from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import { capitalizeString } from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import PolkadotPage from "ui/pages/PolkadotPage";
import { PanelMessageText } from "ui/SharedComponents";
import CosmosValidators from "ui/validators/CosmosValidators";
import { OasisValidators } from "ui/validators/OasisValidators";
import CeloValidators from "./CeloValidators";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IState {
  hasError: boolean;
}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class ValidatorsSwitchContainer extends React.Component<IProps, IState> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  constructor(props: IProps) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error: Error) {
    // Log the error to Sentry.
    Sentry.captureException(error);
  }

  componentDidUpdate(prevProps: IProps) {
    if (
      this.state.hasError &&
      this.props.ledger.network.name !== prevProps.ledger.network.name
    ) {
      this.setState({ hasError: false });
    }
  }

  render(): Nullable<JSX.Element> {
    const { network } = this.props.ledger;
    if (this.state.hasError) {
      const name = capitalizeString(network.name);
      return (
        <PanelMessageText>
          Oops! We are having trouble fetching {name} data at the moment. Our
          engineers have been notified and this will be fixed shortly.
        </PanelMessageText>
      );
    }

    if (!network.supportsValidatorsList) {
      return (
        <PanelMessageText>
          Staking is not supported yet for <b>{network.name}</b>.
        </PanelMessageText>
      );
    }

    switch (network.name) {
      case "TERRA":
      case "COSMOS":
        return <CosmosValidators />;
      case "OASIS":
        return <OasisValidators />;
      case "CELO":
        return <CeloValidators />;
      case "POLKADOT":
        return <PolkadotPage />;
      default:
        return null;
    }
  }
}

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  ledger: Modules.selectors.ledger.ledgerSelector(state),
});

const withProps = connect(mapStateToProps);

interface ComponentProps {}

type ConnectProps = ReturnType<typeof mapStateToProps>;

interface IProps
  extends ConnectProps,
    CosmosTransactionsProps,
    ComponentProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withProps)(
  ValidatorsSwitchContainer,
);
