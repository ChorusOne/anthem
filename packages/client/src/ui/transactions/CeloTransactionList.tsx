import { ICeloTransaction } from "@anthem/utils";
import { H5 } from "@blueprintjs/core";
import React from "react";
import { Centered } from "ui/SharedComponents";
import Toast from "ui/Toast";
import { TransactionListProps } from "./CeloTransactionContainer";
import CeloTransactionListItem from "./CeloTransactionListItem";
// import { TransactionPaginationControls } from "./TransactionComponents";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class CeloTransactionList extends React.PureComponent<IProps> {
  render(): JSX.Element {
    const {
      // isDetailView,
      transactions,
      // transactionsPage,
      // moreResultsExist,
    } = this.props;

    const TXS_EXIST = transactions.length > 0;

    console.log("CELO transaction:");
    console.log(transactions);

    return (
      <React.Fragment>
        {TXS_EXIST ? (
          // transactions.map(this.renderTransactionItem)
          <p style={{ marginLeft: 8 }}>
            Celo transaction history is in progress.
          </p>
        ) : (
          <Centered>
            <H5>No transactions exist</H5>
          </Centered>
        )}
        {/* {!isDetailView && TXS_EXIST && (
          <TransactionPaginationControls
            firstTxDate={transactions[0].date}
            lastTxDate={transactions[transactions.length - 1].date}
            back={this.pageBack}
            forward={this.pageForward}
            page={transactionsPage}
            moreResultsExist={!!moreResultsExist}
          />
        )} */}
      </React.Fragment>
    );
  }

  pageBack = () => {
    this.props.setTransactionsPage(this.props.transactionsPage - 1);
  };

  pageForward = () => {
    this.props.setTransactionsPage(this.props.transactionsPage + 1);
  };

  renderTransactionItem = (transaction: ICeloTransaction) => {
    const { ledger, settings, i18n, isDetailView, setAddress } = this.props;
    const { network, address } = ledger;
    const { t, tString, locale } = i18n;
    const { isDesktop, fiatCurrency } = settings;
    return (
      <CeloTransactionListItem
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
 * Props
 * ============================================================================
 */

interface ComponentProps extends TransactionListProps {
  isDetailView?: boolean;
  moreResultsExist?: boolean;
  transactions: ICeloTransaction[];
}

type IProps = ComponentProps;

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default CeloTransactionList;
