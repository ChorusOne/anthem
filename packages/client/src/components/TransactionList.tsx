import { ITransaction } from "@anthem/utils";
import { H5 } from "@blueprintjs/core";
import { Centered } from "components/SharedComponents";
import Toast from "components/Toast";
import React from "react";
import { atomsToDenom, convertCryptoToFiat } from "tools/currency-utils";
import {
  formatAddressString,
  getFiatPriceHistoryMap,
  getPriceFromTransactionTimestamp,
  getValidatorNameFromAddress,
  getValidatorOperatorAddressMap,
  PriceHistoryMap,
  ValidatorOperatorAddressMap,
} from "tools/generic-utils";
import { TransactionListProps } from "./TransactionListContainer";
import TransactionListItem from "./TransactionListItem";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class TransactionList extends React.PureComponent<IProps> {
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

  render(): JSX.Element {
    const { transactions } = this.props;
    return (
      <React.Fragment>
        {transactions && transactions.length > 0 ? (
          transactions.map(this.renderTransactionItem)
        ) : (
          <Centered>
            <H5>No transactions exist</H5>
          </Centered>
        )}
      </React.Fragment>
    );
  }

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
  transactions: ReadonlyArray<ITransaction>;
}

type IProps = ComponentProps;

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default TransactionList;
