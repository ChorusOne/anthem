import * as Sentry from "@sentry/browser";
import { CosmosTransactionsProps } from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import moment from "moment-timezone";
import React from "react";
import { connect } from "react-redux";
import { capitalizeString } from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import { PanelMessageText } from "ui/SharedComponents";
import CeloPortfolio from "./CeloPortfolio";
import OasisPortfolio from "./OasisPortfolio";

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

class PortfolioSwitchContainer extends React.Component<IProps, IState> {
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

    if (!network.supportsPortfolio) {
      return (
        <PanelMessageText>
          <b>{network.name}</b> portfolio history is not supported yet.
        </PanelMessageText>
      );
    }

    switch (network.name) {
      case "TERRA":
      case "COSMOS":
        return null;
      case "OASIS":
        return (
          <OasisPortfolio
            fullSize={this.props.fullSize}
            downloadDataToFile={this.downloadDataToFile}
          />
        );
      case "CELO":
        return (
          <CeloPortfolio
            fullSize={this.props.fullSize}
            downloadDataToFile={this.downloadDataToFile}
          />
        );
      case "POLKADOT":
      default:
        return null;
    }
  }

  downloadDataToFile = (CSV: string) => {
    // Create the file name
    const dateStringPrefix = moment(Date.now()).format("MM-DD-YYYY");
    const { network } = this.props.ledger;
    const fileName = `${network.name}-account-history-${dateStringPrefix}.csv`;

    try {
      const hiddenElement = document.createElement("a");

      hiddenElement.href = `data:text/csv;charset=utf-8,${encodeURI(CSV)}`;
      hiddenElement.target = "_blank";
      hiddenElement.download = fileName;

      const div = document.getElementById("csv-download-container");

      if (div) {
        div.appendChild(hiddenElement);
        hiddenElement.click();
        hiddenElement.remove();
      } else {
        throw new Error("CSV div container could not be found");
      }
    } catch (err) {
      throw err;
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
});

const withProps = connect(mapStateToProps);

interface ComponentProps {
  fullSize: boolean;
}

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
  PortfolioSwitchContainer,
);
