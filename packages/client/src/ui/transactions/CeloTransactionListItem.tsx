import { ICeloTransaction, NetworkDefinition } from "@anthem/utils";
import { Card, Code, Elevation, Position, Tooltip } from "@blueprintjs/core";
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
import { Row } from "ui/SharedComponents";
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
    const { transaction } = this.props;
    const tagData = maybeGetValueFromTags(transaction);
    return (
      <Card style={TransactionCardStyles} elevation={Elevation.TWO}>
        <EventRow data-cy="transaction-list-item">
          {this.renderTypeAndTimestamp(transaction)}
          {this.renderAddressBlocks(transaction)}
          {this.renderHash(transaction)}
        </EventRow>
        <EventRowBottom>
          {this.renderBlockNumber(transaction)}
          {this.renderTransactionValues(transaction)}
          {this.renderBlockExplorerLink(transaction)}
        </EventRowBottom>
        {tagData && (
          <EventRowBottom>{this.renderTagValues(tagData)}</EventRowBottom>
        )}
      </Card>
    );
  }

  renderTypeAndTimestamp = (transaction: ICeloTransaction) => {
    const { contract, type } = getCeloTransactionType(transaction);
    const time = Number(transaction.timestamp) * 1000;
    return (
      <EventRowItem style={{ minWidth: 300 }}>
        <EventIconBox>
          <EventIcon src={CeloLogo} />
        </EventIconBox>
        <EventContextBox>
          <Row>
            {!!contract && <Code style={{ marginRight: 6 }}>{contract}</Code>}
            <EventText style={{ fontWeight: "bold" }}>{type}</EventText>
          </Row>
          <EventText data-cy="transaction-timestamp">
            {formatDate(time)} {formatTime(time)}
          </EventText>
        </EventContextBox>
      </EventRowItem>
    );
  };

  renderBlockNumber = (transaction: ICeloTransaction) => {
    const { blockNumber } = transaction;
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

  renderHash = (transaction: ICeloTransaction) => {
    const { hash } = transaction;
    const { name } = this.props.network;

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
      <Link
        data-cy="transaction-hash-link"
        to={`${name.toLowerCase()}/txs/${hash}`}
      >
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

  renderBlockExplorerLink = (transaction: ICeloTransaction) => {
    const { hash } = transaction;
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

  renderAddressBlocks = (transaction: ICeloTransaction) => {
    const { from, to } = transaction;
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
            validatorOperatorAddressMap={new Map()}
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

  renderTransactionValues = (transaction: ICeloTransaction) => {
    const { network } = this.props;
    const size = network.denominationSize;
    const { value, gasUsed, gasPrice } = transaction.details;
    const fee = multiply(gasUsed, gasPrice);

    return (
      <>
        <EventRowItem style={{ minWidth: 215 }}>
          <EventIconBox />
          <EventContextBox>
            <EventText style={{ fontWeight: "bold" }}>Value</EventText>
            <EventText data-cy="transaction-value">
              {denomToUnit(value, size)} {network.denom}
            </EventText>
          </EventContextBox>
        </EventRowItem>
        <EventRowItem style={{ minWidth: 215 }}>
          <EventIconBox />
          <EventContextBox>
            <EventText style={{ fontWeight: "bold" }}>Fee</EventText>
            <EventText data-cy="transaction-fee">
              {denomToUnit(fee, size)} {network.denom}
            </EventText>
          </EventContextBox>
        </EventRowItem>
      </>
    );
  };

  renderTagValues = (data: { [key: string]: string }) => {
    const { network } = this.props;
    const size = network.denominationSize;
    const entries = Object.entries(data);

    return (
      <>
        <EventRowItem style={{ minWidth: 300 }}>
          <EventIconBox />
          <EventContextBox>
            <Row>
              <EventText style={{ fontWeight: "bold" }}>
                Internal Transaction Data
              </EventText>
            </Row>
          </EventContextBox>
        </EventRowItem>
        {entries.map(([key, value]) => {
          if (key === "value") {
            return (
              <EventRowItem key={key} style={{ minWidth: 215 }}>
                <EventIconBox />
                <EventContextBox>
                  <EventText style={{ fontWeight: "bold" }}>
                    {capitalizeString(key)}
                  </EventText>
                  <EventText data-cy="transaction-value">
                    {denomToUnit(value, size)} {network.denom}
                  </EventText>
                </EventContextBox>
              </EventRowItem>
            );
          } else {
            return (
              <ClickableEventRow
                key={key}
                style={{ minWidth: 215 }}
                onClick={() => copyTextToClipboard(value)}
              >
                <EventIconBox>
                  <AddressIconComponent
                    address={value}
                    networkName={this.props.network.name}
                    validatorOperatorAddressMap={new Map()}
                  />
                </EventIconBox>
                <EventContextBox>
                  <EventText style={{ fontWeight: "bold" }}>
                    {capitalizeString(key)}
                  </EventText>
                  <EventText style={{ fontWeight: 100, fontSize: 13 }}>
                    {formatAddressString(value, true)}
                  </EventText>
                </EventContextBox>
              </ClickableEventRow>
            );
          }
        })}
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
 * Split a string by capital letters, e.g. "LockedGold" -> "Locked Gold".
 */
const splitByCapitalLetters = (str: string) => str.split(/(?=[A-Z])/).join(" ");

/**
 * Derive transaction type from Celo transaction tags.
 */
const getCeloTransactionType = (transaction: ICeloTransaction) => {
  const { tags } = transaction;
  if (tags.length) {
    const { eventname, source } = tags[0];
    const contract = splitByCapitalLetters(source);
    const type = splitByCapitalLetters(eventname);
    return { contract, type };
  } else {
    // Default transaction type where no specific tag information is present.
    return { contract: "", type: "Celo Transaction" };
  }
};

/**
 * Try to extract the transaction value information from the transaction tags.
 */
const maybeGetValueFromTags = (
  transaction: ICeloTransaction,
): Nullable<{ [key: string]: string }> => {
  const { tags } = transaction;
  try {
    const { parameters } = tags[0];
    const data = JSON.parse(parameters);
    if ("value" in data) {
      return data;
    }
  } catch (err) {
    // Do nothing
  }

  return null;
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default CeloTransactionListItem;
