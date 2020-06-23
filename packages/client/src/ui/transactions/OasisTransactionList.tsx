import { IOasisTransaction } from "@anthem/utils";
import { H5 } from "@blueprintjs/core";
import React from "react";
import { Centered } from "ui/SharedComponents";
import Toast from "ui/Toast";
import { OasisTransactionListProps } from "./OasisTransactionContainer";
import OasisTransactionListItem from "./OasisTransactionListItem";
import { TransactionPaginationControls } from "./TransactionComponents";

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
          <TransactionPaginationControls
            back={this.pageBack}
            forward={this.pageForward}
            page={transactionsPage}
            moreResultsExist={!!moreResultsExist}
            firstTxDate={transactions[0].date}
            lastTxDate={transactions[transactions.length - 1].date}
          />
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

  renderTransactionItem = (transaction: IOasisTransaction, index: number) => {
    const { ledger, settings, i18n, isDetailView, setAddress } = this.props;
    const { network, address } = ledger;
    const { t, tString, locale } = i18n;
    const { isDesktop, fiatCurrency } = settings;
    return (
      <OasisTransactionListItem
        t={t}
        locale={locale}
        tString={tString}
        address={address}
        network={network}
        isDesktop={isDesktop}
        setAddress={setAddress}
        transaction={transaction}
        fiatCurrency={fiatCurrency}
        isDetailView={isDetailView}
        key={`${transaction.date}-${index}`}
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
 * Props
 * ============================================================================
 */

interface ComponentProps extends OasisTransactionListProps {
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
