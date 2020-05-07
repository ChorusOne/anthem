import { ITransaction } from "@anthem/utils";
import { H5 } from "@blueprintjs/core";
import { Centered } from "components/SharedComponents";
import Toast from "components/Toast";
import React from "react";
import {
  formatAddressString,
  getFiatPriceHistoryMap,
  getPriceFromTransactionTimestamp,
  getValidatorNameFromAddress,
  getValidatorOperatorAddressMap,
  PriceHistoryMap,
  ValidatorOperatorAddressMap,
} from "tools/client-utils";
import { atomsToDenom, convertCryptoToFiat } from "tools/currency-utils";
import { TransactionListProps } from "./CosmosTransactionContainer";
import TransactionListItem from "./CosmosTransactionListItem";
import { TransactionPaginationControls } from "./TransactionComponents";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class CosmosTransactionList extends React.PureComponent<IProps> {
  priceHistoryMap: PriceHistoryMap = {};
  validatorOperatorAddressMap: ValidatorOperatorAddressMap = {};

  constructor(props: IProps) {
    super(props);

    const priceHistoryMap = getFiatPriceHistoryMap(
      props.fiatPriceHistory.fiatPriceHistory,
    );

    const validatorOperatorAddressMap = getValidatorOperatorAddressMap(
      props.validators.validators,
    );

    this.priceHistoryMap = priceHistoryMap;
    this.validatorOperatorAddressMap = validatorOperatorAddressMap;
  }

  componentDidUpdate() {
    if (this.props.extraLiveTransactions.length > 0) {
      // Handle possibly removing any local copies of transactions
      this.findAndRemoveLocalTransactionCopies(
        this.props.transactions,
        this.props.extraLiveTransactions,
      );
    }
  }

  render(): JSX.Element {
    const {
      isDetailView,
      transactions,
      transactionsPage,
      moreResultsExist,
      extraLiveTransactions,
    } = this.props;

    // Get the combined list of transactions to render:
    const txs = this.combineTransactionRecords(
      transactions,
      extraLiveTransactions,
    );
    const TXS_EXIST = txs && txs.length > 0;

    return (
      <React.Fragment>
        {TXS_EXIST ? (
          txs.map(this.renderTransactionItem)
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
          />
        )}
      </React.Fragment>
    );
  }

  /**
   * Filter the local transactions data every time this component updates
   * and dispatch actions to remove any local copies of transactions which
   * exist in the GraphQL transactions list.
   *
   * This is part of the logic to preemptively show transactions after a user
   * submits a Ledger transaction before the extractor has persisted the
   * transaction in our database.
   */
  findAndRemoveLocalTransactionCopies = (
    transactions: readonly ITransaction[],
    localTransactions: ITransaction[],
  ) => {
    const hashSet = new Set(transactions.map(tx => tx.hash));
    for (const tx of localTransactions) {
      if (hashSet.has(tx.hash)) {
        this.props.removeLocalCopyOfTransaction({ hash: tx.hash });
      }
    }
  };

  /**
   * Combine the GraphQL transactions list with the list of local transactions,
   * excluding any transactions which exist locally and also exist in the
   * GraphQL data.
   *
   * This is part of the logic to preemptively show transactions after a user
   * submits a Ledger transaction before the extractor has persisted the
   * transaction in our database.
   */
  combineTransactionRecords = (
    transactions: readonly ITransaction[],
    localTransactions: ITransaction[],
  ) => {
    const hashSet = new Set(transactions.map(tx => tx.hash));
    const localUniqueTransactions = localTransactions.filter(
      tx => !hashSet.has(tx.hash),
    );
    return localUniqueTransactions.concat(transactions);
  };

  pageBack = () => {
    this.props.setTransactionsPage(this.props.transactionsPage - 1);
  };

  pageForward = () => {
    this.props.setTransactionsPage(this.props.transactionsPage + 1);
  };

  renderTransactionItem = (transaction: ITransaction) => {
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
        addressOrValidator={this.addressOrValidator}
        getFiatPriceForTransaction={this.getFiatPriceForTransaction}
        validatorOperatorAddressMap={this.validatorOperatorAddressMap}
      />
    );
  };

  getFiatPriceForTransaction = (timestamp: string, amount: string): string => {
    const transactionPrice = getPriceFromTransactionTimestamp(
      timestamp,
      this.priceHistoryMap,
    );

    const fiatPrice = convertCryptoToFiat(
      {
        price: Number(transactionPrice),
      },
      atomsToDenom(amount),
    );

    return fiatPrice;
  };

  addressOrValidator = (address: string) => {
    const { network } = this.props.ledger;
    const validator = getValidatorNameFromAddress(
      this.validatorOperatorAddressMap,
      address,
      network.name,
    );

    if (!validator) {
      return formatAddressString(address, true);
    } else {
      return validator.description.moniker;
    }
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
  extraLiveTransactions: ITransaction[];
  moreResultsExist?: boolean;
  transactions: ReadonlyArray<ITransaction>;
}

type IProps = ComponentProps;

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default CosmosTransactionList;
