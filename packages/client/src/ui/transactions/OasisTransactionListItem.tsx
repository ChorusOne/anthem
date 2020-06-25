import {
  assertUnreachable,
  IOasisBurnEvent,
  IOasisEscrowAddEvent,
  IOasisEscrowReclaimEvent,
  IOasisRegisterEntityEvent,
  IOasisRegisterRuntimeEvent,
  IOasisTransaction,
  IOasisTransactionType,
  IOasisTransferEvent,
  IOasisUnfreezeNodeEvent,
  IOasisUnknownEvent,
  NetworkDefinition,
} from "@anthem/utils";
import { Card, Elevation, Position, Tooltip } from "@blueprintjs/core";
import { OasisLogo } from "assets/icons";
import {
  LinkIcon,
  OasisBurnIcon,
  OasisEscrowAddIcon,
  OasisEscrowReclaimIcon,
  OasisEscrowTakeIcon,
  OasisGenericEvent,
  OasisTransferIcon,
} from "assets/images";
import { FiatCurrency } from "constants/fiat";
import { ILocale } from "i18n/catalog";
import Modules from "modules/root";
import React from "react";
import { Link } from "react-router-dom";
import { copyTextToClipboard, formatAddressString } from "tools/client-utils";
import { denomToUnit, formatCurrencyAmount } from "tools/currency-utils";
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
  TransactionLinkText,
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
    const { transaction } = this.props;
    return (
      <Card style={TransactionCardStyles} elevation={Elevation.TWO}>
        <EventRow data-cy="transaction-list-item">
          {this.renderTypeAndTimestamp()}
          {this.renderHash()}
          {this.renderAddressBlocks()}
          {this.renderFeeAmount(transaction.fee)}
        </EventRow>
      </Card>
    );
  }

  renderAddressBlocks = () => {
    const { transaction } = this.props;
    const { type } = transaction.data;
    switch (type) {
      case IOasisTransactionType.EscrowTake:
      case IOasisTransactionType.Burn: {
        const event = transaction.data as IOasisBurnEvent;
        return this.renderAddressBox(event.owner, "Owner");
      }
      case IOasisTransactionType.Transfer: {
        const event = transaction.data as IOasisTransferEvent;
        return (
          <>
            {this.renderTransactionAmount(event.tokens)}
            {this.renderAddressBox(event.from, "From")}
            {this.renderAddressBox(event.to, "To")}
          </>
        );
      }
      case IOasisTransactionType.EscrowAdd: {
        const event = transaction.data as IOasisEscrowAddEvent;
        return (
          <>
            {this.renderTransactionAmount(event.tokens)}
            {this.renderAddressBox(event.to, "To")}
          </>
        );
      }
      case IOasisTransactionType.EscrowReclaim: {
        const event = transaction.data as IOasisEscrowReclaimEvent;
        return (
          <>
            {this.renderTransactionAmount(event.shares)}
            {this.renderAddressBox(event.from, "From")}
          </>
        );
      }
      case IOasisTransactionType.RegisterEntity: {
        const event = transaction.data as IOasisRegisterEntityEvent;
        if (event.id) {
          return this.renderEventInfoBox(event.id, "Entity id");
        } else {
          return null;
        }
      }
      case IOasisTransactionType.RegisterNode: {
        const event = transaction.data as IOasisRegisterEntityEvent;
        if (event.id) {
          return this.renderEventInfoBox(event.id, "Node id");
        } else {
          return null;
        }
      }
      case IOasisTransactionType.RegisterRuntime: {
        const event = transaction.data as IOasisRegisterRuntimeEvent;
        if (event.id) {
          return this.renderEventInfoBox(event.id, "Runtime id");
        } else {
          return null;
        }
      }
      case IOasisTransactionType.UnfreezeNode: {
        const event = transaction.data as IOasisUnfreezeNodeEvent;
        if (event.id) {
          return this.renderEventInfoBox(event.id, "Node id");
        } else {
          return null;
        }
      }
      case IOasisTransactionType.UnknownEvent: {
        const event = transaction.data as IOasisUnknownEvent;
        return this.renderEventInfoBox(event.method_name, "Method Name");
      }
      case IOasisTransactionType.RateEvent:
      case IOasisTransactionType.BoundEvent:
      case IOasisTransactionType.AmendCommissionSchedule:
        console.warn(`[OASIS]: Handle this transaction type: ${type}`);
        return null;
      default:
        return assertUnreachable(type);
    }
  };

  renderTypeAndTimestamp = () => {
    const { transaction } = this.props;
    const Icon = getOasisTransactionTypeIcon(transaction.data.type);
    return (
      <EventRowItem style={{ minWidth: 215 }}>
        <EventIconBox>{Icon}</EventIconBox>
        <EventContextBox>
          <EventText style={{ fontWeight: "bold" }}>
            {getOasisTransactionLabelFromType(transaction.data.type)}
          </EventText>
          <EventText data-cy="transaction-timestamp">
            {formatDate(transaction.date)} {formatTime(transaction.date)}
          </EventText>
        </EventContextBox>
      </EventRowItem>
    );
  };

  renderFeeAmount = (amount: string) => {
    const { denominationSize, denom } = this.props.network;
    return (
      <EventRowItem style={{ minWidth: 150 }}>
        <EventIconBox />
        <EventContextBox>
          <EventText style={{ fontWeight: "bold" }}>Transaction Fee</EventText>
          <EventText>
            {formatCurrencyAmount(denomToUnit(amount, denominationSize))}{" "}
            {denom}
          </EventText>
        </EventContextBox>
      </EventRowItem>
    );
  };

  renderTransactionAmount = (amount: string) => {
    const { denominationSize, denom } = this.props.network;
    return (
      <EventRowItem style={{ minWidth: 200 }}>
        <EventIconBox>
          <EventIcon src={OasisLogo} />
        </EventIconBox>
        <EventContextBox>
          <EventText style={{ fontWeight: "bold" }}>Amount {denom}</EventText>
          <EventText>
            {formatCurrencyAmount(denomToUnit(amount, denominationSize))}
          </EventText>
        </EventContextBox>
      </EventRowItem>
    );
  };

  renderAddressBox = (address: string, titleText: string) => {
    return (
      <ClickableEventRow onClick={this.handleLinkToAddress(address)}>
        <EventIconBox>
          <AddressIconComponent
            address={address}
            networkName={this.props.network.name}
            validatorOperatorAddressMap={new Map()}
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

  renderEventInfoBox = (info: string, titleText: string) => {
    return (
      <EventRow>
        <EventIconBox />
        <EventContextBox>
          <EventText style={{ fontWeight: "bold" }}>{titleText}</EventText>
          <EventText>{info}</EventText>
        </EventContextBox>
      </EventRow>
    );
  };

  renderHash = () => {
    const { hash } = this.props.transaction;

    const TxHashLink = this.props.isDetailView ? (
      <ClickableEventRow onClick={() => copyTextToClipboard(hash)}>
        <EventIconBox>
          <LinkIcon />
        </EventIconBox>
        <EventContextBox>
          <EventText style={{ fontWeight: "bold" }}>Hash</EventText>
          <TransactionLinkText style={{ fontWeight: 100, fontSize: 13 }}>
            {hash.slice(0, 15)}...
          </TransactionLinkText>
        </EventContextBox>
      </ClickableEventRow>
    ) : (
      <Link to={`/txs/${hash}`} data-cy="transaction-hash-link">
        <ClickableEventRow onClick={() => null}>
          <EventIconBox>
            <LinkIcon />
          </EventIconBox>
          <EventContextBox>
            <EventText style={{ fontWeight: "bold" }}>Hash</EventText>
            <EventText
              style={{ fontWeight: 100, fontSize: 13 }}
              data-cy="transaction-block-number"
            >
              {hash.slice(0, 15)}...
            </EventText>
          </EventContextBox>
        </ClickableEventRow>
      </Link>
    );

    return this.props.isDetailView && this.props.isDesktop ? (
      <Tooltip position={Position.TOP} content="Click to copy hash">
        {TxHashLink}
      </Tooltip>
    ) : (
      TxHashLink
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
    case IOasisTransactionType.RegisterEntity:
    case IOasisTransactionType.RegisterNode:
    case IOasisTransactionType.RegisterRuntime:
    case IOasisTransactionType.UnfreezeNode:
    case IOasisTransactionType.RateEvent:
    case IOasisTransactionType.BoundEvent:
    case IOasisTransactionType.AmendCommissionSchedule:
    case IOasisTransactionType.UnknownEvent:
      return <OasisGenericEvent />;
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
    case IOasisTransactionType.RegisterEntity:
      return "Register Entity";
    case IOasisTransactionType.RegisterNode:
      return "Register Node";
    case IOasisTransactionType.UnfreezeNode:
      return "Unfreeze Node";
    case IOasisTransactionType.RegisterRuntime:
      return "Register Runtime";
    case IOasisTransactionType.RateEvent:
      return "Rate Event";
    case IOasisTransactionType.BoundEvent:
      return "Bound Event";
    case IOasisTransactionType.AmendCommissionSchedule:
      return "Amend Commission Schedule";
    case IOasisTransactionType.UnknownEvent:
      return "Unknown Event Type";
    default:
      return assertUnreachable(type);
  }
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default OasisTransactionListItem;
