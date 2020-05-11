import { Button, Colors } from "@blueprintjs/core";
import { COLORS } from "constants/colors";
import { IThemeProps } from "containers/ThemeContainer";
import React from "react";
import styled from "styled-components";

/** ===========================================================================
 * Transaction Components
 * ----------------------------------------------------------------------------
 * Shared components for rendering transactions from different networks.
 * ============================================================================
 */

interface TransactionPaginationControlsProps {
  page: number;
  moreResultsExist: boolean;
  back: () => void;
  forward: () => void;
}

export const TransactionPaginationControls = (
  props: TransactionPaginationControlsProps,
) => {
  const { page, moreResultsExist, back, forward } = props;
  return (
    <PaginationBar>
      {page > 1 && (
        <Button rightIcon="caret-left" onClick={back}>
          Prev
        </Button>
      )}
      {moreResultsExist ? (
        <PaginationText>Page {page}</PaginationText>
      ) : page > 1 ? (
        <PaginationText>Page {page}</PaginationText>
      ) : (
        <AllResultsText>- All Results Displayed -</AllResultsText>
      )}
      {moreResultsExist && (
        <Button icon="caret-right" onClick={forward}>
          Next
        </Button>
      )}
    </PaginationBar>
  );
};

const PaginationBar = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const PaginationText = styled.p`
  font-size: 14px;
  margin: 0px;
  margin-left: 8px;
  margin-right: 8px;
`;

const AllResultsText = styled.p`
  font-size: 12px;
  margin: 0px;
`;

/** ===========================================================================
 * Transaction List Item Components
 * ============================================================================
 */

export const TransactionCardStyles = {
  padding: 0,
  borderRadius: 0,
  marginBottom: 14,
};

export const EventRow = styled.div`
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  align-items: center;
  height: ${(props: { theme: IThemeProps }) =>
    props.theme.isDesktop ? 70 : "auto"};
  flex-direction: ${(props: { theme: IThemeProps }) =>
    props.theme.isDesktop ? "row" : "column"};
`;

export const EventRowItem = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 15px;
  min-width: 230px;
  padding-left: ${(props: { theme: IThemeProps }) =>
    props.theme.isDesktop ? 15 : 0};
  padding-right: ${(props: { theme: IThemeProps }) =>
    props.theme.isDesktop ? 15 : 0};
  width: ${(props: { theme: IThemeProps }) =>
    props.theme.isDesktop ? "auto" : "100%"};
`;

export const ClickableEventRow = styled(EventRowItem)`
  &:hover {
    cursor: pointer;
    background: ${(props: { theme: IThemeProps }) => {
      return props.theme.isDarkTheme ? Colors.DARK_GRAY2 : Colors.LIGHT_GRAY3;
    }};
  }
`;

export const EventRowBottom = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 70px;
  padding-left: 16px;
  padding-right: 16px;

  background: ${(props: { theme: IThemeProps }) => {
    return props.theme.isDarkTheme ? Colors.DARK_GRAY3 : Colors.LIGHT_GRAY4;
  }};
`;

export const TransactionFailedStatusBar = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 25px;
  padding-left: 16px;
  padding-right: 16px;
  background: ${COLORS.ERROR};
`;

export const EventText = styled.p`
  margin: 0;
  padding: 0;

  color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? COLORS.LIGHT_TEXT : COLORS.DARK_TEXT};
`;

export const EventDescriptionText = styled(EventText)`
  width: 1000px;
  min-width: 900px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const TransactionLinkText = styled.p`
  margin: 0;

  color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? COLORS.LIGHT_TEXT : COLORS.DARK_TEXT};

  &:hover {
    cursor: pointer;
  }
`;

export const EventIconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  min-width: 32px;
  height: 32px;

  &:hover {
    cursor: ${(props: { interactive?: boolean }) => {
      return props.interactive ? "pointer" : "auto";
    }};
  }
`;

export const EventIcon = styled.img`
  width: 32px;

  &:hover {
    cursor: pointer;
  }
`;

export const EventContextBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
