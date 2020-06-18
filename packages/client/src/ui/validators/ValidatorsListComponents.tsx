import { Card, Colors, Icon } from "@blueprintjs/core";
import { COLORS } from "constants/colors";
import React from "react";
import styled from "styled-components";
import { IThemeProps } from "ui/containers/ThemeContainer";

/** ===========================================================================
 * Validators List Components
 * ============================================================================
 */

export const ValidatorListCard = styled(Card)`
  padding: 8px;
  width: ${(props: { theme: IThemeProps }) =>
    props.theme.isDesktop ? "550px" : "auto"};
`;

export const ValidatorRowBase = styled.div`
  padding: 6px;
  display: flex;
  align-items: center;
  flex-direction: row;
`;

export const StakingRow = styled(ValidatorRowBase)`
  height: 70px;
`;

export const StakingRowSummary = styled(StakingRow)`
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.GRAY1 : Colors.GRAY5};
`;

export const ValidatorRowExpandable = styled(ValidatorRowBase)`
  height: 70px;

  &:hover {
    cursor: pointer;
  }
`;

export const ValidatorDetailRow = styled(ValidatorRowBase)`
  height: 35px;
  margin-top: 2px;
  margin-bottom: 2px;
`;

export const ValidatorDetails = styled.div`
  padding-top: 4px;
  padding-bottom: 4px;
  background: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.DARK_GRAY3 : Colors.LIGHT_GRAY3};
`;

export const RowItem = styled.div<{ width?: number }>`
  padding-left: 4px;
  padding-right: 4px;
  width: ${props => (props.width ? `${props.width}px` : "auto")};
`;

export const RowItemHeader = styled(RowItem)`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;

  &:hover {
    cursor: pointer;

    h5 {
      color: ${COLORS.LIGHT_GRAY};
    }
  }
`;

export const Text = styled.p`
  margin: 0;
  text-align: left;
`;

export const SortFilterIcon = ({
  active,
  ascending,
}: {
  active: boolean;
  ascending: boolean;
}) => {
  return active ? (
    <Icon color={COLORS.PRIMARY} icon={ascending ? "caret-up" : "caret-down"} />
  ) : null;
};
