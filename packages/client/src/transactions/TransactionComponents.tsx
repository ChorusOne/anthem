import { Button } from "@blueprintjs/core";
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
