import { COLORS } from "constants/colors";
import { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { composeWithProps } from "tools/context-utils";

/** ===========================================================================
 * Beta Banner
 * ============================================================================
 */

const BetaBanner = ({ mobile }: IProps) => (
  <Relative>
    <BannerPosition mobile={mobile}>
      <AnthemText>Anthem</AnthemText>
      <Banner className="beta-banner">
        <BannerText>beta</BannerText>
      </Banner>
    </BannerPosition>
  </Relative>
);

/** ===========================================================================
 * Styles
 * ============================================================================
 */

const Relative = styled.div`
  position: relative;
`;

const BannerPosition = styled.div<{ mobile: boolean }>`
  z-index: 100;
  position: absolute;
  top: ${({ mobile }) => (mobile ? 12 : 52)}px;
  left: ${({ mobile }) => (mobile ? 190 : 62)}px;
  height: 20px;
  padding: 2px;
  padding-left: 4px;
  padding-right: 4px;
  display: flex;
  align-items: center;
`;

const Banner = styled.div`
  padding: 1px;
  padding-left: 3px;
  padding-right: 3px;
  border-radius: 2px;
  background: ${COLORS.WARNING};
`;

const AnthemText = styled.p`
  margin: 0;
  margin-right: 4px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: ${COLORS.WHITE};
`;

const BannerText = styled.p`
  margin: 0;
  font-size: 12px;
  color: black;
  font-weight: bold;
  text-align: center;
`;

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
});

type ConnectProps = ReturnType<typeof mapStateToProps>;

const withProps = connect(mapStateToProps);

interface ComponentProps {
  mobile: boolean;
}

interface IProps extends ComponentProps, ConnectProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withProps)(BetaBanner);
