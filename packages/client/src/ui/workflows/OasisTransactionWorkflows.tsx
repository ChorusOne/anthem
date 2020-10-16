import {
  assertUnreachable,
  IOasisAccountBalances,
  IQuery,
} from "@anthem/utils";
import {
  Classes,
  Code,
  H3,
  H4,
  H5,
  H6,
  MenuItem,
  Switch,
} from "@blueprintjs/core";
import { IItemRendererProps } from "@blueprintjs/select";
import { COLORS } from "constants/colors";
import { FiatCurrency } from "constants/fiat";
import {
  FiatPriceDataProps,
  OasisAccountBalancesProps,
  withFiatPriceData,
  withGraphQLVariables,
  withOasisAccountBalances,
} from "graphql/queries";
import {
  IOasisTransactionReceipt,
  OasisDelegateArgs,
  OasisTransferArgs,
  OasisUndelegateArgs,
} from "lib/oasis-ledger-lib";
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
  getBlockExplorerUrlForTransaction,
} from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import { TRANSACTION_STAGES } from "tools/cosmos-transaction-utils";
import { renderCurrencyValue, unitToDenom } from "tools/currency-utils";
import { bold } from "tools/i18n-utils";
import {
  validateBech32Address,
  validateLedgerTransactionAmount,
} from "tools/validation-utils";
import { GraphQLGuardComponentMultipleQueries } from "ui/GraphQLGuardComponents";
import {
  AddressQR,
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

interface IState {
  amount: string;
  recipientAddress: string;
  useFullBalance: boolean;
  displayReceiveQR: boolean;
  transactionSetupError: string;
}

/**
 * [OASIS LEDGER TODO]: We will probably need an API to provide an Oasis
 * validator list, if possible. Otherwise, the delegation transaction workflow
 * would require the user to simply supply the address of the validator they
 * wish to delegate to.
 */
// const ValidatorSelect = Select.ofType<any>();

/** ===========================================================================
 * Oasis Transaction Workflows
 * ----------------------------------------------------------------------------
 * Transaction input component which provides transaction input validation.
 *
 * [OASIS LEDGER TODO]: This file will include the UI for the other Oasis
 * Ledger workflows. Currently, it includes the UI for the transfer
 * transaction.
 * ============================================================================
 */

class OasisTransactionForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      amount: "",
      useFullBalance: false,
      recipientAddress: "",
      displayReceiveQR: false,
      transactionSetupError: "",
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
      case "SEND":
        return this.renderSendReceiveTransactionSetup();
      case "DELEGATE":
        return this.renderDelegateTransactionSetup();
      case "UNDELEGATE":
        return this.renderUndelegateTransactionSetup();
      case "CLAIM":
      case "LOCK_GOLD":
      case "UNLOCK_GOLD":
      case "VOTE_GOLD":
      case "WITHDRAW":
      case "ACTIVATE_VOTES":
      case "REVOKE_VOTES":
      case "UPVOTE_PROPOSAL":
      case "VOTE_FOR_PROPOSAL":
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
      // fiatCurrency,
      // fiatPriceData,
      oasisAccountBalances,
    } = this.props;
    const { displayReceiveQR } = this.state;
    const { address, network } = ledger;
    const { tString } = i18n;

    if (displayReceiveQR) {
      return (
        <View>
          <AddressQR address={address} />
          <Button
            icon="arrow-left"
            style={{ bottom: -16, position: "absolute" }}
            onClick={() => this.setState({ displayReceiveQR: false })}
          >
            Back
          </Button>
        </View>
      );
    }

    return (
      <GraphQLGuardComponentMultipleQueries
        tString={tString}
        results={[
          [oasisAccountBalances, "oasisAccountBalances"],
          // TODO: Re-enable when Oasis has price data:
          // [fiatPriceData, "fiatPriceData"],
        ]}
      >
        {([accountBalancesData, exchangeRate]: [
          IOasisAccountBalances,
          IQuery["fiatPriceData"],
        ]) => {
          const { available } = accountBalancesData;
          const balance = renderCurrencyValue({
            denomSize: network.denominationSize,
            value: available,
            // fiatPrice: exchangeRate.price,
            fiatPrice: 0,
            convertToFiat: false,
          });
          // const fiatBalance = renderCurrencyValue({
          //   denomSize: network.denominationSize,
          //   value: available,
          //   fiatPrice: exchangeRate.price,
          //   convertToFiat: true,
          // });

          return (
            <View>
              <p>
                {/* {t("Available balance: {{balance}} ({{balanceFiat}})", {
                  balance: bold(`${balance} ${ledger.network.descriptor}`),
                  balanceFiat: `${fiatBalance} ${fiatCurrency.symbol}`,
                })} */}
                Available balance: {balance}
              </p>
              <H6 style={{ marginTop: 6, marginBottom: 0 }}>
                Please enter an amount to transfer.
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
                      label="Transaction Amount (ROSE)"
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
                      style={{ bottom: -16, position: "absolute" }}
                      onClick={() => this.setState({ displayReceiveQR: true })}
                    >
                      Receive
                    </Button>
                    {this.props.renderConfirmArrow(
                      tString("Generate My Transaction"),
                      this.submitLedgerTransferAmount,
                    )}
                  </form>
                </FormContainer>
                {this.state.transactionSetupError && (
                  <div style={{ marginTop: 6 }} className={Classes.LABEL}>
                    <ErrorText data-cy="amount-send-transaction-error">
                      {this.state.transactionSetupError}
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

  renderDelegateTransactionSetup = () => {
    const {
      i18n,
      ledger,
      fiatCurrency,
      fiatPriceData,
      oasisAccountBalances,
    } = this.props;
    const { network } = ledger;
    const { tString } = i18n;
    return (
      <GraphQLGuardComponentMultipleQueries
        tString={tString}
        results={[
          [oasisAccountBalances, "oasisAccountBalances"],
          [fiatPriceData, "fiatPriceData"],
        ]}
      >
        {([accountBalancesData, exchangeRate]: [
          IOasisAccountBalances,
          IQuery["fiatPriceData"],
        ]) => {
          const { available } = accountBalancesData;
          const balance = renderCurrencyValue({
            denomSize: network.denominationSize,
            value: available,
            fiatPrice: exchangeRate.price,
            convertToFiat: false,
          });
          const fiatBalance = renderCurrencyValue({
            denomSize: network.denominationSize,
            value: available,
            fiatPrice: exchangeRate.price,
            convertToFiat: true,
          });
          return (
            <View>
              <p>Choose a validator to delegate to.</p>
              <p style={{ marginTop: 8 }}>
                Available: {bold(`${balance} ${ledger.network.descriptor}`)} (
                {fiatBalance} {fiatCurrency.symbol})
              </p>
              <H6 style={{ marginTop: 12, marginBottom: 0 }}>
                Please enter an amount of available ROSE to delegate:
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
                      this.submitDelegationAmount();
                    }}
                  >
                    <TextInput
                      autoFocus
                      label="Amount of ROSE to delegate"
                      onSubmit={this.submitDelegationAmount}
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
                      label="Delegate Max"
                      onChange={() => this.toggleFullBalance(balance)}
                    />
                    {this.props.renderConfirmArrow(
                      tString("Generate My Transaction"),
                      this.submitDelegationAmount,
                    )}
                  </form>
                </FormContainer>
                {this.state.transactionSetupError && (
                  <div style={{ marginTop: 12 }} className={Classes.LABEL}>
                    <ErrorText data-cy="amount-transaction-error">
                      {this.state.transactionSetupError}
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

  renderUndelegateTransactionSetup = () => {
    const {
      i18n,
      ledger,
      fiatCurrency,
      fiatPriceData,
      oasisAccountBalances,
    } = this.props;
    const { network } = ledger;
    const { tString } = i18n;
    return (
      <GraphQLGuardComponentMultipleQueries
        tString={tString}
        results={[
          [oasisAccountBalances, "oasisAccountBalances"],
          [fiatPriceData, "fiatPriceData"],
        ]}
      >
        {([accountBalancesData, exchangeRate]: [
          IOasisAccountBalances,
          IQuery["fiatPriceData"],
        ]) => {
          const { staked } = accountBalancesData;
          const balance = renderCurrencyValue({
            denomSize: network.denominationSize,
            value: staked.balance,
            fiatPrice: exchangeRate.price,
            convertToFiat: false,
          });
          const fiatBalance = renderCurrencyValue({
            denomSize: network.denominationSize,
            value: staked.balance,
            fiatPrice: exchangeRate.price,
            convertToFiat: true,
          });
          return (
            <View>
              <p style={{ marginTop: 8 }}>
                Staked ROSE amount:{" "}
                {bold(`${balance} ${ledger.network.descriptor}`)} ({fiatBalance}{" "}
                {fiatCurrency.symbol})
              </p>
              <H6 style={{ marginTop: 12, marginBottom: 0 }}>
                Please enter an amount of available ROSE to undelegate:
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
                      this.submitDelegationAmount();
                    }}
                  >
                    <TextInput
                      autoFocus
                      label="Unlock Amount (ROSE)"
                      onSubmit={this.submitDelegationAmount}
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
                      label="Unstake max"
                      onChange={() => this.toggleFullBalance(balance)}
                    />
                    {this.props.renderConfirmArrow(
                      tString("Generate My Transaction"),
                      this.submitUndelegateTransactionSetup,
                    )}
                  </form>
                </FormContainer>
                {this.state.transactionSetupError && (
                  <div style={{ marginTop: 12 }} className={Classes.LABEL}>
                    <ErrorText data-cy="amount-transaction-error">
                      {this.state.transactionSetupError}
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

  setValidatorSelectItemPredicate = (query: string, validator: any) => {
    const validatorName = validator.name;
    const normalizedName = validatorName.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    return normalizedName.indexOf(normalizedQuery) >= 0;
  };

  renderValidatorSelectItem = (
    validator: any,
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

  handleSelectValidator = (validator: any) => {
    this.setState(
      {
        transactionSetupError: "",
      },
      () => this.props.setDelegationValidatorSelection(validator),
    );
  };

  setCanEscapeKeyCloseDialog = (canClose: boolean) => () => {
    this.props.setCanEscapeKeyCloseDialog(canClose);
  };

  renderTransactionSigningComponent = () => {
    const { tString } = this.props.i18n;
    const { transactionData } = this.props.transaction;
    const { ledgerActionType } = this.props.ledgerDialog;
    const DISPLAY_JSON = ledgerActionType !== "ACTIVATE_VOTES";

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
        {DISPLAY_JSON && TX_JSON}
        <p style={{ marginTop: 12, marginBottom: 0 }}>
          {this.props.transaction.signPending
            ? tString(
                "Please confirm the transaction data exactly matches what is displayed on your Ledger Device.",
              )
            : tString(
                "Select “Sign Transaction” to confirm the transaction details on your Ledger.",
              )}
        </p>
        <p style={{ marginTop: 12, marginBottom: 0 }}>
          Note that CELO transactions are sent to special contract addresses, so
          you will see a contract address to confirm on your Ledger confirmation
          dialog.
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

    if (!transactionResult) {
      return (
        <Centered>
          <p>No transaction data found...</p>
        </Centered>
      );
    }

    const tx = transactionResult as IOasisTransactionReceipt;
    const { hash, height } = tx;

    return (
      <Centered style={{ flexDirection: "column" }}>
        <H5>{tString("Transaction Confirmed!")}</H5>
        <p style={{ textAlign: "center" }}>
          {t(
            "Your transaction is successful and was included at block height {{height}}. It may take a few moments for the updates to appear in Anthem.",
            {
              height,
            },
          )}
        </p>
        <TransactionHashText>{hash}</TransactionHashText>
        <CopyTextComponent
          textToCopy={hash}
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
          href={getBlockExplorerUrlForTransaction(hash, ledger.network.name)}
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

  toggleFullBalance = (maxAmount: string) => {
    this.setState(
      prevState => ({
        useFullBalance: !prevState.useFullBalance,
      }),
      () => {
        if (this.state.useFullBalance) {
          this.setState({ amount: maxAmount });
        }
      },
    );
  };

  handleEnterRecipientAddress = (recipient: string) => {
    this.setState({ recipientAddress: recipient }, () => {
      const { recipientAddress } = this.state;
      if (recipientAddress) {
        if (!validateBech32Address(recipientAddress)) {
          Toast.warn(
            "Please ensure the entered address is a valid Oasis address.",
          );
        }
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

  submitLedgerTransferAmount = () => {
    const { amount } = this.state;
    const { oasisAccountBalances } = this.props.oasisAccountBalances;
    const { available } = oasisAccountBalances;
    const maximumAmount = available;

    const amountError = validateLedgerTransactionAmount(
      amount,
      maximumAmount,
      this.props.i18n.tString,
    );

    this.setState(
      {
        transactionSetupError: amountError,
      },
      () => {
        // TODO: For testing, remove later.
        this.getSendTransaction();

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

    if (!validateBech32Address(recipientAddress)) {
      return this.setState({
        transactionSetupError: "Please enter a valid recipient address",
      });
    } else if (!amount) {
      return this.setState({
        transactionSetupError: "Please enter a transaction amount",
      });
    }

    const data: OasisTransferArgs = {
      from: address,
      to: recipientAddress,
      amount: unitToDenom(amount, denominationSize),
    };

    this.props.setTransactionData(data);
  };

  submitDelegationAmount = () => {
    const { amount } = this.state;
    const { network } = this.props.ledger;
    const { oasisAccountBalances } = this.props.oasisAccountBalances;
    const { available } = oasisAccountBalances;
    const maximumAmount = available;

    const amountError = validateLedgerTransactionAmount(
      unitToDenom(amount, network.denominationSize),
      maximumAmount,
      this.props.i18n.tString,
    );

    this.setState(
      {
        transactionSetupError: amountError,
      },
      () => {
        if (amountError === "") {
          this.getDelegationTransaction();
        }
      },
    );
  };

  getDelegationTransaction = async () => {
    const { amount } = this.state;
    const { network, address } = this.props.ledger;
    const { denominationSize } = network;

    const data: OasisDelegateArgs = {
      delegator: address,
      validator: "",
      amount: unitToDenom(amount, denominationSize),
    };

    this.props.setTransactionData(data);
  };

  submitUndelegateTransactionSetup = () => {
    const { amount } = this.state;
    const { oasisAccountBalances } = this.props.oasisAccountBalances;
    const { staked } = oasisAccountBalances;
    const maximumAmount = staked.balance;

    const amountError = validateLedgerTransactionAmount(
      amount,
      maximumAmount,
      this.props.i18n.tString,
    );

    this.setState(
      {
        transactionSetupError: amountError,
      },
      () => {
        if (amountError === "") {
          this.getUndelegateTransaction();
        }
      },
    );
  };

  getUndelegateTransaction = () => {
    const { amount } = this.state;
    const { network, address } = this.props.ledger;
    const { denominationSize } = network;

    const data: OasisUndelegateArgs = {
      delegator: address,
      validator: "",
      amount: unitToDenom(amount, denominationSize),
    };

    this.props.setTransactionData(data);
  };
}

/** ===========================================================================
 * Styled Components
 * ============================================================================
 */

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
  openLedgerDialog: Modules.actions.ledger.openLedgerDialog,
  refetch: Modules.actions.app.refreshBalanceAndTransactions,
  closeLedgerDialog: Modules.actions.ledger.closeLedgerDialog,
  signTransaction: Modules.actions.transaction.signTransaction,
  setTransactionStage: Modules.actions.transaction.setTransactionStage,
  setTransactionData: Modules.actions.transaction.setTransactionData,
  setSigninNetworkName: Modules.actions.ledger.setSigninNetworkName,
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
    OasisAccountBalancesProps,
    FiatPriceDataProps {}

export default composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withOasisAccountBalances,
  withFiatPriceData,
)(OasisTransactionForm);
