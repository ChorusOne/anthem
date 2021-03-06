import { ICeloTransaction } from "@anthem/utils";
import { H6 } from "@blueprintjs/core";
import React from "react";
import { Centered } from "ui/SharedComponents";
import Toast from "ui/Toast";
import { CeloTransactionListProps } from "./CeloTransactionContainer";
import CeloTransactionListItem from "./CeloTransactionListItem";
import { TransactionPaginationControls } from "./TransactionComponents";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class CeloTransactionList extends React.PureComponent<IProps> {
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
            <H6>No transaction history exists yet.</H6>
          </Centered>
        )}
        {!isDetailView && TXS_EXIST && (
          <TransactionPaginationControls
            back={this.pageBack}
            forward={this.pageForward}
            page={transactionsPage}
            moreResultsExist={!!moreResultsExist}
            firstTxDate={Number(transactions[0].timestamp) * 1000}
            lastTxDate={
              Number(transactions[transactions.length - 1].timestamp) * 1000
            }
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

interface ComponentProps extends CeloTransactionListProps {
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
