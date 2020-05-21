import gql from "graphql-tag";
import * as React from "react";
import * as ApolloReactCommon from "@apollo/react-common";
import * as ApolloReactComponents from "@apollo/react-components";
import * as ApolloReactHoc from "@apollo/react-hoc";
import * as ApolloReactHooks from "@apollo/react-hooks";
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
}

export interface IAccount {
   __typename?: "Account";
  account_number: Scalars["String"];
  address: Scalars["String"];
  coins: Maybe<IAccountCoin[]>;
  public_key: Maybe<IPubKey>;
  sequence: Scalars["String"];
}

export type IAccountBalanceResponseType = ICosmosAccountBalancesType | ICeloAccountBalancesType | IOasisAccountBalancesType;

export interface IAccountCoin {
   __typename?: "AccountCoin";
  denom: Scalars["String"];
  amount: Scalars["String"];
}

export interface IAccountInformation {
   __typename?: "AccountInformation";
  type: Scalars["String"];
  value: IAccount;
}

export interface IAvailableReward {
   __typename?: "AvailableReward";
  reward: Maybe<IBalance[]>;
  validator_address: Scalars["String"];
}

export interface IBalance {
   __typename?: "Balance";
  denom: Scalars["String"];
  amount: Scalars["String"];
}

export interface IBlock {
   __typename?: "Block";
  header: IBlockHeader;
}

export interface IBlockData {
   __typename?: "BlockData";
  block: IBlock;
}

export interface IBlockHeader {
   __typename?: "BlockHeader";
  chain_id: Scalars["String"];
  height: Scalars["String"];
  time: Scalars["String"];
  num_txs: Scalars["String"];
  total_txs: Scalars["String"];
  last_commit_hash: Scalars["String"];
  data_hash: Scalars["String"];
  validators_hash: Scalars["String"];
  next_validators_hash: Scalars["String"];
  consensus_hash: Scalars["String"];
  app_hash: Scalars["String"];
  last_results_hash: Scalars["String"];
  evidence_hash: Scalars["String"];
  proposer_address: Scalars["String"];
}

export interface ICeloAccountBalances {
   __typename?: "CeloAccountBalances";
  address: Scalars["String"];
  height: Scalars["String"];
  goldTokenBalance: Scalars["String"];
  totalLockedGoldBalance: Scalars["String"];
  nonVotingLockedGoldBalance: Scalars["String"];
  votingLockedGoldBalance: Scalars["String"];
  pendingWithdrawalBalance: Scalars["String"];
  celoUSDValue: Scalars["String"];
  delegations: ICeloDelegation[];
}

export interface ICeloAccountBalancesType {
   __typename?: "CeloAccountBalancesType";
  celo: ICeloAccountBalances;
}

export interface ICeloAccountSnapshot {
   __typename?: "CeloAccountSnapshot";
  snapshotDate: Scalars["String"];
  address: Scalars["String"];
  height: Scalars["String"];
  snapshotReward: Scalars["String"];
  goldTokenBalance: Scalars["String"];
  totalLockedGoldBalance: Scalars["String"];
  nonVotingLockedGoldBalance: Scalars["String"];
  votingLockedGoldBalance: Scalars["String"];
  pendingWithdrawalBalance: Scalars["String"];
  celoUSDValue: Scalars["String"];
  delegations: ICeloDelegation[];
}

export interface ICeloDelegation {
   __typename?: "CeloDelegation";
  group: Scalars["String"];
  totalVotes: Scalars["String"];
  activeVotes: Scalars["String"];
  pendingVotes: Scalars["String"];
}

/** TODO: Complete the transaction/events types for Celo Network */
export interface ICeloTransaction {
   __typename?: "CeloTransaction";
  date: Scalars["String"];
  height: Scalars["Int"];
}

export interface ICeloTransactionResult {
   __typename?: "CeloTransactionResult";
  page: Scalars["Float"];
  limit: Scalars["Float"];
  data: ICeloTransaction[];
  moreResultsExist: Scalars["Boolean"];
}

export interface ICoin {
   __typename?: "Coin";
  id: Scalars["String"];
  symbol: Scalars["String"];
  name: Scalars["String"];
}

export interface ICommissionRates {
   __typename?: "CommissionRates";
  rate: Scalars["String"];
  max_rate: Scalars["String"];
  max_change_rate: Scalars["String"];
}

export interface ICosmosAccountBalances {
   __typename?: "CosmosAccountBalances";
  balance: Maybe<IBalance[]>;
  rewards: Maybe<IBalance[]>;
  delegations: Maybe<IDelegation[]>;
  unbonding: Maybe<IUnbondingDelegation[]>;
  commissions: Maybe<IBalance[]>;
}

export interface ICosmosAccountBalancesType {
   __typename?: "CosmosAccountBalancesType";
  cosmos: ICosmosAccountBalances;
}

export interface IDelegation {
   __typename?: "Delegation";
  delegator_address: Scalars["String"];
  validator_address: Scalars["String"];
  shares: Scalars["String"];
}

export interface IDistributionParameters {
   __typename?: "DistributionParameters";
  base_proposer_reward: Scalars["String"];
  bonus_proposer_reward: Scalars["String"];
  community_tax: Scalars["String"];
}

export interface IFiatCurrency {
   __typename?: "FiatCurrency";
  name: Scalars["String"];
  symbol: Scalars["String"];
}

export interface IFiatPrice {
   __typename?: "FiatPrice";
  price: Scalars["Float"];
  timestamp: Scalars["String"];
}

export interface IGovernanceParametersDeposit {
   __typename?: "GovernanceParametersDeposit";
  min_deposit: Maybe<IBalance[]>;
  max_deposit_period: Scalars["String"];
}

export interface IGovernanceParametersTallying {
   __typename?: "GovernanceParametersTallying";
  threshold: Scalars["String"];
  veto: Scalars["String"];
  governance_penalty: Maybe<Scalars["String"]>;
}

export interface IGovernanceParametersVoting {
   __typename?: "GovernanceParametersVoting";
  voting_period: Scalars["String"];
}

export interface IGovernanceProposal {
   __typename?: "GovernanceProposal";
  proposal_id: Maybe<Scalars["Int"]>;
  title: Maybe<Scalars["String"]>;
  description: Maybe<Scalars["String"]>;
  proposal_type: Maybe<Scalars["String"]>;
  proposal_status: Scalars["String"];
  final_tally_result: ITallyResult;
  submit_time: Scalars["String"];
  total_deposit: Maybe<IBalance[]>;
  voting_start_time: Scalars["String"];
}

export interface ILogMessage {
   __typename?: "LogMessage";
  code: Maybe<Scalars["Int"]>;
  message: Maybe<Scalars["String"]>;
  success: Maybe<Scalars["Boolean"]>;
  log: Maybe<Scalars["String"]>;
  msg_index: Maybe<Scalars["String"]>;
}

export interface IMsgBeginRedelegate {
   __typename?: "MsgBeginRedelegate";
  amount: IBalance;
  delegator_address: Maybe<Scalars["String"]>;
  validator_src_address: Scalars["String"];
  validator_dst_address: Scalars["String"];
}

export interface IMsgBeginRedelegateLegacy {
   __typename?: "MsgBeginRedelegateLegacy";
  shares_amount: Scalars["String"];
  delegator_address: Maybe<Scalars["String"]>;
  validator_src_address: Scalars["String"];
  validator_dst_address: Scalars["String"];
}

export interface IMsgDelegate {
   __typename?: "MsgDelegate";
  amount: IBalance;
  delegator_address: Maybe<Scalars["String"]>;
  validator_address: Maybe<Scalars["String"]>;
}

export interface IMsgModifyWithdrawAddress {
   __typename?: "MsgModifyWithdrawAddress";
  withdraw_address: Maybe<Scalars["String"]>;
  validator_address: Maybe<Scalars["String"]>;
}

export interface IMsgSend {
   __typename?: "MsgSend";
  amounts: Maybe<IBalance[]>;
  to_address: Maybe<Scalars["String"]>;
  from_address: Maybe<Scalars["String"]>;
}

export interface IMsgSubmitProposal {
   __typename?: "MsgSubmitProposal";
  title: Scalars["String"];
  description: Scalars["String"];
  proposal_type: Scalars["String"];
  proposer: Scalars["String"];
  initial_deposit: Maybe<IBalance[]>;
}

export interface IMsgVote {
   __typename?: "MsgVote";
  proposal_id: Scalars["String"];
  voter: Scalars["String"];
  option: Scalars["String"];
}

export interface IMsgWithdrawDelegationReward {
   __typename?: "MsgWithdrawDelegationReward";
  delegator_address: Maybe<Scalars["String"]>;
  validator_address: Maybe<Scalars["String"]>;
}

export interface IMsgWithdrawValidatorCommission {
   __typename?: "MsgWithdrawValidatorCommission";
  validator_address: Maybe<Scalars["String"]>;
}

export interface IOasisAccountBalances {
   __typename?: "OasisAccountBalances";
  available: Scalars["String"];
  staked: IOasisBalance;
  unbonding: IOasisBalance;
  rewards: Scalars["String"];
  commissions: Scalars["String"];
  meta: IOasisAccountMeta;
  delegations: Maybe<IOasisDelegation[]>;
}

export interface IOasisAccountBalancesType {
   __typename?: "OasisAccountBalancesType";
  oasis: IOasisAccountBalances;
}

export interface IOasisAccountMeta {
   __typename?: "OasisAccountMeta";
  is_validator: Scalars["Boolean"];
  is_delegator: Scalars["Boolean"];
}

export interface IOasisAmendCommissionScheduleEvent {
   __typename?: "OasisAmendCommissionScheduleEvent";
  type: IOasisTransactionType;
  rates: Array<Scalars["String"]>;
  bounds: Array<Scalars["String"]>;
}

export interface IOasisBalance {
   __typename?: "OasisBalance";
  balance: Scalars["String"];
  shares: Scalars["String"];
}

export interface IOasisBoundEvent {
   __typename?: "OasisBoundEvent";
  type: IOasisTransactionType;
  start: Scalars["String"];
  rate_min: Scalars["String"];
  rate_max: Scalars["String"];
}

export interface IOasisBurnEvent {
   __typename?: "OasisBurnEvent";
  type: IOasisTransactionType;
  owner: Scalars["String"];
  tokens: Scalars["String"];
}

export interface IOasisDelegation {
   __typename?: "OasisDelegation";
  delegator: Scalars["String"];
  validator: Scalars["String"];
  amount: Scalars["String"];
}

export interface IOasisEscrowAddEvent {
   __typename?: "OasisEscrowAddEvent";
  type: IOasisTransactionType;
  owner: Scalars["String"];
  escrow: Scalars["String"];
  tokens: Scalars["String"];
}

export interface IOasisEscrowReclaimEvent {
   __typename?: "OasisEscrowReclaimEvent";
  type: IOasisTransactionType;
  owner: Scalars["String"];
  escrow: Scalars["String"];
  tokens: Scalars["String"];
}

export interface IOasisEscrowTakeEvent {
   __typename?: "OasisEscrowTakeEvent";
  type: IOasisTransactionType;
  owner: Scalars["String"];
  tokens: Scalars["String"];
}

export interface IOasisRateEvent {
   __typename?: "OasisRateEvent";
  type: IOasisTransactionType;
  start: Scalars["String"];
  rate: Scalars["String"];
}

export interface IOasisRegisterEntityEvent {
   __typename?: "OasisRegisterEntityEvent";
  type: IOasisTransactionType;
  id: Scalars["String"];
  nodes: Array<Scalars["String"]>;
  allow_entity_signed_nodes: Scalars["Boolean"];
}

export interface IOasisRegisterNodeEvent {
   __typename?: "OasisRegisterNodeEvent";
  type: IOasisTransactionType;
  id: Scalars["String"];
  entity_id: Scalars["String"];
  expiration: Scalars["Float"];
}

export interface IOasisRegisterRuntimeEvent {
   __typename?: "OasisRegisterRuntimeEvent";
  type: IOasisTransactionType;
  id: Scalars["String"];
  version: Scalars["String"];
}

export interface IOasisTransaction {
   __typename?: "OasisTransaction";
  fee: Scalars["String"];
  gas: Scalars["Int"];
  gas_price: Scalars["String"];
  height: Scalars["Int"];
  method: Scalars["String"];
  date: Scalars["String"];
  sender: Scalars["String"];
  data: IOasisTransactionData;
}

export type IOasisTransactionData = IOasisBurnEvent | IOasisTransferEvent | IOasisEscrowAddEvent | IOasisEscrowTakeEvent | IOasisEscrowReclaimEvent | IOasisRegisterEntityEvent | IOasisRegisterNodeEvent | IOasisUnfreezeNodeEvent | IOasisRegisterRuntimeEvent | IOasisRateEvent | IOasisBoundEvent | IOasisAmendCommissionScheduleEvent | IOasisUnknownEvent;

export interface IOasisTransactionResult {
   __typename?: "OasisTransactionResult";
  page: Scalars["Float"];
  limit: Scalars["Float"];
  data: IOasisTransaction[];
  moreResultsExist: Scalars["Boolean"];
}

export enum IOasisTransactionType {
  Burn = "BURN",
  Transfer = "TRANSFER",
  EscrowAdd = "ESCROW_ADD",
  EscrowTake = "ESCROW_TAKE",
  EscrowReclaim = "ESCROW_RECLAIM",
  RegisterEntity = "REGISTER_ENTITY",
  RegisterNode = "REGISTER_NODE",
  UnfreezeNode = "UNFREEZE_NODE",
  RegisterRuntime = "REGISTER_RUNTIME",
  RateEvent = "RATE_EVENT",
  BoundEvent = "BOUND_EVENT",
  AmendCommissionSchedule = "AMEND_COMMISSION_SCHEDULE",
  UnknownEvent = "UNKNOWN_EVENT",
}

export interface IOasisTransferEvent {
   __typename?: "OasisTransferEvent";
  type: IOasisTransactionType;
  from: Scalars["String"];
  to: Scalars["String"];
  tokens: Scalars["String"];
}

export interface IOasisUnfreezeNodeEvent {
   __typename?: "OasisUnfreezeNodeEvent";
  type: IOasisTransactionType;
  id: Scalars["String"];
}

export interface IOasisUnknownEvent {
   __typename?: "OasisUnknownEvent";
  type: IOasisTransactionType;
  method_name: Scalars["String"];
}

export interface IPortfolioBalance {
   __typename?: "PortfolioBalance";
  address: Scalars["String"];
  denom: Scalars["String"];
  balance: Scalars["String"];
  height: Scalars["Int"];
  timestamp: Scalars["String"];
  chain: Scalars["String"];
}

export interface IPortfolioCommission {
   __typename?: "PortfolioCommission";
  balance: Scalars["String"];
  height: Scalars["Int"];
  validator: Scalars["String"];
  timestamp: Scalars["String"];
}

export interface IPortfolioData {
   __typename?: "PortfolioData";
  balanceHistory: IPortfolioBalance[];
  delegations: IPortfolioDelegation[];
  unbondings: IPortfolioDelegation[];
  delegatorRewards: IPortfolioReward[];
  validatorCommissions: IPortfolioCommission[];
  fiatPriceHistory: IFiatPrice[];
}

export interface IPortfolioDelegation {
   __typename?: "PortfolioDelegation";
  balance: Scalars["String"];
  address: Scalars["String"];
  timestamp: Scalars["String"];
}

export interface IPortfolioReward {
   __typename?: "PortfolioReward";
  balance: Scalars["String"];
  height: Scalars["Int"];
  address: Scalars["String"];
  timestamp: Scalars["String"];
}

export interface IPrice {
   __typename?: "Price";
  price: Scalars["Float"];
}

export interface IPubKey {
   __typename?: "PubKey";
  type: Scalars["String"];
}

export interface IQuery {
   __typename?: "Query";
  /** Cosmos APIs */
  portfolioHistory: IPortfolioData;
  fiatPriceHistory: IFiatPrice[];
  dailyPercentChange: Scalars["String"];
  accountBalances: IAccountBalanceResponseType;
  rewardsByValidator: IAvailableReward[];
  accountInformation: IAccountInformation;
  transaction: Maybe<ITransaction>;
  cosmosTransactions: ITransactionsPaginationResult;
  validatorDistribution: IValidatorDistribution;
  validators: IValidator[];
  validatorSets: IValidatorSet;
  latestBlock: IBlockData;
  stakingPool: IStakingPool;
  stakingParameters: IStakingParameters;
  governanceProposals: IGovernanceProposal[];
  governanceParametersDeposit: IGovernanceParametersDeposit;
  governanceParametersTallying: IGovernanceParametersTallying;
  governanceParametersVoting: IGovernanceParametersVoting;
  slashingParameters: ISlashingParameters;
  distributionCommunityPool: IBalance[];
  distributionParameters: IDistributionParameters;
  /** CoinGecko Price APIs */
  prices: IPrice;
  coins: Maybe<ICoin[]>;
  fiatCurrencies: IFiatCurrency[];
  /** Oasis APIs */
  oasisTransactions: IOasisTransactionResult;
  /** Celo APIs */
  celoAccountHistory: ICeloAccountSnapshot[];
  celoTransactions: ICeloTransactionResult;
}

export interface IQueryPortfolioHistoryArgs {
  address: Scalars["String"];
  fiat: Scalars["String"];
}

export interface IQueryFiatPriceHistoryArgs {
  fiat: Scalars["String"];
  network: Scalars["String"];
}

export interface IQueryDailyPercentChangeArgs {
  crypto: Scalars["String"];
  fiat: Scalars["String"];
}

export interface IQueryAccountBalancesArgs {
  address: Scalars["String"];
}

export interface IQueryRewardsByValidatorArgs {
  address: Scalars["String"];
}

export interface IQueryAccountInformationArgs {
  address: Scalars["String"];
}

export interface IQueryTransactionArgs {
  txHash: Scalars["String"];
  network: Scalars["String"];
}

export interface IQueryCosmosTransactionsArgs {
  address: Scalars["String"];
  startingPage: Maybe<Scalars["Float"]>;
  pageSize: Maybe<Scalars["Float"]>;
}

export interface IQueryValidatorDistributionArgs {
  validatorAddress: Scalars["String"];
}

export interface IQueryValidatorsArgs {
  network: Scalars["String"];
}

export interface IQueryValidatorSetsArgs {
  network: Scalars["String"];
}

export interface IQueryLatestBlockArgs {
  network: Scalars["String"];
}

export interface IQueryStakingPoolArgs {
  network: Scalars["String"];
}

export interface IQueryStakingParametersArgs {
  network: Scalars["String"];
}

export interface IQueryGovernanceProposalsArgs {
  network: Scalars["String"];
}

export interface IQueryGovernanceParametersDepositArgs {
  network: Scalars["String"];
}

export interface IQueryGovernanceParametersTallyingArgs {
  network: Scalars["String"];
}

export interface IQueryGovernanceParametersVotingArgs {
  network: Scalars["String"];
}

export interface IQuerySlashingParametersArgs {
  network: Scalars["String"];
}

export interface IQueryDistributionCommunityPoolArgs {
  network: Scalars["String"];
}

export interface IQueryDistributionParametersArgs {
  network: Scalars["String"];
}

export interface IQueryPricesArgs {
  currency: Scalars["String"];
  versus: Scalars["String"];
}

export interface IQueryOasisTransactionsArgs {
  address: Scalars["String"];
  startingPage: Maybe<Scalars["Float"]>;
  pageSize: Maybe<Scalars["Float"]>;
}

export interface IQueryCeloAccountHistoryArgs {
  address: Scalars["String"];
  fiat: Scalars["String"];
}

export interface IQueryCeloTransactionsArgs {
  address: Scalars["String"];
  startingPage: Maybe<Scalars["Float"]>;
  pageSize: Maybe<Scalars["Float"]>;
}

export interface ISlashingParameters {
   __typename?: "SlashingParameters";
  max_evidence_age: Scalars["String"];
  signed_blocks_window: Scalars["String"];
  min_signed_per_window: Scalars["String"];
  double_sign_unbond_duration: Maybe<Scalars["String"]>;
  downtime_unbond_duration: Maybe<Scalars["String"]>;
  slash_fraction_double_sign: Scalars["String"];
  slash_fraction_downtime: Scalars["String"];
}

export interface IStakingParameters {
   __typename?: "StakingParameters";
  inflation_rate_change: Maybe<Scalars["String"]>;
  inflation_max: Maybe<Scalars["String"]>;
  inflation_min: Maybe<Scalars["String"]>;
  goal_bonded: Maybe<Scalars["String"]>;
  unbonding_time: Scalars["String"];
  max_validators: Scalars["Int"];
  max_entries: Scalars["Int"];
  bond_denom: Scalars["String"];
}

export interface IStakingPool {
   __typename?: "StakingPool";
  loose_tokens: Maybe<Scalars["String"]>;
  bonded_tokens: Maybe<Scalars["String"]>;
  not_bonded_tokens: Maybe<Scalars["String"]>;
  inflation_last_time: Maybe<Scalars["String"]>;
  inflation: Maybe<Scalars["String"]>;
  date_last_commission_reset: Maybe<Scalars["String"]>;
  prev_bonded_shares: Maybe<Scalars["String"]>;
}

export interface ITag {
   __typename?: "Tag";
  key: Scalars["String"];
  value: Maybe<Scalars["String"]>;
}

export interface ITallyResult {
   __typename?: "TallyResult";
  yes: Scalars["String"];
  abstain: Scalars["String"];
  no: Scalars["String"];
  no_with_veto: Scalars["String"];
}

export interface ITransaction {
   __typename?: "Transaction";
  hash: Scalars["String"];
  height: Scalars["String"];
  log: Array<Maybe<ILogMessage>>;
  gaswanted: Scalars["String"];
  gasused: Scalars["String"];
  memo: Maybe<Scalars["String"]>;
  fees: ITxFee;
  tags: Maybe<ITag[]>;
  msgs: ITxMsg[];
  timestamp: Scalars["String"];
  chain: Scalars["String"];
}

export interface ITransactionsPaginationResult {
   __typename?: "TransactionsPaginationResult";
  page: Scalars["Float"];
  limit: Scalars["Float"];
  data: ITransaction[];
  moreResultsExist: Scalars["Boolean"];
}

export interface ITx {
   __typename?: "Tx";
  type: Scalars["String"];
  value: ITxValue;
}

export interface ITxFee {
   __typename?: "TxFee";
  amount: Maybe<IBalance[]>;
  gas: Scalars["String"];
}

export interface ITxMsg {
   __typename?: "TxMsg";
  type: Scalars["String"];
  value: Maybe<ITxMsgValue>;
}

/** Could collapse this into a single type with all optional fields: */
export type ITxMsgValue = IMsgSend | IMsgVote | IMsgDelegate | IMsgSubmitProposal | IMsgBeginRedelegate | IMsgModifyWithdrawAddress | IMsgBeginRedelegateLegacy | IMsgWithdrawDelegationReward | IMsgWithdrawValidatorCommission;

export interface ITxSignature {
   __typename?: "TxSignature";
  pub_key: IPubKey;
  signature: Scalars["String"];
}

export interface ITxValue {
   __typename?: "TxValue";
  fee: ITxFee;
  memo: Scalars["String"];
  msg: Maybe<ITxMsg[]>;
  signatures: Maybe<ITxSignature[]>;
}

export interface IUnbondingDelegation {
   __typename?: "UnbondingDelegation";
  delegator_address: Scalars["String"];
  validator_address: Scalars["String"];
  entries: IUnbondingDelegationEntry[];
}

export interface IUnbondingDelegationEntry {
   __typename?: "UnbondingDelegationEntry";
  balance: Scalars["String"];
  initial_balance: Scalars["String"];
  creation_height: Scalars["String"];
  completion_time: Scalars["String"];
}

export interface IValidator {
   __typename?: "Validator";
  operator_address: Scalars["String"];
  consensus_pubkey: Scalars["String"];
  jailed: Scalars["Boolean"];
  status: Scalars["Int"];
  tokens: Scalars["String"];
  delegator_shares: Scalars["String"];
  description: IValidatorDescription;
  unbonding_height: Scalars["String"];
  unbonding_time: Scalars["String"];
  commission: IValidatorCommission;
  min_self_delegation: Scalars["String"];
}

export interface IValidatorCommission {
   __typename?: "ValidatorCommission";
  update_time: Scalars["String"];
  commission_rates: ICommissionRates;
}

export interface IValidatorDescription {
   __typename?: "ValidatorDescription";
  moniker: Scalars["String"];
  identity: Scalars["String"];
  website: Scalars["String"];
  details: Scalars["String"];
}

export interface IValidatorDistribution {
   __typename?: "ValidatorDistribution";
  operator_address: Scalars["String"];
  self_bond_rewards: Maybe<IBalance[]>;
  val_commission: Maybe<IBalance[]>;
}

export interface IValidatorSet {
   __typename?: "ValidatorSet";
  block_height: Scalars["Int"];
  validators: Maybe<IValidatorSetItem[]>;
}

export interface IValidatorSetItem {
   __typename?: "ValidatorSetItem";
  address: Scalars["String"];
  pub_key: Scalars["String"];
  voting_power: Scalars["String"];
  proposer_priority: Scalars["String"];
}

export interface IAccountBalancesQueryVariables {
  address: Scalars["String"];
}

export type IAccountBalancesQuery = (
  { __typename?: "Query" }
  & { accountBalances: (
    { __typename?: "CosmosAccountBalancesType" }
    & { cosmos: (
      { __typename?: "CosmosAccountBalances" }
      & { balance: Maybe<Array<(
        { __typename?: "Balance" }
        & Pick<IBalance, "denom" | "amount">
      )>>, rewards: Maybe<Array<(
        { __typename?: "Balance" }
        & Pick<IBalance, "denom" | "amount">
      )>>, delegations: Maybe<Array<(
        { __typename?: "Delegation" }
        & Pick<IDelegation, "delegator_address" | "validator_address" | "shares">
      )>>, unbonding: Maybe<Array<(
        { __typename?: "UnbondingDelegation" }
        & Pick<IUnbondingDelegation, "delegator_address" | "validator_address">
        & { entries: Array<(
          { __typename?: "UnbondingDelegationEntry" }
          & Pick<IUnbondingDelegationEntry, "balance" | "initial_balance" | "creation_height" | "completion_time">
        )> }
      )>>, commissions: Maybe<Array<(
        { __typename?: "Balance" }
        & Pick<IBalance, "denom" | "amount">
      )>> }
    ) }
  ) | (
    { __typename?: "CeloAccountBalancesType" }
    & { celo: (
      { __typename?: "CeloAccountBalances" }
      & Pick<ICeloAccountBalances, "address" | "height" | "goldTokenBalance" | "totalLockedGoldBalance" | "nonVotingLockedGoldBalance" | "votingLockedGoldBalance" | "pendingWithdrawalBalance" | "celoUSDValue">
      & { delegations: Array<(
        { __typename?: "CeloDelegation" }
        & Pick<ICeloDelegation, "group" | "totalVotes" | "activeVotes" | "pendingVotes">
      )> }
    ) }
  ) | (
    { __typename?: "OasisAccountBalancesType" }
    & { oasis: (
      { __typename?: "OasisAccountBalances" }
      & Pick<IOasisAccountBalances, "available" | "rewards" | "commissions">
      & { staked: (
        { __typename?: "OasisBalance" }
        & Pick<IOasisBalance, "balance" | "shares">
      ), unbonding: (
        { __typename?: "OasisBalance" }
        & Pick<IOasisBalance, "balance" | "shares">
      ), meta: (
        { __typename?: "OasisAccountMeta" }
        & Pick<IOasisAccountMeta, "is_validator" | "is_delegator">
      ), delegations: Maybe<Array<(
        { __typename?: "OasisDelegation" }
        & Pick<IOasisDelegation, "delegator" | "validator" | "amount">
      )>> }
    ) }
  ) }
);

export interface IAccountInformationQueryVariables {
  address: Scalars["String"];
}

export type IAccountInformationQuery = (
  { __typename?: "Query" }
  & { accountInformation: (
    { __typename?: "AccountInformation" }
    & Pick<IAccountInformation, "type">
    & { value: (
      { __typename?: "Account" }
      & Pick<IAccount, "account_number" | "address" | "sequence">
      & { coins: Maybe<Array<(
        { __typename?: "AccountCoin" }
        & Pick<IAccountCoin, "denom" | "amount">
      )>>, public_key: Maybe<(
        { __typename?: "PubKey" }
        & Pick<IPubKey, "type">
      )> }
    ) }
  ) }
);

export interface ICeloAccountHistoryQueryVariables {
  address: Scalars["String"];
  fiat: Scalars["String"];
}

export type ICeloAccountHistoryQuery = (
  { __typename?: "Query" }
  & { celoAccountHistory: Array<(
    { __typename?: "CeloAccountSnapshot" }
    & Pick<ICeloAccountSnapshot, "snapshotDate" | "address" | "height" | "snapshotReward" | "goldTokenBalance" | "totalLockedGoldBalance" | "nonVotingLockedGoldBalance" | "votingLockedGoldBalance" | "pendingWithdrawalBalance" | "celoUSDValue">
    & { delegations: Array<(
      { __typename?: "CeloDelegation" }
      & Pick<ICeloDelegation, "group" | "totalVotes" | "activeVotes" | "pendingVotes">
    )> }
  )> }
);

export interface ICeloTransactionsQueryVariables {
  address: Scalars["String"];
  startingPage: Maybe<Scalars["Float"]>;
  pageSize: Maybe<Scalars["Float"]>;
}

export type ICeloTransactionsQuery = (
  { __typename?: "Query" }
  & { celoTransactions: (
    { __typename?: "CeloTransactionResult" }
    & Pick<ICeloTransactionResult, "page" | "limit" | "moreResultsExist">
    & { data: Array<(
      { __typename?: "CeloTransaction" }
      & Pick<ICeloTransaction, "date" | "height">
    )> }
  ) }
);

export interface ICoinsQueryVariables {}

export type ICoinsQuery = (
  { __typename?: "Query" }
  & { coins: Maybe<Array<(
    { __typename?: "Coin" }
    & Pick<ICoin, "id" | "symbol" | "name">
  )>> }
);

export interface ICosmosTransactionsQueryVariables {
  address: Scalars["String"];
  startingPage: Maybe<Scalars["Float"]>;
  pageSize: Maybe<Scalars["Float"]>;
}

export type ICosmosTransactionsQuery = (
  { __typename?: "Query" }
  & { cosmosTransactions: (
    { __typename?: "TransactionsPaginationResult" }
    & Pick<ITransactionsPaginationResult, "page" | "limit" | "moreResultsExist">
    & { data: Array<(
      { __typename?: "Transaction" }
      & Pick<ITransaction, "hash" | "height" | "gaswanted" | "gasused" | "memo" | "timestamp" | "chain">
      & { log: Array<Maybe<(
        { __typename?: "LogMessage" }
        & Pick<ILogMessage, "code" | "message" | "success" | "log" | "msg_index">
      )>>, fees: (
        { __typename?: "TxFee" }
        & Pick<ITxFee, "gas">
        & { amount: Maybe<Array<(
          { __typename?: "Balance" }
          & Pick<IBalance, "denom" | "amount">
        )>> }
      ), tags: Maybe<Array<(
        { __typename?: "Tag" }
        & Pick<ITag, "key" | "value">
      )>>, msgs: Array<(
        { __typename?: "TxMsg" }
        & Pick<ITxMsg, "type">
        & { value: Maybe<(
          { __typename?: "MsgSend" }
          & Pick<IMsgSend, "to_address" | "from_address">
          & { amounts: Maybe<Array<(
            { __typename?: "Balance" }
            & Pick<IBalance, "denom" | "amount">
          )>> }
        ) | (
          { __typename?: "MsgVote" }
          & Pick<IMsgVote, "proposal_id" | "voter" | "option">
        ) | (
          { __typename?: "MsgDelegate" }
          & Pick<IMsgDelegate, "delegator_address" | "validator_address">
          & { amount: (
            { __typename?: "Balance" }
            & Pick<IBalance, "denom" | "amount">
          ) }
        ) | (
          { __typename?: "MsgSubmitProposal" }
          & Pick<IMsgSubmitProposal, "title" | "description" | "proposal_type" | "proposer">
          & { initial_deposit: Maybe<Array<(
            { __typename?: "Balance" }
            & Pick<IBalance, "denom" | "amount">
          )>> }
        ) | (
          { __typename?: "MsgBeginRedelegate" }
          & Pick<IMsgBeginRedelegate, "delegator_address" | "validator_src_address" | "validator_dst_address">
          & { amount: (
            { __typename?: "Balance" }
            & Pick<IBalance, "denom" | "amount">
          ) }
        ) | (
          { __typename?: "MsgModifyWithdrawAddress" }
          & Pick<IMsgModifyWithdrawAddress, "withdraw_address" | "validator_address">
        ) | (
          { __typename?: "MsgBeginRedelegateLegacy" }
          & Pick<IMsgBeginRedelegateLegacy, "shares_amount" | "delegator_address" | "validator_src_address" | "validator_dst_address">
        ) | (
          { __typename?: "MsgWithdrawDelegationReward" }
          & Pick<IMsgWithdrawDelegationReward, "delegator_address" | "validator_address">
        ) | (
          { __typename?: "MsgWithdrawValidatorCommission" }
          & Pick<IMsgWithdrawValidatorCommission, "validator_address">
        )> }
      )> }
    )> }
  ) }
);

export interface IDailyPercentChangeQueryVariables {
  crypto: Scalars["String"];
  fiat: Scalars["String"];
}

export type IDailyPercentChangeQuery = (
  { __typename?: "Query" }
  & Pick<IQuery, "dailyPercentChange">
);

export interface IDistributionCommunityPoolQueryVariables {
  network: Scalars["String"];
}

export type IDistributionCommunityPoolQuery = (
  { __typename?: "Query" }
  & { distributionCommunityPool: Array<(
    { __typename?: "Balance" }
    & Pick<IBalance, "denom" | "amount">
  )> }
);

export interface IDistributionParametersQueryVariables {
  network: Scalars["String"];
}

export type IDistributionParametersQuery = (
  { __typename?: "Query" }
  & { distributionParameters: (
    { __typename?: "DistributionParameters" }
    & Pick<IDistributionParameters, "base_proposer_reward" | "bonus_proposer_reward" | "community_tax">
  ) }
);

export interface IFiatCurrenciesQueryVariables {}

export type IFiatCurrenciesQuery = (
  { __typename?: "Query" }
  & { fiatCurrencies: Array<(
    { __typename?: "FiatCurrency" }
    & Pick<IFiatCurrency, "name" | "symbol">
  )> }
);

export interface IFiatPriceHistoryQueryVariables {
  fiat: Scalars["String"];
  network: Scalars["String"];
}

export type IFiatPriceHistoryQuery = (
  { __typename?: "Query" }
  & { fiatPriceHistory: Array<(
    { __typename?: "FiatPrice" }
    & Pick<IFiatPrice, "price" | "timestamp">
  )> }
);

export interface IGovernanceParametersDepositQueryVariables {
  network: Scalars["String"];
}

export type IGovernanceParametersDepositQuery = (
  { __typename?: "Query" }
  & { governanceParametersDeposit: (
    { __typename?: "GovernanceParametersDeposit" }
    & Pick<IGovernanceParametersDeposit, "max_deposit_period">
    & { min_deposit: Maybe<Array<(
      { __typename?: "Balance" }
      & Pick<IBalance, "denom" | "amount">
    )>> }
  ) }
);

export interface IGovernanceParametersTallyingQueryVariables {
  network: Scalars["String"];
}

export type IGovernanceParametersTallyingQuery = (
  { __typename?: "Query" }
  & { governanceParametersTallying: (
    { __typename?: "GovernanceParametersTallying" }
    & Pick<IGovernanceParametersTallying, "threshold" | "veto" | "governance_penalty">
  ) }
);

export interface IGovernanceParametersVotingQueryVariables {
  network: Scalars["String"];
}

export type IGovernanceParametersVotingQuery = (
  { __typename?: "Query" }
  & { governanceParametersVoting: (
    { __typename?: "GovernanceParametersVoting" }
    & Pick<IGovernanceParametersVoting, "voting_period">
  ) }
);

export interface IGovernanceProposalsQueryVariables {
  network: Scalars["String"];
}

export type IGovernanceProposalsQuery = (
  { __typename?: "Query" }
  & { governanceProposals: Array<(
    { __typename?: "GovernanceProposal" }
    & Pick<IGovernanceProposal, "proposal_id" | "title" | "description" | "proposal_type" | "proposal_status" | "submit_time" | "voting_start_time">
    & { final_tally_result: (
      { __typename?: "TallyResult" }
      & Pick<ITallyResult, "yes" | "abstain" | "no" | "no_with_veto">
    ), total_deposit: Maybe<Array<(
      { __typename?: "Balance" }
      & Pick<IBalance, "denom" | "amount">
    )>> }
  )> }
);

export interface ILatestBlockQueryVariables {
  network: Scalars["String"];
}

export type ILatestBlockQuery = (
  { __typename?: "Query" }
  & { latestBlock: (
    { __typename?: "BlockData" }
    & { block: (
      { __typename?: "Block" }
      & { header: (
        { __typename?: "BlockHeader" }
        & Pick<IBlockHeader, "chain_id" | "height" | "time" | "num_txs" | "total_txs" | "last_commit_hash" | "data_hash" | "validators_hash" | "next_validators_hash" | "consensus_hash" | "app_hash" | "last_results_hash" | "evidence_hash" | "proposer_address">
      ) }
    ) }
  ) }
);

export interface IOasisTransactionsQueryVariables {
  address: Scalars["String"];
  startingPage: Maybe<Scalars["Float"]>;
  pageSize: Maybe<Scalars["Float"]>;
}

export type IOasisTransactionsQuery = (
  { __typename?: "Query" }
  & { oasisTransactions: (
    { __typename?: "OasisTransactionResult" }
    & Pick<IOasisTransactionResult, "page" | "limit" | "moreResultsExist">
    & { data: Array<(
      { __typename?: "OasisTransaction" }
      & Pick<IOasisTransaction, "fee" | "gas" | "gas_price" | "height" | "method" | "date" | "sender">
      & { data: (
        { __typename?: "OasisBurnEvent" }
        & Pick<IOasisBurnEvent, "type" | "owner" | "tokens">
      ) | (
        { __typename?: "OasisTransferEvent" }
        & Pick<IOasisTransferEvent, "type" | "from" | "to" | "tokens">
      ) | (
        { __typename?: "OasisEscrowAddEvent" }
        & Pick<IOasisEscrowAddEvent, "type" | "owner" | "escrow" | "tokens">
      ) | (
        { __typename?: "OasisEscrowTakeEvent" }
        & Pick<IOasisEscrowTakeEvent, "type" | "owner" | "tokens">
      ) | (
        { __typename?: "OasisEscrowReclaimEvent" }
        & Pick<IOasisEscrowReclaimEvent, "type" | "owner" | "escrow" | "tokens">
      ) | (
        { __typename?: "OasisRegisterEntityEvent" }
        & Pick<IOasisRegisterEntityEvent, "type" | "id" | "nodes" | "allow_entity_signed_nodes">
      ) | (
        { __typename?: "OasisRegisterNodeEvent" }
        & Pick<IOasisRegisterNodeEvent, "type" | "id" | "entity_id" | "expiration">
      ) | (
        { __typename?: "OasisUnfreezeNodeEvent" }
        & Pick<IOasisUnfreezeNodeEvent, "type" | "id">
      ) | (
        { __typename?: "OasisRegisterRuntimeEvent" }
        & Pick<IOasisRegisterRuntimeEvent, "type" | "id" | "version">
      ) | (
        { __typename?: "OasisRateEvent" }
        & Pick<IOasisRateEvent, "type" | "start" | "rate">
      ) | (
        { __typename?: "OasisBoundEvent" }
        & Pick<IOasisBoundEvent, "type" | "start" | "rate_min" | "rate_max">
      ) | (
        { __typename?: "OasisAmendCommissionScheduleEvent" }
        & Pick<IOasisAmendCommissionScheduleEvent, "type" | "rates" | "bounds">
      ) | (
        { __typename?: "OasisUnknownEvent" }
        & Pick<IOasisUnknownEvent, "type" | "method_name">
      ) }
    )> }
  ) }
);

export interface IPortfolioHistoryQueryVariables {
  address: Scalars["String"];
  fiat: Scalars["String"];
}

export type IPortfolioHistoryQuery = (
  { __typename?: "Query" }
  & { portfolioHistory: (
    { __typename?: "PortfolioData" }
    & { balanceHistory: Array<(
      { __typename?: "PortfolioBalance" }
      & Pick<IPortfolioBalance, "address" | "denom" | "balance" | "height" | "timestamp" | "chain">
    )>, delegations: Array<(
      { __typename?: "PortfolioDelegation" }
      & Pick<IPortfolioDelegation, "balance" | "address" | "timestamp">
    )>, unbondings: Array<(
      { __typename?: "PortfolioDelegation" }
      & Pick<IPortfolioDelegation, "balance" | "address" | "timestamp">
    )>, delegatorRewards: Array<(
      { __typename?: "PortfolioReward" }
      & Pick<IPortfolioReward, "balance" | "height" | "address" | "timestamp">
    )>, validatorCommissions: Array<(
      { __typename?: "PortfolioCommission" }
      & Pick<IPortfolioCommission, "balance" | "height" | "validator" | "timestamp">
    )>, fiatPriceHistory: Array<(
      { __typename?: "FiatPrice" }
      & Pick<IFiatPrice, "price" | "timestamp">
    )> }
  ) }
);

export interface IPricesQueryVariables {
  currency: Scalars["String"];
  versus: Scalars["String"];
}

export type IPricesQuery = (
  { __typename?: "Query" }
  & { prices: (
    { __typename?: "Price" }
    & Pick<IPrice, "price">
  ) }
);

export interface IRewardsByValidatorQueryVariables {
  address: Scalars["String"];
}

export type IRewardsByValidatorQuery = (
  { __typename?: "Query" }
  & { rewardsByValidator: Array<(
    { __typename?: "AvailableReward" }
    & Pick<IAvailableReward, "validator_address">
    & { reward: Maybe<Array<(
      { __typename?: "Balance" }
      & Pick<IBalance, "denom" | "amount">
    )>> }
  )> }
);

export interface ISlashingParametersQueryVariables {
  network: Scalars["String"];
}

export type ISlashingParametersQuery = (
  { __typename?: "Query" }
  & { slashingParameters: (
    { __typename?: "SlashingParameters" }
    & Pick<ISlashingParameters, "max_evidence_age" | "signed_blocks_window" | "min_signed_per_window" | "double_sign_unbond_duration" | "downtime_unbond_duration" | "slash_fraction_double_sign" | "slash_fraction_downtime">
  ) }
);

export interface IStakingParametersQueryVariables {
  network: Scalars["String"];
}

export type IStakingParametersQuery = (
  { __typename?: "Query" }
  & { stakingParameters: (
    { __typename?: "StakingParameters" }
    & Pick<IStakingParameters, "inflation_rate_change" | "inflation_max" | "inflation_min" | "goal_bonded" | "unbonding_time" | "max_validators" | "max_entries" | "bond_denom">
  ) }
);

export interface IStakingPoolQueryVariables {
  network: Scalars["String"];
}

export type IStakingPoolQuery = (
  { __typename?: "Query" }
  & { stakingPool: (
    { __typename?: "StakingPool" }
    & Pick<IStakingPool, "loose_tokens" | "bonded_tokens" | "not_bonded_tokens" | "inflation_last_time" | "inflation" | "date_last_commission_reset" | "prev_bonded_shares">
  ) }
);

export interface ITransactionQueryVariables {
  txHash: Scalars["String"];
  network: Scalars["String"];
}

export type ITransactionQuery = (
  { __typename?: "Query" }
  & { transaction: Maybe<(
    { __typename?: "Transaction" }
    & Pick<ITransaction, "hash" | "height" | "gaswanted" | "gasused" | "memo" | "timestamp" | "chain">
    & { log: Array<Maybe<(
      { __typename?: "LogMessage" }
      & Pick<ILogMessage, "code" | "message" | "success" | "log" | "msg_index">
    )>>, fees: (
      { __typename?: "TxFee" }
      & Pick<ITxFee, "gas">
      & { amount: Maybe<Array<(
        { __typename?: "Balance" }
        & Pick<IBalance, "denom" | "amount">
      )>> }
    ), tags: Maybe<Array<(
      { __typename?: "Tag" }
      & Pick<ITag, "key" | "value">
    )>>, msgs: Array<(
      { __typename?: "TxMsg" }
      & Pick<ITxMsg, "type">
      & { value: Maybe<(
        { __typename?: "MsgSend" }
        & Pick<IMsgSend, "to_address" | "from_address">
        & { amounts: Maybe<Array<(
          { __typename?: "Balance" }
          & Pick<IBalance, "denom" | "amount">
        )>> }
      ) | (
        { __typename?: "MsgVote" }
        & Pick<IMsgVote, "proposal_id" | "voter" | "option">
      ) | (
        { __typename?: "MsgDelegate" }
        & Pick<IMsgDelegate, "delegator_address" | "validator_address">
        & { amount: (
          { __typename?: "Balance" }
          & Pick<IBalance, "denom" | "amount">
        ) }
      ) | (
        { __typename?: "MsgSubmitProposal" }
        & Pick<IMsgSubmitProposal, "title" | "description" | "proposal_type" | "proposer">
        & { initial_deposit: Maybe<Array<(
          { __typename?: "Balance" }
          & Pick<IBalance, "denom" | "amount">
        )>> }
      ) | (
        { __typename?: "MsgBeginRedelegate" }
        & Pick<IMsgBeginRedelegate, "delegator_address" | "validator_src_address" | "validator_dst_address">
        & { amount: (
          { __typename?: "Balance" }
          & Pick<IBalance, "denom" | "amount">
        ) }
      ) | (
        { __typename?: "MsgModifyWithdrawAddress" }
        & Pick<IMsgModifyWithdrawAddress, "withdraw_address" | "validator_address">
      ) | (
        { __typename?: "MsgBeginRedelegateLegacy" }
        & Pick<IMsgBeginRedelegateLegacy, "shares_amount" | "delegator_address" | "validator_src_address" | "validator_dst_address">
      ) | (
        { __typename?: "MsgWithdrawDelegationReward" }
        & Pick<IMsgWithdrawDelegationReward, "delegator_address" | "validator_address">
      ) | (
        { __typename?: "MsgWithdrawValidatorCommission" }
        & Pick<IMsgWithdrawValidatorCommission, "validator_address">
      )> }
    )> }
  )> }
);

export interface IValidatorDistributionQueryVariables {
  validatorAddress: Scalars["String"];
}

export type IValidatorDistributionQuery = (
  { __typename?: "Query" }
  & { validatorDistribution: (
    { __typename?: "ValidatorDistribution" }
    & Pick<IValidatorDistribution, "operator_address">
    & { self_bond_rewards: Maybe<Array<(
      { __typename?: "Balance" }
      & Pick<IBalance, "denom" | "amount">
    )>>, val_commission: Maybe<Array<(
      { __typename?: "Balance" }
      & Pick<IBalance, "denom" | "amount">
    )>> }
  ) }
);

export interface IValidatorSetsQueryVariables {
  network: Scalars["String"];
}

export type IValidatorSetsQuery = (
  { __typename?: "Query" }
  & { validatorSets: (
    { __typename?: "ValidatorSet" }
    & Pick<IValidatorSet, "block_height">
    & { validators: Maybe<Array<(
      { __typename?: "ValidatorSetItem" }
      & Pick<IValidatorSetItem, "address" | "pub_key" | "voting_power" | "proposer_priority">
    )>> }
  ) }
);

export interface IValidatorsQueryVariables {
  network: Scalars["String"];
}

export type IValidatorsQuery = (
  { __typename?: "Query" }
  & { validators: Array<(
    { __typename?: "Validator" }
    & Pick<IValidator, "operator_address" | "consensus_pubkey" | "jailed" | "status" | "tokens" | "delegator_shares" | "unbonding_height" | "unbonding_time" | "min_self_delegation">
    & { description: (
      { __typename?: "ValidatorDescription" }
      & Pick<IValidatorDescription, "moniker" | "identity" | "website" | "details">
    ), commission: (
      { __typename?: "ValidatorCommission" }
      & Pick<IValidatorCommission, "update_time">
      & { commission_rates: (
        { __typename?: "CommissionRates" }
        & Pick<ICommissionRates, "rate" | "max_rate" | "max_change_rate">
      ) }
    ) }
  )> }
);

export const AccountBalancesDocument = gql`
    query accountBalances($address: String!) {
  accountBalances(address: $address) {
    ... on CosmosAccountBalancesType {
      cosmos {
        balance {
          denom
          amount
        }
        rewards {
          denom
          amount
        }
        delegations {
          delegator_address
          validator_address
          shares
        }
        unbonding {
          delegator_address
          validator_address
          entries {
            balance
            initial_balance
            creation_height
            completion_time
          }
        }
        commissions {
          denom
          amount
        }
      }
    }
    ... on CeloAccountBalancesType {
      celo {
        address
        height
        goldTokenBalance
        totalLockedGoldBalance
        nonVotingLockedGoldBalance
        votingLockedGoldBalance
        pendingWithdrawalBalance
        celoUSDValue
        delegations {
          group
          totalVotes
          activeVotes
          pendingVotes
        }
      }
    }
    ... on OasisAccountBalancesType {
      oasis {
        available
        staked {
          balance
          shares
        }
        unbonding {
          balance
          shares
        }
        rewards
        commissions
        meta {
          is_validator
          is_delegator
        }
        delegations {
          delegator
          validator
          amount
        }
      }
    }
  }
}
    `;
export type AccountBalancesComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IAccountBalancesQuery, IAccountBalancesQueryVariables>, "query"> & ({ variables: IAccountBalancesQueryVariables; skip?: boolean; } | { skip: boolean; });

export const AccountBalancesComponent = (props: AccountBalancesComponentProps) => (
      <ApolloReactComponents.Query<IAccountBalancesQuery, IAccountBalancesQueryVariables> query={AccountBalancesDocument} {...props} />
    );

export type IAccountBalancesProps<TChildProps = {}> = ApolloReactHoc.DataProps<IAccountBalancesQuery, IAccountBalancesQueryVariables> & TChildProps;
export function withAccountBalances<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IAccountBalancesQuery,
  IAccountBalancesQueryVariables,
  IAccountBalancesProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IAccountBalancesQuery, IAccountBalancesQueryVariables, IAccountBalancesProps<TChildProps>>(AccountBalancesDocument, {
      alias: "accountBalances",
      ...operationOptions,
    });
}

/**
 * __useAccountBalancesQuery__
 *
 * To run a query within a React component, call `useAccountBalancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountBalancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountBalancesQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useAccountBalancesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IAccountBalancesQuery, IAccountBalancesQueryVariables>) {
        return ApolloReactHooks.useQuery<IAccountBalancesQuery, IAccountBalancesQueryVariables>(AccountBalancesDocument, baseOptions);
      }
export function useAccountBalancesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IAccountBalancesQuery, IAccountBalancesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IAccountBalancesQuery, IAccountBalancesQueryVariables>(AccountBalancesDocument, baseOptions);
        }
export type AccountBalancesQueryHookResult = ReturnType<typeof useAccountBalancesQuery>;
export type AccountBalancesLazyQueryHookResult = ReturnType<typeof useAccountBalancesLazyQuery>;
export type AccountBalancesQueryResult = ApolloReactCommon.QueryResult<IAccountBalancesQuery, IAccountBalancesQueryVariables>;
export const AccountInformationDocument = gql`
    query accountInformation($address: String!) {
  accountInformation(address: $address) {
    type
    value {
      account_number
      address
      coins {
        denom
        amount
      }
      public_key {
        type
      }
      sequence
    }
  }
}
    `;
export type AccountInformationComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IAccountInformationQuery, IAccountInformationQueryVariables>, "query"> & ({ variables: IAccountInformationQueryVariables; skip?: boolean; } | { skip: boolean; });

export const AccountInformationComponent = (props: AccountInformationComponentProps) => (
      <ApolloReactComponents.Query<IAccountInformationQuery, IAccountInformationQueryVariables> query={AccountInformationDocument} {...props} />
    );

export type IAccountInformationProps<TChildProps = {}> = ApolloReactHoc.DataProps<IAccountInformationQuery, IAccountInformationQueryVariables> & TChildProps;
export function withAccountInformation<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IAccountInformationQuery,
  IAccountInformationQueryVariables,
  IAccountInformationProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IAccountInformationQuery, IAccountInformationQueryVariables, IAccountInformationProps<TChildProps>>(AccountInformationDocument, {
      alias: "accountInformation",
      ...operationOptions,
    });
}

/**
 * __useAccountInformationQuery__
 *
 * To run a query within a React component, call `useAccountInformationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountInformationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountInformationQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useAccountInformationQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IAccountInformationQuery, IAccountInformationQueryVariables>) {
        return ApolloReactHooks.useQuery<IAccountInformationQuery, IAccountInformationQueryVariables>(AccountInformationDocument, baseOptions);
      }
export function useAccountInformationLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IAccountInformationQuery, IAccountInformationQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IAccountInformationQuery, IAccountInformationQueryVariables>(AccountInformationDocument, baseOptions);
        }
export type AccountInformationQueryHookResult = ReturnType<typeof useAccountInformationQuery>;
export type AccountInformationLazyQueryHookResult = ReturnType<typeof useAccountInformationLazyQuery>;
export type AccountInformationQueryResult = ApolloReactCommon.QueryResult<IAccountInformationQuery, IAccountInformationQueryVariables>;
export const CeloAccountHistoryDocument = gql`
    query celoAccountHistory($address: String!, $fiat: String!) {
  celoAccountHistory(address: $address, fiat: $fiat) {
    snapshotDate
    address
    height
    snapshotReward
    goldTokenBalance
    totalLockedGoldBalance
    nonVotingLockedGoldBalance
    votingLockedGoldBalance
    pendingWithdrawalBalance
    celoUSDValue
    delegations {
      group
      totalVotes
      activeVotes
      pendingVotes
    }
  }
}
    `;
export type CeloAccountHistoryComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICeloAccountHistoryQuery, ICeloAccountHistoryQueryVariables>, "query"> & ({ variables: ICeloAccountHistoryQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CeloAccountHistoryComponent = (props: CeloAccountHistoryComponentProps) => (
      <ApolloReactComponents.Query<ICeloAccountHistoryQuery, ICeloAccountHistoryQueryVariables> query={CeloAccountHistoryDocument} {...props} />
    );

export type ICeloAccountHistoryProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICeloAccountHistoryQuery, ICeloAccountHistoryQueryVariables> & TChildProps;
export function withCeloAccountHistory<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICeloAccountHistoryQuery,
  ICeloAccountHistoryQueryVariables,
  ICeloAccountHistoryProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICeloAccountHistoryQuery, ICeloAccountHistoryQueryVariables, ICeloAccountHistoryProps<TChildProps>>(CeloAccountHistoryDocument, {
      alias: "celoAccountHistory",
      ...operationOptions,
    });
}

/**
 * __useCeloAccountHistoryQuery__
 *
 * To run a query within a React component, call `useCeloAccountHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCeloAccountHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCeloAccountHistoryQuery({
 *   variables: {
 *      address: // value for 'address'
 *      fiat: // value for 'fiat'
 *   },
 * });
 */
export function useCeloAccountHistoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICeloAccountHistoryQuery, ICeloAccountHistoryQueryVariables>) {
        return ApolloReactHooks.useQuery<ICeloAccountHistoryQuery, ICeloAccountHistoryQueryVariables>(CeloAccountHistoryDocument, baseOptions);
      }
export function useCeloAccountHistoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICeloAccountHistoryQuery, ICeloAccountHistoryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICeloAccountHistoryQuery, ICeloAccountHistoryQueryVariables>(CeloAccountHistoryDocument, baseOptions);
        }
export type CeloAccountHistoryQueryHookResult = ReturnType<typeof useCeloAccountHistoryQuery>;
export type CeloAccountHistoryLazyQueryHookResult = ReturnType<typeof useCeloAccountHistoryLazyQuery>;
export type CeloAccountHistoryQueryResult = ApolloReactCommon.QueryResult<ICeloAccountHistoryQuery, ICeloAccountHistoryQueryVariables>;
export const CeloTransactionsDocument = gql`
    query celoTransactions($address: String!, $startingPage: Float, $pageSize: Float) {
  celoTransactions(address: $address, startingPage: $startingPage, pageSize: $pageSize) {
    page
    limit
    data {
      date
      height
    }
    moreResultsExist
  }
}
    `;
export type CeloTransactionsComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICeloTransactionsQuery, ICeloTransactionsQueryVariables>, "query"> & ({ variables: ICeloTransactionsQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CeloTransactionsComponent = (props: CeloTransactionsComponentProps) => (
      <ApolloReactComponents.Query<ICeloTransactionsQuery, ICeloTransactionsQueryVariables> query={CeloTransactionsDocument} {...props} />
    );

export type ICeloTransactionsProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICeloTransactionsQuery, ICeloTransactionsQueryVariables> & TChildProps;
export function withCeloTransactions<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICeloTransactionsQuery,
  ICeloTransactionsQueryVariables,
  ICeloTransactionsProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICeloTransactionsQuery, ICeloTransactionsQueryVariables, ICeloTransactionsProps<TChildProps>>(CeloTransactionsDocument, {
      alias: "celoTransactions",
      ...operationOptions,
    });
}

/**
 * __useCeloTransactionsQuery__
 *
 * To run a query within a React component, call `useCeloTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCeloTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCeloTransactionsQuery({
 *   variables: {
 *      address: // value for 'address'
 *      startingPage: // value for 'startingPage'
 *      pageSize: // value for 'pageSize'
 *   },
 * });
 */
export function useCeloTransactionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICeloTransactionsQuery, ICeloTransactionsQueryVariables>) {
        return ApolloReactHooks.useQuery<ICeloTransactionsQuery, ICeloTransactionsQueryVariables>(CeloTransactionsDocument, baseOptions);
      }
export function useCeloTransactionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICeloTransactionsQuery, ICeloTransactionsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICeloTransactionsQuery, ICeloTransactionsQueryVariables>(CeloTransactionsDocument, baseOptions);
        }
export type CeloTransactionsQueryHookResult = ReturnType<typeof useCeloTransactionsQuery>;
export type CeloTransactionsLazyQueryHookResult = ReturnType<typeof useCeloTransactionsLazyQuery>;
export type CeloTransactionsQueryResult = ApolloReactCommon.QueryResult<ICeloTransactionsQuery, ICeloTransactionsQueryVariables>;
export const CoinsDocument = gql`
    query coins {
  coins {
    id
    symbol
    name
  }
}
    `;
export type CoinsComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICoinsQuery, ICoinsQueryVariables>, "query">;

export const CoinsComponent = (props: CoinsComponentProps) => (
      <ApolloReactComponents.Query<ICoinsQuery, ICoinsQueryVariables> query={CoinsDocument} {...props} />
    );

export type ICoinsProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICoinsQuery, ICoinsQueryVariables> & TChildProps;
export function withCoins<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICoinsQuery,
  ICoinsQueryVariables,
  ICoinsProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICoinsQuery, ICoinsQueryVariables, ICoinsProps<TChildProps>>(CoinsDocument, {
      alias: "coins",
      ...operationOptions,
    });
}

/**
 * __useCoinsQuery__
 *
 * To run a query within a React component, call `useCoinsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCoinsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCoinsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCoinsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICoinsQuery, ICoinsQueryVariables>) {
        return ApolloReactHooks.useQuery<ICoinsQuery, ICoinsQueryVariables>(CoinsDocument, baseOptions);
      }
export function useCoinsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICoinsQuery, ICoinsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICoinsQuery, ICoinsQueryVariables>(CoinsDocument, baseOptions);
        }
export type CoinsQueryHookResult = ReturnType<typeof useCoinsQuery>;
export type CoinsLazyQueryHookResult = ReturnType<typeof useCoinsLazyQuery>;
export type CoinsQueryResult = ApolloReactCommon.QueryResult<ICoinsQuery, ICoinsQueryVariables>;
export const CosmosTransactionsDocument = gql`
    query cosmosTransactions($address: String!, $startingPage: Float, $pageSize: Float) {
  cosmosTransactions(address: $address, startingPage: $startingPage, pageSize: $pageSize) {
    page
    limit
    data {
      hash
      height
      log {
        code
        message
        success
        log
        msg_index
      }
      gaswanted
      gasused
      memo
      fees {
        amount {
          denom
          amount
        }
        gas
      }
      tags {
        key
        value
      }
      msgs {
        type
        value {
          ... on MsgSend {
            amounts {
              denom
              amount
            }
            to_address
            from_address
          }
          ... on MsgVote {
            proposal_id
            voter
            option
          }
          ... on MsgDelegate {
            amount {
              denom
              amount
            }
            delegator_address
            validator_address
          }
          ... on MsgSubmitProposal {
            title
            description
            proposal_type
            proposer
            initial_deposit {
              denom
              amount
            }
          }
          ... on MsgBeginRedelegate {
            amount {
              denom
              amount
            }
            delegator_address
            validator_src_address
            validator_dst_address
          }
          ... on MsgModifyWithdrawAddress {
            withdraw_address
            validator_address
          }
          ... on MsgBeginRedelegateLegacy {
            shares_amount
            delegator_address
            validator_src_address
            validator_dst_address
          }
          ... on MsgWithdrawDelegationReward {
            delegator_address
            validator_address
          }
          ... on MsgWithdrawValidatorCommission {
            validator_address
          }
        }
      }
      timestamp
      chain
    }
    moreResultsExist
  }
}
    `;
export type CosmosTransactionsComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICosmosTransactionsQuery, ICosmosTransactionsQueryVariables>, "query"> & ({ variables: ICosmosTransactionsQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CosmosTransactionsComponent = (props: CosmosTransactionsComponentProps) => (
      <ApolloReactComponents.Query<ICosmosTransactionsQuery, ICosmosTransactionsQueryVariables> query={CosmosTransactionsDocument} {...props} />
    );

export type ICosmosTransactionsProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICosmosTransactionsQuery, ICosmosTransactionsQueryVariables> & TChildProps;
export function withCosmosTransactions<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICosmosTransactionsQuery,
  ICosmosTransactionsQueryVariables,
  ICosmosTransactionsProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICosmosTransactionsQuery, ICosmosTransactionsQueryVariables, ICosmosTransactionsProps<TChildProps>>(CosmosTransactionsDocument, {
      alias: "cosmosTransactions",
      ...operationOptions,
    });
}

/**
 * __useCosmosTransactionsQuery__
 *
 * To run a query within a React component, call `useCosmosTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCosmosTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCosmosTransactionsQuery({
 *   variables: {
 *      address: // value for 'address'
 *      startingPage: // value for 'startingPage'
 *      pageSize: // value for 'pageSize'
 *   },
 * });
 */
export function useCosmosTransactionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICosmosTransactionsQuery, ICosmosTransactionsQueryVariables>) {
        return ApolloReactHooks.useQuery<ICosmosTransactionsQuery, ICosmosTransactionsQueryVariables>(CosmosTransactionsDocument, baseOptions);
      }
export function useCosmosTransactionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICosmosTransactionsQuery, ICosmosTransactionsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICosmosTransactionsQuery, ICosmosTransactionsQueryVariables>(CosmosTransactionsDocument, baseOptions);
        }
export type CosmosTransactionsQueryHookResult = ReturnType<typeof useCosmosTransactionsQuery>;
export type CosmosTransactionsLazyQueryHookResult = ReturnType<typeof useCosmosTransactionsLazyQuery>;
export type CosmosTransactionsQueryResult = ApolloReactCommon.QueryResult<ICosmosTransactionsQuery, ICosmosTransactionsQueryVariables>;
export const DailyPercentChangeDocument = gql`
    query dailyPercentChange($crypto: String!, $fiat: String!) {
  dailyPercentChange(crypto: $crypto, fiat: $fiat)
}
    `;
export type DailyPercentChangeComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IDailyPercentChangeQuery, IDailyPercentChangeQueryVariables>, "query"> & ({ variables: IDailyPercentChangeQueryVariables; skip?: boolean; } | { skip: boolean; });

export const DailyPercentChangeComponent = (props: DailyPercentChangeComponentProps) => (
      <ApolloReactComponents.Query<IDailyPercentChangeQuery, IDailyPercentChangeQueryVariables> query={DailyPercentChangeDocument} {...props} />
    );

export type IDailyPercentChangeProps<TChildProps = {}> = ApolloReactHoc.DataProps<IDailyPercentChangeQuery, IDailyPercentChangeQueryVariables> & TChildProps;
export function withDailyPercentChange<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IDailyPercentChangeQuery,
  IDailyPercentChangeQueryVariables,
  IDailyPercentChangeProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IDailyPercentChangeQuery, IDailyPercentChangeQueryVariables, IDailyPercentChangeProps<TChildProps>>(DailyPercentChangeDocument, {
      alias: "dailyPercentChange",
      ...operationOptions,
    });
}

/**
 * __useDailyPercentChangeQuery__
 *
 * To run a query within a React component, call `useDailyPercentChangeQuery` and pass it any options that fit your needs.
 * When your component renders, `useDailyPercentChangeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDailyPercentChangeQuery({
 *   variables: {
 *      crypto: // value for 'crypto'
 *      fiat: // value for 'fiat'
 *   },
 * });
 */
export function useDailyPercentChangeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IDailyPercentChangeQuery, IDailyPercentChangeQueryVariables>) {
        return ApolloReactHooks.useQuery<IDailyPercentChangeQuery, IDailyPercentChangeQueryVariables>(DailyPercentChangeDocument, baseOptions);
      }
export function useDailyPercentChangeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IDailyPercentChangeQuery, IDailyPercentChangeQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IDailyPercentChangeQuery, IDailyPercentChangeQueryVariables>(DailyPercentChangeDocument, baseOptions);
        }
export type DailyPercentChangeQueryHookResult = ReturnType<typeof useDailyPercentChangeQuery>;
export type DailyPercentChangeLazyQueryHookResult = ReturnType<typeof useDailyPercentChangeLazyQuery>;
export type DailyPercentChangeQueryResult = ApolloReactCommon.QueryResult<IDailyPercentChangeQuery, IDailyPercentChangeQueryVariables>;
export const DistributionCommunityPoolDocument = gql`
    query distributionCommunityPool($network: String!) {
  distributionCommunityPool(network: $network) {
    denom
    amount
  }
}
    `;
export type DistributionCommunityPoolComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IDistributionCommunityPoolQuery, IDistributionCommunityPoolQueryVariables>, "query"> & ({ variables: IDistributionCommunityPoolQueryVariables; skip?: boolean; } | { skip: boolean; });

export const DistributionCommunityPoolComponent = (props: DistributionCommunityPoolComponentProps) => (
      <ApolloReactComponents.Query<IDistributionCommunityPoolQuery, IDistributionCommunityPoolQueryVariables> query={DistributionCommunityPoolDocument} {...props} />
    );

export type IDistributionCommunityPoolProps<TChildProps = {}> = ApolloReactHoc.DataProps<IDistributionCommunityPoolQuery, IDistributionCommunityPoolQueryVariables> & TChildProps;
export function withDistributionCommunityPool<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IDistributionCommunityPoolQuery,
  IDistributionCommunityPoolQueryVariables,
  IDistributionCommunityPoolProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IDistributionCommunityPoolQuery, IDistributionCommunityPoolQueryVariables, IDistributionCommunityPoolProps<TChildProps>>(DistributionCommunityPoolDocument, {
      alias: "distributionCommunityPool",
      ...operationOptions,
    });
}

/**
 * __useDistributionCommunityPoolQuery__
 *
 * To run a query within a React component, call `useDistributionCommunityPoolQuery` and pass it any options that fit your needs.
 * When your component renders, `useDistributionCommunityPoolQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDistributionCommunityPoolQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useDistributionCommunityPoolQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IDistributionCommunityPoolQuery, IDistributionCommunityPoolQueryVariables>) {
        return ApolloReactHooks.useQuery<IDistributionCommunityPoolQuery, IDistributionCommunityPoolQueryVariables>(DistributionCommunityPoolDocument, baseOptions);
      }
export function useDistributionCommunityPoolLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IDistributionCommunityPoolQuery, IDistributionCommunityPoolQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IDistributionCommunityPoolQuery, IDistributionCommunityPoolQueryVariables>(DistributionCommunityPoolDocument, baseOptions);
        }
export type DistributionCommunityPoolQueryHookResult = ReturnType<typeof useDistributionCommunityPoolQuery>;
export type DistributionCommunityPoolLazyQueryHookResult = ReturnType<typeof useDistributionCommunityPoolLazyQuery>;
export type DistributionCommunityPoolQueryResult = ApolloReactCommon.QueryResult<IDistributionCommunityPoolQuery, IDistributionCommunityPoolQueryVariables>;
export const DistributionParametersDocument = gql`
    query distributionParameters($network: String!) {
  distributionParameters(network: $network) {
    base_proposer_reward
    bonus_proposer_reward
    community_tax
  }
}
    `;
export type DistributionParametersComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IDistributionParametersQuery, IDistributionParametersQueryVariables>, "query"> & ({ variables: IDistributionParametersQueryVariables; skip?: boolean; } | { skip: boolean; });

export const DistributionParametersComponent = (props: DistributionParametersComponentProps) => (
      <ApolloReactComponents.Query<IDistributionParametersQuery, IDistributionParametersQueryVariables> query={DistributionParametersDocument} {...props} />
    );

export type IDistributionParametersProps<TChildProps = {}> = ApolloReactHoc.DataProps<IDistributionParametersQuery, IDistributionParametersQueryVariables> & TChildProps;
export function withDistributionParameters<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IDistributionParametersQuery,
  IDistributionParametersQueryVariables,
  IDistributionParametersProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IDistributionParametersQuery, IDistributionParametersQueryVariables, IDistributionParametersProps<TChildProps>>(DistributionParametersDocument, {
      alias: "distributionParameters",
      ...operationOptions,
    });
}

/**
 * __useDistributionParametersQuery__
 *
 * To run a query within a React component, call `useDistributionParametersQuery` and pass it any options that fit your needs.
 * When your component renders, `useDistributionParametersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDistributionParametersQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useDistributionParametersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IDistributionParametersQuery, IDistributionParametersQueryVariables>) {
        return ApolloReactHooks.useQuery<IDistributionParametersQuery, IDistributionParametersQueryVariables>(DistributionParametersDocument, baseOptions);
      }
export function useDistributionParametersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IDistributionParametersQuery, IDistributionParametersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IDistributionParametersQuery, IDistributionParametersQueryVariables>(DistributionParametersDocument, baseOptions);
        }
export type DistributionParametersQueryHookResult = ReturnType<typeof useDistributionParametersQuery>;
export type DistributionParametersLazyQueryHookResult = ReturnType<typeof useDistributionParametersLazyQuery>;
export type DistributionParametersQueryResult = ApolloReactCommon.QueryResult<IDistributionParametersQuery, IDistributionParametersQueryVariables>;
export const FiatCurrenciesDocument = gql`
    query fiatCurrencies {
  fiatCurrencies {
    name
    symbol
  }
}
    `;
export type FiatCurrenciesComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IFiatCurrenciesQuery, IFiatCurrenciesQueryVariables>, "query">;

export const FiatCurrenciesComponent = (props: FiatCurrenciesComponentProps) => (
      <ApolloReactComponents.Query<IFiatCurrenciesQuery, IFiatCurrenciesQueryVariables> query={FiatCurrenciesDocument} {...props} />
    );

export type IFiatCurrenciesProps<TChildProps = {}> = ApolloReactHoc.DataProps<IFiatCurrenciesQuery, IFiatCurrenciesQueryVariables> & TChildProps;
export function withFiatCurrencies<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IFiatCurrenciesQuery,
  IFiatCurrenciesQueryVariables,
  IFiatCurrenciesProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IFiatCurrenciesQuery, IFiatCurrenciesQueryVariables, IFiatCurrenciesProps<TChildProps>>(FiatCurrenciesDocument, {
      alias: "fiatCurrencies",
      ...operationOptions,
    });
}

/**
 * __useFiatCurrenciesQuery__
 *
 * To run a query within a React component, call `useFiatCurrenciesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFiatCurrenciesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFiatCurrenciesQuery({
 *   variables: {
 *   },
 * });
 */
export function useFiatCurrenciesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IFiatCurrenciesQuery, IFiatCurrenciesQueryVariables>) {
        return ApolloReactHooks.useQuery<IFiatCurrenciesQuery, IFiatCurrenciesQueryVariables>(FiatCurrenciesDocument, baseOptions);
      }
export function useFiatCurrenciesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IFiatCurrenciesQuery, IFiatCurrenciesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IFiatCurrenciesQuery, IFiatCurrenciesQueryVariables>(FiatCurrenciesDocument, baseOptions);
        }
export type FiatCurrenciesQueryHookResult = ReturnType<typeof useFiatCurrenciesQuery>;
export type FiatCurrenciesLazyQueryHookResult = ReturnType<typeof useFiatCurrenciesLazyQuery>;
export type FiatCurrenciesQueryResult = ApolloReactCommon.QueryResult<IFiatCurrenciesQuery, IFiatCurrenciesQueryVariables>;
export const FiatPriceHistoryDocument = gql`
    query fiatPriceHistory($fiat: String!, $network: String!) {
  fiatPriceHistory(fiat: $fiat, network: $network) {
    price
    timestamp
  }
}
    `;
export type FiatPriceHistoryComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IFiatPriceHistoryQuery, IFiatPriceHistoryQueryVariables>, "query"> & ({ variables: IFiatPriceHistoryQueryVariables; skip?: boolean; } | { skip: boolean; });

export const FiatPriceHistoryComponent = (props: FiatPriceHistoryComponentProps) => (
      <ApolloReactComponents.Query<IFiatPriceHistoryQuery, IFiatPriceHistoryQueryVariables> query={FiatPriceHistoryDocument} {...props} />
    );

export type IFiatPriceHistoryProps<TChildProps = {}> = ApolloReactHoc.DataProps<IFiatPriceHistoryQuery, IFiatPriceHistoryQueryVariables> & TChildProps;
export function withFiatPriceHistory<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IFiatPriceHistoryQuery,
  IFiatPriceHistoryQueryVariables,
  IFiatPriceHistoryProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IFiatPriceHistoryQuery, IFiatPriceHistoryQueryVariables, IFiatPriceHistoryProps<TChildProps>>(FiatPriceHistoryDocument, {
      alias: "fiatPriceHistory",
      ...operationOptions,
    });
}

/**
 * __useFiatPriceHistoryQuery__
 *
 * To run a query within a React component, call `useFiatPriceHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useFiatPriceHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFiatPriceHistoryQuery({
 *   variables: {
 *      fiat: // value for 'fiat'
 *      network: // value for 'network'
 *   },
 * });
 */
export function useFiatPriceHistoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IFiatPriceHistoryQuery, IFiatPriceHistoryQueryVariables>) {
        return ApolloReactHooks.useQuery<IFiatPriceHistoryQuery, IFiatPriceHistoryQueryVariables>(FiatPriceHistoryDocument, baseOptions);
      }
export function useFiatPriceHistoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IFiatPriceHistoryQuery, IFiatPriceHistoryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IFiatPriceHistoryQuery, IFiatPriceHistoryQueryVariables>(FiatPriceHistoryDocument, baseOptions);
        }
export type FiatPriceHistoryQueryHookResult = ReturnType<typeof useFiatPriceHistoryQuery>;
export type FiatPriceHistoryLazyQueryHookResult = ReturnType<typeof useFiatPriceHistoryLazyQuery>;
export type FiatPriceHistoryQueryResult = ApolloReactCommon.QueryResult<IFiatPriceHistoryQuery, IFiatPriceHistoryQueryVariables>;
export const GovernanceParametersDepositDocument = gql`
    query governanceParametersDeposit($network: String!) {
  governanceParametersDeposit(network: $network) {
    min_deposit {
      denom
      amount
    }
    max_deposit_period
  }
}
    `;
export type GovernanceParametersDepositComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IGovernanceParametersDepositQuery, IGovernanceParametersDepositQueryVariables>, "query"> & ({ variables: IGovernanceParametersDepositQueryVariables; skip?: boolean; } | { skip: boolean; });

export const GovernanceParametersDepositComponent = (props: GovernanceParametersDepositComponentProps) => (
      <ApolloReactComponents.Query<IGovernanceParametersDepositQuery, IGovernanceParametersDepositQueryVariables> query={GovernanceParametersDepositDocument} {...props} />
    );

export type IGovernanceParametersDepositProps<TChildProps = {}> = ApolloReactHoc.DataProps<IGovernanceParametersDepositQuery, IGovernanceParametersDepositQueryVariables> & TChildProps;
export function withGovernanceParametersDeposit<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IGovernanceParametersDepositQuery,
  IGovernanceParametersDepositQueryVariables,
  IGovernanceParametersDepositProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IGovernanceParametersDepositQuery, IGovernanceParametersDepositQueryVariables, IGovernanceParametersDepositProps<TChildProps>>(GovernanceParametersDepositDocument, {
      alias: "governanceParametersDeposit",
      ...operationOptions,
    });
}

/**
 * __useGovernanceParametersDepositQuery__
 *
 * To run a query within a React component, call `useGovernanceParametersDepositQuery` and pass it any options that fit your needs.
 * When your component renders, `useGovernanceParametersDepositQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGovernanceParametersDepositQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useGovernanceParametersDepositQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IGovernanceParametersDepositQuery, IGovernanceParametersDepositQueryVariables>) {
        return ApolloReactHooks.useQuery<IGovernanceParametersDepositQuery, IGovernanceParametersDepositQueryVariables>(GovernanceParametersDepositDocument, baseOptions);
      }
export function useGovernanceParametersDepositLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IGovernanceParametersDepositQuery, IGovernanceParametersDepositQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IGovernanceParametersDepositQuery, IGovernanceParametersDepositQueryVariables>(GovernanceParametersDepositDocument, baseOptions);
        }
export type GovernanceParametersDepositQueryHookResult = ReturnType<typeof useGovernanceParametersDepositQuery>;
export type GovernanceParametersDepositLazyQueryHookResult = ReturnType<typeof useGovernanceParametersDepositLazyQuery>;
export type GovernanceParametersDepositQueryResult = ApolloReactCommon.QueryResult<IGovernanceParametersDepositQuery, IGovernanceParametersDepositQueryVariables>;
export const GovernanceParametersTallyingDocument = gql`
    query governanceParametersTallying($network: String!) {
  governanceParametersTallying(network: $network) {
    threshold
    veto
    governance_penalty
  }
}
    `;
export type GovernanceParametersTallyingComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IGovernanceParametersTallyingQuery, IGovernanceParametersTallyingQueryVariables>, "query"> & ({ variables: IGovernanceParametersTallyingQueryVariables; skip?: boolean; } | { skip: boolean; });

export const GovernanceParametersTallyingComponent = (props: GovernanceParametersTallyingComponentProps) => (
      <ApolloReactComponents.Query<IGovernanceParametersTallyingQuery, IGovernanceParametersTallyingQueryVariables> query={GovernanceParametersTallyingDocument} {...props} />
    );

export type IGovernanceParametersTallyingProps<TChildProps = {}> = ApolloReactHoc.DataProps<IGovernanceParametersTallyingQuery, IGovernanceParametersTallyingQueryVariables> & TChildProps;
export function withGovernanceParametersTallying<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IGovernanceParametersTallyingQuery,
  IGovernanceParametersTallyingQueryVariables,
  IGovernanceParametersTallyingProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IGovernanceParametersTallyingQuery, IGovernanceParametersTallyingQueryVariables, IGovernanceParametersTallyingProps<TChildProps>>(GovernanceParametersTallyingDocument, {
      alias: "governanceParametersTallying",
      ...operationOptions,
    });
}

/**
 * __useGovernanceParametersTallyingQuery__
 *
 * To run a query within a React component, call `useGovernanceParametersTallyingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGovernanceParametersTallyingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGovernanceParametersTallyingQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useGovernanceParametersTallyingQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IGovernanceParametersTallyingQuery, IGovernanceParametersTallyingQueryVariables>) {
        return ApolloReactHooks.useQuery<IGovernanceParametersTallyingQuery, IGovernanceParametersTallyingQueryVariables>(GovernanceParametersTallyingDocument, baseOptions);
      }
export function useGovernanceParametersTallyingLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IGovernanceParametersTallyingQuery, IGovernanceParametersTallyingQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IGovernanceParametersTallyingQuery, IGovernanceParametersTallyingQueryVariables>(GovernanceParametersTallyingDocument, baseOptions);
        }
export type GovernanceParametersTallyingQueryHookResult = ReturnType<typeof useGovernanceParametersTallyingQuery>;
export type GovernanceParametersTallyingLazyQueryHookResult = ReturnType<typeof useGovernanceParametersTallyingLazyQuery>;
export type GovernanceParametersTallyingQueryResult = ApolloReactCommon.QueryResult<IGovernanceParametersTallyingQuery, IGovernanceParametersTallyingQueryVariables>;
export const GovernanceParametersVotingDocument = gql`
    query governanceParametersVoting($network: String!) {
  governanceParametersVoting(network: $network) {
    voting_period
  }
}
    `;
export type GovernanceParametersVotingComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IGovernanceParametersVotingQuery, IGovernanceParametersVotingQueryVariables>, "query"> & ({ variables: IGovernanceParametersVotingQueryVariables; skip?: boolean; } | { skip: boolean; });

export const GovernanceParametersVotingComponent = (props: GovernanceParametersVotingComponentProps) => (
      <ApolloReactComponents.Query<IGovernanceParametersVotingQuery, IGovernanceParametersVotingQueryVariables> query={GovernanceParametersVotingDocument} {...props} />
    );

export type IGovernanceParametersVotingProps<TChildProps = {}> = ApolloReactHoc.DataProps<IGovernanceParametersVotingQuery, IGovernanceParametersVotingQueryVariables> & TChildProps;
export function withGovernanceParametersVoting<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IGovernanceParametersVotingQuery,
  IGovernanceParametersVotingQueryVariables,
  IGovernanceParametersVotingProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IGovernanceParametersVotingQuery, IGovernanceParametersVotingQueryVariables, IGovernanceParametersVotingProps<TChildProps>>(GovernanceParametersVotingDocument, {
      alias: "governanceParametersVoting",
      ...operationOptions,
    });
}

/**
 * __useGovernanceParametersVotingQuery__
 *
 * To run a query within a React component, call `useGovernanceParametersVotingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGovernanceParametersVotingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGovernanceParametersVotingQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useGovernanceParametersVotingQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IGovernanceParametersVotingQuery, IGovernanceParametersVotingQueryVariables>) {
        return ApolloReactHooks.useQuery<IGovernanceParametersVotingQuery, IGovernanceParametersVotingQueryVariables>(GovernanceParametersVotingDocument, baseOptions);
      }
export function useGovernanceParametersVotingLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IGovernanceParametersVotingQuery, IGovernanceParametersVotingQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IGovernanceParametersVotingQuery, IGovernanceParametersVotingQueryVariables>(GovernanceParametersVotingDocument, baseOptions);
        }
export type GovernanceParametersVotingQueryHookResult = ReturnType<typeof useGovernanceParametersVotingQuery>;
export type GovernanceParametersVotingLazyQueryHookResult = ReturnType<typeof useGovernanceParametersVotingLazyQuery>;
export type GovernanceParametersVotingQueryResult = ApolloReactCommon.QueryResult<IGovernanceParametersVotingQuery, IGovernanceParametersVotingQueryVariables>;
export const GovernanceProposalsDocument = gql`
    query governanceProposals($network: String!) {
  governanceProposals(network: $network) {
    proposal_id
    title
    description
    proposal_type
    proposal_status
    final_tally_result {
      yes
      abstain
      no
      no_with_veto
    }
    submit_time
    total_deposit {
      denom
      amount
    }
    voting_start_time
  }
}
    `;
export type GovernanceProposalsComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IGovernanceProposalsQuery, IGovernanceProposalsQueryVariables>, "query"> & ({ variables: IGovernanceProposalsQueryVariables; skip?: boolean; } | { skip: boolean; });

export const GovernanceProposalsComponent = (props: GovernanceProposalsComponentProps) => (
      <ApolloReactComponents.Query<IGovernanceProposalsQuery, IGovernanceProposalsQueryVariables> query={GovernanceProposalsDocument} {...props} />
    );

export type IGovernanceProposalsProps<TChildProps = {}> = ApolloReactHoc.DataProps<IGovernanceProposalsQuery, IGovernanceProposalsQueryVariables> & TChildProps;
export function withGovernanceProposals<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IGovernanceProposalsQuery,
  IGovernanceProposalsQueryVariables,
  IGovernanceProposalsProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IGovernanceProposalsQuery, IGovernanceProposalsQueryVariables, IGovernanceProposalsProps<TChildProps>>(GovernanceProposalsDocument, {
      alias: "governanceProposals",
      ...operationOptions,
    });
}

/**
 * __useGovernanceProposalsQuery__
 *
 * To run a query within a React component, call `useGovernanceProposalsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGovernanceProposalsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGovernanceProposalsQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useGovernanceProposalsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IGovernanceProposalsQuery, IGovernanceProposalsQueryVariables>) {
        return ApolloReactHooks.useQuery<IGovernanceProposalsQuery, IGovernanceProposalsQueryVariables>(GovernanceProposalsDocument, baseOptions);
      }
export function useGovernanceProposalsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IGovernanceProposalsQuery, IGovernanceProposalsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IGovernanceProposalsQuery, IGovernanceProposalsQueryVariables>(GovernanceProposalsDocument, baseOptions);
        }
export type GovernanceProposalsQueryHookResult = ReturnType<typeof useGovernanceProposalsQuery>;
export type GovernanceProposalsLazyQueryHookResult = ReturnType<typeof useGovernanceProposalsLazyQuery>;
export type GovernanceProposalsQueryResult = ApolloReactCommon.QueryResult<IGovernanceProposalsQuery, IGovernanceProposalsQueryVariables>;
export const LatestBlockDocument = gql`
    query latestBlock($network: String!) {
  latestBlock(network: $network) {
    block {
      header {
        chain_id
        height
        time
        num_txs
        total_txs
        last_commit_hash
        data_hash
        validators_hash
        next_validators_hash
        consensus_hash
        app_hash
        last_results_hash
        evidence_hash
        proposer_address
      }
    }
  }
}
    `;
export type LatestBlockComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ILatestBlockQuery, ILatestBlockQueryVariables>, "query"> & ({ variables: ILatestBlockQueryVariables; skip?: boolean; } | { skip: boolean; });

export const LatestBlockComponent = (props: LatestBlockComponentProps) => (
      <ApolloReactComponents.Query<ILatestBlockQuery, ILatestBlockQueryVariables> query={LatestBlockDocument} {...props} />
    );

export type ILatestBlockProps<TChildProps = {}> = ApolloReactHoc.DataProps<ILatestBlockQuery, ILatestBlockQueryVariables> & TChildProps;
export function withLatestBlock<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ILatestBlockQuery,
  ILatestBlockQueryVariables,
  ILatestBlockProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ILatestBlockQuery, ILatestBlockQueryVariables, ILatestBlockProps<TChildProps>>(LatestBlockDocument, {
      alias: "latestBlock",
      ...operationOptions,
    });
}

/**
 * __useLatestBlockQuery__
 *
 * To run a query within a React component, call `useLatestBlockQuery` and pass it any options that fit your needs.
 * When your component renders, `useLatestBlockQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLatestBlockQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useLatestBlockQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ILatestBlockQuery, ILatestBlockQueryVariables>) {
        return ApolloReactHooks.useQuery<ILatestBlockQuery, ILatestBlockQueryVariables>(LatestBlockDocument, baseOptions);
      }
export function useLatestBlockLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ILatestBlockQuery, ILatestBlockQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ILatestBlockQuery, ILatestBlockQueryVariables>(LatestBlockDocument, baseOptions);
        }
export type LatestBlockQueryHookResult = ReturnType<typeof useLatestBlockQuery>;
export type LatestBlockLazyQueryHookResult = ReturnType<typeof useLatestBlockLazyQuery>;
export type LatestBlockQueryResult = ApolloReactCommon.QueryResult<ILatestBlockQuery, ILatestBlockQueryVariables>;
export const OasisTransactionsDocument = gql`
    query oasisTransactions($address: String!, $startingPage: Float, $pageSize: Float) {
  oasisTransactions(address: $address, startingPage: $startingPage, pageSize: $pageSize) {
    page
    limit
    data {
      fee
      gas
      gas_price
      height
      method
      date
      sender
      data {
        ... on OasisBurnEvent {
          type
          owner
          tokens
        }
        ... on OasisTransferEvent {
          type
          from
          to
          tokens
        }
        ... on OasisEscrowAddEvent {
          type
          owner
          escrow
          tokens
        }
        ... on OasisEscrowTakeEvent {
          type
          owner
          tokens
        }
        ... on OasisEscrowReclaimEvent {
          type
          owner
          escrow
          tokens
        }
        ... on OasisRegisterEntityEvent {
          type
          id
          nodes
          allow_entity_signed_nodes
        }
        ... on OasisRegisterNodeEvent {
          type
          id
          entity_id
          expiration
        }
        ... on OasisUnfreezeNodeEvent {
          type
          id
        }
        ... on OasisRegisterRuntimeEvent {
          type
          id
          version
        }
        ... on OasisRateEvent {
          type
          start
          rate
        }
        ... on OasisBoundEvent {
          type
          start
          rate_min
          rate_max
        }
        ... on OasisAmendCommissionScheduleEvent {
          type
          rates
          bounds
        }
        ... on OasisUnknownEvent {
          type
          method_name
        }
      }
    }
    moreResultsExist
  }
}
    `;
export type OasisTransactionsComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IOasisTransactionsQuery, IOasisTransactionsQueryVariables>, "query"> & ({ variables: IOasisTransactionsQueryVariables; skip?: boolean; } | { skip: boolean; });

export const OasisTransactionsComponent = (props: OasisTransactionsComponentProps) => (
      <ApolloReactComponents.Query<IOasisTransactionsQuery, IOasisTransactionsQueryVariables> query={OasisTransactionsDocument} {...props} />
    );

export type IOasisTransactionsProps<TChildProps = {}> = ApolloReactHoc.DataProps<IOasisTransactionsQuery, IOasisTransactionsQueryVariables> & TChildProps;
export function withOasisTransactions<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IOasisTransactionsQuery,
  IOasisTransactionsQueryVariables,
  IOasisTransactionsProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IOasisTransactionsQuery, IOasisTransactionsQueryVariables, IOasisTransactionsProps<TChildProps>>(OasisTransactionsDocument, {
      alias: "oasisTransactions",
      ...operationOptions,
    });
}

/**
 * __useOasisTransactionsQuery__
 *
 * To run a query within a React component, call `useOasisTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOasisTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOasisTransactionsQuery({
 *   variables: {
 *      address: // value for 'address'
 *      startingPage: // value for 'startingPage'
 *      pageSize: // value for 'pageSize'
 *   },
 * });
 */
export function useOasisTransactionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IOasisTransactionsQuery, IOasisTransactionsQueryVariables>) {
        return ApolloReactHooks.useQuery<IOasisTransactionsQuery, IOasisTransactionsQueryVariables>(OasisTransactionsDocument, baseOptions);
      }
export function useOasisTransactionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IOasisTransactionsQuery, IOasisTransactionsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IOasisTransactionsQuery, IOasisTransactionsQueryVariables>(OasisTransactionsDocument, baseOptions);
        }
export type OasisTransactionsQueryHookResult = ReturnType<typeof useOasisTransactionsQuery>;
export type OasisTransactionsLazyQueryHookResult = ReturnType<typeof useOasisTransactionsLazyQuery>;
export type OasisTransactionsQueryResult = ApolloReactCommon.QueryResult<IOasisTransactionsQuery, IOasisTransactionsQueryVariables>;
export const PortfolioHistoryDocument = gql`
    query portfolioHistory($address: String!, $fiat: String!) {
  portfolioHistory(address: $address, fiat: $fiat) {
    balanceHistory {
      address
      denom
      balance
      height
      timestamp
      chain
    }
    delegations {
      balance
      address
      timestamp
    }
    unbondings {
      balance
      address
      timestamp
    }
    delegatorRewards {
      balance
      height
      address
      timestamp
    }
    validatorCommissions {
      balance
      height
      validator
      timestamp
    }
    fiatPriceHistory {
      price
      timestamp
    }
  }
}
    `;
export type PortfolioHistoryComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IPortfolioHistoryQuery, IPortfolioHistoryQueryVariables>, "query"> & ({ variables: IPortfolioHistoryQueryVariables; skip?: boolean; } | { skip: boolean; });

export const PortfolioHistoryComponent = (props: PortfolioHistoryComponentProps) => (
      <ApolloReactComponents.Query<IPortfolioHistoryQuery, IPortfolioHistoryQueryVariables> query={PortfolioHistoryDocument} {...props} />
    );

export type IPortfolioHistoryProps<TChildProps = {}> = ApolloReactHoc.DataProps<IPortfolioHistoryQuery, IPortfolioHistoryQueryVariables> & TChildProps;
export function withPortfolioHistory<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IPortfolioHistoryQuery,
  IPortfolioHistoryQueryVariables,
  IPortfolioHistoryProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IPortfolioHistoryQuery, IPortfolioHistoryQueryVariables, IPortfolioHistoryProps<TChildProps>>(PortfolioHistoryDocument, {
      alias: "portfolioHistory",
      ...operationOptions,
    });
}

/**
 * __usePortfolioHistoryQuery__
 *
 * To run a query within a React component, call `usePortfolioHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `usePortfolioHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortfolioHistoryQuery({
 *   variables: {
 *      address: // value for 'address'
 *      fiat: // value for 'fiat'
 *   },
 * });
 */
export function usePortfolioHistoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IPortfolioHistoryQuery, IPortfolioHistoryQueryVariables>) {
        return ApolloReactHooks.useQuery<IPortfolioHistoryQuery, IPortfolioHistoryQueryVariables>(PortfolioHistoryDocument, baseOptions);
      }
export function usePortfolioHistoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IPortfolioHistoryQuery, IPortfolioHistoryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IPortfolioHistoryQuery, IPortfolioHistoryQueryVariables>(PortfolioHistoryDocument, baseOptions);
        }
export type PortfolioHistoryQueryHookResult = ReturnType<typeof usePortfolioHistoryQuery>;
export type PortfolioHistoryLazyQueryHookResult = ReturnType<typeof usePortfolioHistoryLazyQuery>;
export type PortfolioHistoryQueryResult = ApolloReactCommon.QueryResult<IPortfolioHistoryQuery, IPortfolioHistoryQueryVariables>;
export const PricesDocument = gql`
    query prices($currency: String!, $versus: String!) {
  prices(currency: $currency, versus: $versus) {
    price
  }
}
    `;
export type PricesComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IPricesQuery, IPricesQueryVariables>, "query"> & ({ variables: IPricesQueryVariables; skip?: boolean; } | { skip: boolean; });

export const PricesComponent = (props: PricesComponentProps) => (
      <ApolloReactComponents.Query<IPricesQuery, IPricesQueryVariables> query={PricesDocument} {...props} />
    );

export type IPricesProps<TChildProps = {}> = ApolloReactHoc.DataProps<IPricesQuery, IPricesQueryVariables> & TChildProps;
export function withPrices<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IPricesQuery,
  IPricesQueryVariables,
  IPricesProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IPricesQuery, IPricesQueryVariables, IPricesProps<TChildProps>>(PricesDocument, {
      alias: "prices",
      ...operationOptions,
    });
}

/**
 * __usePricesQuery__
 *
 * To run a query within a React component, call `usePricesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePricesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePricesQuery({
 *   variables: {
 *      currency: // value for 'currency'
 *      versus: // value for 'versus'
 *   },
 * });
 */
export function usePricesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IPricesQuery, IPricesQueryVariables>) {
        return ApolloReactHooks.useQuery<IPricesQuery, IPricesQueryVariables>(PricesDocument, baseOptions);
      }
export function usePricesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IPricesQuery, IPricesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IPricesQuery, IPricesQueryVariables>(PricesDocument, baseOptions);
        }
export type PricesQueryHookResult = ReturnType<typeof usePricesQuery>;
export type PricesLazyQueryHookResult = ReturnType<typeof usePricesLazyQuery>;
export type PricesQueryResult = ApolloReactCommon.QueryResult<IPricesQuery, IPricesQueryVariables>;
export const RewardsByValidatorDocument = gql`
    query rewardsByValidator($address: String!) {
  rewardsByValidator(address: $address) {
    reward {
      denom
      amount
    }
    validator_address
  }
}
    `;
export type RewardsByValidatorComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IRewardsByValidatorQuery, IRewardsByValidatorQueryVariables>, "query"> & ({ variables: IRewardsByValidatorQueryVariables; skip?: boolean; } | { skip: boolean; });

export const RewardsByValidatorComponent = (props: RewardsByValidatorComponentProps) => (
      <ApolloReactComponents.Query<IRewardsByValidatorQuery, IRewardsByValidatorQueryVariables> query={RewardsByValidatorDocument} {...props} />
    );

export type IRewardsByValidatorProps<TChildProps = {}> = ApolloReactHoc.DataProps<IRewardsByValidatorQuery, IRewardsByValidatorQueryVariables> & TChildProps;
export function withRewardsByValidator<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IRewardsByValidatorQuery,
  IRewardsByValidatorQueryVariables,
  IRewardsByValidatorProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IRewardsByValidatorQuery, IRewardsByValidatorQueryVariables, IRewardsByValidatorProps<TChildProps>>(RewardsByValidatorDocument, {
      alias: "rewardsByValidator",
      ...operationOptions,
    });
}

/**
 * __useRewardsByValidatorQuery__
 *
 * To run a query within a React component, call `useRewardsByValidatorQuery` and pass it any options that fit your needs.
 * When your component renders, `useRewardsByValidatorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRewardsByValidatorQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useRewardsByValidatorQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IRewardsByValidatorQuery, IRewardsByValidatorQueryVariables>) {
        return ApolloReactHooks.useQuery<IRewardsByValidatorQuery, IRewardsByValidatorQueryVariables>(RewardsByValidatorDocument, baseOptions);
      }
export function useRewardsByValidatorLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IRewardsByValidatorQuery, IRewardsByValidatorQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IRewardsByValidatorQuery, IRewardsByValidatorQueryVariables>(RewardsByValidatorDocument, baseOptions);
        }
export type RewardsByValidatorQueryHookResult = ReturnType<typeof useRewardsByValidatorQuery>;
export type RewardsByValidatorLazyQueryHookResult = ReturnType<typeof useRewardsByValidatorLazyQuery>;
export type RewardsByValidatorQueryResult = ApolloReactCommon.QueryResult<IRewardsByValidatorQuery, IRewardsByValidatorQueryVariables>;
export const SlashingParametersDocument = gql`
    query slashingParameters($network: String!) {
  slashingParameters(network: $network) {
    max_evidence_age
    signed_blocks_window
    min_signed_per_window
    double_sign_unbond_duration
    downtime_unbond_duration
    slash_fraction_double_sign
    slash_fraction_downtime
  }
}
    `;
export type SlashingParametersComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ISlashingParametersQuery, ISlashingParametersQueryVariables>, "query"> & ({ variables: ISlashingParametersQueryVariables; skip?: boolean; } | { skip: boolean; });

export const SlashingParametersComponent = (props: SlashingParametersComponentProps) => (
      <ApolloReactComponents.Query<ISlashingParametersQuery, ISlashingParametersQueryVariables> query={SlashingParametersDocument} {...props} />
    );

export type ISlashingParametersProps<TChildProps = {}> = ApolloReactHoc.DataProps<ISlashingParametersQuery, ISlashingParametersQueryVariables> & TChildProps;
export function withSlashingParameters<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ISlashingParametersQuery,
  ISlashingParametersQueryVariables,
  ISlashingParametersProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ISlashingParametersQuery, ISlashingParametersQueryVariables, ISlashingParametersProps<TChildProps>>(SlashingParametersDocument, {
      alias: "slashingParameters",
      ...operationOptions,
    });
}

/**
 * __useSlashingParametersQuery__
 *
 * To run a query within a React component, call `useSlashingParametersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSlashingParametersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSlashingParametersQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useSlashingParametersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ISlashingParametersQuery, ISlashingParametersQueryVariables>) {
        return ApolloReactHooks.useQuery<ISlashingParametersQuery, ISlashingParametersQueryVariables>(SlashingParametersDocument, baseOptions);
      }
export function useSlashingParametersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ISlashingParametersQuery, ISlashingParametersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ISlashingParametersQuery, ISlashingParametersQueryVariables>(SlashingParametersDocument, baseOptions);
        }
export type SlashingParametersQueryHookResult = ReturnType<typeof useSlashingParametersQuery>;
export type SlashingParametersLazyQueryHookResult = ReturnType<typeof useSlashingParametersLazyQuery>;
export type SlashingParametersQueryResult = ApolloReactCommon.QueryResult<ISlashingParametersQuery, ISlashingParametersQueryVariables>;
export const StakingParametersDocument = gql`
    query stakingParameters($network: String!) {
  stakingParameters(network: $network) {
    inflation_rate_change
    inflation_max
    inflation_min
    goal_bonded
    unbonding_time
    max_validators
    max_entries
    bond_denom
  }
}
    `;
export type StakingParametersComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IStakingParametersQuery, IStakingParametersQueryVariables>, "query"> & ({ variables: IStakingParametersQueryVariables; skip?: boolean; } | { skip: boolean; });

export const StakingParametersComponent = (props: StakingParametersComponentProps) => (
      <ApolloReactComponents.Query<IStakingParametersQuery, IStakingParametersQueryVariables> query={StakingParametersDocument} {...props} />
    );

export type IStakingParametersProps<TChildProps = {}> = ApolloReactHoc.DataProps<IStakingParametersQuery, IStakingParametersQueryVariables> & TChildProps;
export function withStakingParameters<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IStakingParametersQuery,
  IStakingParametersQueryVariables,
  IStakingParametersProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IStakingParametersQuery, IStakingParametersQueryVariables, IStakingParametersProps<TChildProps>>(StakingParametersDocument, {
      alias: "stakingParameters",
      ...operationOptions,
    });
}

/**
 * __useStakingParametersQuery__
 *
 * To run a query within a React component, call `useStakingParametersQuery` and pass it any options that fit your needs.
 * When your component renders, `useStakingParametersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStakingParametersQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useStakingParametersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IStakingParametersQuery, IStakingParametersQueryVariables>) {
        return ApolloReactHooks.useQuery<IStakingParametersQuery, IStakingParametersQueryVariables>(StakingParametersDocument, baseOptions);
      }
export function useStakingParametersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IStakingParametersQuery, IStakingParametersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IStakingParametersQuery, IStakingParametersQueryVariables>(StakingParametersDocument, baseOptions);
        }
export type StakingParametersQueryHookResult = ReturnType<typeof useStakingParametersQuery>;
export type StakingParametersLazyQueryHookResult = ReturnType<typeof useStakingParametersLazyQuery>;
export type StakingParametersQueryResult = ApolloReactCommon.QueryResult<IStakingParametersQuery, IStakingParametersQueryVariables>;
export const StakingPoolDocument = gql`
    query stakingPool($network: String!) {
  stakingPool(network: $network) {
    loose_tokens
    bonded_tokens
    not_bonded_tokens
    inflation_last_time
    inflation
    date_last_commission_reset
    prev_bonded_shares
  }
}
    `;
export type StakingPoolComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IStakingPoolQuery, IStakingPoolQueryVariables>, "query"> & ({ variables: IStakingPoolQueryVariables; skip?: boolean; } | { skip: boolean; });

export const StakingPoolComponent = (props: StakingPoolComponentProps) => (
      <ApolloReactComponents.Query<IStakingPoolQuery, IStakingPoolQueryVariables> query={StakingPoolDocument} {...props} />
    );

export type IStakingPoolProps<TChildProps = {}> = ApolloReactHoc.DataProps<IStakingPoolQuery, IStakingPoolQueryVariables> & TChildProps;
export function withStakingPool<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IStakingPoolQuery,
  IStakingPoolQueryVariables,
  IStakingPoolProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IStakingPoolQuery, IStakingPoolQueryVariables, IStakingPoolProps<TChildProps>>(StakingPoolDocument, {
      alias: "stakingPool",
      ...operationOptions,
    });
}

/**
 * __useStakingPoolQuery__
 *
 * To run a query within a React component, call `useStakingPoolQuery` and pass it any options that fit your needs.
 * When your component renders, `useStakingPoolQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStakingPoolQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useStakingPoolQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IStakingPoolQuery, IStakingPoolQueryVariables>) {
        return ApolloReactHooks.useQuery<IStakingPoolQuery, IStakingPoolQueryVariables>(StakingPoolDocument, baseOptions);
      }
export function useStakingPoolLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IStakingPoolQuery, IStakingPoolQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IStakingPoolQuery, IStakingPoolQueryVariables>(StakingPoolDocument, baseOptions);
        }
export type StakingPoolQueryHookResult = ReturnType<typeof useStakingPoolQuery>;
export type StakingPoolLazyQueryHookResult = ReturnType<typeof useStakingPoolLazyQuery>;
export type StakingPoolQueryResult = ApolloReactCommon.QueryResult<IStakingPoolQuery, IStakingPoolQueryVariables>;
export const TransactionDocument = gql`
    query transaction($txHash: String!, $network: String!) {
  transaction(txHash: $txHash, network: $network) {
    hash
    height
    log {
      code
      message
      success
      log
      msg_index
    }
    gaswanted
    gasused
    memo
    fees {
      amount {
        denom
        amount
      }
      gas
    }
    tags {
      key
      value
    }
    msgs {
      type
      value {
        ... on MsgSend {
          amounts {
            denom
            amount
          }
          to_address
          from_address
        }
        ... on MsgVote {
          proposal_id
          voter
          option
        }
        ... on MsgDelegate {
          amount {
            denom
            amount
          }
          delegator_address
          validator_address
        }
        ... on MsgSubmitProposal {
          title
          description
          proposal_type
          proposer
          initial_deposit {
            denom
            amount
          }
        }
        ... on MsgBeginRedelegate {
          amount {
            denom
            amount
          }
          delegator_address
          validator_src_address
          validator_dst_address
        }
        ... on MsgModifyWithdrawAddress {
          withdraw_address
          validator_address
        }
        ... on MsgBeginRedelegateLegacy {
          shares_amount
          delegator_address
          validator_src_address
          validator_dst_address
        }
        ... on MsgWithdrawDelegationReward {
          delegator_address
          validator_address
        }
        ... on MsgWithdrawValidatorCommission {
          validator_address
        }
      }
    }
    timestamp
    chain
  }
}
    `;
export type TransactionComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ITransactionQuery, ITransactionQueryVariables>, "query"> & ({ variables: ITransactionQueryVariables; skip?: boolean; } | { skip: boolean; });

export const TransactionComponent = (props: TransactionComponentProps) => (
      <ApolloReactComponents.Query<ITransactionQuery, ITransactionQueryVariables> query={TransactionDocument} {...props} />
    );

export type ITransactionProps<TChildProps = {}> = ApolloReactHoc.DataProps<ITransactionQuery, ITransactionQueryVariables> & TChildProps;
export function withTransaction<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ITransactionQuery,
  ITransactionQueryVariables,
  ITransactionProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ITransactionQuery, ITransactionQueryVariables, ITransactionProps<TChildProps>>(TransactionDocument, {
      alias: "transaction",
      ...operationOptions,
    });
}

/**
 * __useTransactionQuery__
 *
 * To run a query within a React component, call `useTransactionQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionQuery({
 *   variables: {
 *      txHash: // value for 'txHash'
 *      network: // value for 'network'
 *   },
 * });
 */
export function useTransactionQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ITransactionQuery, ITransactionQueryVariables>) {
        return ApolloReactHooks.useQuery<ITransactionQuery, ITransactionQueryVariables>(TransactionDocument, baseOptions);
      }
export function useTransactionLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ITransactionQuery, ITransactionQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ITransactionQuery, ITransactionQueryVariables>(TransactionDocument, baseOptions);
        }
export type TransactionQueryHookResult = ReturnType<typeof useTransactionQuery>;
export type TransactionLazyQueryHookResult = ReturnType<typeof useTransactionLazyQuery>;
export type TransactionQueryResult = ApolloReactCommon.QueryResult<ITransactionQuery, ITransactionQueryVariables>;
export const ValidatorDistributionDocument = gql`
    query validatorDistribution($validatorAddress: String!) {
  validatorDistribution(validatorAddress: $validatorAddress) {
    operator_address
    self_bond_rewards {
      denom
      amount
    }
    val_commission {
      denom
      amount
    }
  }
}
    `;
export type ValidatorDistributionComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IValidatorDistributionQuery, IValidatorDistributionQueryVariables>, "query"> & ({ variables: IValidatorDistributionQueryVariables; skip?: boolean; } | { skip: boolean; });

export const ValidatorDistributionComponent = (props: ValidatorDistributionComponentProps) => (
      <ApolloReactComponents.Query<IValidatorDistributionQuery, IValidatorDistributionQueryVariables> query={ValidatorDistributionDocument} {...props} />
    );

export type IValidatorDistributionProps<TChildProps = {}> = ApolloReactHoc.DataProps<IValidatorDistributionQuery, IValidatorDistributionQueryVariables> & TChildProps;
export function withValidatorDistribution<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IValidatorDistributionQuery,
  IValidatorDistributionQueryVariables,
  IValidatorDistributionProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IValidatorDistributionQuery, IValidatorDistributionQueryVariables, IValidatorDistributionProps<TChildProps>>(ValidatorDistributionDocument, {
      alias: "validatorDistribution",
      ...operationOptions,
    });
}

/**
 * __useValidatorDistributionQuery__
 *
 * To run a query within a React component, call `useValidatorDistributionQuery` and pass it any options that fit your needs.
 * When your component renders, `useValidatorDistributionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useValidatorDistributionQuery({
 *   variables: {
 *      validatorAddress: // value for 'validatorAddress'
 *   },
 * });
 */
export function useValidatorDistributionQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IValidatorDistributionQuery, IValidatorDistributionQueryVariables>) {
        return ApolloReactHooks.useQuery<IValidatorDistributionQuery, IValidatorDistributionQueryVariables>(ValidatorDistributionDocument, baseOptions);
      }
export function useValidatorDistributionLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IValidatorDistributionQuery, IValidatorDistributionQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IValidatorDistributionQuery, IValidatorDistributionQueryVariables>(ValidatorDistributionDocument, baseOptions);
        }
export type ValidatorDistributionQueryHookResult = ReturnType<typeof useValidatorDistributionQuery>;
export type ValidatorDistributionLazyQueryHookResult = ReturnType<typeof useValidatorDistributionLazyQuery>;
export type ValidatorDistributionQueryResult = ApolloReactCommon.QueryResult<IValidatorDistributionQuery, IValidatorDistributionQueryVariables>;
export const ValidatorSetsDocument = gql`
    query validatorSets($network: String!) {
  validatorSets(network: $network) {
    block_height
    validators {
      address
      pub_key
      voting_power
      proposer_priority
    }
  }
}
    `;
export type ValidatorSetsComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IValidatorSetsQuery, IValidatorSetsQueryVariables>, "query"> & ({ variables: IValidatorSetsQueryVariables; skip?: boolean; } | { skip: boolean; });

export const ValidatorSetsComponent = (props: ValidatorSetsComponentProps) => (
      <ApolloReactComponents.Query<IValidatorSetsQuery, IValidatorSetsQueryVariables> query={ValidatorSetsDocument} {...props} />
    );

export type IValidatorSetsProps<TChildProps = {}> = ApolloReactHoc.DataProps<IValidatorSetsQuery, IValidatorSetsQueryVariables> & TChildProps;
export function withValidatorSets<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IValidatorSetsQuery,
  IValidatorSetsQueryVariables,
  IValidatorSetsProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IValidatorSetsQuery, IValidatorSetsQueryVariables, IValidatorSetsProps<TChildProps>>(ValidatorSetsDocument, {
      alias: "validatorSets",
      ...operationOptions,
    });
}

/**
 * __useValidatorSetsQuery__
 *
 * To run a query within a React component, call `useValidatorSetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useValidatorSetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useValidatorSetsQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useValidatorSetsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IValidatorSetsQuery, IValidatorSetsQueryVariables>) {
        return ApolloReactHooks.useQuery<IValidatorSetsQuery, IValidatorSetsQueryVariables>(ValidatorSetsDocument, baseOptions);
      }
export function useValidatorSetsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IValidatorSetsQuery, IValidatorSetsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IValidatorSetsQuery, IValidatorSetsQueryVariables>(ValidatorSetsDocument, baseOptions);
        }
export type ValidatorSetsQueryHookResult = ReturnType<typeof useValidatorSetsQuery>;
export type ValidatorSetsLazyQueryHookResult = ReturnType<typeof useValidatorSetsLazyQuery>;
export type ValidatorSetsQueryResult = ApolloReactCommon.QueryResult<IValidatorSetsQuery, IValidatorSetsQueryVariables>;
export const ValidatorsDocument = gql`
    query validators($network: String!) {
  validators(network: $network) {
    operator_address
    consensus_pubkey
    jailed
    status
    tokens
    delegator_shares
    description {
      moniker
      identity
      website
      details
    }
    unbonding_height
    unbonding_time
    commission {
      update_time
      commission_rates {
        rate
        max_rate
        max_change_rate
      }
    }
    min_self_delegation
  }
}
    `;
export type ValidatorsComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IValidatorsQuery, IValidatorsQueryVariables>, "query"> & ({ variables: IValidatorsQueryVariables; skip?: boolean; } | { skip: boolean; });

export const ValidatorsComponent = (props: ValidatorsComponentProps) => (
      <ApolloReactComponents.Query<IValidatorsQuery, IValidatorsQueryVariables> query={ValidatorsDocument} {...props} />
    );

export type IValidatorsProps<TChildProps = {}> = ApolloReactHoc.DataProps<IValidatorsQuery, IValidatorsQueryVariables> & TChildProps;
export function withValidators<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IValidatorsQuery,
  IValidatorsQueryVariables,
  IValidatorsProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IValidatorsQuery, IValidatorsQueryVariables, IValidatorsProps<TChildProps>>(ValidatorsDocument, {
      alias: "validators",
      ...operationOptions,
    });
}

/**
 * __useValidatorsQuery__
 *
 * To run a query within a React component, call `useValidatorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useValidatorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useValidatorsQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useValidatorsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IValidatorsQuery, IValidatorsQueryVariables>) {
        return ApolloReactHooks.useQuery<IValidatorsQuery, IValidatorsQueryVariables>(ValidatorsDocument, baseOptions);
      }
export function useValidatorsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IValidatorsQuery, IValidatorsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IValidatorsQuery, IValidatorsQueryVariables>(ValidatorsDocument, baseOptions);
        }
export type ValidatorsQueryHookResult = ReturnType<typeof useValidatorsQuery>;
export type ValidatorsLazyQueryHookResult = ReturnType<typeof useValidatorsLazyQuery>;
export type ValidatorsQueryResult = ApolloReactCommon.QueryResult<IValidatorsQuery, IValidatorsQueryVariables>;
