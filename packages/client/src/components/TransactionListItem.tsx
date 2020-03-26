import { Card, Colors, Elevation, Position, Tooltip } from "@blueprintjs/core";
import { CosmosLogo } from "assets/icons";
import {
  LinkIcon,
  TxReceiveIcon,
  TxRewardWithdrawalIcon,
  TxSendIcon,
  TxStakeIcon,
  TxVoteIcon,
  TxWithdrawalStakeIcon,
} from "assets/images";
import { Row, View } from "components/SharedComponents";
import { COLORS } from "constants/colors";
import { FiatCurrency } from "constants/fiat";
import { NetworkMetadata } from "constants/networks";
import { IThemeProps } from "containers/ThemeContainer";
import { ITransaction } from "graphql/types";
import { ILocale } from "i18n/catalog";
import Analytics from "lib/analytics-lib";
import Modules from "modules/root";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { denomToAtoms, formatCurrencyAmount } from "tools/currency-utils";
import { formatDate, formatTime } from "tools/date-utils";
import {
  assertUnreachable,
  copyTextToClipboard,
  justFormatChainString,
  ValidatorOperatorAddressMap,
} from "tools/generic-utils";
import { tFnString, TranslateMethodProps } from "tools/i18n-utils";
import {
  COSMOS_TRANSACTION_TYPES,
  getHumanReadableMessageFromTransaction,
  getTransactionFailedLogMessage,
  getTxFee,
  GovernanceSubmitProposalMessageData,
  GovernanceVoteMessageData,
  TransactionItemData,
  TransactionItemProps,
  ValidatorCreateOrEditMessageData,
  ValidatorModifyWithdrawAddressMessageData,
} from "tools/transaction-utils";
import AddressIconComponent from "./AddressIconComponent";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IProps extends TranslateMethodProps {
  isDetailView?: boolean;
  transaction: ITransaction;
  address: string;
  locale: ILocale;
  isDesktop: boolean;
  fiatCurrency: FiatCurrency;
  network: NetworkMetadata;
  setAddress: typeof Modules.actions.ledger.setAddress;
  validatorOperatorAddressMap: ValidatorOperatorAddressMap;
  onCopySuccess: (address: string) => void;
  addressOrValidator: (address: string) => string;
  getFiatPriceForTransaction: (timestamp: string, amount: string) => string;
}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class TransactionListItem extends React.PureComponent<IProps, {}> {
  render(): Nullable<JSX.Element> {
    const { isDesktop, transaction } = this.props;
    const messages = this.getTransactionMessages(transaction);

    return isDesktop
      ? this.renderTransaction(transaction, messages)
      : this.renderMobileTransactionView(transaction, messages);
  }

  getTransactionMessages = (transaction: ITransaction) => {
    const { t, address, tString, network } = this.props;
    let results: ReadonlyArray<TransactionItemProps> = [];

    for (let i = 0; i < transaction.msgs.length; i++) {
      const result = getHumanReadableMessageFromTransaction({
        t,
        tString,
        address,
        transaction,
        msgIndex: i,
        denom: network.denom,
      });
      if (result) {
        results = results.concat(result);
      }
    }

    return results;
  };

  renderTransaction = (
    transaction: ITransaction,
    messages: ReadonlyArray<TransactionItemProps>,
  ) => {
    const fees = getTxFee(transaction);
    const transactionFailedLog = getTransactionFailedLogMessage(transaction);
    return (
      <Card style={cardStyles} elevation={Elevation.TWO}>
        {transactionFailedLog && (
          <TransactionFailedStatusBar>
            <p style={{ margin: 0, color: COLORS.WHITE }}>
              {this.props.t(
                "Warning! Transaction failed, log: {{transactionFailedLog}}",
                {
                  transactionFailedLog,
                },
              )}
            </p>
          </TransactionFailedStatusBar>
        )}
        {messages.map(({ data }, index) => {
          return (
            <View key={`${transaction.hash}${index}`}>
              {this.renderMessage(data)}
            </View>
          );
        })}
        {this.renderTransactionFeesRow(fees, transaction)}
      </Card>
    );
  };

  renderMessage = (data: TransactionItemProps["data"]) => {
    if (data.type === COSMOS_TRANSACTION_TYPES.SUBMIT_PROPOSAL) {
      return this.renderGovernanceSubmitProposalTransaction(
        data as GovernanceSubmitProposalMessageData,
      );
    } else if (data.type === COSMOS_TRANSACTION_TYPES.VOTE) {
      return this.renderGovernanceVoteTransaction(
        data as GovernanceVoteMessageData,
      );
    } else if (data.type === COSMOS_TRANSACTION_TYPES.CREATE_VALIDATOR) {
      return this.renderValidatorCreateOrEditMessage(
        data as ValidatorCreateOrEditMessageData,
      );
    } else if (data.type === COSMOS_TRANSACTION_TYPES.EDIT_VALIDATOR) {
      return this.renderValidatorCreateOrEditMessage(
        data as ValidatorCreateOrEditMessageData,
      );
    } else if (data.type === COSMOS_TRANSACTION_TYPES.MODIFY_WITHDRAW_ADDRESS) {
      return this.renderValidatorModifyWithdrawAddressMessage(
        data as ValidatorModifyWithdrawAddressMessageData,
      );
    } else {
      return this.renderDefaultTransactionMessage(data as TransactionItemData);
    }
  };

  renderDefaultTransactionMessage = (data: TransactionItemData) => {
    const { tString } = this.props;
    return (
      <EventRow data-cy="transaction-list-item">
        {this.renderTypeAndTimestamp(data)}
        {this.renderTransactionAmount(data.amount, data.timestamp)}
        {this.renderAddressBox(data.fromAddress, tString("From"))}
        {data.type !== COSMOS_TRANSACTION_TYPES.CLAIM_COMMISSION &&
          this.renderAddressBox(data.toAddress, tString("To"))}
      </EventRow>
    );
  };

  renderGovernanceVoteTransaction = (data: GovernanceVoteMessageData) => {
    const { t } = this.props;
    const { option, proposal_id } = data;
    return (
      <EventRow data-cy="transaction-list-item">
        {this.renderTypeAndTimestamp(data)}
        <TxRowItem>
          <IconBox />
          <ContextBox>
            <TxText>{t("Voted")}</TxText>
            <TxText style={{ fontWeight: "bold" }}>{option}</TxText>
          </ContextBox>
        </TxRowItem>
        <TxRowItem>
          <IconBox />
          <ContextBox>
            <TxText>{t("Proposal ID")}</TxText>
            <TxText style={{ fontWeight: "bold" }}>{proposal_id}</TxText>
          </ContextBox>
        </TxRowItem>
      </EventRow>
    );
  };

  renderGovernanceSubmitProposalTransaction = (
    data: GovernanceSubmitProposalMessageData,
  ) => {
    const { t } = this.props;
    const { title, deposit, proposer, timestamp, description } = data;
    return (
      <View>
        <EventRow data-cy="transaction-list-item">
          {this.renderTypeAndTimestamp(data)}
          {this.renderTransactionAmount(deposit, timestamp)}
          {this.renderAddressBox(proposer, "from")}
        </EventRow>
        <EventRow>
          <TxRowItem>
            <IconBox />
            <ContextBox>
              <TxText style={{ fontWeight: "bold" }}>{t("Title")}</TxText>
              <TxText>{title}</TxText>
            </ContextBox>
          </TxRowItem>
        </EventRow>
        <EventRow>
          <TxRowItem style={{ width: 1000, minWidth: 900 }}>
            <IconBox />
            <ContextBox>
              <TxText style={{ fontWeight: "bold" }}>{t("Description")}</TxText>
              <DescriptionText>{description}</DescriptionText>
            </ContextBox>
          </TxRowItem>
        </EventRow>
      </View>
    );
  };

  renderValidatorCreateOrEditMessage = (
    data: ValidatorCreateOrEditMessageData,
  ) => {
    const { tString } = this.props;
    const { delegatorAddress, validatorAddress } = data;
    return (
      <EventRow data-cy="transaction-list-item">
        {this.renderTypeAndTimestamp(data)}
        {delegatorAddress &&
          this.renderAddressBox(delegatorAddress, tString("Delegator"))}
        {validatorAddress &&
          this.renderAddressBox(validatorAddress, tString("Validator"))}
      </EventRow>
    );
  };

  renderValidatorModifyWithdrawAddressMessage = (
    data: ValidatorModifyWithdrawAddressMessageData,
  ) => {
    const { tString } = this.props;
    const { withdrawAddress, validatorAddress } = data;
    return (
      <EventRow data-cy="transaction-list-item">
        {this.renderTypeAndTimestamp(data)}
        {this.renderAddressBox(withdrawAddress, tString("Delegator"))}
        {validatorAddress &&
          this.renderAddressBox(validatorAddress, tString("Validator"))}
      </EventRow>
    );
  };

  renderTypeAndTimestamp = (data: TransactionItemProps["data"]) => {
    const { tString } = this.props;
    const Icon = getTransactionTypeIcon(data.type);
    return (
      <TxRowItem style={{ minWidth: 230 }}>
        <IconBox>{Icon}</IconBox>
        <ContextBox>
          <TxText style={{ fontWeight: "bold" }}>
            {getTransactionLabelFromType(data.type, tString)}
          </TxText>
          <TxText data-cy="transaction-timestamp">
            {formatDate(Number(data.timestamp))}{" "}
            {formatTime(Number(data.timestamp))}
          </TxText>
        </ContextBox>
      </TxRowItem>
    );
  };

  renderTransactionAmount = (amount: Nullable<string>, timestamp: string) => {
    if (!amount) {
      return <TxRowItem style={{ minWidth: 275 }} />;
    }

    const { fiatCurrency } = this.props;
    return (
      <TxRowItem style={{ minWidth: 275 }}>
        <IconBox>
          <TxIcon src={CosmosLogo} />
        </IconBox>
        <ContextBox>
          <TxText style={{ fontWeight: "bold" }}>
            {formatCurrencyAmount(denomToAtoms(amount))} ATOM
          </TxText>
          <TxText>
            {this.getFiatAmount(amount, timestamp)} {fiatCurrency.symbol}
          </TxText>
        </ContextBox>
      </TxRowItem>
    );
  };

  renderAddressBox = (address: string, titleText: string) => {
    return (
      <ClickableEventRow
        style={{ width: "auto" }}
        onClick={this.handleLinkToAddress(address)}
      >
        <IconBox>
          <AddressIconComponent
            address={address}
            networkName={this.props.network.name}
            validatorOperatorAddressMap={this.props.validatorOperatorAddressMap}
          />
        </IconBox>
        <ContextBox>
          <TxText>{titleText}</TxText>
          <TxText style={{ fontWeight: "bold" }}>
            {this.props.addressOrValidator(address)}
          </TxText>
        </ContextBox>
      </ClickableEventRow>
    );
  };

  renderTransactionHashLink = (hash: string, chain: string) => {
    return (
      <React.Fragment>
        <Tooltip position={Position.TOP} content="Click to copy hash">
          <ClickableEventRow onClick={() => copyTextToClipboard(hash)}>
            <IconBox>
              <LinkIcon />
            </IconBox>
            <ContextBox>
              <TxText style={{ fontWeight: "bold" }}>Transaction Hash</TxText>
              <TransactionLinkText>{hash.slice(0, 15)}...</TransactionLinkText>
            </ContextBox>
          </ClickableEventRow>
        </Tooltip>
        <EventRow>
          <IconBox />
          <Row key={hash} data-cy="transaction-list-item">
            <TxText>{justFormatChainString(chain)}</TxText>
          </Row>
        </EventRow>
      </React.Fragment>
    );
  };

  renderTransactionFeesRow = (fees: string, transaction: ITransaction) => {
    const { hash, height, timestamp, chain } = transaction;
    const { t, fiatCurrency } = this.props;
    const atomFees = denomToAtoms(fees);
    const fiatFees = this.props.getFiatPriceForTransaction(timestamp, atomFees);

    return (
      <EventRowBottom>
        <TxRowItem style={{ minWidth: 230 }}>
          <IconBox />
          <ContextBox>
            <TxText style={{ fontWeight: "bold" }}>Block Height</TxText>
            <TxText>{height}</TxText>
          </ContextBox>
        </TxRowItem>
        <TxRowItem style={{ minWidth: 275 }}>
          <IconBox />
          <ContextBox>
            <TxText style={{ fontWeight: "bold" }}>{t("Fees")}</TxText>
            <TxText>
              {formatCurrencyAmount(atomFees, 6)} ATOM (
              {formatCurrencyAmount(fiatFees, 2)} {fiatCurrency.symbol})
            </TxText>
          </ContextBox>
        </TxRowItem>
        {this.renderTransactionHashLink(hash, chain)}
      </EventRowBottom>
    );
  };

  renderMobileTransactionView = (
    transaction: ITransaction,
    messages: ReadonlyArray<TransactionItemProps>,
  ) => {
    const { hash, timestamp } = transaction;
    return (
      <Link to={`/txs/${hash}`} onClick={Analytics.openTransactionDetails}>
        <EventRowMobile key={hash} data-cy="transaction-list-item">
          <View style={{ minWidth: 150 }}>
            <EventTimestamp
              style={{ color: Colors.GRAY3 }}
              data-cy="transaction-timestamp"
            >
              {formatDate(Number(timestamp))}
            </EventTimestamp>
          </View>
          <EventText
            style={{ color: Colors.GRAY3 }}
            data-cy="transaction-message"
          >
            {messages.map((msg, i) => (
              <span key={i}>{msg.text}</span>
            ))}
          </EventText>
        </EventRowMobile>
      </Link>
    );
  };

  getFiatAmount = (amount: string, timestamp: string) => {
    return formatCurrencyAmount(
      this.props.getFiatPriceForTransaction(timestamp, denomToAtoms(amount)),
    );
  };

  handleLinkToAddress = (address: string) => () => {
    this.props.setAddress(address, { showToastForError: true });
  };
}

/** ===========================================================================
 * Styled Components
 * ============================================================================
 */

const cardStyles = {
  padding: 0,
  borderRadius: 0,
  marginBottom: 14,
};

const EventRow = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 70px;
  padding-left: 16px;
  padding-right: 16px;
`;

const TransactionFailedStatusBar = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 25px;
  padding-left: 16px;
  padding-right: 16px;
  background: ${COLORS.ERROR};
`;

const EventRowBottom = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 70px;
  padding-left: 16px;
  padding-right: 16px;

  background: ${(props: { theme: IThemeProps }) => {
    return props.theme.isDarkTheme ? Colors.DARK_GRAY3 : Colors.LIGHT_GRAY4;
  }};
`;

const TxText = styled.p`
  margin: 0;
  padding: 0;

  color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? COLORS.LIGHT_TEXT : COLORS.DARK_TEXT};
`;

const DescriptionText = styled(TxText)`
  width: 1000px;
  min-width: 900px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const TransactionLinkText = styled.p`
  margin: 0;

  color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? COLORS.LIGHT_TEXT : COLORS.DARK_TEXT};

  &:hover {
    cursor: pointer;
  }
`;

const TxRowItem = styled.div`
  min-width: 230px;
  padding: 15px;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
`;

const IconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  min-width: 32px;
  height: 32px;

  &:hover {
    cursor: ${(props: { interactive?: boolean }) => {
      return props.interactive ? "pointer" : "auto";
    }};
  }
`;

const ContextBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const TxIcon = styled.img`
  width: 32px;

  &:hover {
    cursor: pointer;
  }
`;

const ClickableEventRow = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 15px;
  min-width: 230px;

  &:hover {
    cursor: pointer;
    background: ${(props: { theme: IThemeProps }) => {
      return props.theme.isDarkTheme ? Colors.DARK_GRAY2 : Colors.LIGHT_GRAY3;
    }};
  }
`;

/**
 * Return the icon for a given transaction type.
 */
const getTransactionTypeIcon = (type: COSMOS_TRANSACTION_TYPES) => {
  switch (type) {
    case COSMOS_TRANSACTION_TYPES.SEND:
      return <TxSendIcon />;
    case COSMOS_TRANSACTION_TYPES.RECEIVE:
      return <TxReceiveIcon />;
    case COSMOS_TRANSACTION_TYPES.VOTE:
      return <TxVoteIcon />;
    case COSMOS_TRANSACTION_TYPES.DELEGATE:
    case COSMOS_TRANSACTION_TYPES.BEGIN_REDELEGATE:
      return <TxStakeIcon />;
    case COSMOS_TRANSACTION_TYPES.UNDELEGATE:
      return <TxWithdrawalStakeIcon />;
    case COSMOS_TRANSACTION_TYPES.CLAIM_REWARDS:
    case COSMOS_TRANSACTION_TYPES.CLAIM_COMMISSION:
      return <TxRewardWithdrawalIcon />;
    case COSMOS_TRANSACTION_TYPES.SUBMIT_PROPOSAL:
    case COSMOS_TRANSACTION_TYPES.CREATE_VALIDATOR:
    case COSMOS_TRANSACTION_TYPES.EDIT_VALIDATOR:
    case COSMOS_TRANSACTION_TYPES.MODIFY_WITHDRAW_ADDRESS:
      // No separate icon
      return <TxSendIcon />;
    default:
      return assertUnreachable(type);
  }
};

/**
 * Convert a transaction type to its internationalized string label.
 */
export const getTransactionLabelFromType = (
  transactionType: COSMOS_TRANSACTION_TYPES,
  tString: tFnString,
): string => {
  switch (transactionType) {
    case COSMOS_TRANSACTION_TYPES.SEND:
      return tString("Send");
    case COSMOS_TRANSACTION_TYPES.RECEIVE:
      return tString("Receive");
    case COSMOS_TRANSACTION_TYPES.VOTE:
      return tString("Vote");
    case COSMOS_TRANSACTION_TYPES.DELEGATE:
      return tString("Delegate");
    case COSMOS_TRANSACTION_TYPES.UNDELEGATE:
      return tString("Undelegate");
    case COSMOS_TRANSACTION_TYPES.BEGIN_REDELEGATE:
      return tString("Redelegate");
    case COSMOS_TRANSACTION_TYPES.CLAIM_REWARDS:
      return tString("Claim Rewards");
    case COSMOS_TRANSACTION_TYPES.SUBMIT_PROPOSAL:
      return tString("Submit Proposal");
    case COSMOS_TRANSACTION_TYPES.CLAIM_COMMISSION:
      return tString("Claim Commission");
    case COSMOS_TRANSACTION_TYPES.CREATE_VALIDATOR:
      return tString("Create Validator");
    case COSMOS_TRANSACTION_TYPES.EDIT_VALIDATOR:
      return tString("Edit Validator");
    case COSMOS_TRANSACTION_TYPES.MODIFY_WITHDRAW_ADDRESS:
      return "Modify Withdraw Address";
    default:
      return assertUnreachable(transactionType);
  }
};

/** ===========================================================================
 * Mobile
 * ============================================================================
 */

const EventRowMobile = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
  flex-direction: row;
  background: ${(props: { theme: IThemeProps }) => {
    return props.theme.isDarkTheme ? Colors.DARK_GRAY4 : Colors.LIGHT_GRAY3;
  }};

  &:nth-child(2n + 1) {
    background: ${(props: { theme: IThemeProps }) => {
      return props.theme.isDarkTheme ? Colors.DARK_GRAY3 : Colors.LIGHT_GRAY4;
    }};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const EventTimestamp = styled.p`
  margin: 0;
  padding: 0;
  font-size: 12px;
  font-weight: bold;

  @media (max-width: 768px) {
    margin-bottom: 8px;
  }
`;

const EventText = styled.p`
  margin: 0;
  padding: 0;
`;

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default TransactionListItem;
