import * as Sentry from "@sentry/browser";
import {
  CosmosTransactionsProps,
  FiatPriceHistoryProps,
  ValidatorsProps,
} from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import moment from "moment-timezone";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { composeWithProps } from "tools/context-utils";
import { PanelMessageText } from "ui/SharedComponents";
import CeloPortfolio from "./CeloPortfolio";
import CosmosPortfolio from "./CosmosPortfolio";
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
    if (this.state.hasError) {
      return (
        <PanelMessageText>
          {this.props.i18n.tString("Error fetching data...")}
        </PanelMessageText>
      );
    }

    const { network } = this.props.ledger;

    if (!network.supportsPortfolio) {
      return (
        <PanelMessageText>
          <b>{network.name}</b> portfolio history is not supported yet.
        </PanelMessageText>
      );
    }

    switch (network.name) {
      case "COSMOS":
        return (
          <CosmosPortfolio
            fullSize={this.props.fullSize}
            downloadDataToFile={this.downloadDataToFile}
          />
        );
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
      default:
        return null;
    }
  }

  downloadDataToFile = (CSV: string) => {
    // Create the file name
    const dateStringPrefix = moment(Date.now()).format("MM-DD-YYYY");
    const fileName = `anthem-cosmos-data-${dateStringPrefix}.csv`;

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

export type TransactionListProps = ConnectProps &
  FiatPriceHistoryProps &
  ValidatorsProps &
  RouteComponentProps;

interface IProps
  extends TransactionListProps,
    CosmosTransactionsProps,
    ComponentProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withProps)(
  PortfolioSwitchContainer,
);
