import { assertUnreachable } from "@anthem/utils";
import { COLORS } from "constants/colors";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
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
    if (!this.props.address) {
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
            <b>BETA:</b> Anthem provides data for the Cosmos network but is
            currently in a beta release. You may experience data integrity
            issues.{" "}
            <Link
              to="/help"
              onClick={this.props.displayDataIntegrityHelpLabel}
              style={{ color: COLORS.WHITE, textDecoration: "underline" }}
            >
              Learn More.
            </Link>
          </BannerText>
        );
      case "TERRA":
        return (
          <BannerText>
            Terra Network in Anthem currently only supports balances and Ledger
            transaction workflows.
          </BannerText>
        );
      case "KAVA":
        return (
          <BannerText>
            Kava Network in Anthem currently only supports balances and Ledger
            transaction workflows.
          </BannerText>
        );
      case "OASIS":
      case "CELO":
        return (
          <BannerText>
            <b>{name}</b> Network is still in development.
          </BannerText>
        );
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
