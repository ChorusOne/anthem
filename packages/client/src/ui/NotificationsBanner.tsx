import { assertUnreachable } from "@anthem/utils";
import { COLORS } from "constants/colors";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { composeWithProps } from "tools/context-utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface ComponentProps {}

interface IProps extends ComponentProps {}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class NotificationsBanner extends React.Component<IProps> {
  render(): Nullable<JSX.Element> {
    const { network } = this.props;

    // Don't render on Staking Agent page
    if (network.name === "POLKADOT") {
      return null;
    }

    return (
      <Banner className="notifications-banner">
        {this.getBannerTextForNetwork()}
      </Banner>
    );
  }

  getBannerTextForNetwork = () => {
    const { network } = this.props;
    const { name } = network;

    switch (name) {
      case "COSMOS":
        return (
          <BannerText>
            <span role="img" aria-label="warning-emoji">
              ⚠️
            </span>{" "}
            After the cosmoshub-4 upgrade, Anthem unfortunately no longer
            supports Cosmos. Reach out if you have questions or if you want to
            help maintain historical data for the Cosmos Hub.
          </BannerText>
        );
      case "TERRA":
        return <BannerText>Terra is no longer supported. </BannerText>;
      case "KAVA":
        return (
          <BannerText>
            Kava Network in Anthem currently only supports balances and Ledger
            transaction workflows.
          </BannerText>
        );
      case "OASIS":
        return (
          <BannerText>
            <>
              <span role="img" aria-label="warning-emoji">
                🚧
              </span>{" "}
              Ledger transactions are live on <b>Oasis mainnet</b>. You may
              experience data integrity issues.
            </>
          </BannerText>
        );
      case "CELO":
        return (
          <BannerText>
            <span role="img" aria-label="warning-emoji">
              ⚠️
            </span>{" "}
            <b>{name} Network</b> is in beta.
          </BannerText>
        );
      case "POLKADOT":
        return null;
      default:
        return assertUnreachable(name);
    }
  };
}

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

const Banner = styled.div`
  z-index: 1;
  min-height: 24px;
  top: 0;
  left: 0;
  right: 0;
  position: fixed;
  padding: 0;
  padding-left: 265px;
  padding-right: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgb(33, 136, 147);
  background: linear-gradient(
    90deg,
    rgba(33, 136, 147, 1) 36%,
    rgba(30, 201, 165, 1) 80%
  );
`;

const BannerText = styled.p`
  margin: 0;
  padding: 0;
  font-weight: 300px;
  color: ${COLORS.WHITE};
`;

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  banner: Modules.selectors.app.appSelector(state),
  address: Modules.selectors.ledger.addressSelector(state),
  network: Modules.selectors.ledger.networkSelector(state),
});

const dispatchProps = {
  showMonthlySummaryTooltip: Modules.actions.app.showMonthlySummaryTooltip,
  displayDataIntegrityHelpLabel:
    Modules.actions.app.displayDataIntegrityHelpLabel,
};

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

const withProps = connect(mapStateToProps, dispatchProps);

interface ComponentProps {}

interface IProps extends ComponentProps, ConnectProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withProps)(NotificationsBanner);
