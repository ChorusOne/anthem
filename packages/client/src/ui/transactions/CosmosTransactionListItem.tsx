import {
  assertUnreachable,
  ICosmosTransaction,
  ICosmosValidator,
  NetworkDefinition,
} from "@anthem/utils";
import { Card, Elevation, Position, Tooltip } from "@blueprintjs/core";
import {
  LinkIcon,
  NetworkLogoIcon,
  TxReceiveIcon,
  TxRewardWithdrawalIcon,
  TxSendIcon,
  TxStakeIcon,
  TxVoteIcon,
  TxWithdrawalStakeIcon,
} from "assets/images";
import { COLORS } from "constants/colors";
import { FiatCurrency } from "constants/fiat";
import { ILocale } from "i18n/catalog";
import Modules from "modules/root";
import React from "react";
import { Link } from "react-router-dom";
import {
  copyTextToClipboard,
  justFormatChainString,
  ValidatorOperatorAddressMap,
} from "tools/client-utils";
import {
  COSMOS_TRANSACTION_TYPES,
  CosmosBalance,
  CosmosTransactionFee,
  CosmosTransactionItemData,
  getTransactionFailedLogMessage,
  getTxFee,
  GovernanceSubmitProposalMessageData,
  GovernanceVoteMessageData,
  TERRA_TRANSACTION_TYPES,
  TransactionItemData,
  transformCosmosTransactionToRenderElements,
  ValidatorCreateOrEditMessageData,
  ValidatorModifyWithdrawAddressMessageData,
} from "tools/cosmos-transaction-utils";
import { denomToUnit, formatCurrencyAmount } from "tools/currency-utils";
import { formatDate, formatTime } from "tools/date-utils";
import { tFnString, TranslateMethodProps } from "tools/i18n-utils";
import { Row, View } from "ui/SharedComponents";
import AddressIconComponent from "../AddressIconComponent";
import {
  ClickableEventRow,
  EventContextBox,
  EventDescriptionText,
  EventIconBox,
  EventRow,
  EventRowBottom,
  EventRowItem,
  EventText,
  TransactionCardStyles,
  TransactionFailedStatusBar,
  TransactionLinkText,
} from "./TransactionComponents";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IProps extends TranslateMethodProps {
  isDetailView?: boolean;
  transaction: ICosmosTransaction;
  address: string;
  locale: ILocale;
  isDesktop: boolean;
  fiatCurrency: FiatCurrency;
  network: NetworkDefinition;
  setAddress: typeof Modules.actions.ledger.setAddress;
  validatorOperatorAddressMap: ValidatorOperatorAddressMap<ICosmosValidator>;
  onCopySuccess: (address: string) => void;
  addressOrValidator: (address: string) => string;
  getFiatPriceForTransaction: (timestamp: string, amount: string) => string;
}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class CosmosTransactionListItem extends React.PureComponent<IProps, {}> {
  render(): Nullable<JSX.Element> {
    const { transaction } = this.props;
    const messages = this.getTransactionMessages(transaction);
    return this.renderTransaction(transaction, messages);
  }

  getTransactionMessages = (transaction: ICosmosTransaction) => {
    const { address, network } = this.props;
    let results: ReadonlyArray<CosmosTransactionItemData> = [];

    for (let i = 0; i < transaction.msgs.length; i++) {
      const result = transformCosmosTransactionToRenderElements({
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
    transaction: ICosmosTransaction,
    messages: ReadonlyArray<CosmosTransactionItemData>,
  ) => {
    const fee = getTxFee(transaction);
    const transactionFailedLog = getTransactionFailedLogMessage(transaction);
    return (
      <Card style={TransactionCardStyles} elevation={Elevation.TWO}>
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
        {messages.map((data, index) => {
          return (
            <View key={`${transaction.hash}${index}`}>
              {this.renderMessage(data)}
            </View>
          );
        })}
        {this.renderTransactionFeesRow(fee, transaction)}
      </Card>
    );
  };

  renderMessage = (data: CosmosTransactionItemData) => {
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
        <EventRowItem>
          <EventIconBox />
          <EventContextBox>
            <EventText>{t("Voted")}</EventText>
            <EventText style={{ fontWeight: "bold" }}>{option}</EventText>
          </EventContextBox>
        </EventRowItem>
        <EventRowItem>
          <EventIconBox />
          <EventContextBox>
            <EventText>{t("Proposal ID")}</EventText>
            <EventText style={{ fontWeight: "bold" }}>{proposal_id}</EventText>
          </EventContextBox>
        </EventRowItem>
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
          <EventRowItem>
            <EventIconBox />
            <EventContextBox>
              <EventText style={{ fontWeight: "bold" }}>{t("Title")}</EventText>
              <EventText>{title}</EventText>
            </EventContextBox>
          </EventRowItem>
        </EventRow>
        <EventRow>
          <EventRowItem style={{ width: 1000, minWidth: 900 }}>
            <EventIconBox />
            <EventContextBox>
              <EventText style={{ fontWeight: "bold" }}>
                {t("Description")}
              </EventText>
              <EventDescriptionText>{description}</EventDescriptionText>
            </EventContextBox>
          </EventRowItem>
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

  renderTypeAndTimestamp = (data: CosmosTransactionItemData) => {
    const { tString } = this.props;
    const Icon = getCosmosTransactionTypeIcon(data.type);
    return (
      <EventRowItem style={{ minWidth: 230 }}>
        <EventIconBox>{Icon}</EventIconBox>
        <EventContextBox>
          <EventText style={{ fontWeight: "bold" }}>
            {getCosmosTransactionLabelFromType(data.type, tString)}
          </EventText>
          <EventText data-cy="transaction-timestamp">
            {formatDate(Number(data.timestamp))}{" "}
            {formatTime(Number(data.timestamp))}
          </EventText>
        </EventContextBox>
      </EventRowItem>
    );
  };

  renderTransactionAmount = (
    amount: Nullable<CosmosBalance>,
    timestamp: string,
  ) => {
    const { network, isDesktop } = this.props;
    if (!amount) {
      if (isDesktop) {
        return <EventRowItem style={{ minWidth: 275 }} />;
      } else {
        return null;
      }
    }

    const { fiatCurrency } = this.props;
    return (
      <EventRowItem style={{ minWidth: 275 }}>
        <EventIconBox>
          <NetworkLogoIcon network={network.name} />
        </EventIconBox>
        <EventContextBox>
          <EventText style={{ fontWeight: "bold" }}>
            {formatCurrencyAmount(
              denomToUnit(amount.amount, network.denominationSize),
            )}{" "}
            {amount.denom}
          </EventText>
          {amount.denom === network.denom && (
            <EventText>
              {this.getFiatAmount(amount.amount, timestamp)}{" "}
              {fiatCurrency.symbol}
            </EventText>
          )}
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
            validatorOperatorAddressMap={this.props.validatorOperatorAddressMap}
          />
        </EventIconBox>
        <EventContextBox>
          <EventText>{titleText}</EventText>
          <EventText style={{ fontWeight: "bold" }}>
            {this.props.addressOrValidator(address)}
          </EventText>
        </EventContextBox>
      </ClickableEventRow>
    );
  };

  renderTransactionHashLink = (hash: string, chain: string) => {
    // If viewing in the transaction list view, render a link to the detail
    // view. Otherwise just render a link to copy the hash.
    const TxHashLink = this.props.isDetailView ? (
      <ClickableEventRow onClick={() => copyTextToClipboard(hash)}>
        <EventIconBox>
          <LinkIcon />
        </EventIconBox>
        <EventContextBox>
          <EventText style={{ fontWeight: "bold" }}>Transaction Hash</EventText>
          <TransactionLinkText>{hash.slice(0, 15)}...</TransactionLinkText>
        </EventContextBox>
      </ClickableEventRow>
    ) : (
      <Link data-cy="transaction-hash-link" to={`txs/${hash}`}>
        <ClickableEventRow onClick={() => null}>
          <EventIconBox>
            <LinkIcon />
          </EventIconBox>
          <EventContextBox>
            <EventText style={{ fontWeight: "bold" }}>
              Transaction Hash
            </EventText>
            <TransactionLinkText>{hash.slice(0, 15)}...</TransactionLinkText>
          </EventContextBox>
        </ClickableEventRow>
      </Link>
    );

    return (
      <React.Fragment>
        {this.props.isDetailView && this.props.isDesktop ? (
          <Tooltip position={Position.TOP} content="Click to copy hash">
            {TxHashLink}
          </Tooltip>
        ) : (
          TxHashLink
        )}
        <EventRowItem>
          <EventIconBox />
          <Row key={hash} data-cy="transaction-list-item">
            <EventText>{justFormatChainString(chain)}</EventText>
          </Row>
        </EventRowItem>
      </React.Fragment>
    );
  };

  renderTransactionFeesRow = (
    fee: CosmosTransactionFee,
    transaction: ICosmosTransaction,
  ) => {
    if (!fee) {
      return null;
    }

    const { hash, height, timestamp, chain } = transaction;
    const { t, network, fiatCurrency } = this.props;
    const txFee = denomToUnit(fee.amount, network.denominationSize);
    const fiatFees = this.props.getFiatPriceForTransaction(timestamp, txFee);

    return (
      <EventRowBottom>
        <EventRowItem style={{ minWidth: 230 }}>
          <EventIconBox />
          <EventContextBox>
            <EventText style={{ fontWeight: "bold" }}>Block Height</EventText>
            <EventText>{height}</EventText>
          </EventContextBox>
        </EventRowItem>
        <EventRowItem style={{ minWidth: 275 }}>
          <EventIconBox />
          <EventContextBox>
            <EventText style={{ fontWeight: "bold" }}>{t("Fees")}</EventText>
            <EventText>
              {formatCurrencyAmount(txFee, 6)} {fee.denom}{" "}
              {fee.denom === network.denom && (
                <>
                  ({formatCurrencyAmount(fiatFees, 2)} {fiatCurrency.symbol})
                </>
              )}
            </EventText>
          </EventContextBox>
        </EventRowItem>
        {this.renderTransactionHashLink(hash, chain)}
      </EventRowBottom>
    );
  };

  getFiatAmount = (amount: string, timestamp: string) => {
    const { denominationSize } = this.props.network;
    return formatCurrencyAmount(
      this.props.getFiatPriceForTransaction(
        timestamp,
        denomToUnit(amount, denominationSize),
      ),
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

/**
 * Return the icon for a given transaction type.
 */
const getCosmosTransactionTypeIcon = (
  type: COSMOS_TRANSACTION_TYPES | TERRA_TRANSACTION_TYPES,
) => {
  switch (type) {
    case TERRA_TRANSACTION_TYPES.SEND:
    case TERRA_TRANSACTION_TYPES.MULTI_SEND:
    case COSMOS_TRANSACTION_TYPES.SEND:
      return <TxSendIcon />;
    case TERRA_TRANSACTION_TYPES.RECEIVE:
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
    case TERRA_TRANSACTION_TYPES.GOVERNANCE_DEPOSIT:
    case TERRA_TRANSACTION_TYPES.DELEGATE_FEED_CONSENT:
    case TERRA_TRANSACTION_TYPES.EXCHANGE_RATE_VOTE:
    case TERRA_TRANSACTION_TYPES.EXCHANGE_RATE_PRE_VOTE:
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
export const getCosmosTransactionLabelFromType = (
  transactionType: COSMOS_TRANSACTION_TYPES | TERRA_TRANSACTION_TYPES,
  tString: tFnString,
): string => {
  switch (transactionType) {
    case TERRA_TRANSACTION_TYPES.GOVERNANCE_DEPOSIT:
      return "Governance Deposit";
    case TERRA_TRANSACTION_TYPES.DELEGATE_FEED_CONSENT:
      return "Delegate Feed Consent";
    case TERRA_TRANSACTION_TYPES.EXCHANGE_RATE_VOTE:
      return "Exchange Rate Vote";
    case TERRA_TRANSACTION_TYPES.EXCHANGE_RATE_PRE_VOTE:
      return "Exchange Rate Pre Vote";
    case TERRA_TRANSACTION_TYPES.SEND:
    case TERRA_TRANSACTION_TYPES.MULTI_SEND:
    case COSMOS_TRANSACTION_TYPES.SEND:
      return tString("Send");
    case TERRA_TRANSACTION_TYPES.RECEIVE:
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
 * Export
 * ============================================================================
 */

export default CosmosTransactionListItem;
