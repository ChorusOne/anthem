import { ICosmosTransaction, ICosmosValidator } from "@anthem/utils";
import { H5 } from "@blueprintjs/core";
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
import { convertCryptoToFiat, unitToDenom } from "tools/currency-utils";
import { Centered } from "ui/SharedComponents";
import Toast from "ui/Toast";
import { CosmosTransactionListProps } from "./CosmosTransactionContainer";
import TransactionListItem from "./CosmosTransactionListItem";
import { TransactionPaginationControls } from "./TransactionComponents";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class CosmosTransactionList extends React.PureComponent<IProps> {
  priceHistoryMap: PriceHistoryMap = {};
  validatorOperatorAddressMap: ValidatorOperatorAddressMap<
    ICosmosValidator
  > = new Map();

  constructor(props: IProps) {
    super(props);

    const priceHistoryMap = getFiatPriceHistoryMap(
      props.fiatPriceHistory.fiatPriceHistory,
    );

    const addressMap = getValidatorOperatorAddressMap<ICosmosValidator>(
      props.cosmosValidators.cosmosValidators,
      v => v.operator_address.toUpperCase(),
    );

    this.priceHistoryMap = priceHistoryMap;
    this.validatorOperatorAddressMap = addressMap;
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

  render(): Nullable<JSX.Element> {
    const {
      isDetailView,
      transactions,
      transactionsPage,
      moreResultsExist,
      // extraLiveTransactions,
    } = this.props;

    /**
     * NOTE: Disabling the live transaction update workaround for now.
     * The transactions data model needs to be updated to work with
     *  Cosmos Hub 3 transactions - then this can be re-enabled.
     */
    // Get the combined list of transactions to render:
    // const txs = this.combineTransactionRecords(
    //   transactions,
    //   extraLiveTransactions,
    // );
    const txs = transactions;
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
            firstTxDate={Number(txs[0].timestamp)}
            lastTxDate={Number(txs[txs.length - 1].timestamp)}
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
    transactions: readonly ICosmosTransaction[],
    localTransactions: ICosmosTransaction[],
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
    transactions: readonly ICosmosTransaction[],
    localTransactions: ICosmosTransaction[],
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

  renderTransactionItem = (transaction: ICosmosTransaction) => {
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
    const { network } = this.props.ledger;
    const transactionPrice = getPriceFromTransactionTimestamp(
      timestamp,
      this.priceHistoryMap,
    );

    const fiatPrice = convertCryptoToFiat(
      Number(transactionPrice),
      unitToDenom(amount, network.denominationSize),
      network,
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

interface ComponentProps extends CosmosTransactionListProps {
  isDetailView?: boolean;
  extraLiveTransactions: ICosmosTransaction[];
  moreResultsExist?: boolean;
  transactions: ReadonlyArray<ICosmosTransaction>;
}

type IProps = ComponentProps;

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default CosmosTransactionList;
