import { ICeloTransaction, NetworkDefinition } from "@anthem/utils";
import { Card, Elevation } from "@blueprintjs/core";
import { CeloLogo } from "assets/icons";
import { OasisGenericEvent } from "assets/images";
import { FiatCurrency } from "constants/fiat";
import { ILocale } from "i18n/catalog";
import Modules from "modules/root";
import React from "react";
import { capitalizeString, formatAddressString } from "tools/client-utils";
import { TranslateMethodProps } from "tools/i18n-utils";
import AddressIconComponent from "ui/AddressIconComponent";
import {
  ClickableEventRow,
  EventContextBox,
  EventIcon,
  EventIconBox,
  EventRow,
  EventRowItem,
  EventText,
  TransactionCardStyles,
} from "./TransactionComponents";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IProps extends TranslateMethodProps {
  isDetailView?: boolean;
  transaction: ICeloTransaction;
  address: string;
  locale: ILocale;
  isDesktop: boolean;
  fiatCurrency: FiatCurrency;
  network: NetworkDefinition;
  setAddress: typeof Modules.actions.ledger.setAddress;
  onCopySuccess: (address: string) => void;
}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class CeloTransactionListItem extends React.PureComponent<IProps, {}> {
  render(): Nullable<JSX.Element> {
    return (
      <Card style={TransactionCardStyles} elevation={Elevation.TWO}>
        <EventRow data-cy="transaction-list-item">
          {this.renderTransactionType()}
          {this.renderBlockNumber()}
          {this.renderAddressBlocks()}
        </EventRow>
      </Card>
    );
  }

  renderTransactionType = () => {
    const tagType = getCeloTransactionType(this.props.transaction);
    return (
      <EventRowItem style={{ minWidth: 300 }}>
        <EventIconBox>
          <EventIcon src={CeloLogo} />
        </EventIconBox>
        <EventContextBox>
          <EventText style={{ fontWeight: "bold" }}>Transaction Type</EventText>
          <EventText data-cy="transaction-type">{tagType}</EventText>
        </EventContextBox>
      </EventRowItem>
    );
  };

  renderBlockNumber = () => {
    const { blockNumber } = this.props.transaction;
    return (
      <EventRowItem style={{ minWidth: 215 }}>
        <EventIconBox>
          <OasisGenericEvent />
        </EventIconBox>
        <EventContextBox>
          <EventText style={{ fontWeight: "bold" }}>Block Number</EventText>
          <EventText data-cy="transaction-block-number">
            {blockNumber}
          </EventText>
        </EventContextBox>
      </EventRowItem>
    );
  };

  renderAddressBlocks = () => {
    const { from, to } = this.props.transaction;
    if (from && to) {
      return (
        <>
          {this.renderAddressBox(from, "From")}
          {this.renderAddressBox(to, "To")}
        </>
      );
    }

    return null;
  };

  renderAddressBox = (address: string, titleText: string) => {
    return (
      <ClickableEventRow onClick={this.handleLinkToAddress(address)}>
        <EventIconBox>
          <AddressIconComponent
            address={address}
            networkName={this.props.network.name}
            validatorOperatorAddressMap={{}}
          />
        </EventIconBox>
        <EventContextBox>
          <EventText style={{ fontWeight: "bold" }}>{titleText}</EventText>
          <EventText style={{ fontWeight: 100, fontSize: 12 }}>
            {formatAddressString(address, true)}
          </EventText>
        </EventContextBox>
      </ClickableEventRow>
    );
  };

  handleLinkToAddress = (address: string) => () => {
    this.props.setAddress(address, { showToastForError: true });
  };
}

/** ===========================================================================
 * Utils
 * ============================================================================
 */

/**
 * Derive transaction type from Celo transaction tags.
 */
const getCeloTransactionType = (transaction: ICeloTransaction) => {
  const { tags } = transaction;
  if (tags.length) {
    const { tag } = tags[0];
    return tag
      .split("-")
      .map(capitalizeString)
      .join(" ");
  } else {
    return "Celo Transaction";
  }
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default CeloTransactionListItem;
