import {
  assertUnreachable,
  IOasisBurnEvent,
  IOasisEscrowAddEvent,
  IOasisTransaction,
  IOasisTransactionType,
  IOasisTransferEvent,
  NetworkDefinition,
} from "@anthem/utils";
import { Card, Elevation } from "@blueprintjs/core";
import { OasisLogo } from "assets/icons";
import {
  OasisBurnIcon,
  OasisEscrowAddIcon,
  OasisEscrowReclaimIcon,
  OasisEscrowTakeIcon,
  OasisTransferIcon,
} from "assets/images";
import AddressIconComponent from "components/AddressIconComponent";
import { FiatCurrency } from "constants/fiat";
import { ILocale } from "i18n/catalog";
import Modules from "modules/root";
import React from "react";
import { formatAddressString } from "tools/client-utils";
import { formatCurrencyAmount } from "tools/currency-utils";
import { formatDate, formatTime } from "tools/date-utils";
import { TranslateMethodProps } from "tools/i18n-utils";
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
  transaction: IOasisTransaction;
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

class OasisTransactionListItem extends React.PureComponent<IProps, {}> {
  render(): Nullable<JSX.Element> {
    return (
      <Card style={TransactionCardStyles} elevation={Elevation.TWO}>
        <EventRow>
          {this.renderTypeAndTimestamp()}
          {this.renderTransactionAmount()}
          {this.renderAddressBlocks()}
        </EventRow>
      </Card>
    );
  }

  renderTypeAndTimestamp = () => {
    const { transaction } = this.props;
    const Icon = getOasisTransactionTypeIcon(transaction.event.type);
    return (
      <EventRowItem style={{ minWidth: 275 }}>
        <EventIconBox>{Icon}</EventIconBox>
        <EventContextBox>
          <EventText style={{ fontWeight: "bold" }}>
            {getOasisTransactionLabelFromType(transaction.event.type)}
          </EventText>
          <EventText data-cy="transaction-timestamp">
            {formatDate(Number(transaction.date))}{" "}
            {formatTime(Number(transaction.date))}
          </EventText>
        </EventContextBox>
      </EventRowItem>
    );
  };

  renderTransactionAmount = () => {
    const { transaction } = this.props;
    const amount = transaction.event.tokens;
    return (
      <EventRowItem style={{ minWidth: 275 }}>
        <EventIconBox>
          <EventIcon src={OasisLogo} />
        </EventIconBox>
        <EventContextBox>
          <EventText style={{ fontWeight: "bold" }}>Amount</EventText>
          <EventText>{formatCurrencyAmount(amount)}</EventText>
        </EventContextBox>
      </EventRowItem>
    );
  };

  renderAddressBlocks = () => {
    const { transaction } = this.props;
    const { type } = transaction.event;
    switch (type) {
      case IOasisTransactionType.EscrowTake:
      case IOasisTransactionType.Burn: {
        const event = transaction.event as IOasisBurnEvent;
        return this.renderAddressBox(event.owner, "Owner");
      }
      case IOasisTransactionType.Transfer: {
        const event = transaction.event as IOasisTransferEvent;
        return (
          <>
            {this.renderAddressBox(event.from, "From")}
            {this.renderAddressBox(event.to, "To")}
          </>
        );
      }
      case IOasisTransactionType.EscrowAdd:
      case IOasisTransactionType.EscrowReclaim: {
        const event = transaction.event as IOasisEscrowAddEvent;
        return (
          <>
            {this.renderAddressBox(event.owner, "Owner")}
            {this.renderAddressBox(event.escrow, "Escrow")}
          </>
        );
      }
      default:
        return assertUnreachable(type);
    }
  };

  renderAddressBox = (address: string, titleText: string) => {
    return (
      <ClickableEventRow
        style={{ width: "auto" }}
        onClick={this.handleLinkToAddress(address)}
      >
        <EventIconBox>
          <AddressIconComponent
            address={address}
            networkName={this.props.network.name}
            validatorOperatorAddressMap={{}}
          />
        </EventIconBox>
        <EventContextBox>
          <EventText>{titleText}</EventText>
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
 * Styles
 * ============================================================================
 */

export const getOasisTransactionTypeIcon = (type: IOasisTransactionType) => {
  switch (type) {
    case IOasisTransactionType.Burn:
      return <OasisBurnIcon />;
    case IOasisTransactionType.Transfer:
      return <OasisTransferIcon />;
    case IOasisTransactionType.EscrowAdd:
      return <OasisEscrowAddIcon />;
    case IOasisTransactionType.EscrowTake:
      return <OasisEscrowTakeIcon />;
    case IOasisTransactionType.EscrowReclaim:
      return <OasisEscrowReclaimIcon />;
    default:
      return assertUnreachable(type);
  }
};

export const getOasisTransactionLabelFromType = (
  type: IOasisTransactionType,
): string => {
  switch (type) {
    case IOasisTransactionType.Burn:
      return "Burn";
    case IOasisTransactionType.Transfer:
      return "Transfer";
    case IOasisTransactionType.EscrowAdd:
      return "Escrow Add";
    case IOasisTransactionType.EscrowTake:
      return "Escrow Take";
    case IOasisTransactionType.EscrowReclaim:
      return "Escrow Reclaim";
    default:
      return assertUnreachable(type);
  }
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default OasisTransactionListItem;
