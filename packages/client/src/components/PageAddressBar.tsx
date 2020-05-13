import { Colors, H3, Icon } from "@blueprintjs/core";
import { Row } from "components/SharedComponents";
import { COLORS } from "constants/colors";
import { IThemeProps } from "containers/ThemeContainer";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { composeWithProps } from "tools/context-utils";
import AddressInputDashboardBar from "../components/AddressInputDashboardBar";

/** ===========================================================================
 * PageAddressBar
 * ----------------------------------------------------------------------------
 * - Header bar for a page which renders the page title, the network
 * price info, and the address search bar.
 * ============================================================================
 */

class PageAddressBar extends React.PureComponent<IProps> {
  addressInput: Nullable<HTMLInputElement> = null;

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  render() {
    const { pageTitle, renderBackSquare } = this.props;
    return (
      <PageTopBar>
        <Row style={{ marginTop: 12, marginBottom: 8 }}>
          {renderBackSquare && (
            <BackSquare onClick={this.props.history.goBack}>
              <Icon icon="chevron-left" />
            </BackSquare>
          )}
          <H3
            style={{ fontWeight: "bold", margin: 0 }}
            data-cy={`${pageTitle}-page-title`}
          >
            {pageTitle}
          </H3>
        </Row>
        <AddressInputDashboardBar assignInputRef={this.assignInputRef} />
      </PageTopBar>
    );
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (this.props.app.dashboardInputFocused) {
      return;
    }

    const { keyCode } = event;

    /* Keys: */
    const I = 73;

    if (keyCode === I) {
      /**
       * Focus the address input only if it is not focused, in which case
       * also prevent the default keypress behavior (to avoid typing i) in
       * the input field once the focus event occurs.
       */
      event.preventDefault();
      if (event.keyCode === I) {
        if (this.addressInput) {
          this.addressInput.focus();
        }
      }
    }
  };

  assignInputRef = (ref: HTMLInputElement) => {
    this.addressInput = ref;
  };
}

/** ===========================================================================
 * Styles
 * ============================================================================
 */

const PageTopBar = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 25px;
  margin-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${(props: { theme: IThemeProps }) => {
    return props.theme.isDarkTheme ? COLORS.ADDRESS_LINE : Colors.LIGHT_GRAY1;
  }};
`;

const BackSquare = styled.div`
  width: 32px;
  height: 32px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid none;

  :hover {
    cursor: pointer;
    border-width: 1px;
    border-style: solid;
    border-color: ${(props: { theme: IThemeProps }) => {
      return props.theme.isDarkTheme ? COLORS.ADDRESS_LINE : Colors.LIGHT_GRAY1;
    }};
  }
`;

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  app: Modules.selectors.app.appSelector(state),
});

const withProps = connect(mapStateToProps);

interface ComponentProps {
  pageTitle: string;
  renderBackSquare?: boolean;
}

type ConnectProps = ReturnType<typeof mapStateToProps>;

interface IProps extends ConnectProps, RouteComponentProps, ComponentProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withRouter,
  withProps,
)(PageAddressBar);
