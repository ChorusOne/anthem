import { IQuery } from "@anthem/utils";
import { NetworkLogoIcon } from "assets/images";
import {
  DailyPercentChangeProps,
  FiatPriceDataProps,
  withDailyPercentChange,
  withFiatPriceData,
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
import AddressInput from "ui/AddressInput";
import { PercentChangeText, View } from "ui/SharedComponents";
import { GraphQLGuardComponent } from "./GraphQLGuardComponents";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class AddressInputDashboardBar extends React.Component<IProps, {}> {
  componentWillUnmount() {
    // Remove the ref when the component unmounts
    this.props.assignInputRef(null);
  }

  render(): Nullable<JSX.Element> {
    if (!this.props.settings.isDesktop) {
      return null;
    }

    const { i18n, address, network, prices, dailyPercentChange } = this.props;
    const { tString } = i18n;

    return (
      <AddressInputBar>
        {!!address && (
          <>
            <GraphQLGuardComponent
              tString={tString}
              dataKey="prices"
              errorComponent={
                <Row style={{ width: 110 }}>
                  <NetworkLogoIcon network={network.name} />
                  <NetworkBar>
                    <b style={{ margin: 0, fontSize: 14 }}>{network.name}</b>
                    <p style={{ margin: 0 }}>Network</p>
                  </NetworkBar>
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
                    <NetworkBar>
                      <p style={{ margin: 0, fontSize: 14 }}>
                        {network.descriptor} {tString("Price")}
                      </p>
                      <b>
                        {fiatPrice} {this.props.settings.fiatCurrency.symbol}
                      </b>
                    </NetworkBar>
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
                      <PercentChangeText value={percentageChange} />
                    </View>
                  </Row>
                );
              }}
            </GraphQLGuardComponent>
          </>
        )}
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

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const NetworkBar = styled.div`
  text-align: center;
  margin-left: 6px;
  margin-right: 20px;
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
  address: Modules.selectors.ledger.addressSelector(state),
});

const dispatchProps = {
  assignInputRef: Modules.actions.app.setAddressInputRef,
  setAddressInputState: Modules.actions.app.setDashboardAddressInputFocusState,
};

const withProps = connect(mapStateToProps, dispatchProps);

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

interface ComponentProps {}

interface IProps
  extends ComponentProps,
    ConnectProps,
    FiatPriceDataProps,
    DailyPercentChangeProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withRouter,
  withFiatPriceData,
  withDailyPercentChange,
)(AddressInputDashboardBar);
