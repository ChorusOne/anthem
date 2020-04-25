import { IQuery } from "@anthem/utils";
import { NetworkLogoIcon } from "assets/images";
import AddressInput from "components/AddressInput";
import { View } from "components/SharedComponents";
import { COLORS } from "constants/colors";
import {
  AtomPriceDataProps,
  DailyPercentChangeProps,
  withAtomPriceData,
  withDailyPercentChange,
  withGraphQLVariables,
} from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { composeWithProps } from "tools/context-utils";
import { formatCurrencyAmount } from "tools/currency-utils";
import { isGreaterThan, isLessThan } from "tools/math-utils";
import { GraphQLGuardComponent } from "./GraphQLGuardComponents";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class AddressInputDashboardBar extends React.Component<IProps, {}> {
  render(): Nullable<JSX.Element> {
    if (!this.props.settings.isDesktop) {
      return null;
    }

    const { i18n, network, prices, dailyPercentChange } = this.props;
    const { tString } = i18n;

    return (
      <AddressInputBar>
        <GraphQLGuardComponent
          tString={tString}
          dataKey="prices"
          errorComponent={
            <Row style={{ width: 110 }}>
              <NetworkLogoIcon network={network.name} />
              <View style={{ textAlign: "center", marginRight: 20 }}>
                <b style={{ margin: 0, fontSize: 14 }}>{network.descriptor}</b>
                <p>Network</p>
              </View>
            </Row>
          }
          result={prices}
          loadingComponent={<p style={{ width: 135 }} />}
        >
          {(priceData: IQuery["prices"]) => {
            const { price } = priceData;
            const fiatPrice = formatCurrencyAmount(price, 2);
            return (
              <Row style={{ width: 140 }}>
                <NetworkLogoIcon network={network.name} />
                <View style={{ textAlign: "center", marginRight: 20 }}>
                  <p style={{ margin: 0, fontSize: 14 }}>
                    {network.descriptor} {tString("Price")}
                  </p>
                  <b>
                    {fiatPrice} {this.props.settings.fiatCurrency.symbol}
                  </b>
                </View>
              </Row>
            );
          }}
        </GraphQLGuardComponent>
        <GraphQLGuardComponent
          tString={tString}
          errorComponent={<p />}
          loadingComponent={<p style={{ width: 115 }} />}
          dataKey="dailyPercentChange"
          result={dailyPercentChange}
        >
          {(percentageChange: IQuery["dailyPercentChange"]) => {
            return (
              <Row style={{ width: 115 }}>
                <View style={{ textAlign: "center", marginRight: 20 }}>
                  <p style={{ margin: 0, fontSize: 14 }}>
                    {tString("Change")} (24h)
                  </p>
                  <b
                    style={{
                      color: getColorForPercentChange(percentageChange),
                    }}
                  >
                    {renderPercentChange(percentageChange)}
                  </b>
                </View>
              </Row>
            );
          }}
        </GraphQLGuardComponent>
        <AddressInput
          tString={tString}
          onBlur={this.onBlurInput}
          onFocus={this.onFocusInput}
          assignInputRef={this.props.assignInputRef}
          isDesktop={this.props.settings.isDesktop}
          inputWidth={window.innerWidth < 1300 ? 200 : 300}
        />
      </AddressInputBar>
    );
  }

  onFocusInput = () => {
    this.props.setAddressInputState(true);
  };

  onBlurInput = () => {
    this.props.setAddressInputState(false);
  };
}

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

const AddressInputBar = styled.div`
  margin-bottom: 10px;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const getColorForPercentChange = (percentChange: string) => {
  if (isGreaterThan(percentChange, 0)) {
    return COLORS.BRIGHT_GREEN;
  } else if (isLessThan(percentChange, 0)) {
    return COLORS.ERROR;
  } else {
    return undefined;
  }
};

const renderPercentChange = (percentChange: string) => {
  const sign = isGreaterThan(percentChange, 0) ? "+" : "";
  return `${sign}${percentChange}%`;
};

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  settings: Modules.selectors.settings(state),
  app: Modules.selectors.app.appSelector(state),
  network: Modules.selectors.ledger.networkSelector(state),
});

const dispatchProps = {
  setAddressInputState: Modules.actions.app.setDashboardAddressInputFocusState,
};

const withProps = connect(mapStateToProps, dispatchProps);

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

interface ComponentProps {
  assignInputRef: (ref: HTMLInputElement) => void;
}

interface IProps
  extends ComponentProps,
    ConnectProps,
    AtomPriceDataProps,
    DailyPercentChangeProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withRouter,
  withAtomPriceData,
  withDailyPercentChange,
)(AddressInputDashboardBar);
