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

  border-radius: ${(props: { highlight: boolean }) =>
    props.highlight ? 8 : 0}px;

  border: ${(props: { highlight: boolean; theme: IThemeProps }) => {
    const color = props.theme.isDarkTheme ? COLORS.CHORUS_MINT : COLORS.CELO;
    return props.highlight ? `1px solid ${color}` : "none";
  }};

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

export const ValidatorCapacityCircle = styled.div`
  border-radius: 50%;
  width: 16px;
  height: 16px;
  margin-left: 26px;
  background: ${({ capacity }: { capacity: number }) => {
    // Render a color based on the percent capacity:
    return capacity > 99
      ? COLORS.ERROR
      : capacity > 95
      ? "orange"
      : capacity > 90
      ? COLORS.WARNING
      : COLORS.CHORUS_MINT;
  }};
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
