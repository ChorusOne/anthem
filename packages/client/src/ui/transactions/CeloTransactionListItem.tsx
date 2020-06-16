import { ICeloTransaction, NetworkDefinition } from "@anthem/utils";
import { Card, Elevation, Position, Tooltip } from "@blueprintjs/core";
import { CeloLogo } from "assets/icons";
import { LinkIcon, OasisGenericEvent } from "assets/images";
import { FiatCurrency } from "constants/fiat";
import { ILocale } from "i18n/catalog";
import Modules from "modules/root";
import React from "react";
import { Link } from "react-router-dom";
import {
  capitalizeString,
  copyTextToClipboard,
  formatAddressString,
} from "tools/client-utils";
import { denomToUnit } from "tools/currency-utils";
import { formatDate, formatTime } from "tools/date-utils";
import { TranslateMethodProps } from "tools/i18n-utils";
import { multiply } from "tools/math-utils";
import AddressIconComponent from "ui/AddressIconComponent";
import {
  ClickableEventRow,
  EventContextBox,
  EventIcon,
  EventIconBox,
  EventRow,
  EventRowBottom,
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
          {this.renderAddressBlocks()}
          {this.renderHash()}
        </EventRow>
        <EventRowBottom>
          {this.renderBlockNumber()}
          {this.renderTransactionValues()}
          {this.renderBlockExplorerLink()}
        </EventRowBottom>
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
      <EventRowItem style={{ minWidth: 300 }}>
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
      <Link to={`/txs/${hash}`}>
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

  renderBlockExplorerLink = () => {
    const { hash } = this.props.transaction;
    const link = `https://explorer.celo.org/tx/${hash}`;
    return (
      <a target="_blank" href={link} rel="noopener noreferrer">
        <ClickableEventRow onClick={() => null}>
          <EventIconBox>
            <LinkIcon />
          </EventIconBox>
          <EventContextBox>
            <EventText style={{ fontWeight: 200 }}>
              View on Celo Explorer
            </EventText>
          </EventContextBox>
        </ClickableEventRow>
      </a>
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
      <ClickableEventRow
        style={{ minWidth: 215 }}
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
          <EventText style={{ fontWeight: "bold" }}>{titleText}</EventText>
          <EventText style={{ fontWeight: 100, fontSize: 13 }}>
            {formatAddressString(address, true)}
          </EventText>
        </EventContextBox>
      </ClickableEventRow>
    );
  };

  renderTransactionValues = () => {
    const size = this.props.network.denominationSize;
    const { value, gasUsed, gasPrice } = this.props.transaction.details;
    const fee = multiply(gasUsed, gasPrice);
    return (
      <>
        <EventRowItem style={{ minWidth: 215 }}>
          <EventIconBox />
          <EventContextBox>
            <EventText style={{ fontWeight: "bold" }}>Value</EventText>
            <EventText data-cy="transaction-value">
              {denomToUnit(value, size)} cGLD
            </EventText>
          </EventContextBox>
        </EventRowItem>
        <EventRowItem style={{ minWidth: 215 }}>
          <EventIconBox />
          <EventContextBox>
            <EventText style={{ fontWeight: "bold" }}>Fee</EventText>
            <EventText data-cy="transaction-value">
              {denomToUnit(fee, size)} cGLD
            </EventText>
          </EventContextBox>
        </EventRowItem>
      </>
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
    const { eventname, source } = tags[0];
    const label = `${source} ${eventname}`;
    return capitalizeString(label);
  } else {
    return "Celo Transaction";
  }
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default CeloTransactionListItem;
