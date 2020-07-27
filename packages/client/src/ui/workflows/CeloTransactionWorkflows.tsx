import {
  assertUnreachable,
  ICeloAccountBalances,
  ICeloValidatorGroup,
  IQuery,
} from "@anthem/utils";
import {
  Checkbox,
  Classes,
  Code,
  Colors,
  H3,
  H4,
  H5,
  H6,
  MenuItem,
  Switch,
} from "@blueprintjs/core";
import { IItemRendererProps, Select } from "@blueprintjs/select";
import { COLORS } from "constants/colors";
import { FiatCurrency } from "constants/fiat";
import {
  CeloAccountBalancesProps,
  CeloValidatorsProps,
  FiatPriceDataProps,
  withCeloAccountBalances,
  withCeloValidatorGroups,
  withFiatPriceData,
  withGraphQLVariables,
} from "graphql/queries";
import celoLedgerLib from "lib/celo-ledger-lib";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React, { ChangeEvent } from "react";
import { connect } from "react-redux";
import SyntaxHighlighter, {
  Prism as PrismSyntaxHighlighter,
} from "react-syntax-highlighter";
import { googlecode } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import styled from "styled-components";
import {
  capitalizeString,
  copyTextToClipboard,
  getAccountBalances,
  getBlockExplorerUrlForTransaction,
  mapRewardsToAvailableRewards,
  sortValidatorsChorusOnTop,
} from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import { TRANSACTION_STAGES } from "tools/cosmos-transaction-utils";
import {
  calculateTransactionAmount,
  denomToUnit,
  formatCurrencyAmount,
  unitToDenom,
} from "tools/currency-utils";
import { bold } from "tools/i18n-utils";
import {
  validateCosmosAddress,
  validateEthereumAddress,
  validateLedgerTransactionAmount,
} from "tools/validation-utils";
import { IThemeProps } from "ui/containers/ThemeContainer";
import { GraphQLGuardComponentMultipleQueries } from "ui/GraphQLGuardComponents";
import {
  Button,
  Centered,
  CopyIcon,
  CopyTextComponent,
  ErrorText,
  Link,
  LoaderBars,
  Row,
  TextInput,
  View,
} from "../SharedComponents";
import Toast from "../Toast";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

export interface AvailableReward {
  amount: string;
  denom: string;
  validator_address: string;
}

interface IState {
  gasPrice: string;
  gasAmount: string;
  amount: string;
  delegationTransactionInputError: string;
  recipientAddress: string;
  sendTransactionInputError: string;
  displayCustomGasSettings: boolean;
  claimsTransactionSetupError: string;
  useFullBalance: boolean;
  selectAllRewards: boolean;
  selectedRewards: ReadonlyArray<AvailableReward>;
}

const DEFAULT_GAS_PRICE = "0.01";
const DEFAULT_GAS_AMOUNT = "250000";

const ValidatorSelect = Select.ofType<ICeloValidatorGroup>();

/** ===========================================================================
 * React Component
 * ----------------------------------------------------------------------------
 * Transaction input component which provides transaction input validation.
 * ============================================================================
 */

class CreateTransactionForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      amount: "",
      selectedRewards: [],
      useFullBalance: false,
      selectAllRewards: false,
      displayCustomGasSettings: false,
      gasPrice: DEFAULT_GAS_PRICE,
      gasAmount: DEFAULT_GAS_AMOUNT,
      recipientAddress: "",
      claimsTransactionSetupError: "",
      sendTransactionInputError: "",
      delegationTransactionInputError: "",
    };
  }

  render(): Nullable<JSX.Element> {
    const { transactionStage } = this.props.transaction;
    const { ledgerActionType } = this.props.ledgerDialog;

    const stage = transactionStage;
    if (stage === TRANSACTION_STAGES.SIGN) {
      return this.renderTransactionSigningComponent();
    } else if (stage === TRANSACTION_STAGES.SIGN_ON_LEDGER) {
      return this.renderSignOnLedgerStep();
    } else if (stage === TRANSACTION_STAGES.CONFIRM) {
      return this.renderTransactionConfirmation();
    } else if (stage === TRANSACTION_STAGES.PENDING) {
      return this.renderPendingTransaction();
    } else if (stage === TRANSACTION_STAGES.SUCCESS) {
      return this.renderTransactionSuccess();
    }

    /**
     * Setup Stage:
     */
    switch (ledgerActionType) {
      case "DELEGATE":
        return this.renderDelegationTransactionSetup();
      case "CLAIM":
        return this.renderRewardsTransactionSetup();
      case "SEND":
        return this.renderSendReceiveTransactionSetup();
      case null:
        break;
      default:
        assertUnreachable(ledgerActionType);
    }

    return null;
  }

  renderSendReceiveTransactionSetup = () => {
    const {
      i18n,
      ledger,
      fiatCurrency,
      fiatPriceData,
      celoAccountBalances,
    } = this.props;
    const { address, network } = ledger;
    const { t, tString } = i18n;
    return (
      <GraphQLGuardComponentMultipleQueries
        tString={tString}
        results={[
          [celoAccountBalances, "celoAccountBalances"],
          [fiatPriceData, "fiatPriceData"],
        ]}
      >
        {([accountBalancesData, exchangeRate]: [
          ICeloAccountBalances,
          IQuery["fiatPriceData"],
        ]) => {
          const { availableGoldBalance } = accountBalancesData;
          const balance = renderCeloCurrency({
            denomSize: network.denominationSize,
            value: availableGoldBalance,
            fiatPrice: exchangeRate.price,
            convertToFiat: true,
          });
          const fiatBalance = renderCeloCurrency({
            denomSize: network.denominationSize,
            value: availableGoldBalance,
            fiatPrice: exchangeRate.price,
            convertToFiat: true,
          });

          return (
            <View>
              <p>
                {t("Available balance: {{balance}} ({{balanceFiat}})", {
                  balance: bold(`${balance} ${ledger.network.descriptor}`),
                  balanceFiat: `${fiatBalance} ${fiatCurrency.symbol}`,
                })}
              </p>
              <H6 style={{ marginTop: 6, marginBottom: 0 }}>
                Please enter an amount to send
              </H6>
              <View>
                <FormContainer>
                  <form
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                    data-cy="ledger-action-input-form"
                    onSubmit={(event: ChangeEvent<HTMLFormElement>) => {
                      event.preventDefault();
                      this.submitLedgerTransferAmount();
                    }}
                  >
                    <TextInput
                      autoFocus
                      label="Transaction Amount (CELO)"
                      onSubmit={this.submitLedgerTransferAmount}
                      style={{ ...InputStyles, marginBottom: 6, width: 150 }}
                      placeholder={tString("Enter an amount")}
                      data-cy="transaction-send-amount-input"
                      value={this.state.amount}
                      onChange={this.handleEnterLedgerActionAmount}
                    />
                    <TextInput
                      label={`Recipient Address (${ledger.network.name})`}
                      onSubmit={this.submitLedgerTransferAmount}
                      style={{ ...InputStyles, width: 400 }}
                      placeholder="Enter recipient address"
                      data-cy="transaction-send-recipient-input"
                      value={this.state.recipientAddress}
                      onChange={this.handleEnterRecipientAddress}
                    />
                    <Button
                      icon="duplicate"
                      onClick={() => copyTextToClipboard(address)}
                      style={{ bottom: -16, position: "absolute" }}
                    >
                      Receive
                    </Button>
                    {this.props.renderConfirmArrow(
                      tString("Generate My Transaction"),
                      this.submitLedgerTransferAmount,
                    )}
                  </form>
                </FormContainer>
                {this.state.sendTransactionInputError && (
                  <div style={{ marginTop: 6 }} className={Classes.LABEL}>
                    <ErrorText data-cy="amount-send-transaction-error">
                      {this.state.sendTransactionInputError}
                    </ErrorText>
                  </div>
                )}
              </View>
            </View>
          );
        }}
      </GraphQLGuardComponentMultipleQueries>
    );
  };

  renderSignOnLedgerStep = () => {
    return (
      <Centered style={{ flexDirection: "column" }}>
        <H5>Sign on Ledger</H5>
        <p>Please confirm the transaction details on your Ledger.</p>
      </Centered>
    );
  };

  renderRewardsTransactionSetup = () => {
    const {
      i18n,
      ledger,
      fiatCurrency,
      fiatPriceData,
      celoValidatorGroups,
      celoAccountBalances,
    } = this.props;
    const { t, tString } = i18n;
    const { network } = ledger;

    return (
      <GraphQLGuardComponentMultipleQueries
        tString={tString}
        results={[
          [celoAccountBalances, "celoAccountBalances"],
          [celoValidatorGroups, "celoValidatorGroups"],
          [fiatPriceData, "fiatPriceData"],
        ]}
      >
        {([accountBalancesData, validatorsList, fiatPrices]: readonly [
          ICeloAccountBalances,
          IQuery["cosmosValidators"],
          IQuery["fiatPriceData"],
        ]) => {
          const { pendingWithdrawalBalance } = accountBalancesData;

          // Proxy for no rewards available.
          if (pendingWithdrawalBalance === "0") {
            return (
              <View>
                <b>
                  {tString(
                    "You currently have no rewards available for withdrawal.",
                  )}
                </b>
              </View>
            );
          }

          return (
            <View>
              <p>
                {t(
                  "You have a total of {{rewards}} ({{rewardsUSD}}) rewards available to withdraw.",
                  {
                    rewards: bold(
                      `${pendingWithdrawalBalance} ${ledger.network.descriptor}`,
                    ),
                    rewardsUSD: `${pendingWithdrawalBalance} ${fiatCurrency.symbol}`,
                  },
                )}
              </p>
              <p>
                {tString(
                  "Select the rewards you wish to withdraw from the list:",
                )}
              </p>
              {/* {availableRewards.map((result, index) => {
                const checked = Boolean(
                  this.state.selectedRewards.find(
                    reward =>
                      reward.validator_address === result.validator_address,
                  ),
                );

                // If the validator is out of the elected set it will not be
                // in the validatorList!
                const validator = validatorsList.find(
                  v => v.operator_address === result.validator_address,
                );

                if (!validator) {
                  return null;
                }

                return (
                  <RewardsSelectBlock key={result.validator_address}>
                    <Checkbox
                      readOnly
                      checked={checked}
                      style={{ margin: 0 }}
                      data-cy={`validator-check-option-${index}`}
                      onClick={(e: React.FormEvent<HTMLInputElement>) => {
                        this.toggleRewardsClaimOption(result, !checked);
                      }}
                    />
                    <b>{validator.description.moniker}</b>
                    <p style={{ margin: 0, marginLeft: 4 }}>
                      {formatCurrencyAmount(
                        denomToUnit(
                          result.amount,
                          network.denominationSize,
                          String,
                        ),
                        4,
                      )}{" "}
                      {ledger.network.descriptor}
                    </p>
                  </RewardsSelectBlock>
                );
              })}
              {availableRewards.length > 1 && (
                <Button
                  category="PRIMARY"
                  style={{ marginTop: 14, width: 155 }}
                  data-cy="rewards-claim-all-button"
                  onClick={() => this.handleSelectAllRewards(availableRewards)}
                >
                  {this.state.selectAllRewards ? "Unselect" : "Select"} All
                  Rewards
                </Button>
              )} */}
              <DividerLine />
              {this.renderGasPriceSetup()}
              {this.state.claimsTransactionSetupError && (
                <div style={{ marginTop: 12 }} className={Classes.LABEL}>
                  <ErrorText data-cy="claims-transaction-error">
                    {this.state.claimsTransactionSetupError}
                  </ErrorText>
                </div>
              )}
              {this.props.renderConfirmArrow(
                tString("Generate My Transaction"),
                this.getRewardsClaimTransaction,
              )}
            </View>
          );
        }}
      </GraphQLGuardComponentMultipleQueries>
    );
  };

  handleSelectAllRewards = (availableRewards: AvailableReward[]) => {
    this.setState(ps => ({
      selectAllRewards: !ps.selectAllRewards,
      selectedRewards: ps.selectAllRewards ? [] : availableRewards,
    }));
  };

  toggleRewardsClaimOption = (result: AvailableReward, checked: boolean) => {
    // Select or unselect a selected rewards claim.
    this.setState(({ selectedRewards }) => {
      return {
        selectedRewards: checked
          ? selectedRewards.concat(result)
          : selectedRewards.filter(
              selected =>
                selected.validator_address !== result.validator_address,
            ),
      };
    });
  };

  renderDelegationTransactionSetup = () => {
    const {
      i18n,
      ledger,
      fiatCurrency,
      transaction,
      fiatPriceData,
      celoValidatorGroups,
      celoAccountBalances,
    } = this.props;
    const { network } = ledger;
    const { t, tString } = i18n;
    const { selectedValidatorForDelegation } = transaction;
    const group = selectedValidatorForDelegation
      ? (selectedValidatorForDelegation as ICeloValidatorGroup)
      : null;
    return (
      <GraphQLGuardComponentMultipleQueries
        tString={tString}
        results={[
          [celoValidatorGroups, "celoValidatorGroups"],
          [celoAccountBalances, "celoAccountBalances"],
          [fiatPriceData, "fiatPriceData"],
        ]}
      >
        {([celoValidatorGroupsData, accountBalancesData, exchangeRate]: [
          IQuery["celoValidatorGroups"],
          ICeloAccountBalances,
          IQuery["fiatPriceData"],
        ]) => {
          const { nonVotingLockedGoldBalance } = accountBalancesData;
          const balance = renderCeloCurrency({
            denomSize: network.denominationSize,
            value: nonVotingLockedGoldBalance,
            fiatPrice: exchangeRate.price,
            convertToFiat: false,
          });
          const fiatBalance = renderCeloCurrency({
            denomSize: network.denominationSize,
            value: nonVotingLockedGoldBalance,
            fiatPrice: exchangeRate.price,
            convertToFiat: true,
          });
          return (
            <View>
              <p>
                Non-voting locked gold:{" "}
                {bold(`${balance} ${ledger.network.descriptor}`)} ({fiatBalance}{" "}
                {fiatCurrency.symbol})
              </p>
              <H6 style={{ marginTop: 8, marginBottom: 8 }}>
                Selected Validator Group:
              </H6>
              <ValidatorSelect
                popoverProps={{
                  onClose: this.setCanEscapeKeyCloseDialog(true),
                  popoverClassName: "ValidatorCompositionSelect",
                }}
                onItemSelect={this.handleSelectValidator}
                itemRenderer={this.renderValidatorSelectItem}
                itemPredicate={this.setValidatorSelectItemPredicate}
                items={sortValidatorsChorusOnTop<ICeloValidatorGroup>(
                  celoValidatorGroupsData,
                  v => v.group,
                )}
              >
                <Button
                  category="SECONDARY"
                  rightIcon="caret-down"
                  onClick={this.setCanEscapeKeyCloseDialog(false)}
                  data-cy="validator-composition-select-menu"
                >
                  {group ? group.name : "Choose Validator Group"}
                </Button>
              </ValidatorSelect>
              <H6 style={{ marginTop: 12, marginBottom: 0 }}>
                Please enter an amount to vote for this validator group
              </H6>
              <View style={{ marginTop: 12 }}>
                <FormContainer>
                  <form
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                    data-cy="ledger-action-input-form"
                    onSubmit={(event: ChangeEvent<HTMLFormElement>) => {
                      event.preventDefault();
                      this.submitLedgerVoteForValidatorGroup();
                    }}
                  >
                    <TextInput
                      autoFocus
                      label="Transaction Amount (CELO)"
                      onSubmit={this.submitLedgerVoteForValidatorGroup}
                      style={{ ...InputStyles, width: 300 }}
                      placeholder={tString("Enter an amount")}
                      data-cy="transaction-amount-input"
                      value={this.state.amount}
                      onChange={this.handleEnterLedgerActionAmount}
                    />
                    <Switch
                      checked={this.state.useFullBalance}
                      style={{ marginTop: 24 }}
                      data-cy="transaction-delegate-all-toggle"
                      label="Vote Max"
                      onChange={this.toggleFullBalance}
                    />
                    {this.props.renderConfirmArrow(
                      tString("Generate My Transaction"),
                      this.submitLedgerVoteForValidatorGroup,
                    )}
                  </form>
                </FormContainer>
                {this.state.delegationTransactionInputError && (
                  <div style={{ marginTop: 12 }} className={Classes.LABEL}>
                    <ErrorText data-cy="amount-transaction-error">
                      {this.state.delegationTransactionInputError}
                    </ErrorText>
                  </div>
                )}
              </View>
            </View>
          );
        }}
      </GraphQLGuardComponentMultipleQueries>
    );
  };

  setValidatorSelectItemPredicate = (
    query: string,
    validator: ICeloValidatorGroup,
  ) => {
    const validatorName = validator.name;
    const normalizedName = validatorName.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    return normalizedName.indexOf(normalizedQuery) >= 0;
  };

  renderValidatorSelectItem = (
    validator: ICeloValidatorGroup,
    { handleClick, modifiers }: IItemRendererProps,
  ) => {
    return (
      <MenuItem
        onClick={handleClick}
        active={modifiers.active}
        key={validator.group}
        text={validator.name}
        data-cy={`${validator.name}-delegation-option`}
      />
    );
  };

  handleSelectValidator = (validator: ICeloValidatorGroup) => {
    this.setState(
      {
        claimsTransactionSetupError: "",
      },
      () => this.props.setDelegationValidatorSelection(validator),
    );
  };

  setCanEscapeKeyCloseDialog = (canClose: boolean) => () => {
    this.props.setCanEscapeKeyCloseDialog(canClose);
  };

  renderGasPriceSetup = () => {
    const { t, tString } = this.props.i18n;
    return (
      <View>
        <p style={{ marginTop: 12 }}>
          {t("Default gas price: {{price}} ", { price: <b>0.01 CELO.</b> })}
          <Link
            testID="toggle-custom-gas-settings"
            onClick={this.toggleCustomGasPrice}
          >
            {!this.state.displayCustomGasSettings
              ? tString("Enter a custom gas price.")
              : tString("Use the default gas price.")}
          </Link>
        </p>
        <p style={{ fontSize: 12 }}>
          <b>{tString("Note:")}</b> "We are currently using a default gasPrice
          of 0.01 CELO, feel free to adjust this value depending on network
          conditions."
        </p>
        {this.state.displayCustomGasSettings && (
          <Row style={{ justifyContent: "flex-start" }}>
            <TextInput
              autoFocus
              label="Gas Price (CELO)"
              style={InputStyles}
              data-cy="custom-gas-price-input"
              placeholder="Enter a gas price (CELO)"
              value={this.state.gasPrice}
              onChange={this.handleEnterCustomGasValues("gasPrice")}
            />
            <TextInput
              style={InputStyles}
              label={tString("Gas Amount")}
              data-cy="custom-gas-amount-input"
              placeholder={tString("Enter a custom gas amount")}
              value={this.state.gasAmount}
              onChange={this.handleEnterCustomGasValues("gasAmount")}
            />
          </Row>
        )}
      </View>
    );
  };

  renderTransactionSigningComponent = () => {
    const { tString } = this.props.i18n;
    const { denominationSize } = this.props.ledger.network;
    const { transactionData } = this.props.transaction;
    const { ledgerActionType } = this.props.ledgerDialog;
    const IS_SEND = ledgerActionType === "SEND";

    if (IS_SEND && transactionData) {
      const { amount, to } = transactionData;
      const value = denomToUnit(amount, denominationSize);
      return (
        <View>
          <div>
            <p>
              <b>Please note:</b> The CELO token transfer will be conducted via
              the Celo Golden Token Contract:{" "}
            </p>
            <p style={{ marginTop: 12 }}>
              <Code>0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9</Code>
            </p>
            <p style={{ marginTop: 12 }}>
              {value} CELO will be sent to this contract which will then conduct
              the CELO transfer to the recipient address:
            </p>
            <p style={{ marginTop: 12 }}>
              <Code>{to}</Code>
            </p>
            <p style={{ marginTop: 12 }}>
              You will be asked to confirm these details on your Ledger Device.
              Signing the transaction will then submit it to the network for
              processing.
            </p>
            <p style={{ marginTop: 12 }}>
              Press "Sign Transaction" to continue.
            </p>
          </div>
          {!this.props.transaction.signPending &&
            this.props.renderConfirmArrow(tString("Sign Transaction"), () => {
              this.props.setTransactionStage(TRANSACTION_STAGES.SIGN_ON_LEDGER);
              this.props.signTransaction();
            })}
        </View>
      );
    }

    const jsonStyles = {
      margin: 0,
      height: 125,
      fontSize: 11,
      borderRadius: 2,
    };

    // Convert to JSON:
    const json = JSON.stringify(transactionData, null, 2);

    const TX_JSON = this.props.isDarkTheme ? (
      <PrismSyntaxHighlighter
        language="json"
        style={atomDark}
        customStyle={jsonStyles}
      >
        {json}
      </PrismSyntaxHighlighter>
    ) : (
      <SyntaxHighlighter
        language="json"
        style={googlecode}
        customStyle={jsonStyles}
      >
        {json}
      </SyntaxHighlighter>
    );

    return (
      <View>
        {TX_JSON}
        <p style={{ marginTop: 12, marginBottom: 0 }}>
          {this.props.transaction.signPending
            ? tString(
                "Please confirm the transaction data exactly matches what is displayed on your Ledger Device.",
              )
            : tString(
                "Select “Sign Transaction” to confirm the transaction details on your Ledger.",
              )}
        </p>
        {!this.props.transaction.signPending &&
          this.props.renderConfirmArrow(tString("Sign Transaction"), () =>
            this.props.signTransaction(),
          )}
      </View>
    );
  };

  renderTransactionConfirmation = () => {
    const { tString } = this.props.i18n;
    const { network } = this.props.ledger;
    return (
      <Centered style={{ flexDirection: "column" }}>
        {this.props.transaction.broadcastingTransaction ? (
          <Centered style={{ flexDirection: "column" }}>
            <H4>{tString("Submitting Transaction...")}</H4>
            <H6>
              {tString("Waiting for confirmation from the blockchain...")}
            </H6>
            <LoaderBars style={{ marginTop: 16, marginBottom: 16 }} />
          </Centered>
        ) : (
          <React.Fragment>
            <H3>{tString("Transaction signed successfully!")}</H3>
            <p style={{ marginTop: 8 }}>
              {tString("Confirm to submit your transaction to {{network}}.", {
                network: capitalizeString(network.name),
              })}
            </p>
            <Row
              style={{
                width: 175,
                marginTop: 12,
                justifyContent: "space-between",
              }}
            >
              <Button
                category="DANGER"
                data-cy="transaction-cancel-button"
                onClick={this.props.closeLedgerDialog}
              >
                {tString("Cancel")}
              </Button>
              <Button
                data-cy="transaction-submit-button"
                onClick={this.props.broadcastTransaction}
              >
                {tString("Submit")}
              </Button>
            </Row>
          </React.Fragment>
        )}
      </Centered>
    );
  };

  renderPendingTransaction = () => {
    return (
      <Centered style={{ flexDirection: "column" }}>
        <H4>
          {this.props.i18n.tString(
            "Waiting for confirmation from the blockchain...",
          )}
        </H4>
        <LoaderBars style={{ marginTop: 16, marginBottom: 16 }} />
      </Centered>
    );
  };

  renderTransactionSuccess = () => {
    const { i18n, transaction, ledger } = this.props;
    const { t, tString } = i18n;
    const { transactionResult } = transaction;
    const { transactionHash, blockNumber } = transactionResult;

    return (
      <Centered style={{ flexDirection: "column" }}>
        <H5>{tString("Transaction Confirmed!")}</H5>
        <p style={{ textAlign: "center" }}>
          {t(
            "Your transaction is successful and was included at block height {{height}}. It may take a few moments for the updates to appear in Anthem.",
            {
              height: blockNumber,
            },
          )}
        </p>
        <TransactionHashText>{transactionHash}</TransactionHashText>
        <CopyTextComponent
          textToCopy={transactionHash}
          onCopy={() =>
            Toast.success(this.props.i18n.tString("Transaction hash copied."))
          }
        >
          <Row>
            <Link style={{ margin: 0 }}>
              {tString("Copy Transaction Hash")}
            </Link>
            <CopyIcon style={{ marginLeft: 8 }} color={COLORS.LIGHT_GRAY} />
          </Row>
        </CopyTextComponent>
        <Link
          style={{ marginTop: 12 }}
          href={getBlockExplorerUrlForTransaction(
            transactionHash,
            ledger.network.name,
          )}
        >
          {tString("View on a block explorer")}
        </Link>
        <Button
          data-cy="transaction-dialog-close-button"
          style={{ marginTop: 16 }}
          onClick={() => {
            this.props.refetch();
            this.props.closeLedgerDialog();
          }}
        >
          {tString("Close")}
        </Button>
      </Centered>
    );
  };

  toggleFullBalance = () => {
    const { celoAccountBalances, ledger } = this.props;
    const { denominationSize } = ledger.network;
    const balancesData = celoAccountBalances.celoAccountBalances;
    const { nonVotingLockedGoldBalance } = balancesData;
    this.setState(
      prevState => ({
        useFullBalance: !prevState.useFullBalance,
      }),
      () => {
        if (this.state.useFullBalance) {
          const max = denomToUnit(nonVotingLockedGoldBalance, denominationSize);
          this.setState({ amount: max });
        }
      },
    );
  };

  getMaximumAmount = () => {
    const { fiatPriceData, celoAccountBalances, ledger } = this.props;
    const { ledgerActionType } = this.props.ledgerDialog;
    const IS_CLAIM = ledgerActionType === "CLAIM";

    const balancesData = celoAccountBalances.celoAccountBalances;

    const { availableGoldBalance, pendingWithdrawalBalance } = balancesData;
    const balance = availableGoldBalance;
    const rewards = pendingWithdrawalBalance;
    const targetValue = (IS_CLAIM ? rewards : balance).replace(",", "");
    const maximumAmountAfterFees = calculateTransactionAmount(
      targetValue,
      this.state.gasPrice,
      this.state.gasAmount,
      ledger.network,
    );

    return maximumAmountAfterFees;
  };

  handleEnterRecipientAddress = (recipient: string) => {
    this.setState({ recipientAddress: recipient }, () => {
      const { recipientAddress } = this.state;
      if (recipientAddress) {
        // if (!validateCosmosAddress(recipientAddress)) {
        //   Toast.warn(
        //     "Please ensure the entered address is a valid Cosmos address.",
        //   );
        // }
      }
    });
  };

  handleEnterLedgerActionAmount = (value: string) => {
    if (!isNaN(Number(value)) || value === "") {
      this.setState({
        amount: value,
      });
    }
  };

  handleEnterCustomGasValues = (field: keyof IState) => (value: string) => {
    if (!isNaN(Number(value)) || value === "") {
      this.setState(
        prev => ({
          ...prev,
          [field]: value,
        }),
        this.updateValues,
      );
    }
  };

  updateValues = () => {
    const { network } = this.props.ledger;
    const { amount, gasPrice, gasAmount, useFullBalance } = this.state;
    const doNotUpdate = gasPrice === "" || gasAmount === "";

    if (!doNotUpdate && this.state.amount !== "") {
      const maximumAmount = this.getMaximumAmount();
      const updatedAmountValue = calculateTransactionAmount(
        useFullBalance ? maximumAmount : amount,
        gasPrice,
        gasAmount,
        network,
      );

      this.setState(
        {
          amount: updatedAmountValue,
        },
        this.updateAmountError,
      );
    }
  };

  toggleCustomGasPrice = () => {
    this.setState(
      prev => ({
        displayCustomGasSettings: !prev.displayCustomGasSettings,
      }),
      () => {
        if (!this.state.displayCustomGasSettings) {
          this.setState(
            {
              gasPrice: DEFAULT_GAS_PRICE,
              gasAmount: DEFAULT_GAS_AMOUNT,
            },
            this.updateValues,
          );
        }
      },
    );
  };

  updateAmountError = () => {
    const amountError = validateLedgerTransactionAmount(
      this.state.amount,
      this.getMaximumAmount(),
      this.props.i18n.tString,
    );

    this.setState({ delegationTransactionInputError: amountError });
  };

  submitLedgerTransferAmount = () => {
    const { amount } = this.state;
    const { celoAccountBalances } = this.props.celoAccountBalances;
    const { availableGoldBalance } = celoAccountBalances;
    const maximumAmount = availableGoldBalance;

    const amountError = validateLedgerTransactionAmount(
      amount,
      maximumAmount,
      this.props.i18n.tString,
    );

    this.setState(
      {
        sendTransactionInputError: amountError,
        delegationTransactionInputError: amountError,
      },
      () => {
        if (amountError === "") {
          this.getSendTransaction();
        }
      },
    );
  };

  getSendTransaction = async () => {
    const { amount, recipientAddress } = this.state;
    const { network, address } = this.props.ledger;
    const { denominationSize } = network;

    if (!validateEthereumAddress(recipientAddress)) {
      return this.setState({
        sendTransactionInputError: "Please enter a valid recipient address",
      });
    } else if (!amount) {
      return this.setState({
        sendTransactionInputError: "Please enter a transaction amount",
      });
    }

    const data = {
      from: address,
      to: recipientAddress,
      amount: unitToDenom(amount, denominationSize),
    };

    this.props.setTransactionData(data);
  };

  submitLedgerVoteForValidatorGroup = () => {
    const { amount } = this.state;
    const { celoAccountBalances } = this.props.celoAccountBalances;
    const { nonVotingLockedGoldBalance } = celoAccountBalances;
    const maximumAmount = nonVotingLockedGoldBalance;

    const amountError = validateLedgerTransactionAmount(
      amount,
      maximumAmount,
      this.props.i18n.tString,
    );

    this.setState(
      {
        sendTransactionInputError: amountError,
        delegationTransactionInputError: amountError,
      },
      () => {
        if (amountError === "") {
          this.getDelegationTransaction();
        }
      },
    );
  };

  getDelegationTransaction = () => {
    const { amount } = this.state;
    const { transaction } = this.props;
    const { selectedValidatorForDelegation } = transaction;
    const { network, address } = this.props.ledger;
    const { denominationSize } = network;

    if (!selectedValidatorForDelegation) {
      return this.setState({
        delegationTransactionInputError:
          "Please choose a validator to delegate to.",
      });
    }

    const group = selectedValidatorForDelegation as ICeloValidatorGroup;

    const data = {
      group: group.group,
      from: address,
      amount: unitToDenom(amount, denominationSize),
    };

    this.props.setTransactionData(data);
  };

  getRewardsClaimTransaction = () => {
    const { gasAmount, gasPrice, selectedRewards } = this.state;
    const { network, address } = this.props.ledger;
    const { denom } = network;

    // TODO: Implement!
  };
}

/** ===========================================================================
 * Styled Components
 * ============================================================================
 */

interface RenderCurrencyArgs {
  value: string;
  denomSize: number;
  fiatPrice: number;
  convertToFiat?: boolean;
}

// Helper to render Celo currency values
const renderCeloCurrency = (args: RenderCurrencyArgs) => {
  const { value, denomSize, fiatPrice, convertToFiat } = args;
  let result = denomToUnit(value, denomSize, Number);
  if (convertToFiat) {
    result = fiatPrice * result;
  }
  return formatCurrencyAmount(result);
};

const FormContainer = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: row;
`;

const InputStyles = {
  width: 200,
  marginRight: 8,
  borderRadius: 1,
};

const TransactionHashText = styled(Code)`
  font-size: 12px;
  margin-top: 12px;
  margin-bottom: 16px;
  word-wrap: break-word;
`;

const RewardsSelectBlock = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const DividerLine = styled.div`
  height: 1px;
  margin-top: 16px;
  margin-bottom: 8px;
  width: 100%;
  border-top-width: 1px;
  border-top-style: solid;
  background: transparent;
  border-top-color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.DARK_GRAY5 : Colors.LIGHT_GRAY1};
`;

/** ===========================================================================
 * Export
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  ledger: Modules.selectors.ledger.ledgerSelector(state),
  ledgerDialog: Modules.selectors.ledger.ledgerDialogSelector(state),
  transaction: Modules.selectors.transaction.transactionsSelector(state),
});

const dispatchProps = {
  refetch: Modules.actions.app.refreshBalanceAndTransactions,
  closeLedgerDialog: Modules.actions.ledger.closeLedgerDialog,
  signTransaction: Modules.actions.transaction.signTransaction,
  setTransactionStage: Modules.actions.transaction.setTransactionStage,
  setTransactionData: Modules.actions.transaction.setTransactionData,
  broadcastTransaction: Modules.actions.transaction.broadcastTransaction,
  setDelegationValidatorSelection:
    Modules.actions.transaction.setDelegationValidatorSelection,
};

const withProps = connect(mapStateToProps, dispatchProps);

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

interface ComponentProps {
  isDarkTheme: boolean;
  fiatCurrency: FiatCurrency;
  setCanEscapeKeyCloseDialog: (canClose: boolean) => void;
  renderConfirmArrow: (text: string, callback: () => void) => void;
}

interface IProps
  extends ComponentProps,
    ConnectProps,
    CeloValidatorsProps,
    CeloAccountBalancesProps,
    FiatPriceDataProps {}

export default composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withCeloValidatorGroups,
  withFiatPriceData,
  withCeloAccountBalances,
)(CreateTransactionForm);
