import { IOasisTransaction, ITransaction } from "@anthem/utils";
import { Button, H5 } from "@blueprintjs/core";
import { Centered } from "components/SharedComponents";
import Toast from "components/Toast";
import React from "react";
import styled from "styled-components";
import { TransactionListProps } from "./CosmosTransactionContainer";
import TransactionListItem from "./CosmosTransactionListItem";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class OasisTransactionList extends React.PureComponent<IProps> {
  render(): JSX.Element {
    const {
      isDetailView,
      transactions,
      transactionsPage,
      moreResultsExist,
    } = this.props;

    const TXS_EXIST = transactions.length > 0;

    return (
      <React.Fragment>
        {TXS_EXIST ? (
          transactions.map(this.renderTransactionItem)
        ) : (
          <Centered>
            <H5>No transactions exist</H5>
          </Centered>
        )}
        {!isDetailView && TXS_EXIST && (
          <PaginationBar>
            {transactionsPage > 1 && (
              <Button rightIcon="caret-left" onClick={this.pageBack}>
                Prev
              </Button>
            )}
            {moreResultsExist ? (
              <PaginationText>Page {transactionsPage}</PaginationText>
            ) : transactionsPage > 1 ? (
              <PaginationText>Page {transactionsPage}</PaginationText>
            ) : (
              <AllResultsText>- All Results Displayed -</AllResultsText>
            )}
            {moreResultsExist && (
              <Button icon="caret-right" onClick={this.pageForward}>
                Next
              </Button>
            )}
          </PaginationBar>
        )}
      </React.Fragment>
    );
  }

  pageBack = () => {
    this.props.setTransactionsPage(this.props.transactionsPage - 1);
  };

  pageForward = () => {
    this.props.setTransactionsPage(this.props.transactionsPage + 1);
  };

  renderTransactionItem = (transaction: IOasisTransaction) => {
    const { ledger, settings, i18n, isDetailView, setAddress } = this.props;
    const { network, address } = ledger;
    const { t, tString, locale } = i18n;
    const { isDesktop, fiatCurrency } = settings;
    return (
      <TransactionListItem
        t={t}
        locale={locale}
        tString={tString}
        address={address}
        network={network}
        isDesktop={isDesktop}
        key={transaction.hash}
        setAddress={setAddress}
        transaction={transaction}
        fiatCurrency={fiatCurrency}
        isDetailView={isDetailView}
        onCopySuccess={this.onCopySuccess}
      />
    );
  };

  onCopySuccess = (address: string) => {
    Toast.success(
      this.props.i18n.tString("Address {{address}} copied to clipboard", {
        address,
      }),
    );
  };
}

/** ===========================================================================
 * Styles
 * ============================================================================
 */

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

/** ===========================================================================
 * Props
 * ============================================================================
 */

interface ComponentProps extends TransactionListProps {
  isDetailView?: boolean;
  moreResultsExist?: boolean;
  transactions: IOasisTransaction[];
}

type IProps = ComponentProps;

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default OasisTransactionList;
