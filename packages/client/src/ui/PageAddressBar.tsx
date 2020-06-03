import { Colors, H3, Icon } from "@blueprintjs/core";
import { COLORS } from "constants/colors";
import React from "react";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { composeWithProps } from "tools/context-utils";
import { IThemeProps } from "ui/containers/ThemeContainer";
import { Row } from "ui/SharedComponents";
import AddressInputDashboardBar from "./AddressInputDashboardBar";

/** ===========================================================================
 * PageAddressBar
 * ----------------------------------------------------------------------------
 * - Header bar for a page which renders the page title, the network
 * price info, and the address search bar.
 * ============================================================================
 */

class PageAddressBar extends React.PureComponent<IProps> {
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
        <AddressInputDashboardBar />
      </PageTopBar>
    );
  }
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

interface ComponentProps {
  pageTitle: string;
  renderBackSquare?: boolean;
}

interface IProps extends RouteComponentProps, ComponentProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withRouter)(PageAddressBar);
