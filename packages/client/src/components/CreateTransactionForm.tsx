import {
  Checkbox,
  Classes,
  Colors,
  H3,
  H4,
  H5,
  H6,
  MenuItem,
  Switch,
} from "@blueprintjs/core";
import { IItemRendererProps, Select } from "@blueprintjs/select";
import { GraphQLGuardComponentMultipleQueries } from "components/GraphQLGuardComponents";
import { COLORS } from "constants/colors";
import { FiatCurrency } from "constants/fiat";
import { IThemeProps } from "containers/ThemeContainer";
import {
  AccountBalancesProps,
  AccountInformationProps,
  AtomPriceDataProps,
  RewardsByValidatorProps,
  ValidatorsProps,
  withAccountBalances,
  withAccountInformation,
  withAtomPriceData,
  withGraphQLVariables,
  withRewardsByValidatorQuery,
  withValidators,
} from "graphql/queries";
import { IAccountInformation, IQuery, IValidator } from "graphql/types";
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
import { composeWithProps } from "tools/context-utils";
import {
  createDelegationTransactionMessage,
  createRewardsClaimTransaction,
  createTransactionRequestMetadata,
} from "tools/cosmos-utils";
import {
  calculateTransactionAmount,
  denomToAtoms,
  formatCurrencyAmount,
} from "tools/currency-utils";
import {
  capitalizeString,
  formatValidatorsList,
  getAccountBalances,
  getBlockExplorerUrlForTransaction,
  mapRewardsToAvailableRewards,
} from "tools/generic-utils";
import { bold } from "tools/i18n-utils";
import { TRANSACTION_STAGES } from "tools/transaction-utils";
import { validateLedgerTransactionAmount } from "tools/validation-utils";
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
} from "./SharedComponents";
import Toast from "./Toast";

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
  displayCustomGasSettings: boolean;
  claimsTransactionSetupError: string;
  useFullBalance: boolean;
  selectAllRewards: boolean;
  selectedRewards: ReadonlyArray<AvailableReward>;
  selectedValidatorForDelegation: Nullable<IValidator>;
}

const DEFAULT_GAS_PRICE = "0.01";
const DEFAULT_GAS_AMOUNT = "250000";

const ValidatorSelect = Select.ofType<IValidator>();

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
      claimsTransactionSetupError: "",
      selectedValidatorForDelegation: null,
      delegationTransactionInputError: "",
    };
  }

  render(): JSX.Element {
    const { transactionStage } = this.props.transaction;
    const { ledgerActionType } = this.props.ledgerDialog;

    const IS_DELEGATION = ledgerActionType === "DELEGATE";

    if (transactionStage === TRANSACTION_STAGES.SIGN) {
      return this.renderTransactionSigningComponent();
    } else if (transactionStage === TRANSACTION_STAGES.CONFIRM) {
      return this.renderTransactionConfirmation();
    } else if (transactionStage === TRANSACTION_STAGES.PENDING) {
      return this.renderPendingTransaction();
    } else if (transactionStage === TRANSACTION_STAGES.SUCCESS) {
      return this.renderTransactionSuccess();
    }

    if (IS_DELEGATION) {
      return this.renderDelegationTransactionSetup();
    } else {
      return this.renderRewardsTransactionSetup();
    }
  }

  renderRewardsTransactionSetup = () => {
    const {
      i18n,
      prices,
      ledger,
      validators,
      fiatCurrency,
      accountBalances,
      rewardsByValidator,
    } = this.props;
    const { t, tString } = i18n;
    const { network } = ledger;
    const atomsConversionRate = prices.prices;

    return (
      <GraphQLGuardComponentMultipleQueries
        tString={tString}
        results={[
          [validators, "validators"],
          [accountBalances, "accountBalances"],
          [rewardsByValidator, "rewardsByValidator"],
        ]}
      >
        {([validatorsList, accountBalancesData, rewardsData]: readonly [
          IQuery["validators"],
          IQuery["accountBalances"],
          IQuery["rewardsByValidator"],
        ]) => {
          const balances = getAccountBalances(
            accountBalancesData,
            atomsConversionRate,
            ledger.network.denom,
            6,
          );
          const { rewards, rewardsUSD } = balances;

          const availableRewards = mapRewardsToAvailableRewards(
            rewardsData,
            network,
          );

          // Proxy for no rewards available.
          if (availableRewards.length === 0) {
            return (
              <View>
                <b>
                  {tString(
                    "You currently have no rewards available for withdrawal.",
                  )}
                </b>
                <p style={{ marginTop: 12 }}>
                  {tString(
                    "Please note that at least 1 µATOM worth of rewards is required before withdrawals can occur.",
                  )}
                </p>
              </View>
            );
          }

          return (
            <View>
              <p>
                {t(
                  "You have a total of {{rewards}} ({{rewardsUSD}}) rewards available to withdraw.",
                  {
                    rewards: bold(`${rewards} ${ledger.network.descriptor}`),
                    rewardsUSD: `${rewardsUSD} ${fiatCurrency.symbol}`,
                  },
                )}
              </p>
              <p>
                {tString(
                  "Select the rewards you wish to withdraw from the list:",
                )}
              </p>
              {availableRewards.map((result, index) => {
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
                        denomToAtoms(result.amount, String),
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
              )}
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
      prices,
      ledger,
      validators,
      fiatCurrency,
      accountBalances,
    } = this.props;
    const { t, tString } = i18n;
    const { selectedValidatorForDelegation } = this.state;

    const atomsConversionRate = prices.prices;
    const balances = getAccountBalances(
      accountBalances.accountBalances,
      atomsConversionRate,
      ledger.network.denom,
      6,
    );
    const { balance, balanceUSD } = balances;

    return (
      <GraphQLGuardComponentMultipleQueries
        tString={tString}
        results={[
          [prices, "prices"],
          [validators, "validators"],
          [accountBalances, "accountBalances"],
        ]}
      >
        <View>
          <p>
            {t("Available balance: {{balance}} ({{balanceUSD}})", {
              balance: bold(`${balance} ${ledger.network.descriptor}`),
              balanceUSD: `${balanceUSD} ${fiatCurrency.symbol}`,
            })}
          </p>
          <ValidatorSelect
            popoverProps={{
              onClose: this.setCanEscapeKeyCloseDialog(true),
              popoverClassName: "ValidatorCompositionSelect",
            }}
            items={formatValidatorsList(validators.validators)}
            onItemSelect={this.handleSelectValidator}
            itemRenderer={this.renderValidatorSelectItem}
            itemPredicate={this.setValidatorSelectItemPredicate}
          >
            <Button
              category="SECONDARY"
              rightIcon="caret-down"
              onClick={this.setCanEscapeKeyCloseDialog(false)}
              data-cy="validator-composition-select-menu"
            >
              {selectedValidatorForDelegation
                ? selectedValidatorForDelegation.description.moniker
                : t("Choose Validator")}
            </Button>
          </ValidatorSelect>
          <H6 style={{ marginTop: 12, marginBottom: 0 }}>
            {t("Please enter an amount to delegate")}
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
                  this.submitLedgerTransactionAmount();
                }}
              >
                <TextInput
                  autoFocus
                  label={tString("Transaction Amount (ATOM)")}
                  onSubmit={this.submitLedgerTransactionAmount}
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
                  label={tString("Delegate All")}
                  onChange={this.toggleFullBalance}
                />
                {this.props.renderConfirmArrow(
                  tString("Generate My Transaction"),
                  this.submitLedgerTransactionAmount,
                )}
              </form>
            </FormContainer>
            {this.renderGasPriceSetup()}
            {this.state.delegationTransactionInputError && (
              <div style={{ marginTop: 12 }} className={Classes.LABEL}>
                <ErrorText data-cy="amount-transaction-error">
                  {this.state.delegationTransactionInputError}
                </ErrorText>
              </div>
            )}
          </View>
        </View>
      </GraphQLGuardComponentMultipleQueries>
    );
  };

  setValidatorSelectItemPredicate = (query: string, validator: IValidator) => {
    const validatorName = validator.description.moniker;
    const normalizedName = validatorName.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    return normalizedName.indexOf(normalizedQuery) >= 0;
  };

  renderValidatorSelectItem = (
    validator: IValidator,
    { handleClick, modifiers }: IItemRendererProps,
  ) => {
    return (
      <MenuItem
        onClick={handleClick}
        active={modifiers.active}
        key={validator.consensus_pubkey}
        text={validator.description.moniker}
        data-cy={`${validator.description.moniker}-delegation-option`}
      />
    );
  };

  handleSelectValidator = (validator: IValidator) => {
    this.setState({
      claimsTransactionSetupError: "",
      selectedValidatorForDelegation: validator,
    });
  };

  setCanEscapeKeyCloseDialog = (canClose: boolean) => () => {
    this.props.setCanEscapeKeyCloseDialog(canClose);
  };

  renderGasPriceSetup = () => {
    const { t, tString } = this.props.i18n;
    return (
      <View>
        <p style={{ marginTop: 12 }}>
          {t("Default gas price: {{price}} ", { price: <b>0.01 µATOM.</b> })}
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
          <b>{tString("Note:")}</b>{" "}
          {tString(
            "We are currently using a default gasPrice of 0.01 µATOM, feel free to adjust this value depending on network conditions.",
          )}
        </p>
        {this.state.displayCustomGasSettings && (
          <Row style={{ justifyContent: "flex-start" }}>
            <TextInput
              autoFocus
              label={tString("Gas Price (µATOM)")}
              style={InputStyles}
              data-cy="custom-gas-price-input"
              placeholder={tString("Enter a gas price (µATOM)")}
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

    const jsonStyles = {
      margin: 0,
      height: 225,
      fontSize: 11,
      borderRadius: 2,
    };

    // Convert to JSON:
    const json = JSON.stringify(
      // @ts-ignore
      this.props.transaction.transactionData.txMsg,
      null,
      2,
    );

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

    const { transactionHash, confirmedTransactionHeight } = transaction;

    return (
      <Centered style={{ flexDirection: "column" }}>
        <H5>{tString("Transaction Confirmed!")}</H5>
        <p style={{ textAlign: "center" }}>
          {t(
            "Your transaction is successful and was included at block height {{height}}. It may take a few moments for the updates to appear in Anthem.",
            {
              height: confirmedTransactionHeight,
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
    this.setState(
      prevState => ({
        useFullBalance: !prevState.useFullBalance,
      }),
      () => {
        if (this.state.useFullBalance) {
          const maximumAmount = this.getMaximumAmount();
          this.setState({
            amount: maximumAmount,
          });
        }
      },
    );
  };

  getMaximumAmount = () => {
    const { prices, accountBalances, ledger } = this.props;
    const { ledgerActionType } = this.props.ledgerDialog;
    const atomsConversionRate = prices.prices;
    const IS_DELEGATION = ledgerActionType === "DELEGATE";

    const balances = getAccountBalances(
      accountBalances.accountBalances,
      atomsConversionRate,
      ledger.network.denom,
      6,
    );

    const { balance, rewards } = balances;
    const targetValue = (IS_DELEGATION ? balance : rewards).replace(",", "");
    const maximumAmountAfterFees = calculateTransactionAmount(
      targetValue,
      this.state.gasPrice,
      this.state.gasAmount,
    );

    return maximumAmountAfterFees;
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
    const { amount, gasPrice, gasAmount, useFullBalance } = this.state;
    const doNotUpdate = gasPrice === "" || gasAmount === "";

    if (!doNotUpdate && this.state.amount !== "") {
      const maximumAmount = this.getMaximumAmount();
      const updatedAmountValue = calculateTransactionAmount(
        useFullBalance ? maximumAmount : amount,
        gasPrice,
        gasAmount,
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

  submitLedgerTransactionAmount = () => {
    const { amount: ledgerActionAmount } = this.state;
    const maximumAmount = this.getMaximumAmount();

    const amountError = validateLedgerTransactionAmount(
      ledgerActionAmount,
      maximumAmount,
      this.props.i18n.tString,
    );

    this.setState({ delegationTransactionInputError: amountError }, () => {
      if (amountError === "") {
        this.getDelegationTransaction();
      }
    });
  };

  getDelegationTransaction = () => {
    const {
      amount,
      gasAmount,
      gasPrice,
      selectedValidatorForDelegation,
    } = this.state;
    const { accountInformation } = this.props;
    const { network, address } = this.props.ledger;
    const { denom } = network;

    if (!selectedValidatorForDelegation) {
      return this.setState({
        delegationTransactionInputError:
          "Please choose a validator to delegate to.",
      });
    }

    if (
      selectedValidatorForDelegation &&
      accountInformation.accountInformation
    ) {
      const txMsg = createDelegationTransactionMessage({
        denom,
        amount,
        address,
        gasAmount,
        gasPrice,
        network: network.name,
        validatorOperatorAddress:
          selectedValidatorForDelegation.operator_address,
      });

      const account = accountInformation.accountInformation as IAccountInformation;

      const txRequestMetadata = createTransactionRequestMetadata({
        address,
        account,
        gasAmount,
        gasPrice,
        network,
      });

      const transaction = {
        txMsg,
        txRequestMetadata,
      };

      this.props.setTransactionData(transaction);
    } else {
      Toast.warn(
        this.props.i18n.tString(
          "Something went wrong... account information is not available right now.",
        ),
      );
    }
  };

  getRewardsClaimTransaction = () => {
    const { gasAmount, gasPrice, selectedRewards } = this.state;
    const { accountInformation } = this.props;
    const { network, address } = this.props.ledger;
    const { denom } = network;

    if (selectedRewards.length === 0) {
      this.setState({
        claimsTransactionSetupError:
          "Please select at least one validator to withdraw rewards from.",
      });
    } else if (accountInformation.accountInformation) {
      const account = accountInformation.accountInformation as IAccountInformation;

      const txMsg = createRewardsClaimTransaction({
        denom,
        address,
        gasAmount,
        gasPrice,
        selectedRewards,
        network: network.name,
      });

      const txRequestMetadata = createTransactionRequestMetadata({
        address,
        account,
        gasAmount,
        gasPrice,
        network,
      });

      const transaction = {
        txMsg,
        txRequestMetadata,
      };

      this.props.setTransactionData(transaction);
    } else {
      Toast.warn(
        this.props.i18n.tString(
          "Something went wrong... account information is not available right now.",
        ),
      );
    }
  };
}

/** ===========================================================================
 * Styled Components
 * ============================================================================
 */

const FormContainer = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: row;
`;

const InputStyles = {
  width: 200,
  marginRight: 8,
  borderRadius: 1,
};

const TransactionHashText = styled.p`
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
  transaction: Modules.selectors.transaction(state),
  ledger: Modules.selectors.ledger.ledgerSelector(state),
  ledgerDialog: Modules.selectors.ledger.ledgerDialogSelector(state),
});

const dispatchProps = {
  refetch: Modules.actions.app.refreshBalanceAndTransactions,
  closeLedgerDialog: Modules.actions.ledger.closeLedgerDialog,
  signTransaction: Modules.actions.transaction.signTransaction,
  setTransactionData: Modules.actions.transaction.setTransactionData,
  broadcastTransaction: Modules.actions.transaction.broadcastTransaction,
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
    ValidatorsProps,
    AccountBalancesProps,
    AccountInformationProps,
    AtomPriceDataProps,
    RewardsByValidatorProps {}

export default composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withValidators,
  withAtomPriceData,
  withAccountBalances,
  withAccountInformation,
  withRewardsByValidatorQuery,
)(CreateTransactionForm);
