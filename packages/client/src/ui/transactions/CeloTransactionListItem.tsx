import { ICeloTransaction, NetworkDefinition } from "@anthem/utils";
import { Card, Elevation } from "@blueprintjs/core";
import { CeloLogo } from "assets/icons";
import { OasisGenericEvent } from "assets/images";
import { FiatCurrency } from "constants/fiat";
import { ILocale } from "i18n/catalog";
import Modules from "modules/root";
import React from "react";
import { formatAddressString } from "tools/client-utils";
import { formatDate, formatTime } from "tools/date-utils";
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
          {this.renderTypeAndTimestamp()}
          {this.renderBlockNumber()}
          {this.renderAddressBlocks()}
        </EventRow>
      </Card>
    );
  }

  renderTypeAndTimestamp = () => {
    const { transaction } = this.props;
    const label = getCeloTransactionType(this.props.transaction);
    const time = Number(transaction.timestamp) * 1000;
    return (
      <EventRowItem style={{ minWidth: 300 }}>
        <EventIconBox>
          <EventIcon src={CeloLogo} />
        </EventIconBox>
        <EventContextBox>
          <EventText style={{ fontWeight: "bold" }}>{label}</EventText>
          <EventText data-cy="transaction-timestamp">
            {formatDate(time)} {formatTime(time)}
          </EventText>
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
    return (
      <>
        {!!from ? this.renderAddressBox(from, "From") : null}
        {!!to ? this.renderAddressBox(to, "To") : null}
      </>
    );
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
    const { prettyname } = tags[0];
    return prettyname;
  } else {
    return "Celo Transaction";
  }
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default CeloTransactionListItem;
