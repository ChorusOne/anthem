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

export interface IAccountCoin {
   __typename?: "AccountCoin";
  denom: Scalars["String"];
  amount: Scalars["String"];
}

export interface IApprovedProposal {
   __typename?: "ApprovedProposal";
  proposalID: Scalars["Float"];
  index: Scalars["Float"];
  currentBlockNumber: Scalars["Float"];
  stage: Scalars["String"];
  proposer: Scalars["String"];
  proposalEpoch: Scalars["Float"];
  referendumEpoch: Scalars["Float"];
  executionEpoch: Scalars["Float"];
  expirationEpoch: Scalars["Float"];
  queuedAtBlockNumber: Scalars["Float"];
  deposit: Scalars["Float"];
  queuedAtTimestamp: Scalars["Float"];
  gist: Scalars["String"];
  description: Scalars["String"];
}

export interface IAvailableReward {
   __typename?: "AvailableReward";
  reward: Maybe<ICosmosBalance[]>;
  validator_address: Scalars["String"];
}

export interface IBlock {
   __typename?: "Block";
  header: IBlockHeader;
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
  availableGoldBalance: Scalars["String"];
  totalLockedGoldBalance: Scalars["String"];
  nonVotingLockedGoldBalance: Scalars["String"];
  votingLockedGoldBalance: Scalars["String"];
  pendingWithdrawalBalance: Scalars["String"];
  celoUSDValue: Scalars["String"];
  delegations: ICeloDelegation[];
}

export interface ICeloAccountSnapshot {
   __typename?: "CeloAccountSnapshot";
  snapshotDate: Scalars["String"];
  address: Scalars["String"];
  height: Scalars["String"];
  snapshotReward: Scalars["String"];
  availableGoldBalance: Scalars["String"];
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

export interface ICeloGovernanceProposalHistory {
   __typename?: "CeloGovernanceProposalHistory";
  queuedProposals: IQueuedProposal[];
  approvalProposals: IApprovedProposal[];
  referendumProposals: IReferendumProposal[];
  executionProposals: IExecutionProposal[];
  expiredProposals: IExpiredProposal[];
}

export interface ICeloSystemBalances {
   __typename?: "CeloSystemBalances";
  height: Scalars["String"];
  goldTokenSupply: Scalars["String"];
  totalLockedGoldBalance: Scalars["String"];
  nonVotingLockedGoldBalance: Scalars["String"];
  totalCeloUSDValue: Maybe<Scalars["String"]>;
}

export interface ICeloSystemHistory {
   __typename?: "CeloSystemHistory";
  BlockNumber: Scalars["String"];
  SnapshotDate: Scalars["String"];
  GoldTokenSupply: Scalars["String"];
  TotalLockedGoldBalance: Scalars["String"];
  NonVotingLockedGoldBalance: Scalars["String"];
  TotalCeloUSDValue: Scalars["String"];
}

export interface ICeloTransaction {
   __typename?: "CeloTransaction";
  blockNumber: Scalars["Int"];
  timestamp: Scalars["String"];
  hash: Scalars["String"];
  from: Maybe<Scalars["String"]>;
  to: Maybe<Scalars["String"]>;
  details: ICeloTransactionDetails;
  tags: ICeloTransactionTags[];
}

export interface ICeloTransactionDetails {
   __typename?: "CeloTransactionDetails";
  nonce: Scalars["Float"];
  gasLimit: Scalars["Float"];
  gasPrice: Scalars["Float"];
  gasUsed: Scalars["Float"];
  feeCurrency: Maybe<Scalars["String"]>;
  gatewayFeeRecipient: Maybe<Scalars["String"]>;
  gatewayFee: Scalars["Float"];
  to: Maybe<Scalars["String"]>;
  value: Scalars["Float"];
}

export interface ICeloTransactionResult {
   __typename?: "CeloTransactionResult";
  page: Scalars["Float"];
  limit: Scalars["Float"];
  data: ICeloTransaction[];
  moreResultsExist: Scalars["Boolean"];
}

export interface ICeloTransactionTags {
   __typename?: "CeloTransactionTags";
  eventname: Scalars["String"];
  source: Scalars["String"];
  parameters: Scalars["String"];
}

export interface ICeloValidatorDetail {
   __typename?: "CeloValidatorDetail";
  validatorAddress: Scalars["String"];
  validator_score: Scalars["Float"];
}

export interface ICeloValidatorGroup {
   __typename?: "CeloValidatorGroup";
  group: Scalars["String"];
  name: Scalars["String"];
  metadataURL: Scalars["String"];
  blockNumber: Scalars["Float"];
  votingPower: Scalars["Float"];
  votingPowerFraction: Scalars["String"];
  capacityAvailable: Scalars["Float"];
  totalCapacity: Scalars["Float"];
  multiplier: Scalars["Float"];
  groupShare: Scalars["Float"];
  groupScore: Scalars["Float"];
  validatorDetails: ICeloValidatorDetail[];
}

export interface ICommissionRates {
   __typename?: "CommissionRates";
  rate: Scalars["String"];
  max_rate: Scalars["String"];
  max_change_rate: Scalars["String"];
}

export interface ICosmosAccountBalances {
   __typename?: "CosmosAccountBalances";
  balance: Maybe<ICosmosBalance[]>;
  rewards: Maybe<ICosmosBalance[]>;
  delegations: Maybe<IDelegation[]>;
  unbonding: Maybe<IUnbondingDelegation[]>;
  commissions: Maybe<ICosmosBalance[]>;
}

export interface ICosmosAccountHistory {
   __typename?: "CosmosAccountHistory";
  balanceHistory: ICosmosBalanceHistory[];
  delegations: ICosmosDelegationHistory[];
  unbondings: ICosmosDelegationHistory[];
  delegatorRewards: ICosmosRewardHistory[];
  validatorCommissions: ICosmosCommissionHistory[];
  fiatPriceHistory: IFiatPrice[];
}

export interface ICosmosAccountInformation {
   __typename?: "CosmosAccountInformation";
  type: Scalars["String"];
  value: IAccount;
}

export interface ICosmosBalance {
   __typename?: "CosmosBalance";
  denom: Scalars["String"];
  amount: Scalars["String"];
}

export interface ICosmosBalanceHistory {
   __typename?: "CosmosBalanceHistory";
  address: Scalars["String"];
  denom: Scalars["String"];
  balance: Scalars["String"];
  height: Scalars["Int"];
  timestamp: Scalars["String"];
  chain: Scalars["String"];
}

export interface ICosmosBlockData {
   __typename?: "CosmosBlockData";
  block: IBlock;
}

export interface ICosmosCommissionHistory {
   __typename?: "CosmosCommissionHistory";
  balance: Scalars["String"];
  height: Scalars["Int"];
  validator: Scalars["String"];
  timestamp: Scalars["String"];
}

export interface ICosmosDelegationHistory {
   __typename?: "CosmosDelegationHistory";
  balance: Scalars["String"];
  address: Scalars["String"];
  timestamp: Scalars["String"];
}

export interface ICosmosDistributionParameters {
   __typename?: "CosmosDistributionParameters";
  base_proposer_reward: Scalars["String"];
  bonus_proposer_reward: Scalars["String"];
  community_tax: Scalars["String"];
}

export interface ICosmosGovernanceParametersDeposit {
   __typename?: "CosmosGovernanceParametersDeposit";
  min_deposit: Maybe<ICosmosBalance[]>;
  max_deposit_period: Scalars["String"];
}

export interface ICosmosGovernanceParametersTallying {
   __typename?: "CosmosGovernanceParametersTallying";
  threshold: Scalars["String"];
  veto: Scalars["String"];
  governance_penalty: Maybe<Scalars["String"]>;
}

export interface ICosmosGovernanceParametersVoting {
   __typename?: "CosmosGovernanceParametersVoting";
  voting_period: Scalars["String"];
}

export interface ICosmosGovernanceProposal {
   __typename?: "CosmosGovernanceProposal";
  proposal_id: Maybe<Scalars["Int"]>;
  title: Maybe<Scalars["String"]>;
  description: Maybe<Scalars["String"]>;
  proposal_type: Maybe<Scalars["String"]>;
  proposal_status: Scalars["String"];
  final_tally_result: ITallyResult;
  submit_time: Scalars["String"];
  total_deposit: Maybe<ICosmosBalance[]>;
  voting_start_time: Scalars["String"];
}

export interface ICosmosRewardHistory {
   __typename?: "CosmosRewardHistory";
  balance: Scalars["String"];
  height: Scalars["Int"];
  address: Scalars["String"];
  timestamp: Scalars["String"];
}

export interface ICosmosSlashingParameters {
   __typename?: "CosmosSlashingParameters";
  max_evidence_age: Scalars["String"];
  signed_blocks_window: Scalars["String"];
  min_signed_per_window: Scalars["String"];
  double_sign_unbond_duration: Maybe<Scalars["String"]>;
  downtime_unbond_duration: Maybe<Scalars["String"]>;
  slash_fraction_double_sign: Scalars["String"];
  slash_fraction_downtime: Scalars["String"];
}

export interface ICosmosStakingParameters {
   __typename?: "CosmosStakingParameters";
  inflation_rate_change: Maybe<Scalars["String"]>;
  inflation_max: Maybe<Scalars["String"]>;
  inflation_min: Maybe<Scalars["String"]>;
  goal_bonded: Maybe<Scalars["String"]>;
  unbonding_time: Scalars["String"];
  max_validators: Scalars["Int"];
  max_entries: Scalars["Int"];
  bond_denom: Scalars["String"];
}

export interface ICosmosStakingPool {
   __typename?: "CosmosStakingPool";
  loose_tokens: Maybe<Scalars["String"]>;
  bonded_tokens: Maybe<Scalars["String"]>;
  not_bonded_tokens: Maybe<Scalars["String"]>;
  inflation_last_time: Maybe<Scalars["String"]>;
  inflation: Maybe<Scalars["String"]>;
  date_last_commission_reset: Maybe<Scalars["String"]>;
  prev_bonded_shares: Maybe<Scalars["String"]>;
}

export interface ICosmosTransaction {
   __typename?: "CosmosTransaction";
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

export interface ICosmosTransactionResult {
   __typename?: "CosmosTransactionResult";
  page: Scalars["Float"];
  limit: Scalars["Float"];
  data: ICosmosTransaction[];
  moreResultsExist: Scalars["Boolean"];
}

export interface ICosmosValidator {
   __typename?: "CosmosValidator";
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

export interface ICosmosValidatorDistribution {
   __typename?: "CosmosValidatorDistribution";
  operator_address: Scalars["String"];
  self_bond_rewards: Maybe<ICosmosBalance[]>;
  val_commission: Maybe<ICosmosBalance[]>;
}

export interface ICosmosValidatorSet {
   __typename?: "CosmosValidatorSet";
  block_height: Scalars["Int"];
  validators: Maybe<IValidatorSetItem[]>;
}

export interface IDelegation {
   __typename?: "Delegation";
  delegator_address: Scalars["String"];
  validator_address: Scalars["String"];
  shares: Scalars["String"];
}

export interface IExecutionProposal {
   __typename?: "ExecutionProposal";
  proposalID: Scalars["Float"];
  index: Scalars["Float"];
  currentBlockNumber: Scalars["Float"];
  stage: Scalars["String"];
  proposer: Scalars["String"];
  yesVotes: Scalars["Float"];
  noVotes: Scalars["Float"];
  abstainVotes: Scalars["Float"];
  proposalEpoch: Scalars["Float"];
  referendumEpoch: Scalars["Float"];
  executionEpoch: Scalars["Float"];
  expirationEpoch: Scalars["Float"];
  queuedAtBlockNumber: Scalars["Float"];
  deposit: Scalars["Float"];
  queuedAtTimestamp: Scalars["Float"];
  gist: Scalars["String"];
  description: Scalars["String"];
}

export interface IExpiredProposal {
   __typename?: "ExpiredProposal";
  proposalID: Scalars["Float"];
  currentBlockNumber: Scalars["Float"];
  stage: Scalars["String"];
  proposer: Scalars["String"];
  executed: Maybe<Scalars["Boolean"]>;
  queuedAtBlockNumber: Scalars["Float"];
  deposit: Scalars["Float"];
  queuedAtTimestamp: Scalars["Float"];
  gist: Scalars["String"];
  description: Scalars["String"];
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
  amount: ICosmosBalance;
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
  amount: ICosmosBalance;
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
  amounts: Maybe<ICosmosBalance[]>;
  to_address: Maybe<Scalars["String"]>;
  from_address: Maybe<Scalars["String"]>;
}

export interface IMsgSubmitProposal {
   __typename?: "MsgSubmitProposal";
  title: Scalars["String"];
  description: Scalars["String"];
  proposal_type: Scalars["String"];
  proposer: Scalars["String"];
  initial_deposit: Maybe<ICosmosBalance[]>;
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

export interface IOasisAccountHistory {
   __typename?: "OasisAccountHistory";
  date: Scalars["String"];
  height: Scalars["Float"];
  address: Scalars["String"];
  rewards: Scalars["String"];
  balance: Scalars["String"];
  meta: IOasisAccountMeta;
  delegations: Maybe<IOasisDelegation[]>;
  debonding_balance: IOasisBalance;
  staked_balance: IOasisBalance;
}

export interface IOasisAccountMeta {
   __typename?: "OasisAccountMeta";
  is_validator: Scalars["Boolean"];
  is_delegator: Scalars["Boolean"];
}

export interface IOasisAmendCommissionScheduleEvent {
   __typename?: "OasisAmendCommissionScheduleEvent";
  type: IOasisTransactionType;
  rates: Maybe<Array<Scalars["String"]>>;
  bounds: Maybe<Array<Scalars["String"]>>;
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
  to: Scalars["String"];
  tokens: Scalars["String"];
}

export interface IOasisEscrowReclaimEvent {
   __typename?: "OasisEscrowReclaimEvent";
  type: IOasisTransactionType;
  from: Scalars["String"];
  shares: Scalars["String"];
}

export interface IOasisEscrowTakeEvent {
   __typename?: "OasisEscrowTakeEvent";
  type: IOasisTransactionType;
  from: Scalars["String"];
  to: Scalars["String"];
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
  id: Maybe<Scalars["String"]>;
  nodes: Array<Scalars["String"]>;
  allow_entity_signed_nodes: Scalars["Boolean"];
}

export interface IOasisRegisterNodeEvent {
   __typename?: "OasisRegisterNodeEvent";
  type: IOasisTransactionType;
  id: Maybe<Scalars["String"]>;
  entity_id: Maybe<Scalars["String"]>;
  expiration: Maybe<Scalars["Float"]>;
}

export interface IOasisRegisterRuntimeEvent {
   __typename?: "OasisRegisterRuntimeEvent";
  type: IOasisTransactionType;
  id: Maybe<Scalars["String"]>;
  version: Scalars["String"];
}

export interface IOasisTransaction {
   __typename?: "OasisTransaction";
  hash: Scalars["String"];
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
  id: Maybe<Scalars["String"]>;
}

export interface IOasisUnknownEvent {
   __typename?: "OasisUnknownEvent";
  type: IOasisTransactionType;
  method_name: Scalars["String"];
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
  cosmosAccountBalances: ICosmosAccountBalances;
  cosmosAccountHistory: ICosmosAccountHistory;
  cosmosTransaction: ICosmosTransaction;
  cosmosTransactions: ICosmosTransactionResult;
  cosmosRewardsByValidator: IAvailableReward[];
  cosmosAccountInformation: ICosmosAccountInformation;
  cosmosValidatorDistribution: ICosmosValidatorDistribution;
  cosmosValidators: ICosmosValidator[];
  cosmosValidatorSets: ICosmosValidatorSet;
  cosmosLatestBlock: ICosmosBlockData;
  cosmosStakingPool: ICosmosStakingPool;
  cosmosStakingParameters: ICosmosStakingParameters;
  cosmosGovernanceProposals: ICosmosGovernanceProposal[];
  cosmosGovernanceParametersDeposit: ICosmosGovernanceParametersDeposit;
  cosmosGovernanceParametersTallying: ICosmosGovernanceParametersTallying;
  cosmosGovernanceParametersVoting: ICosmosGovernanceParametersVoting;
  cosmosSlashingParameters: ICosmosSlashingParameters;
  cosmosDistributionCommunityPool: ICosmosBalance[];
  cosmosDistributionParameters: ICosmosDistributionParameters;
  /** Oasis APIs */
  oasisAccountBalances: IOasisAccountBalances;
  oasisAccountHistory: IOasisAccountHistory[];
  oasisTransactions: IOasisTransactionResult;
  oasisTransaction: IOasisTransaction;
  /** Celo APIs */
  celoAccountBalances: ICeloAccountBalances;
  celoAccountHistory: ICeloAccountSnapshot[];
  celoTransactions: ICeloTransactionResult;
  celoGovernanceTransactions: ICeloTransaction[];
  celoTransaction: ICeloTransaction;
  celoSystemBalances: ICeloSystemBalances;
  celoSystemHistory: ICeloSystemHistory[];
  celoValidatorGroups: ICeloValidatorGroup[];
  celoGovernanceProposals: ICeloGovernanceProposalHistory;
  /** Fiat price APIs */
  fiatCurrencies: IFiatCurrency[];
  fiatPriceHistory: IFiatPrice[];
  dailyPercentChange: Scalars["String"];
  prices: IPrice;
}

export interface IQueryCosmosAccountBalancesArgs {
  address: Scalars["String"];
}

export interface IQueryCosmosAccountHistoryArgs {
  address: Scalars["String"];
  fiat: Scalars["String"];
}

export interface IQueryCosmosTransactionArgs {
  hash: Scalars["String"];
  network: Scalars["String"];
}

export interface IQueryCosmosTransactionsArgs {
  address: Scalars["String"];
  startingPage: Maybe<Scalars["Float"]>;
  pageSize: Maybe<Scalars["Float"]>;
}

export interface IQueryCosmosRewardsByValidatorArgs {
  address: Scalars["String"];
}

export interface IQueryCosmosAccountInformationArgs {
  address: Scalars["String"];
}

export interface IQueryCosmosValidatorDistributionArgs {
  validatorAddress: Scalars["String"];
}

export interface IQueryCosmosValidatorsArgs {
  network: Scalars["String"];
}

export interface IQueryCosmosValidatorSetsArgs {
  network: Scalars["String"];
}

export interface IQueryCosmosLatestBlockArgs {
  network: Scalars["String"];
}

export interface IQueryCosmosStakingPoolArgs {
  network: Scalars["String"];
}

export interface IQueryCosmosStakingParametersArgs {
  network: Scalars["String"];
}

export interface IQueryCosmosGovernanceProposalsArgs {
  network: Scalars["String"];
}

export interface IQueryCosmosGovernanceParametersDepositArgs {
  network: Scalars["String"];
}

export interface IQueryCosmosGovernanceParametersTallyingArgs {
  network: Scalars["String"];
}

export interface IQueryCosmosGovernanceParametersVotingArgs {
  network: Scalars["String"];
}

export interface IQueryCosmosSlashingParametersArgs {
  network: Scalars["String"];
}

export interface IQueryCosmosDistributionCommunityPoolArgs {
  network: Scalars["String"];
}

export interface IQueryCosmosDistributionParametersArgs {
  network: Scalars["String"];
}

export interface IQueryOasisAccountBalancesArgs {
  address: Scalars["String"];
}

export interface IQueryOasisAccountHistoryArgs {
  address: Scalars["String"];
  fiat: Scalars["String"];
}

export interface IQueryOasisTransactionsArgs {
  address: Scalars["String"];
  startingPage: Maybe<Scalars["Float"]>;
  pageSize: Maybe<Scalars["Float"]>;
}

export interface IQueryOasisTransactionArgs {
  hash: Scalars["String"];
}

export interface IQueryCeloAccountBalancesArgs {
  address: Scalars["String"];
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

export interface IQueryCeloGovernanceTransactionsArgs {
  address: Scalars["String"];
}

export interface IQueryCeloTransactionArgs {
  hash: Scalars["String"];
}

export interface IQueryFiatPriceHistoryArgs {
  fiat: Scalars["String"];
  network: Scalars["String"];
}

export interface IQueryDailyPercentChangeArgs {
  currency: Scalars["String"];
  fiat: Scalars["String"];
}

export interface IQueryPricesArgs {
  currency: Scalars["String"];
  versus: Scalars["String"];
}

export interface IQueuedProposal {
   __typename?: "QueuedProposal";
  proposalID: Scalars["Float"];
  index: Scalars["Float"];
  currentBlockNumber: Scalars["Float"];
  stage: Scalars["String"];
  proposer: Scalars["String"];
  upvotes: Scalars["Float"];
  proposalEpoch: Scalars["Float"];
  referendumEpoch: Scalars["Float"];
  executionEpoch: Scalars["Float"];
  expirationEpoch: Scalars["Float"];
  queuedAtBlockNumber: Scalars["Float"];
  deposit: Scalars["Float"];
  queuedAtTimestamp: Scalars["Float"];
  gist: Scalars["String"];
  description: Scalars["String"];
}

export interface IReferendumProposal {
   __typename?: "ReferendumProposal";
  proposalID: Scalars["Float"];
  index: Scalars["Float"];
  currentBlockNumber: Scalars["Float"];
  stage: Scalars["String"];
  proposer: Scalars["String"];
  yesVotes: Scalars["Float"];
  noVotes: Scalars["Float"];
  abstainVotes: Scalars["Float"];
  proposalEpoch: Scalars["Float"];
  referendumEpoch: Scalars["Float"];
  executionEpoch: Scalars["Float"];
  expirationEpoch: Scalars["Float"];
  queuedAtBlockNumber: Scalars["Float"];
  deposit: Scalars["Float"];
  queuedAtTimestamp: Scalars["Float"];
  gist: Scalars["String"];
  description: Scalars["String"];
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

export interface ITx {
   __typename?: "Tx";
  type: Scalars["String"];
  value: ITxValue;
}

export interface ITxFee {
   __typename?: "TxFee";
  amount: Maybe<ICosmosBalance[]>;
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

export interface IValidatorSetItem {
   __typename?: "ValidatorSetItem";
  address: Scalars["String"];
  pub_key: Scalars["String"];
  voting_power: Scalars["String"];
  proposer_priority: Scalars["String"];
}

export interface ICeloAccountBalancesQueryVariables {
  address: Scalars["String"];
}

export type ICeloAccountBalancesQuery = (
  { __typename?: "Query" }
  & { celoAccountBalances: (
    { __typename?: "CeloAccountBalances" }
    & Pick<ICeloAccountBalances, "address" | "height" | "availableGoldBalance" | "totalLockedGoldBalance" | "nonVotingLockedGoldBalance" | "votingLockedGoldBalance" | "pendingWithdrawalBalance" | "celoUSDValue">
    & { delegations: Array<(
      { __typename?: "CeloDelegation" }
      & Pick<ICeloDelegation, "group" | "totalVotes" | "activeVotes" | "pendingVotes">
    )> }
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
    & Pick<ICeloAccountSnapshot, "snapshotDate" | "address" | "height" | "snapshotReward" | "availableGoldBalance" | "totalLockedGoldBalance" | "nonVotingLockedGoldBalance" | "votingLockedGoldBalance" | "pendingWithdrawalBalance" | "celoUSDValue">
    & { delegations: Array<(
      { __typename?: "CeloDelegation" }
      & Pick<ICeloDelegation, "group" | "totalVotes" | "activeVotes" | "pendingVotes">
    )> }
  )> }
);

export interface ICeloGovernanceProposalsQueryVariables {}

export type ICeloGovernanceProposalsQuery = (
  { __typename?: "Query" }
  & { celoGovernanceProposals: (
    { __typename?: "CeloGovernanceProposalHistory" }
    & { queuedProposals: Array<(
      { __typename?: "QueuedProposal" }
      & Pick<IQueuedProposal, "proposalID" | "index" | "currentBlockNumber" | "stage" | "proposer" | "upvotes" | "proposalEpoch" | "referendumEpoch" | "executionEpoch" | "expirationEpoch" | "queuedAtBlockNumber" | "deposit" | "queuedAtTimestamp" | "gist" | "description">
    )>, approvalProposals: Array<(
      { __typename?: "ApprovedProposal" }
      & Pick<IApprovedProposal, "proposalID" | "index" | "currentBlockNumber" | "stage" | "proposer" | "proposalEpoch" | "referendumEpoch" | "executionEpoch" | "expirationEpoch" | "queuedAtBlockNumber" | "deposit" | "queuedAtTimestamp" | "gist" | "description">
    )>, referendumProposals: Array<(
      { __typename?: "ReferendumProposal" }
      & Pick<IReferendumProposal, "proposalID" | "index" | "currentBlockNumber" | "stage" | "proposer" | "yesVotes" | "noVotes" | "abstainVotes" | "proposalEpoch" | "referendumEpoch" | "executionEpoch" | "expirationEpoch" | "queuedAtBlockNumber" | "deposit" | "queuedAtTimestamp" | "gist" | "description">
    )>, executionProposals: Array<(
      { __typename?: "ExecutionProposal" }
      & Pick<IExecutionProposal, "proposalID" | "index" | "currentBlockNumber" | "stage" | "proposer" | "yesVotes" | "noVotes" | "abstainVotes" | "proposalEpoch" | "referendumEpoch" | "executionEpoch" | "expirationEpoch" | "queuedAtBlockNumber" | "deposit" | "queuedAtTimestamp" | "gist" | "description">
    )>, expiredProposals: Array<(
      { __typename?: "ExpiredProposal" }
      & Pick<IExpiredProposal, "proposalID" | "currentBlockNumber" | "stage" | "proposer" | "executed" | "queuedAtBlockNumber" | "deposit" | "queuedAtTimestamp" | "gist" | "description">
    )> }
  ) }
);

export interface ICeloGovernanceTransactionsQueryVariables {
  address: Scalars["String"];
}

export type ICeloGovernanceTransactionsQuery = (
  { __typename?: "Query" }
  & { celoGovernanceTransactions: Array<(
    { __typename?: "CeloTransaction" }
    & Pick<ICeloTransaction, "blockNumber" | "timestamp" | "hash" | "from" | "to">
    & { details: (
      { __typename?: "CeloTransactionDetails" }
      & Pick<ICeloTransactionDetails, "nonce" | "gasLimit" | "gasPrice" | "gasUsed" | "feeCurrency" | "gatewayFeeRecipient" | "gatewayFee" | "to" | "value">
    ), tags: Array<(
      { __typename?: "CeloTransactionTags" }
      & Pick<ICeloTransactionTags, "eventname" | "source" | "parameters">
    )> }
  )> }
);

export interface ICeloSystemBalancesQueryVariables {}

export type ICeloSystemBalancesQuery = (
  { __typename?: "Query" }
  & { celoSystemBalances: (
    { __typename?: "CeloSystemBalances" }
    & Pick<ICeloSystemBalances, "height" | "goldTokenSupply" | "totalLockedGoldBalance" | "nonVotingLockedGoldBalance" | "totalCeloUSDValue">
  ) }
);

export interface ICeloSystemHistoryQueryVariables {}

export type ICeloSystemHistoryQuery = (
  { __typename?: "Query" }
  & { celoSystemHistory: Array<(
    { __typename?: "CeloSystemHistory" }
    & Pick<ICeloSystemHistory, "BlockNumber" | "SnapshotDate" | "GoldTokenSupply" | "TotalLockedGoldBalance" | "NonVotingLockedGoldBalance" | "TotalCeloUSDValue">
  )> }
);

export interface ICeloTransactionQueryVariables {
  hash: Scalars["String"];
}

export type ICeloTransactionQuery = (
  { __typename?: "Query" }
  & { celoTransaction: (
    { __typename?: "CeloTransaction" }
    & Pick<ICeloTransaction, "blockNumber" | "timestamp" | "hash" | "from" | "to">
    & { details: (
      { __typename?: "CeloTransactionDetails" }
      & Pick<ICeloTransactionDetails, "nonce" | "gasLimit" | "gasPrice" | "gasUsed" | "feeCurrency" | "gatewayFeeRecipient" | "gatewayFee" | "to" | "value">
    ), tags: Array<(
      { __typename?: "CeloTransactionTags" }
      & Pick<ICeloTransactionTags, "eventname" | "source" | "parameters">
    )> }
  ) }
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
      & Pick<ICeloTransaction, "blockNumber" | "timestamp" | "hash" | "from" | "to">
      & { details: (
        { __typename?: "CeloTransactionDetails" }
        & Pick<ICeloTransactionDetails, "nonce" | "gasLimit" | "gasPrice" | "gasUsed" | "feeCurrency" | "gatewayFeeRecipient" | "gatewayFee" | "to" | "value">
      ), tags: Array<(
        { __typename?: "CeloTransactionTags" }
        & Pick<ICeloTransactionTags, "eventname" | "source" | "parameters">
      )> }
    )> }
  ) }
);

export interface ICeloValidatorGroupsQueryVariables {}

export type ICeloValidatorGroupsQuery = (
  { __typename?: "Query" }
  & { celoValidatorGroups: Array<(
    { __typename?: "CeloValidatorGroup" }
    & Pick<ICeloValidatorGroup, "group" | "name" | "metadataURL" | "blockNumber" | "votingPower" | "votingPowerFraction" | "capacityAvailable" | "totalCapacity" | "multiplier" | "groupShare" | "groupScore">
    & { validatorDetails: Array<(
      { __typename?: "CeloValidatorDetail" }
      & Pick<ICeloValidatorDetail, "validatorAddress" | "validator_score">
    )> }
  )> }
);

export interface ICosmosAccountBalancesQueryVariables {
  address: Scalars["String"];
}

export type ICosmosAccountBalancesQuery = (
  { __typename?: "Query" }
  & { cosmosAccountBalances: (
    { __typename?: "CosmosAccountBalances" }
    & { balance: Maybe<Array<(
      { __typename?: "CosmosBalance" }
      & Pick<ICosmosBalance, "denom" | "amount">
    )>>, rewards: Maybe<Array<(
      { __typename?: "CosmosBalance" }
      & Pick<ICosmosBalance, "denom" | "amount">
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
      { __typename?: "CosmosBalance" }
      & Pick<ICosmosBalance, "denom" | "amount">
    )>> }
  ) }
);

export interface ICosmosAccountHistoryQueryVariables {
  address: Scalars["String"];
  fiat: Scalars["String"];
}

export type ICosmosAccountHistoryQuery = (
  { __typename?: "Query" }
  & { cosmosAccountHistory: (
    { __typename?: "CosmosAccountHistory" }
    & { balanceHistory: Array<(
      { __typename?: "CosmosBalanceHistory" }
      & Pick<ICosmosBalanceHistory, "address" | "denom" | "balance" | "height" | "timestamp" | "chain">
    )>, delegations: Array<(
      { __typename?: "CosmosDelegationHistory" }
      & Pick<ICosmosDelegationHistory, "balance" | "address" | "timestamp">
    )>, unbondings: Array<(
      { __typename?: "CosmosDelegationHistory" }
      & Pick<ICosmosDelegationHistory, "balance" | "address" | "timestamp">
    )>, delegatorRewards: Array<(
      { __typename?: "CosmosRewardHistory" }
      & Pick<ICosmosRewardHistory, "balance" | "height" | "address" | "timestamp">
    )>, validatorCommissions: Array<(
      { __typename?: "CosmosCommissionHistory" }
      & Pick<ICosmosCommissionHistory, "balance" | "height" | "validator" | "timestamp">
    )>, fiatPriceHistory: Array<(
      { __typename?: "FiatPrice" }
      & Pick<IFiatPrice, "price" | "timestamp">
    )> }
  ) }
);

export interface ICosmosAccountInformationQueryVariables {
  address: Scalars["String"];
}

export type ICosmosAccountInformationQuery = (
  { __typename?: "Query" }
  & { cosmosAccountInformation: (
    { __typename?: "CosmosAccountInformation" }
    & Pick<ICosmosAccountInformation, "type">
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

export interface ICosmosDistributionCommunityPoolQueryVariables {
  network: Scalars["String"];
}

export type ICosmosDistributionCommunityPoolQuery = (
  { __typename?: "Query" }
  & { cosmosDistributionCommunityPool: Array<(
    { __typename?: "CosmosBalance" }
    & Pick<ICosmosBalance, "denom" | "amount">
  )> }
);

export interface ICosmosDistributionParametersQueryVariables {
  network: Scalars["String"];
}

export type ICosmosDistributionParametersQuery = (
  { __typename?: "Query" }
  & { cosmosDistributionParameters: (
    { __typename?: "CosmosDistributionParameters" }
    & Pick<ICosmosDistributionParameters, "base_proposer_reward" | "bonus_proposer_reward" | "community_tax">
  ) }
);

export interface ICosmosGovernanceParametersDepositQueryVariables {
  network: Scalars["String"];
}

export type ICosmosGovernanceParametersDepositQuery = (
  { __typename?: "Query" }
  & { cosmosGovernanceParametersDeposit: (
    { __typename?: "CosmosGovernanceParametersDeposit" }
    & Pick<ICosmosGovernanceParametersDeposit, "max_deposit_period">
    & { min_deposit: Maybe<Array<(
      { __typename?: "CosmosBalance" }
      & Pick<ICosmosBalance, "denom" | "amount">
    )>> }
  ) }
);

export interface ICosmosGovernanceParametersTallyingQueryVariables {
  network: Scalars["String"];
}

export type ICosmosGovernanceParametersTallyingQuery = (
  { __typename?: "Query" }
  & { cosmosGovernanceParametersTallying: (
    { __typename?: "CosmosGovernanceParametersTallying" }
    & Pick<ICosmosGovernanceParametersTallying, "threshold" | "veto" | "governance_penalty">
  ) }
);

export interface ICosmosGovernanceParametersVotingQueryVariables {
  network: Scalars["String"];
}

export type ICosmosGovernanceParametersVotingQuery = (
  { __typename?: "Query" }
  & { cosmosGovernanceParametersVoting: (
    { __typename?: "CosmosGovernanceParametersVoting" }
    & Pick<ICosmosGovernanceParametersVoting, "voting_period">
  ) }
);

export interface ICosmosGovernanceProposalsQueryVariables {
  network: Scalars["String"];
}

export type ICosmosGovernanceProposalsQuery = (
  { __typename?: "Query" }
  & { cosmosGovernanceProposals: Array<(
    { __typename?: "CosmosGovernanceProposal" }
    & Pick<ICosmosGovernanceProposal, "proposal_id" | "title" | "description" | "proposal_type" | "proposal_status" | "submit_time" | "voting_start_time">
    & { final_tally_result: (
      { __typename?: "TallyResult" }
      & Pick<ITallyResult, "yes" | "abstain" | "no" | "no_with_veto">
    ), total_deposit: Maybe<Array<(
      { __typename?: "CosmosBalance" }
      & Pick<ICosmosBalance, "denom" | "amount">
    )>> }
  )> }
);

export interface ICosmosLatestBlockQueryVariables {
  network: Scalars["String"];
}

export type ICosmosLatestBlockQuery = (
  { __typename?: "Query" }
  & { cosmosLatestBlock: (
    { __typename?: "CosmosBlockData" }
    & { block: (
      { __typename?: "Block" }
      & { header: (
        { __typename?: "BlockHeader" }
        & Pick<IBlockHeader, "chain_id" | "height" | "time" | "num_txs" | "total_txs" | "last_commit_hash" | "data_hash" | "validators_hash" | "next_validators_hash" | "consensus_hash" | "app_hash" | "last_results_hash" | "evidence_hash" | "proposer_address">
      ) }
    ) }
  ) }
);

export interface ICosmosRewardsByValidatorQueryVariables {
  address: Scalars["String"];
}

export type ICosmosRewardsByValidatorQuery = (
  { __typename?: "Query" }
  & { cosmosRewardsByValidator: Array<(
    { __typename?: "AvailableReward" }
    & Pick<IAvailableReward, "validator_address">
    & { reward: Maybe<Array<(
      { __typename?: "CosmosBalance" }
      & Pick<ICosmosBalance, "denom" | "amount">
    )>> }
  )> }
);

export interface ICosmosSlashingParametersQueryVariables {
  network: Scalars["String"];
}

export type ICosmosSlashingParametersQuery = (
  { __typename?: "Query" }
  & { cosmosSlashingParameters: (
    { __typename?: "CosmosSlashingParameters" }
    & Pick<ICosmosSlashingParameters, "max_evidence_age" | "signed_blocks_window" | "min_signed_per_window" | "double_sign_unbond_duration" | "downtime_unbond_duration" | "slash_fraction_double_sign" | "slash_fraction_downtime">
  ) }
);

export interface ICosmosStakingParametersQueryVariables {
  network: Scalars["String"];
}

export type ICosmosStakingParametersQuery = (
  { __typename?: "Query" }
  & { cosmosStakingParameters: (
    { __typename?: "CosmosStakingParameters" }
    & Pick<ICosmosStakingParameters, "inflation_rate_change" | "inflation_max" | "inflation_min" | "goal_bonded" | "unbonding_time" | "max_validators" | "max_entries" | "bond_denom">
  ) }
);

export interface ICosmosStakingPoolQueryVariables {
  network: Scalars["String"];
}

export type ICosmosStakingPoolQuery = (
  { __typename?: "Query" }
  & { cosmosStakingPool: (
    { __typename?: "CosmosStakingPool" }
    & Pick<ICosmosStakingPool, "loose_tokens" | "bonded_tokens" | "not_bonded_tokens" | "inflation_last_time" | "inflation" | "date_last_commission_reset" | "prev_bonded_shares">
  ) }
);

export interface ICosmosTransactionQueryVariables {
  hash: Scalars["String"];
  network: Scalars["String"];
}

export type ICosmosTransactionQuery = (
  { __typename?: "Query" }
  & { cosmosTransaction: (
    { __typename?: "CosmosTransaction" }
    & Pick<ICosmosTransaction, "hash" | "height" | "gaswanted" | "gasused" | "memo" | "timestamp" | "chain">
    & { log: Array<Maybe<(
      { __typename?: "LogMessage" }
      & Pick<ILogMessage, "code" | "message" | "success" | "log" | "msg_index">
    )>>, fees: (
      { __typename?: "TxFee" }
      & Pick<ITxFee, "gas">
      & { amount: Maybe<Array<(
        { __typename?: "CosmosBalance" }
        & Pick<ICosmosBalance, "denom" | "amount">
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
          { __typename?: "CosmosBalance" }
          & Pick<ICosmosBalance, "denom" | "amount">
        )>> }
      ) | (
        { __typename?: "MsgVote" }
        & Pick<IMsgVote, "proposal_id" | "voter" | "option">
      ) | (
        { __typename?: "MsgDelegate" }
        & Pick<IMsgDelegate, "delegator_address" | "validator_address">
        & { amount: (
          { __typename?: "CosmosBalance" }
          & Pick<ICosmosBalance, "denom" | "amount">
        ) }
      ) | (
        { __typename?: "MsgSubmitProposal" }
        & Pick<IMsgSubmitProposal, "title" | "description" | "proposal_type" | "proposer">
        & { initial_deposit: Maybe<Array<(
          { __typename?: "CosmosBalance" }
          & Pick<ICosmosBalance, "denom" | "amount">
        )>> }
      ) | (
        { __typename?: "MsgBeginRedelegate" }
        & Pick<IMsgBeginRedelegate, "delegator_address" | "validator_src_address" | "validator_dst_address">
        & { amount: (
          { __typename?: "CosmosBalance" }
          & Pick<ICosmosBalance, "denom" | "amount">
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
  ) }
);

export interface ICosmosTransactionsQueryVariables {
  address: Scalars["String"];
  startingPage: Maybe<Scalars["Float"]>;
  pageSize: Maybe<Scalars["Float"]>;
}

export type ICosmosTransactionsQuery = (
  { __typename?: "Query" }
  & { cosmosTransactions: (
    { __typename?: "CosmosTransactionResult" }
    & Pick<ICosmosTransactionResult, "page" | "limit" | "moreResultsExist">
    & { data: Array<(
      { __typename?: "CosmosTransaction" }
      & Pick<ICosmosTransaction, "hash" | "height" | "gaswanted" | "gasused" | "memo" | "timestamp" | "chain">
      & { log: Array<Maybe<(
        { __typename?: "LogMessage" }
        & Pick<ILogMessage, "code" | "message" | "success" | "log" | "msg_index">
      )>>, fees: (
        { __typename?: "TxFee" }
        & Pick<ITxFee, "gas">
        & { amount: Maybe<Array<(
          { __typename?: "CosmosBalance" }
          & Pick<ICosmosBalance, "denom" | "amount">
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
            { __typename?: "CosmosBalance" }
            & Pick<ICosmosBalance, "denom" | "amount">
          )>> }
        ) | (
          { __typename?: "MsgVote" }
          & Pick<IMsgVote, "proposal_id" | "voter" | "option">
        ) | (
          { __typename?: "MsgDelegate" }
          & Pick<IMsgDelegate, "delegator_address" | "validator_address">
          & { amount: (
            { __typename?: "CosmosBalance" }
            & Pick<ICosmosBalance, "denom" | "amount">
          ) }
        ) | (
          { __typename?: "MsgSubmitProposal" }
          & Pick<IMsgSubmitProposal, "title" | "description" | "proposal_type" | "proposer">
          & { initial_deposit: Maybe<Array<(
            { __typename?: "CosmosBalance" }
            & Pick<ICosmosBalance, "denom" | "amount">
          )>> }
        ) | (
          { __typename?: "MsgBeginRedelegate" }
          & Pick<IMsgBeginRedelegate, "delegator_address" | "validator_src_address" | "validator_dst_address">
          & { amount: (
            { __typename?: "CosmosBalance" }
            & Pick<ICosmosBalance, "denom" | "amount">
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

export interface ICosmosValidatorDistributionQueryVariables {
  validatorAddress: Scalars["String"];
}

export type ICosmosValidatorDistributionQuery = (
  { __typename?: "Query" }
  & { cosmosValidatorDistribution: (
    { __typename?: "CosmosValidatorDistribution" }
    & Pick<ICosmosValidatorDistribution, "operator_address">
    & { self_bond_rewards: Maybe<Array<(
      { __typename?: "CosmosBalance" }
      & Pick<ICosmosBalance, "denom" | "amount">
    )>>, val_commission: Maybe<Array<(
      { __typename?: "CosmosBalance" }
      & Pick<ICosmosBalance, "denom" | "amount">
    )>> }
  ) }
);

export interface ICosmosValidatorSetsQueryVariables {
  network: Scalars["String"];
}

export type ICosmosValidatorSetsQuery = (
  { __typename?: "Query" }
  & { cosmosValidatorSets: (
    { __typename?: "CosmosValidatorSet" }
    & Pick<ICosmosValidatorSet, "block_height">
    & { validators: Maybe<Array<(
      { __typename?: "ValidatorSetItem" }
      & Pick<IValidatorSetItem, "address" | "pub_key" | "voting_power" | "proposer_priority">
    )>> }
  ) }
);

export interface ICosmosValidatorsQueryVariables {
  network: Scalars["String"];
}

export type ICosmosValidatorsQuery = (
  { __typename?: "Query" }
  & { cosmosValidators: Array<(
    { __typename?: "CosmosValidator" }
    & Pick<ICosmosValidator, "operator_address" | "consensus_pubkey" | "jailed" | "status" | "tokens" | "delegator_shares" | "unbonding_height" | "unbonding_time" | "min_self_delegation">
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

export interface IDailyPercentChangeQueryVariables {
  currency: Scalars["String"];
  fiat: Scalars["String"];
}

export type IDailyPercentChangeQuery = (
  { __typename?: "Query" }
  & Pick<IQuery, "dailyPercentChange">
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

export interface IOasisAccountBalancesQueryVariables {
  address: Scalars["String"];
}

export type IOasisAccountBalancesQuery = (
  { __typename?: "Query" }
  & { oasisAccountBalances: (
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
);

export interface IOasisAccountHistoryQueryVariables {
  address: Scalars["String"];
  fiat: Scalars["String"];
}

export type IOasisAccountHistoryQuery = (
  { __typename?: "Query" }
  & { oasisAccountHistory: Array<(
    { __typename?: "OasisAccountHistory" }
    & Pick<IOasisAccountHistory, "date" | "height" | "address" | "rewards" | "balance">
    & { meta: (
      { __typename?: "OasisAccountMeta" }
      & Pick<IOasisAccountMeta, "is_validator" | "is_delegator">
    ), delegations: Maybe<Array<(
      { __typename?: "OasisDelegation" }
      & Pick<IOasisDelegation, "delegator" | "validator" | "amount">
    )>>, debonding_balance: (
      { __typename?: "OasisBalance" }
      & Pick<IOasisBalance, "balance" | "shares">
    ), staked_balance: (
      { __typename?: "OasisBalance" }
      & Pick<IOasisBalance, "balance" | "shares">
    ) }
  )> }
);

export interface IOasisTransactionQueryVariables {
  hash: Scalars["String"];
}

export type IOasisTransactionQuery = (
  { __typename?: "Query" }
  & { oasisTransaction: (
    { __typename?: "OasisTransaction" }
    & Pick<IOasisTransaction, "hash" | "fee" | "gas" | "gas_price" | "height" | "method" | "date" | "sender">
    & { data: (
      { __typename?: "OasisBurnEvent" }
      & Pick<IOasisBurnEvent, "type" | "owner" | "tokens">
    ) | (
      { __typename?: "OasisTransferEvent" }
      & Pick<IOasisTransferEvent, "type" | "from" | "to" | "tokens">
    ) | (
      { __typename?: "OasisEscrowAddEvent" }
      & Pick<IOasisEscrowAddEvent, "type" | "to" | "tokens">
    ) | (
      { __typename?: "OasisEscrowTakeEvent" }
      & Pick<IOasisEscrowTakeEvent, "type" | "from" | "to" | "tokens">
    ) | (
      { __typename?: "OasisEscrowReclaimEvent" }
      & Pick<IOasisEscrowReclaimEvent, "type" | "from" | "shares">
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
      & Pick<IOasisTransaction, "hash" | "fee" | "gas" | "gas_price" | "height" | "method" | "date" | "sender">
      & { data: (
        { __typename?: "OasisBurnEvent" }
        & Pick<IOasisBurnEvent, "type" | "owner" | "tokens">
      ) | (
        { __typename?: "OasisTransferEvent" }
        & Pick<IOasisTransferEvent, "type" | "from" | "to" | "tokens">
      ) | (
        { __typename?: "OasisEscrowAddEvent" }
        & Pick<IOasisEscrowAddEvent, "type" | "to" | "tokens">
      ) | (
        { __typename?: "OasisEscrowTakeEvent" }
        & Pick<IOasisEscrowTakeEvent, "type" | "from" | "to" | "tokens">
      ) | (
        { __typename?: "OasisEscrowReclaimEvent" }
        & Pick<IOasisEscrowReclaimEvent, "type" | "from" | "shares">
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

export const CeloAccountBalancesDocument = gql`
    query celoAccountBalances($address: String!) {
  celoAccountBalances(address: $address) {
    address
    height
    availableGoldBalance
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
export type CeloAccountBalancesComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICeloAccountBalancesQuery, ICeloAccountBalancesQueryVariables>, "query"> & ({ variables: ICeloAccountBalancesQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CeloAccountBalancesComponent = (props: CeloAccountBalancesComponentProps) => (
      <ApolloReactComponents.Query<ICeloAccountBalancesQuery, ICeloAccountBalancesQueryVariables> query={CeloAccountBalancesDocument} {...props} />
    );

export type ICeloAccountBalancesProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICeloAccountBalancesQuery, ICeloAccountBalancesQueryVariables> & TChildProps;
export function withCeloAccountBalances<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICeloAccountBalancesQuery,
  ICeloAccountBalancesQueryVariables,
  ICeloAccountBalancesProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICeloAccountBalancesQuery, ICeloAccountBalancesQueryVariables, ICeloAccountBalancesProps<TChildProps>>(CeloAccountBalancesDocument, {
      alias: "celoAccountBalances",
      ...operationOptions,
    });
}

/**
 * __useCeloAccountBalancesQuery__
 *
 * To run a query within a React component, call `useCeloAccountBalancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCeloAccountBalancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCeloAccountBalancesQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useCeloAccountBalancesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICeloAccountBalancesQuery, ICeloAccountBalancesQueryVariables>) {
        return ApolloReactHooks.useQuery<ICeloAccountBalancesQuery, ICeloAccountBalancesQueryVariables>(CeloAccountBalancesDocument, baseOptions);
      }
export function useCeloAccountBalancesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICeloAccountBalancesQuery, ICeloAccountBalancesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICeloAccountBalancesQuery, ICeloAccountBalancesQueryVariables>(CeloAccountBalancesDocument, baseOptions);
        }
export type CeloAccountBalancesQueryHookResult = ReturnType<typeof useCeloAccountBalancesQuery>;
export type CeloAccountBalancesLazyQueryHookResult = ReturnType<typeof useCeloAccountBalancesLazyQuery>;
export type CeloAccountBalancesQueryResult = ApolloReactCommon.QueryResult<ICeloAccountBalancesQuery, ICeloAccountBalancesQueryVariables>;
export const CeloAccountHistoryDocument = gql`
    query celoAccountHistory($address: String!, $fiat: String!) {
  celoAccountHistory(address: $address, fiat: $fiat) {
    snapshotDate
    address
    height
    snapshotReward
    availableGoldBalance
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
export const CeloGovernanceProposalsDocument = gql`
    query celoGovernanceProposals {
  celoGovernanceProposals {
    queuedProposals {
      proposalID
      index
      currentBlockNumber
      stage
      proposer
      upvotes
      proposalEpoch
      referendumEpoch
      executionEpoch
      expirationEpoch
      queuedAtBlockNumber
      deposit
      queuedAtTimestamp
      gist
      description
    }
    approvalProposals {
      proposalID
      index
      currentBlockNumber
      stage
      proposer
      proposalEpoch
      referendumEpoch
      executionEpoch
      expirationEpoch
      queuedAtBlockNumber
      deposit
      queuedAtTimestamp
      gist
      description
    }
    referendumProposals {
      proposalID
      index
      currentBlockNumber
      stage
      proposer
      yesVotes
      noVotes
      abstainVotes
      proposalEpoch
      referendumEpoch
      executionEpoch
      expirationEpoch
      queuedAtBlockNumber
      deposit
      queuedAtTimestamp
      gist
      description
    }
    executionProposals {
      proposalID
      index
      currentBlockNumber
      stage
      proposer
      yesVotes
      noVotes
      abstainVotes
      proposalEpoch
      referendumEpoch
      executionEpoch
      expirationEpoch
      queuedAtBlockNumber
      deposit
      queuedAtTimestamp
      gist
      description
    }
    expiredProposals {
      proposalID
      currentBlockNumber
      stage
      proposer
      executed
      queuedAtBlockNumber
      deposit
      queuedAtTimestamp
      gist
      description
    }
  }
}
    `;
export type CeloGovernanceProposalsComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICeloGovernanceProposalsQuery, ICeloGovernanceProposalsQueryVariables>, "query">;

export const CeloGovernanceProposalsComponent = (props: CeloGovernanceProposalsComponentProps) => (
      <ApolloReactComponents.Query<ICeloGovernanceProposalsQuery, ICeloGovernanceProposalsQueryVariables> query={CeloGovernanceProposalsDocument} {...props} />
    );

export type ICeloGovernanceProposalsProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICeloGovernanceProposalsQuery, ICeloGovernanceProposalsQueryVariables> & TChildProps;
export function withCeloGovernanceProposals<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICeloGovernanceProposalsQuery,
  ICeloGovernanceProposalsQueryVariables,
  ICeloGovernanceProposalsProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICeloGovernanceProposalsQuery, ICeloGovernanceProposalsQueryVariables, ICeloGovernanceProposalsProps<TChildProps>>(CeloGovernanceProposalsDocument, {
      alias: "celoGovernanceProposals",
      ...operationOptions,
    });
}

/**
 * __useCeloGovernanceProposalsQuery__
 *
 * To run a query within a React component, call `useCeloGovernanceProposalsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCeloGovernanceProposalsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCeloGovernanceProposalsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCeloGovernanceProposalsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICeloGovernanceProposalsQuery, ICeloGovernanceProposalsQueryVariables>) {
        return ApolloReactHooks.useQuery<ICeloGovernanceProposalsQuery, ICeloGovernanceProposalsQueryVariables>(CeloGovernanceProposalsDocument, baseOptions);
      }
export function useCeloGovernanceProposalsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICeloGovernanceProposalsQuery, ICeloGovernanceProposalsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICeloGovernanceProposalsQuery, ICeloGovernanceProposalsQueryVariables>(CeloGovernanceProposalsDocument, baseOptions);
        }
export type CeloGovernanceProposalsQueryHookResult = ReturnType<typeof useCeloGovernanceProposalsQuery>;
export type CeloGovernanceProposalsLazyQueryHookResult = ReturnType<typeof useCeloGovernanceProposalsLazyQuery>;
export type CeloGovernanceProposalsQueryResult = ApolloReactCommon.QueryResult<ICeloGovernanceProposalsQuery, ICeloGovernanceProposalsQueryVariables>;
export const CeloGovernanceTransactionsDocument = gql`
    query celoGovernanceTransactions($address: String!) {
  celoGovernanceTransactions(address: $address) {
    blockNumber
    timestamp
    hash
    from
    to
    details {
      nonce
      gasLimit
      gasPrice
      gasUsed
      feeCurrency
      gatewayFeeRecipient
      gatewayFee
      to
      value
    }
    tags {
      eventname
      source
      parameters
    }
  }
}
    `;
export type CeloGovernanceTransactionsComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICeloGovernanceTransactionsQuery, ICeloGovernanceTransactionsQueryVariables>, "query"> & ({ variables: ICeloGovernanceTransactionsQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CeloGovernanceTransactionsComponent = (props: CeloGovernanceTransactionsComponentProps) => (
      <ApolloReactComponents.Query<ICeloGovernanceTransactionsQuery, ICeloGovernanceTransactionsQueryVariables> query={CeloGovernanceTransactionsDocument} {...props} />
    );

export type ICeloGovernanceTransactionsProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICeloGovernanceTransactionsQuery, ICeloGovernanceTransactionsQueryVariables> & TChildProps;
export function withCeloGovernanceTransactions<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICeloGovernanceTransactionsQuery,
  ICeloGovernanceTransactionsQueryVariables,
  ICeloGovernanceTransactionsProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICeloGovernanceTransactionsQuery, ICeloGovernanceTransactionsQueryVariables, ICeloGovernanceTransactionsProps<TChildProps>>(CeloGovernanceTransactionsDocument, {
      alias: "celoGovernanceTransactions",
      ...operationOptions,
    });
}

/**
 * __useCeloGovernanceTransactionsQuery__
 *
 * To run a query within a React component, call `useCeloGovernanceTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCeloGovernanceTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCeloGovernanceTransactionsQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useCeloGovernanceTransactionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICeloGovernanceTransactionsQuery, ICeloGovernanceTransactionsQueryVariables>) {
        return ApolloReactHooks.useQuery<ICeloGovernanceTransactionsQuery, ICeloGovernanceTransactionsQueryVariables>(CeloGovernanceTransactionsDocument, baseOptions);
      }
export function useCeloGovernanceTransactionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICeloGovernanceTransactionsQuery, ICeloGovernanceTransactionsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICeloGovernanceTransactionsQuery, ICeloGovernanceTransactionsQueryVariables>(CeloGovernanceTransactionsDocument, baseOptions);
        }
export type CeloGovernanceTransactionsQueryHookResult = ReturnType<typeof useCeloGovernanceTransactionsQuery>;
export type CeloGovernanceTransactionsLazyQueryHookResult = ReturnType<typeof useCeloGovernanceTransactionsLazyQuery>;
export type CeloGovernanceTransactionsQueryResult = ApolloReactCommon.QueryResult<ICeloGovernanceTransactionsQuery, ICeloGovernanceTransactionsQueryVariables>;
export const CeloSystemBalancesDocument = gql`
    query celoSystemBalances {
  celoSystemBalances {
    height
    goldTokenSupply
    totalLockedGoldBalance
    nonVotingLockedGoldBalance
    totalCeloUSDValue
  }
}
    `;
export type CeloSystemBalancesComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICeloSystemBalancesQuery, ICeloSystemBalancesQueryVariables>, "query">;

export const CeloSystemBalancesComponent = (props: CeloSystemBalancesComponentProps) => (
      <ApolloReactComponents.Query<ICeloSystemBalancesQuery, ICeloSystemBalancesQueryVariables> query={CeloSystemBalancesDocument} {...props} />
    );

export type ICeloSystemBalancesProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICeloSystemBalancesQuery, ICeloSystemBalancesQueryVariables> & TChildProps;
export function withCeloSystemBalances<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICeloSystemBalancesQuery,
  ICeloSystemBalancesQueryVariables,
  ICeloSystemBalancesProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICeloSystemBalancesQuery, ICeloSystemBalancesQueryVariables, ICeloSystemBalancesProps<TChildProps>>(CeloSystemBalancesDocument, {
      alias: "celoSystemBalances",
      ...operationOptions,
    });
}

/**
 * __useCeloSystemBalancesQuery__
 *
 * To run a query within a React component, call `useCeloSystemBalancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCeloSystemBalancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCeloSystemBalancesQuery({
 *   variables: {
 *   },
 * });
 */
export function useCeloSystemBalancesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICeloSystemBalancesQuery, ICeloSystemBalancesQueryVariables>) {
        return ApolloReactHooks.useQuery<ICeloSystemBalancesQuery, ICeloSystemBalancesQueryVariables>(CeloSystemBalancesDocument, baseOptions);
      }
export function useCeloSystemBalancesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICeloSystemBalancesQuery, ICeloSystemBalancesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICeloSystemBalancesQuery, ICeloSystemBalancesQueryVariables>(CeloSystemBalancesDocument, baseOptions);
        }
export type CeloSystemBalancesQueryHookResult = ReturnType<typeof useCeloSystemBalancesQuery>;
export type CeloSystemBalancesLazyQueryHookResult = ReturnType<typeof useCeloSystemBalancesLazyQuery>;
export type CeloSystemBalancesQueryResult = ApolloReactCommon.QueryResult<ICeloSystemBalancesQuery, ICeloSystemBalancesQueryVariables>;
export const CeloSystemHistoryDocument = gql`
    query celoSystemHistory {
  celoSystemHistory {
    BlockNumber
    SnapshotDate
    GoldTokenSupply
    TotalLockedGoldBalance
    NonVotingLockedGoldBalance
    TotalCeloUSDValue
  }
}
    `;
export type CeloSystemHistoryComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICeloSystemHistoryQuery, ICeloSystemHistoryQueryVariables>, "query">;

export const CeloSystemHistoryComponent = (props: CeloSystemHistoryComponentProps) => (
      <ApolloReactComponents.Query<ICeloSystemHistoryQuery, ICeloSystemHistoryQueryVariables> query={CeloSystemHistoryDocument} {...props} />
    );

export type ICeloSystemHistoryProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICeloSystemHistoryQuery, ICeloSystemHistoryQueryVariables> & TChildProps;
export function withCeloSystemHistory<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICeloSystemHistoryQuery,
  ICeloSystemHistoryQueryVariables,
  ICeloSystemHistoryProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICeloSystemHistoryQuery, ICeloSystemHistoryQueryVariables, ICeloSystemHistoryProps<TChildProps>>(CeloSystemHistoryDocument, {
      alias: "celoSystemHistory",
      ...operationOptions,
    });
}

/**
 * __useCeloSystemHistoryQuery__
 *
 * To run a query within a React component, call `useCeloSystemHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCeloSystemHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCeloSystemHistoryQuery({
 *   variables: {
 *   },
 * });
 */
export function useCeloSystemHistoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICeloSystemHistoryQuery, ICeloSystemHistoryQueryVariables>) {
        return ApolloReactHooks.useQuery<ICeloSystemHistoryQuery, ICeloSystemHistoryQueryVariables>(CeloSystemHistoryDocument, baseOptions);
      }
export function useCeloSystemHistoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICeloSystemHistoryQuery, ICeloSystemHistoryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICeloSystemHistoryQuery, ICeloSystemHistoryQueryVariables>(CeloSystemHistoryDocument, baseOptions);
        }
export type CeloSystemHistoryQueryHookResult = ReturnType<typeof useCeloSystemHistoryQuery>;
export type CeloSystemHistoryLazyQueryHookResult = ReturnType<typeof useCeloSystemHistoryLazyQuery>;
export type CeloSystemHistoryQueryResult = ApolloReactCommon.QueryResult<ICeloSystemHistoryQuery, ICeloSystemHistoryQueryVariables>;
export const CeloTransactionDocument = gql`
    query celoTransaction($hash: String!) {
  celoTransaction(hash: $hash) {
    blockNumber
    timestamp
    hash
    from
    to
    details {
      nonce
      gasLimit
      gasPrice
      gasUsed
      feeCurrency
      gatewayFeeRecipient
      gatewayFee
      to
      value
    }
    tags {
      eventname
      source
      parameters
    }
  }
}
    `;
export type CeloTransactionComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICeloTransactionQuery, ICeloTransactionQueryVariables>, "query"> & ({ variables: ICeloTransactionQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CeloTransactionComponent = (props: CeloTransactionComponentProps) => (
      <ApolloReactComponents.Query<ICeloTransactionQuery, ICeloTransactionQueryVariables> query={CeloTransactionDocument} {...props} />
    );

export type ICeloTransactionProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICeloTransactionQuery, ICeloTransactionQueryVariables> & TChildProps;
export function withCeloTransaction<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICeloTransactionQuery,
  ICeloTransactionQueryVariables,
  ICeloTransactionProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICeloTransactionQuery, ICeloTransactionQueryVariables, ICeloTransactionProps<TChildProps>>(CeloTransactionDocument, {
      alias: "celoTransaction",
      ...operationOptions,
    });
}

/**
 * __useCeloTransactionQuery__
 *
 * To run a query within a React component, call `useCeloTransactionQuery` and pass it any options that fit your needs.
 * When your component renders, `useCeloTransactionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCeloTransactionQuery({
 *   variables: {
 *      hash: // value for 'hash'
 *   },
 * });
 */
export function useCeloTransactionQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICeloTransactionQuery, ICeloTransactionQueryVariables>) {
        return ApolloReactHooks.useQuery<ICeloTransactionQuery, ICeloTransactionQueryVariables>(CeloTransactionDocument, baseOptions);
      }
export function useCeloTransactionLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICeloTransactionQuery, ICeloTransactionQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICeloTransactionQuery, ICeloTransactionQueryVariables>(CeloTransactionDocument, baseOptions);
        }
export type CeloTransactionQueryHookResult = ReturnType<typeof useCeloTransactionQuery>;
export type CeloTransactionLazyQueryHookResult = ReturnType<typeof useCeloTransactionLazyQuery>;
export type CeloTransactionQueryResult = ApolloReactCommon.QueryResult<ICeloTransactionQuery, ICeloTransactionQueryVariables>;
export const CeloTransactionsDocument = gql`
    query celoTransactions($address: String!, $startingPage: Float, $pageSize: Float) {
  celoTransactions(address: $address, startingPage: $startingPage, pageSize: $pageSize) {
    page
    limit
    data {
      blockNumber
      timestamp
      hash
      from
      to
      details {
        nonce
        gasLimit
        gasPrice
        gasUsed
        feeCurrency
        gatewayFeeRecipient
        gatewayFee
        to
        value
      }
      tags {
        eventname
        source
        parameters
      }
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
export const CeloValidatorGroupsDocument = gql`
    query celoValidatorGroups {
  celoValidatorGroups {
    group
    name
    metadataURL
    blockNumber
    votingPower
    votingPowerFraction
    capacityAvailable
    totalCapacity
    multiplier
    groupShare
    groupScore
    validatorDetails {
      validatorAddress
      validator_score
    }
  }
}
    `;
export type CeloValidatorGroupsComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICeloValidatorGroupsQuery, ICeloValidatorGroupsQueryVariables>, "query">;

export const CeloValidatorGroupsComponent = (props: CeloValidatorGroupsComponentProps) => (
      <ApolloReactComponents.Query<ICeloValidatorGroupsQuery, ICeloValidatorGroupsQueryVariables> query={CeloValidatorGroupsDocument} {...props} />
    );

export type ICeloValidatorGroupsProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICeloValidatorGroupsQuery, ICeloValidatorGroupsQueryVariables> & TChildProps;
export function withCeloValidatorGroups<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICeloValidatorGroupsQuery,
  ICeloValidatorGroupsQueryVariables,
  ICeloValidatorGroupsProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICeloValidatorGroupsQuery, ICeloValidatorGroupsQueryVariables, ICeloValidatorGroupsProps<TChildProps>>(CeloValidatorGroupsDocument, {
      alias: "celoValidatorGroups",
      ...operationOptions,
    });
}

/**
 * __useCeloValidatorGroupsQuery__
 *
 * To run a query within a React component, call `useCeloValidatorGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCeloValidatorGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCeloValidatorGroupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCeloValidatorGroupsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICeloValidatorGroupsQuery, ICeloValidatorGroupsQueryVariables>) {
        return ApolloReactHooks.useQuery<ICeloValidatorGroupsQuery, ICeloValidatorGroupsQueryVariables>(CeloValidatorGroupsDocument, baseOptions);
      }
export function useCeloValidatorGroupsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICeloValidatorGroupsQuery, ICeloValidatorGroupsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICeloValidatorGroupsQuery, ICeloValidatorGroupsQueryVariables>(CeloValidatorGroupsDocument, baseOptions);
        }
export type CeloValidatorGroupsQueryHookResult = ReturnType<typeof useCeloValidatorGroupsQuery>;
export type CeloValidatorGroupsLazyQueryHookResult = ReturnType<typeof useCeloValidatorGroupsLazyQuery>;
export type CeloValidatorGroupsQueryResult = ApolloReactCommon.QueryResult<ICeloValidatorGroupsQuery, ICeloValidatorGroupsQueryVariables>;
export const CosmosAccountBalancesDocument = gql`
    query cosmosAccountBalances($address: String!) {
  cosmosAccountBalances(address: $address) {
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
    `;
export type CosmosAccountBalancesComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICosmosAccountBalancesQuery, ICosmosAccountBalancesQueryVariables>, "query"> & ({ variables: ICosmosAccountBalancesQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CosmosAccountBalancesComponent = (props: CosmosAccountBalancesComponentProps) => (
      <ApolloReactComponents.Query<ICosmosAccountBalancesQuery, ICosmosAccountBalancesQueryVariables> query={CosmosAccountBalancesDocument} {...props} />
    );

export type ICosmosAccountBalancesProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICosmosAccountBalancesQuery, ICosmosAccountBalancesQueryVariables> & TChildProps;
export function withCosmosAccountBalances<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICosmosAccountBalancesQuery,
  ICosmosAccountBalancesQueryVariables,
  ICosmosAccountBalancesProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICosmosAccountBalancesQuery, ICosmosAccountBalancesQueryVariables, ICosmosAccountBalancesProps<TChildProps>>(CosmosAccountBalancesDocument, {
      alias: "cosmosAccountBalances",
      ...operationOptions,
    });
}

/**
 * __useCosmosAccountBalancesQuery__
 *
 * To run a query within a React component, call `useCosmosAccountBalancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCosmosAccountBalancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCosmosAccountBalancesQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useCosmosAccountBalancesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICosmosAccountBalancesQuery, ICosmosAccountBalancesQueryVariables>) {
        return ApolloReactHooks.useQuery<ICosmosAccountBalancesQuery, ICosmosAccountBalancesQueryVariables>(CosmosAccountBalancesDocument, baseOptions);
      }
export function useCosmosAccountBalancesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICosmosAccountBalancesQuery, ICosmosAccountBalancesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICosmosAccountBalancesQuery, ICosmosAccountBalancesQueryVariables>(CosmosAccountBalancesDocument, baseOptions);
        }
export type CosmosAccountBalancesQueryHookResult = ReturnType<typeof useCosmosAccountBalancesQuery>;
export type CosmosAccountBalancesLazyQueryHookResult = ReturnType<typeof useCosmosAccountBalancesLazyQuery>;
export type CosmosAccountBalancesQueryResult = ApolloReactCommon.QueryResult<ICosmosAccountBalancesQuery, ICosmosAccountBalancesQueryVariables>;
export const CosmosAccountHistoryDocument = gql`
    query cosmosAccountHistory($address: String!, $fiat: String!) {
  cosmosAccountHistory(address: $address, fiat: $fiat) {
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
export type CosmosAccountHistoryComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICosmosAccountHistoryQuery, ICosmosAccountHistoryQueryVariables>, "query"> & ({ variables: ICosmosAccountHistoryQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CosmosAccountHistoryComponent = (props: CosmosAccountHistoryComponentProps) => (
      <ApolloReactComponents.Query<ICosmosAccountHistoryQuery, ICosmosAccountHistoryQueryVariables> query={CosmosAccountHistoryDocument} {...props} />
    );

export type ICosmosAccountHistoryProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICosmosAccountHistoryQuery, ICosmosAccountHistoryQueryVariables> & TChildProps;
export function withCosmosAccountHistory<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICosmosAccountHistoryQuery,
  ICosmosAccountHistoryQueryVariables,
  ICosmosAccountHistoryProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICosmosAccountHistoryQuery, ICosmosAccountHistoryQueryVariables, ICosmosAccountHistoryProps<TChildProps>>(CosmosAccountHistoryDocument, {
      alias: "cosmosAccountHistory",
      ...operationOptions,
    });
}

/**
 * __useCosmosAccountHistoryQuery__
 *
 * To run a query within a React component, call `useCosmosAccountHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCosmosAccountHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCosmosAccountHistoryQuery({
 *   variables: {
 *      address: // value for 'address'
 *      fiat: // value for 'fiat'
 *   },
 * });
 */
export function useCosmosAccountHistoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICosmosAccountHistoryQuery, ICosmosAccountHistoryQueryVariables>) {
        return ApolloReactHooks.useQuery<ICosmosAccountHistoryQuery, ICosmosAccountHistoryQueryVariables>(CosmosAccountHistoryDocument, baseOptions);
      }
export function useCosmosAccountHistoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICosmosAccountHistoryQuery, ICosmosAccountHistoryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICosmosAccountHistoryQuery, ICosmosAccountHistoryQueryVariables>(CosmosAccountHistoryDocument, baseOptions);
        }
export type CosmosAccountHistoryQueryHookResult = ReturnType<typeof useCosmosAccountHistoryQuery>;
export type CosmosAccountHistoryLazyQueryHookResult = ReturnType<typeof useCosmosAccountHistoryLazyQuery>;
export type CosmosAccountHistoryQueryResult = ApolloReactCommon.QueryResult<ICosmosAccountHistoryQuery, ICosmosAccountHistoryQueryVariables>;
export const CosmosAccountInformationDocument = gql`
    query cosmosAccountInformation($address: String!) {
  cosmosAccountInformation(address: $address) {
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
export type CosmosAccountInformationComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICosmosAccountInformationQuery, ICosmosAccountInformationQueryVariables>, "query"> & ({ variables: ICosmosAccountInformationQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CosmosAccountInformationComponent = (props: CosmosAccountInformationComponentProps) => (
      <ApolloReactComponents.Query<ICosmosAccountInformationQuery, ICosmosAccountInformationQueryVariables> query={CosmosAccountInformationDocument} {...props} />
    );

export type ICosmosAccountInformationProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICosmosAccountInformationQuery, ICosmosAccountInformationQueryVariables> & TChildProps;
export function withCosmosAccountInformation<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICosmosAccountInformationQuery,
  ICosmosAccountInformationQueryVariables,
  ICosmosAccountInformationProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICosmosAccountInformationQuery, ICosmosAccountInformationQueryVariables, ICosmosAccountInformationProps<TChildProps>>(CosmosAccountInformationDocument, {
      alias: "cosmosAccountInformation",
      ...operationOptions,
    });
}

/**
 * __useCosmosAccountInformationQuery__
 *
 * To run a query within a React component, call `useCosmosAccountInformationQuery` and pass it any options that fit your needs.
 * When your component renders, `useCosmosAccountInformationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCosmosAccountInformationQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useCosmosAccountInformationQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICosmosAccountInformationQuery, ICosmosAccountInformationQueryVariables>) {
        return ApolloReactHooks.useQuery<ICosmosAccountInformationQuery, ICosmosAccountInformationQueryVariables>(CosmosAccountInformationDocument, baseOptions);
      }
export function useCosmosAccountInformationLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICosmosAccountInformationQuery, ICosmosAccountInformationQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICosmosAccountInformationQuery, ICosmosAccountInformationQueryVariables>(CosmosAccountInformationDocument, baseOptions);
        }
export type CosmosAccountInformationQueryHookResult = ReturnType<typeof useCosmosAccountInformationQuery>;
export type CosmosAccountInformationLazyQueryHookResult = ReturnType<typeof useCosmosAccountInformationLazyQuery>;
export type CosmosAccountInformationQueryResult = ApolloReactCommon.QueryResult<ICosmosAccountInformationQuery, ICosmosAccountInformationQueryVariables>;
export const CosmosDistributionCommunityPoolDocument = gql`
    query cosmosDistributionCommunityPool($network: String!) {
  cosmosDistributionCommunityPool(network: $network) {
    denom
    amount
  }
}
    `;
export type CosmosDistributionCommunityPoolComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICosmosDistributionCommunityPoolQuery, ICosmosDistributionCommunityPoolQueryVariables>, "query"> & ({ variables: ICosmosDistributionCommunityPoolQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CosmosDistributionCommunityPoolComponent = (props: CosmosDistributionCommunityPoolComponentProps) => (
      <ApolloReactComponents.Query<ICosmosDistributionCommunityPoolQuery, ICosmosDistributionCommunityPoolQueryVariables> query={CosmosDistributionCommunityPoolDocument} {...props} />
    );

export type ICosmosDistributionCommunityPoolProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICosmosDistributionCommunityPoolQuery, ICosmosDistributionCommunityPoolQueryVariables> & TChildProps;
export function withCosmosDistributionCommunityPool<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICosmosDistributionCommunityPoolQuery,
  ICosmosDistributionCommunityPoolQueryVariables,
  ICosmosDistributionCommunityPoolProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICosmosDistributionCommunityPoolQuery, ICosmosDistributionCommunityPoolQueryVariables, ICosmosDistributionCommunityPoolProps<TChildProps>>(CosmosDistributionCommunityPoolDocument, {
      alias: "cosmosDistributionCommunityPool",
      ...operationOptions,
    });
}

/**
 * __useCosmosDistributionCommunityPoolQuery__
 *
 * To run a query within a React component, call `useCosmosDistributionCommunityPoolQuery` and pass it any options that fit your needs.
 * When your component renders, `useCosmosDistributionCommunityPoolQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCosmosDistributionCommunityPoolQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useCosmosDistributionCommunityPoolQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICosmosDistributionCommunityPoolQuery, ICosmosDistributionCommunityPoolQueryVariables>) {
        return ApolloReactHooks.useQuery<ICosmosDistributionCommunityPoolQuery, ICosmosDistributionCommunityPoolQueryVariables>(CosmosDistributionCommunityPoolDocument, baseOptions);
      }
export function useCosmosDistributionCommunityPoolLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICosmosDistributionCommunityPoolQuery, ICosmosDistributionCommunityPoolQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICosmosDistributionCommunityPoolQuery, ICosmosDistributionCommunityPoolQueryVariables>(CosmosDistributionCommunityPoolDocument, baseOptions);
        }
export type CosmosDistributionCommunityPoolQueryHookResult = ReturnType<typeof useCosmosDistributionCommunityPoolQuery>;
export type CosmosDistributionCommunityPoolLazyQueryHookResult = ReturnType<typeof useCosmosDistributionCommunityPoolLazyQuery>;
export type CosmosDistributionCommunityPoolQueryResult = ApolloReactCommon.QueryResult<ICosmosDistributionCommunityPoolQuery, ICosmosDistributionCommunityPoolQueryVariables>;
export const CosmosDistributionParametersDocument = gql`
    query cosmosDistributionParameters($network: String!) {
  cosmosDistributionParameters(network: $network) {
    base_proposer_reward
    bonus_proposer_reward
    community_tax
  }
}
    `;
export type CosmosDistributionParametersComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICosmosDistributionParametersQuery, ICosmosDistributionParametersQueryVariables>, "query"> & ({ variables: ICosmosDistributionParametersQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CosmosDistributionParametersComponent = (props: CosmosDistributionParametersComponentProps) => (
      <ApolloReactComponents.Query<ICosmosDistributionParametersQuery, ICosmosDistributionParametersQueryVariables> query={CosmosDistributionParametersDocument} {...props} />
    );

export type ICosmosDistributionParametersProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICosmosDistributionParametersQuery, ICosmosDistributionParametersQueryVariables> & TChildProps;
export function withCosmosDistributionParameters<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICosmosDistributionParametersQuery,
  ICosmosDistributionParametersQueryVariables,
  ICosmosDistributionParametersProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICosmosDistributionParametersQuery, ICosmosDistributionParametersQueryVariables, ICosmosDistributionParametersProps<TChildProps>>(CosmosDistributionParametersDocument, {
      alias: "cosmosDistributionParameters",
      ...operationOptions,
    });
}

/**
 * __useCosmosDistributionParametersQuery__
 *
 * To run a query within a React component, call `useCosmosDistributionParametersQuery` and pass it any options that fit your needs.
 * When your component renders, `useCosmosDistributionParametersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCosmosDistributionParametersQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useCosmosDistributionParametersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICosmosDistributionParametersQuery, ICosmosDistributionParametersQueryVariables>) {
        return ApolloReactHooks.useQuery<ICosmosDistributionParametersQuery, ICosmosDistributionParametersQueryVariables>(CosmosDistributionParametersDocument, baseOptions);
      }
export function useCosmosDistributionParametersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICosmosDistributionParametersQuery, ICosmosDistributionParametersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICosmosDistributionParametersQuery, ICosmosDistributionParametersQueryVariables>(CosmosDistributionParametersDocument, baseOptions);
        }
export type CosmosDistributionParametersQueryHookResult = ReturnType<typeof useCosmosDistributionParametersQuery>;
export type CosmosDistributionParametersLazyQueryHookResult = ReturnType<typeof useCosmosDistributionParametersLazyQuery>;
export type CosmosDistributionParametersQueryResult = ApolloReactCommon.QueryResult<ICosmosDistributionParametersQuery, ICosmosDistributionParametersQueryVariables>;
export const CosmosGovernanceParametersDepositDocument = gql`
    query cosmosGovernanceParametersDeposit($network: String!) {
  cosmosGovernanceParametersDeposit(network: $network) {
    min_deposit {
      denom
      amount
    }
    max_deposit_period
  }
}
    `;
export type CosmosGovernanceParametersDepositComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICosmosGovernanceParametersDepositQuery, ICosmosGovernanceParametersDepositQueryVariables>, "query"> & ({ variables: ICosmosGovernanceParametersDepositQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CosmosGovernanceParametersDepositComponent = (props: CosmosGovernanceParametersDepositComponentProps) => (
      <ApolloReactComponents.Query<ICosmosGovernanceParametersDepositQuery, ICosmosGovernanceParametersDepositQueryVariables> query={CosmosGovernanceParametersDepositDocument} {...props} />
    );

export type ICosmosGovernanceParametersDepositProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICosmosGovernanceParametersDepositQuery, ICosmosGovernanceParametersDepositQueryVariables> & TChildProps;
export function withCosmosGovernanceParametersDeposit<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICosmosGovernanceParametersDepositQuery,
  ICosmosGovernanceParametersDepositQueryVariables,
  ICosmosGovernanceParametersDepositProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICosmosGovernanceParametersDepositQuery, ICosmosGovernanceParametersDepositQueryVariables, ICosmosGovernanceParametersDepositProps<TChildProps>>(CosmosGovernanceParametersDepositDocument, {
      alias: "cosmosGovernanceParametersDeposit",
      ...operationOptions,
    });
}

/**
 * __useCosmosGovernanceParametersDepositQuery__
 *
 * To run a query within a React component, call `useCosmosGovernanceParametersDepositQuery` and pass it any options that fit your needs.
 * When your component renders, `useCosmosGovernanceParametersDepositQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCosmosGovernanceParametersDepositQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useCosmosGovernanceParametersDepositQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICosmosGovernanceParametersDepositQuery, ICosmosGovernanceParametersDepositQueryVariables>) {
        return ApolloReactHooks.useQuery<ICosmosGovernanceParametersDepositQuery, ICosmosGovernanceParametersDepositQueryVariables>(CosmosGovernanceParametersDepositDocument, baseOptions);
      }
export function useCosmosGovernanceParametersDepositLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICosmosGovernanceParametersDepositQuery, ICosmosGovernanceParametersDepositQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICosmosGovernanceParametersDepositQuery, ICosmosGovernanceParametersDepositQueryVariables>(CosmosGovernanceParametersDepositDocument, baseOptions);
        }
export type CosmosGovernanceParametersDepositQueryHookResult = ReturnType<typeof useCosmosGovernanceParametersDepositQuery>;
export type CosmosGovernanceParametersDepositLazyQueryHookResult = ReturnType<typeof useCosmosGovernanceParametersDepositLazyQuery>;
export type CosmosGovernanceParametersDepositQueryResult = ApolloReactCommon.QueryResult<ICosmosGovernanceParametersDepositQuery, ICosmosGovernanceParametersDepositQueryVariables>;
export const CosmosGovernanceParametersTallyingDocument = gql`
    query cosmosGovernanceParametersTallying($network: String!) {
  cosmosGovernanceParametersTallying(network: $network) {
    threshold
    veto
    governance_penalty
  }
}
    `;
export type CosmosGovernanceParametersTallyingComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICosmosGovernanceParametersTallyingQuery, ICosmosGovernanceParametersTallyingQueryVariables>, "query"> & ({ variables: ICosmosGovernanceParametersTallyingQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CosmosGovernanceParametersTallyingComponent = (props: CosmosGovernanceParametersTallyingComponentProps) => (
      <ApolloReactComponents.Query<ICosmosGovernanceParametersTallyingQuery, ICosmosGovernanceParametersTallyingQueryVariables> query={CosmosGovernanceParametersTallyingDocument} {...props} />
    );

export type ICosmosGovernanceParametersTallyingProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICosmosGovernanceParametersTallyingQuery, ICosmosGovernanceParametersTallyingQueryVariables> & TChildProps;
export function withCosmosGovernanceParametersTallying<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICosmosGovernanceParametersTallyingQuery,
  ICosmosGovernanceParametersTallyingQueryVariables,
  ICosmosGovernanceParametersTallyingProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICosmosGovernanceParametersTallyingQuery, ICosmosGovernanceParametersTallyingQueryVariables, ICosmosGovernanceParametersTallyingProps<TChildProps>>(CosmosGovernanceParametersTallyingDocument, {
      alias: "cosmosGovernanceParametersTallying",
      ...operationOptions,
    });
}

/**
 * __useCosmosGovernanceParametersTallyingQuery__
 *
 * To run a query within a React component, call `useCosmosGovernanceParametersTallyingQuery` and pass it any options that fit your needs.
 * When your component renders, `useCosmosGovernanceParametersTallyingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCosmosGovernanceParametersTallyingQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useCosmosGovernanceParametersTallyingQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICosmosGovernanceParametersTallyingQuery, ICosmosGovernanceParametersTallyingQueryVariables>) {
        return ApolloReactHooks.useQuery<ICosmosGovernanceParametersTallyingQuery, ICosmosGovernanceParametersTallyingQueryVariables>(CosmosGovernanceParametersTallyingDocument, baseOptions);
      }
export function useCosmosGovernanceParametersTallyingLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICosmosGovernanceParametersTallyingQuery, ICosmosGovernanceParametersTallyingQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICosmosGovernanceParametersTallyingQuery, ICosmosGovernanceParametersTallyingQueryVariables>(CosmosGovernanceParametersTallyingDocument, baseOptions);
        }
export type CosmosGovernanceParametersTallyingQueryHookResult = ReturnType<typeof useCosmosGovernanceParametersTallyingQuery>;
export type CosmosGovernanceParametersTallyingLazyQueryHookResult = ReturnType<typeof useCosmosGovernanceParametersTallyingLazyQuery>;
export type CosmosGovernanceParametersTallyingQueryResult = ApolloReactCommon.QueryResult<ICosmosGovernanceParametersTallyingQuery, ICosmosGovernanceParametersTallyingQueryVariables>;
export const CosmosGovernanceParametersVotingDocument = gql`
    query cosmosGovernanceParametersVoting($network: String!) {
  cosmosGovernanceParametersVoting(network: $network) {
    voting_period
  }
}
    `;
export type CosmosGovernanceParametersVotingComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICosmosGovernanceParametersVotingQuery, ICosmosGovernanceParametersVotingQueryVariables>, "query"> & ({ variables: ICosmosGovernanceParametersVotingQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CosmosGovernanceParametersVotingComponent = (props: CosmosGovernanceParametersVotingComponentProps) => (
      <ApolloReactComponents.Query<ICosmosGovernanceParametersVotingQuery, ICosmosGovernanceParametersVotingQueryVariables> query={CosmosGovernanceParametersVotingDocument} {...props} />
    );

export type ICosmosGovernanceParametersVotingProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICosmosGovernanceParametersVotingQuery, ICosmosGovernanceParametersVotingQueryVariables> & TChildProps;
export function withCosmosGovernanceParametersVoting<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICosmosGovernanceParametersVotingQuery,
  ICosmosGovernanceParametersVotingQueryVariables,
  ICosmosGovernanceParametersVotingProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICosmosGovernanceParametersVotingQuery, ICosmosGovernanceParametersVotingQueryVariables, ICosmosGovernanceParametersVotingProps<TChildProps>>(CosmosGovernanceParametersVotingDocument, {
      alias: "cosmosGovernanceParametersVoting",
      ...operationOptions,
    });
}

/**
 * __useCosmosGovernanceParametersVotingQuery__
 *
 * To run a query within a React component, call `useCosmosGovernanceParametersVotingQuery` and pass it any options that fit your needs.
 * When your component renders, `useCosmosGovernanceParametersVotingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCosmosGovernanceParametersVotingQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useCosmosGovernanceParametersVotingQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICosmosGovernanceParametersVotingQuery, ICosmosGovernanceParametersVotingQueryVariables>) {
        return ApolloReactHooks.useQuery<ICosmosGovernanceParametersVotingQuery, ICosmosGovernanceParametersVotingQueryVariables>(CosmosGovernanceParametersVotingDocument, baseOptions);
      }
export function useCosmosGovernanceParametersVotingLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICosmosGovernanceParametersVotingQuery, ICosmosGovernanceParametersVotingQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICosmosGovernanceParametersVotingQuery, ICosmosGovernanceParametersVotingQueryVariables>(CosmosGovernanceParametersVotingDocument, baseOptions);
        }
export type CosmosGovernanceParametersVotingQueryHookResult = ReturnType<typeof useCosmosGovernanceParametersVotingQuery>;
export type CosmosGovernanceParametersVotingLazyQueryHookResult = ReturnType<typeof useCosmosGovernanceParametersVotingLazyQuery>;
export type CosmosGovernanceParametersVotingQueryResult = ApolloReactCommon.QueryResult<ICosmosGovernanceParametersVotingQuery, ICosmosGovernanceParametersVotingQueryVariables>;
export const CosmosGovernanceProposalsDocument = gql`
    query cosmosGovernanceProposals($network: String!) {
  cosmosGovernanceProposals(network: $network) {
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
export type CosmosGovernanceProposalsComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICosmosGovernanceProposalsQuery, ICosmosGovernanceProposalsQueryVariables>, "query"> & ({ variables: ICosmosGovernanceProposalsQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CosmosGovernanceProposalsComponent = (props: CosmosGovernanceProposalsComponentProps) => (
      <ApolloReactComponents.Query<ICosmosGovernanceProposalsQuery, ICosmosGovernanceProposalsQueryVariables> query={CosmosGovernanceProposalsDocument} {...props} />
    );

export type ICosmosGovernanceProposalsProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICosmosGovernanceProposalsQuery, ICosmosGovernanceProposalsQueryVariables> & TChildProps;
export function withCosmosGovernanceProposals<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICosmosGovernanceProposalsQuery,
  ICosmosGovernanceProposalsQueryVariables,
  ICosmosGovernanceProposalsProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICosmosGovernanceProposalsQuery, ICosmosGovernanceProposalsQueryVariables, ICosmosGovernanceProposalsProps<TChildProps>>(CosmosGovernanceProposalsDocument, {
      alias: "cosmosGovernanceProposals",
      ...operationOptions,
    });
}

/**
 * __useCosmosGovernanceProposalsQuery__
 *
 * To run a query within a React component, call `useCosmosGovernanceProposalsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCosmosGovernanceProposalsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCosmosGovernanceProposalsQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useCosmosGovernanceProposalsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICosmosGovernanceProposalsQuery, ICosmosGovernanceProposalsQueryVariables>) {
        return ApolloReactHooks.useQuery<ICosmosGovernanceProposalsQuery, ICosmosGovernanceProposalsQueryVariables>(CosmosGovernanceProposalsDocument, baseOptions);
      }
export function useCosmosGovernanceProposalsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICosmosGovernanceProposalsQuery, ICosmosGovernanceProposalsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICosmosGovernanceProposalsQuery, ICosmosGovernanceProposalsQueryVariables>(CosmosGovernanceProposalsDocument, baseOptions);
        }
export type CosmosGovernanceProposalsQueryHookResult = ReturnType<typeof useCosmosGovernanceProposalsQuery>;
export type CosmosGovernanceProposalsLazyQueryHookResult = ReturnType<typeof useCosmosGovernanceProposalsLazyQuery>;
export type CosmosGovernanceProposalsQueryResult = ApolloReactCommon.QueryResult<ICosmosGovernanceProposalsQuery, ICosmosGovernanceProposalsQueryVariables>;
export const CosmosLatestBlockDocument = gql`
    query cosmosLatestBlock($network: String!) {
  cosmosLatestBlock(network: $network) {
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
export type CosmosLatestBlockComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICosmosLatestBlockQuery, ICosmosLatestBlockQueryVariables>, "query"> & ({ variables: ICosmosLatestBlockQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CosmosLatestBlockComponent = (props: CosmosLatestBlockComponentProps) => (
      <ApolloReactComponents.Query<ICosmosLatestBlockQuery, ICosmosLatestBlockQueryVariables> query={CosmosLatestBlockDocument} {...props} />
    );

export type ICosmosLatestBlockProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICosmosLatestBlockQuery, ICosmosLatestBlockQueryVariables> & TChildProps;
export function withCosmosLatestBlock<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICosmosLatestBlockQuery,
  ICosmosLatestBlockQueryVariables,
  ICosmosLatestBlockProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICosmosLatestBlockQuery, ICosmosLatestBlockQueryVariables, ICosmosLatestBlockProps<TChildProps>>(CosmosLatestBlockDocument, {
      alias: "cosmosLatestBlock",
      ...operationOptions,
    });
}

/**
 * __useCosmosLatestBlockQuery__
 *
 * To run a query within a React component, call `useCosmosLatestBlockQuery` and pass it any options that fit your needs.
 * When your component renders, `useCosmosLatestBlockQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCosmosLatestBlockQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useCosmosLatestBlockQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICosmosLatestBlockQuery, ICosmosLatestBlockQueryVariables>) {
        return ApolloReactHooks.useQuery<ICosmosLatestBlockQuery, ICosmosLatestBlockQueryVariables>(CosmosLatestBlockDocument, baseOptions);
      }
export function useCosmosLatestBlockLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICosmosLatestBlockQuery, ICosmosLatestBlockQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICosmosLatestBlockQuery, ICosmosLatestBlockQueryVariables>(CosmosLatestBlockDocument, baseOptions);
        }
export type CosmosLatestBlockQueryHookResult = ReturnType<typeof useCosmosLatestBlockQuery>;
export type CosmosLatestBlockLazyQueryHookResult = ReturnType<typeof useCosmosLatestBlockLazyQuery>;
export type CosmosLatestBlockQueryResult = ApolloReactCommon.QueryResult<ICosmosLatestBlockQuery, ICosmosLatestBlockQueryVariables>;
export const CosmosRewardsByValidatorDocument = gql`
    query cosmosRewardsByValidator($address: String!) {
  cosmosRewardsByValidator(address: $address) {
    reward {
      denom
      amount
    }
    validator_address
  }
}
    `;
export type CosmosRewardsByValidatorComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICosmosRewardsByValidatorQuery, ICosmosRewardsByValidatorQueryVariables>, "query"> & ({ variables: ICosmosRewardsByValidatorQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CosmosRewardsByValidatorComponent = (props: CosmosRewardsByValidatorComponentProps) => (
      <ApolloReactComponents.Query<ICosmosRewardsByValidatorQuery, ICosmosRewardsByValidatorQueryVariables> query={CosmosRewardsByValidatorDocument} {...props} />
    );

export type ICosmosRewardsByValidatorProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICosmosRewardsByValidatorQuery, ICosmosRewardsByValidatorQueryVariables> & TChildProps;
export function withCosmosRewardsByValidator<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICosmosRewardsByValidatorQuery,
  ICosmosRewardsByValidatorQueryVariables,
  ICosmosRewardsByValidatorProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICosmosRewardsByValidatorQuery, ICosmosRewardsByValidatorQueryVariables, ICosmosRewardsByValidatorProps<TChildProps>>(CosmosRewardsByValidatorDocument, {
      alias: "cosmosRewardsByValidator",
      ...operationOptions,
    });
}

/**
 * __useCosmosRewardsByValidatorQuery__
 *
 * To run a query within a React component, call `useCosmosRewardsByValidatorQuery` and pass it any options that fit your needs.
 * When your component renders, `useCosmosRewardsByValidatorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCosmosRewardsByValidatorQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useCosmosRewardsByValidatorQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICosmosRewardsByValidatorQuery, ICosmosRewardsByValidatorQueryVariables>) {
        return ApolloReactHooks.useQuery<ICosmosRewardsByValidatorQuery, ICosmosRewardsByValidatorQueryVariables>(CosmosRewardsByValidatorDocument, baseOptions);
      }
export function useCosmosRewardsByValidatorLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICosmosRewardsByValidatorQuery, ICosmosRewardsByValidatorQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICosmosRewardsByValidatorQuery, ICosmosRewardsByValidatorQueryVariables>(CosmosRewardsByValidatorDocument, baseOptions);
        }
export type CosmosRewardsByValidatorQueryHookResult = ReturnType<typeof useCosmosRewardsByValidatorQuery>;
export type CosmosRewardsByValidatorLazyQueryHookResult = ReturnType<typeof useCosmosRewardsByValidatorLazyQuery>;
export type CosmosRewardsByValidatorQueryResult = ApolloReactCommon.QueryResult<ICosmosRewardsByValidatorQuery, ICosmosRewardsByValidatorQueryVariables>;
export const CosmosSlashingParametersDocument = gql`
    query cosmosSlashingParameters($network: String!) {
  cosmosSlashingParameters(network: $network) {
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
export type CosmosSlashingParametersComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICosmosSlashingParametersQuery, ICosmosSlashingParametersQueryVariables>, "query"> & ({ variables: ICosmosSlashingParametersQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CosmosSlashingParametersComponent = (props: CosmosSlashingParametersComponentProps) => (
      <ApolloReactComponents.Query<ICosmosSlashingParametersQuery, ICosmosSlashingParametersQueryVariables> query={CosmosSlashingParametersDocument} {...props} />
    );

export type ICosmosSlashingParametersProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICosmosSlashingParametersQuery, ICosmosSlashingParametersQueryVariables> & TChildProps;
export function withCosmosSlashingParameters<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICosmosSlashingParametersQuery,
  ICosmosSlashingParametersQueryVariables,
  ICosmosSlashingParametersProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICosmosSlashingParametersQuery, ICosmosSlashingParametersQueryVariables, ICosmosSlashingParametersProps<TChildProps>>(CosmosSlashingParametersDocument, {
      alias: "cosmosSlashingParameters",
      ...operationOptions,
    });
}

/**
 * __useCosmosSlashingParametersQuery__
 *
 * To run a query within a React component, call `useCosmosSlashingParametersQuery` and pass it any options that fit your needs.
 * When your component renders, `useCosmosSlashingParametersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCosmosSlashingParametersQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useCosmosSlashingParametersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICosmosSlashingParametersQuery, ICosmosSlashingParametersQueryVariables>) {
        return ApolloReactHooks.useQuery<ICosmosSlashingParametersQuery, ICosmosSlashingParametersQueryVariables>(CosmosSlashingParametersDocument, baseOptions);
      }
export function useCosmosSlashingParametersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICosmosSlashingParametersQuery, ICosmosSlashingParametersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICosmosSlashingParametersQuery, ICosmosSlashingParametersQueryVariables>(CosmosSlashingParametersDocument, baseOptions);
        }
export type CosmosSlashingParametersQueryHookResult = ReturnType<typeof useCosmosSlashingParametersQuery>;
export type CosmosSlashingParametersLazyQueryHookResult = ReturnType<typeof useCosmosSlashingParametersLazyQuery>;
export type CosmosSlashingParametersQueryResult = ApolloReactCommon.QueryResult<ICosmosSlashingParametersQuery, ICosmosSlashingParametersQueryVariables>;
export const CosmosStakingParametersDocument = gql`
    query cosmosStakingParameters($network: String!) {
  cosmosStakingParameters(network: $network) {
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
export type CosmosStakingParametersComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICosmosStakingParametersQuery, ICosmosStakingParametersQueryVariables>, "query"> & ({ variables: ICosmosStakingParametersQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CosmosStakingParametersComponent = (props: CosmosStakingParametersComponentProps) => (
      <ApolloReactComponents.Query<ICosmosStakingParametersQuery, ICosmosStakingParametersQueryVariables> query={CosmosStakingParametersDocument} {...props} />
    );

export type ICosmosStakingParametersProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICosmosStakingParametersQuery, ICosmosStakingParametersQueryVariables> & TChildProps;
export function withCosmosStakingParameters<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICosmosStakingParametersQuery,
  ICosmosStakingParametersQueryVariables,
  ICosmosStakingParametersProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICosmosStakingParametersQuery, ICosmosStakingParametersQueryVariables, ICosmosStakingParametersProps<TChildProps>>(CosmosStakingParametersDocument, {
      alias: "cosmosStakingParameters",
      ...operationOptions,
    });
}

/**
 * __useCosmosStakingParametersQuery__
 *
 * To run a query within a React component, call `useCosmosStakingParametersQuery` and pass it any options that fit your needs.
 * When your component renders, `useCosmosStakingParametersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCosmosStakingParametersQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useCosmosStakingParametersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICosmosStakingParametersQuery, ICosmosStakingParametersQueryVariables>) {
        return ApolloReactHooks.useQuery<ICosmosStakingParametersQuery, ICosmosStakingParametersQueryVariables>(CosmosStakingParametersDocument, baseOptions);
      }
export function useCosmosStakingParametersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICosmosStakingParametersQuery, ICosmosStakingParametersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICosmosStakingParametersQuery, ICosmosStakingParametersQueryVariables>(CosmosStakingParametersDocument, baseOptions);
        }
export type CosmosStakingParametersQueryHookResult = ReturnType<typeof useCosmosStakingParametersQuery>;
export type CosmosStakingParametersLazyQueryHookResult = ReturnType<typeof useCosmosStakingParametersLazyQuery>;
export type CosmosStakingParametersQueryResult = ApolloReactCommon.QueryResult<ICosmosStakingParametersQuery, ICosmosStakingParametersQueryVariables>;
export const CosmosStakingPoolDocument = gql`
    query cosmosStakingPool($network: String!) {
  cosmosStakingPool(network: $network) {
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
export type CosmosStakingPoolComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICosmosStakingPoolQuery, ICosmosStakingPoolQueryVariables>, "query"> & ({ variables: ICosmosStakingPoolQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CosmosStakingPoolComponent = (props: CosmosStakingPoolComponentProps) => (
      <ApolloReactComponents.Query<ICosmosStakingPoolQuery, ICosmosStakingPoolQueryVariables> query={CosmosStakingPoolDocument} {...props} />
    );

export type ICosmosStakingPoolProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICosmosStakingPoolQuery, ICosmosStakingPoolQueryVariables> & TChildProps;
export function withCosmosStakingPool<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICosmosStakingPoolQuery,
  ICosmosStakingPoolQueryVariables,
  ICosmosStakingPoolProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICosmosStakingPoolQuery, ICosmosStakingPoolQueryVariables, ICosmosStakingPoolProps<TChildProps>>(CosmosStakingPoolDocument, {
      alias: "cosmosStakingPool",
      ...operationOptions,
    });
}

/**
 * __useCosmosStakingPoolQuery__
 *
 * To run a query within a React component, call `useCosmosStakingPoolQuery` and pass it any options that fit your needs.
 * When your component renders, `useCosmosStakingPoolQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCosmosStakingPoolQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useCosmosStakingPoolQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICosmosStakingPoolQuery, ICosmosStakingPoolQueryVariables>) {
        return ApolloReactHooks.useQuery<ICosmosStakingPoolQuery, ICosmosStakingPoolQueryVariables>(CosmosStakingPoolDocument, baseOptions);
      }
export function useCosmosStakingPoolLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICosmosStakingPoolQuery, ICosmosStakingPoolQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICosmosStakingPoolQuery, ICosmosStakingPoolQueryVariables>(CosmosStakingPoolDocument, baseOptions);
        }
export type CosmosStakingPoolQueryHookResult = ReturnType<typeof useCosmosStakingPoolQuery>;
export type CosmosStakingPoolLazyQueryHookResult = ReturnType<typeof useCosmosStakingPoolLazyQuery>;
export type CosmosStakingPoolQueryResult = ApolloReactCommon.QueryResult<ICosmosStakingPoolQuery, ICosmosStakingPoolQueryVariables>;
export const CosmosTransactionDocument = gql`
    query cosmosTransaction($hash: String!, $network: String!) {
  cosmosTransaction(hash: $hash, network: $network) {
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
export type CosmosTransactionComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICosmosTransactionQuery, ICosmosTransactionQueryVariables>, "query"> & ({ variables: ICosmosTransactionQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CosmosTransactionComponent = (props: CosmosTransactionComponentProps) => (
      <ApolloReactComponents.Query<ICosmosTransactionQuery, ICosmosTransactionQueryVariables> query={CosmosTransactionDocument} {...props} />
    );

export type ICosmosTransactionProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICosmosTransactionQuery, ICosmosTransactionQueryVariables> & TChildProps;
export function withCosmosTransaction<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICosmosTransactionQuery,
  ICosmosTransactionQueryVariables,
  ICosmosTransactionProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICosmosTransactionQuery, ICosmosTransactionQueryVariables, ICosmosTransactionProps<TChildProps>>(CosmosTransactionDocument, {
      alias: "cosmosTransaction",
      ...operationOptions,
    });
}

/**
 * __useCosmosTransactionQuery__
 *
 * To run a query within a React component, call `useCosmosTransactionQuery` and pass it any options that fit your needs.
 * When your component renders, `useCosmosTransactionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCosmosTransactionQuery({
 *   variables: {
 *      hash: // value for 'hash'
 *      network: // value for 'network'
 *   },
 * });
 */
export function useCosmosTransactionQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICosmosTransactionQuery, ICosmosTransactionQueryVariables>) {
        return ApolloReactHooks.useQuery<ICosmosTransactionQuery, ICosmosTransactionQueryVariables>(CosmosTransactionDocument, baseOptions);
      }
export function useCosmosTransactionLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICosmosTransactionQuery, ICosmosTransactionQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICosmosTransactionQuery, ICosmosTransactionQueryVariables>(CosmosTransactionDocument, baseOptions);
        }
export type CosmosTransactionQueryHookResult = ReturnType<typeof useCosmosTransactionQuery>;
export type CosmosTransactionLazyQueryHookResult = ReturnType<typeof useCosmosTransactionLazyQuery>;
export type CosmosTransactionQueryResult = ApolloReactCommon.QueryResult<ICosmosTransactionQuery, ICosmosTransactionQueryVariables>;
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
export const CosmosValidatorDistributionDocument = gql`
    query cosmosValidatorDistribution($validatorAddress: String!) {
  cosmosValidatorDistribution(validatorAddress: $validatorAddress) {
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
export type CosmosValidatorDistributionComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICosmosValidatorDistributionQuery, ICosmosValidatorDistributionQueryVariables>, "query"> & ({ variables: ICosmosValidatorDistributionQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CosmosValidatorDistributionComponent = (props: CosmosValidatorDistributionComponentProps) => (
      <ApolloReactComponents.Query<ICosmosValidatorDistributionQuery, ICosmosValidatorDistributionQueryVariables> query={CosmosValidatorDistributionDocument} {...props} />
    );

export type ICosmosValidatorDistributionProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICosmosValidatorDistributionQuery, ICosmosValidatorDistributionQueryVariables> & TChildProps;
export function withCosmosValidatorDistribution<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICosmosValidatorDistributionQuery,
  ICosmosValidatorDistributionQueryVariables,
  ICosmosValidatorDistributionProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICosmosValidatorDistributionQuery, ICosmosValidatorDistributionQueryVariables, ICosmosValidatorDistributionProps<TChildProps>>(CosmosValidatorDistributionDocument, {
      alias: "cosmosValidatorDistribution",
      ...operationOptions,
    });
}

/**
 * __useCosmosValidatorDistributionQuery__
 *
 * To run a query within a React component, call `useCosmosValidatorDistributionQuery` and pass it any options that fit your needs.
 * When your component renders, `useCosmosValidatorDistributionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCosmosValidatorDistributionQuery({
 *   variables: {
 *      validatorAddress: // value for 'validatorAddress'
 *   },
 * });
 */
export function useCosmosValidatorDistributionQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICosmosValidatorDistributionQuery, ICosmosValidatorDistributionQueryVariables>) {
        return ApolloReactHooks.useQuery<ICosmosValidatorDistributionQuery, ICosmosValidatorDistributionQueryVariables>(CosmosValidatorDistributionDocument, baseOptions);
      }
export function useCosmosValidatorDistributionLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICosmosValidatorDistributionQuery, ICosmosValidatorDistributionQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICosmosValidatorDistributionQuery, ICosmosValidatorDistributionQueryVariables>(CosmosValidatorDistributionDocument, baseOptions);
        }
export type CosmosValidatorDistributionQueryHookResult = ReturnType<typeof useCosmosValidatorDistributionQuery>;
export type CosmosValidatorDistributionLazyQueryHookResult = ReturnType<typeof useCosmosValidatorDistributionLazyQuery>;
export type CosmosValidatorDistributionQueryResult = ApolloReactCommon.QueryResult<ICosmosValidatorDistributionQuery, ICosmosValidatorDistributionQueryVariables>;
export const CosmosValidatorSetsDocument = gql`
    query cosmosValidatorSets($network: String!) {
  cosmosValidatorSets(network: $network) {
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
export type CosmosValidatorSetsComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICosmosValidatorSetsQuery, ICosmosValidatorSetsQueryVariables>, "query"> & ({ variables: ICosmosValidatorSetsQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CosmosValidatorSetsComponent = (props: CosmosValidatorSetsComponentProps) => (
      <ApolloReactComponents.Query<ICosmosValidatorSetsQuery, ICosmosValidatorSetsQueryVariables> query={CosmosValidatorSetsDocument} {...props} />
    );

export type ICosmosValidatorSetsProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICosmosValidatorSetsQuery, ICosmosValidatorSetsQueryVariables> & TChildProps;
export function withCosmosValidatorSets<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICosmosValidatorSetsQuery,
  ICosmosValidatorSetsQueryVariables,
  ICosmosValidatorSetsProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICosmosValidatorSetsQuery, ICosmosValidatorSetsQueryVariables, ICosmosValidatorSetsProps<TChildProps>>(CosmosValidatorSetsDocument, {
      alias: "cosmosValidatorSets",
      ...operationOptions,
    });
}

/**
 * __useCosmosValidatorSetsQuery__
 *
 * To run a query within a React component, call `useCosmosValidatorSetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCosmosValidatorSetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCosmosValidatorSetsQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useCosmosValidatorSetsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICosmosValidatorSetsQuery, ICosmosValidatorSetsQueryVariables>) {
        return ApolloReactHooks.useQuery<ICosmosValidatorSetsQuery, ICosmosValidatorSetsQueryVariables>(CosmosValidatorSetsDocument, baseOptions);
      }
export function useCosmosValidatorSetsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICosmosValidatorSetsQuery, ICosmosValidatorSetsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICosmosValidatorSetsQuery, ICosmosValidatorSetsQueryVariables>(CosmosValidatorSetsDocument, baseOptions);
        }
export type CosmosValidatorSetsQueryHookResult = ReturnType<typeof useCosmosValidatorSetsQuery>;
export type CosmosValidatorSetsLazyQueryHookResult = ReturnType<typeof useCosmosValidatorSetsLazyQuery>;
export type CosmosValidatorSetsQueryResult = ApolloReactCommon.QueryResult<ICosmosValidatorSetsQuery, ICosmosValidatorSetsQueryVariables>;
export const CosmosValidatorsDocument = gql`
    query cosmosValidators($network: String!) {
  cosmosValidators(network: $network) {
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
export type CosmosValidatorsComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ICosmosValidatorsQuery, ICosmosValidatorsQueryVariables>, "query"> & ({ variables: ICosmosValidatorsQueryVariables; skip?: boolean; } | { skip: boolean; });

export const CosmosValidatorsComponent = (props: CosmosValidatorsComponentProps) => (
      <ApolloReactComponents.Query<ICosmosValidatorsQuery, ICosmosValidatorsQueryVariables> query={CosmosValidatorsDocument} {...props} />
    );

export type ICosmosValidatorsProps<TChildProps = {}> = ApolloReactHoc.DataProps<ICosmosValidatorsQuery, ICosmosValidatorsQueryVariables> & TChildProps;
export function withCosmosValidators<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ICosmosValidatorsQuery,
  ICosmosValidatorsQueryVariables,
  ICosmosValidatorsProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, ICosmosValidatorsQuery, ICosmosValidatorsQueryVariables, ICosmosValidatorsProps<TChildProps>>(CosmosValidatorsDocument, {
      alias: "cosmosValidators",
      ...operationOptions,
    });
}

/**
 * __useCosmosValidatorsQuery__
 *
 * To run a query within a React component, call `useCosmosValidatorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCosmosValidatorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCosmosValidatorsQuery({
 *   variables: {
 *      network: // value for 'network'
 *   },
 * });
 */
export function useCosmosValidatorsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICosmosValidatorsQuery, ICosmosValidatorsQueryVariables>) {
        return ApolloReactHooks.useQuery<ICosmosValidatorsQuery, ICosmosValidatorsQueryVariables>(CosmosValidatorsDocument, baseOptions);
      }
export function useCosmosValidatorsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICosmosValidatorsQuery, ICosmosValidatorsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICosmosValidatorsQuery, ICosmosValidatorsQueryVariables>(CosmosValidatorsDocument, baseOptions);
        }
export type CosmosValidatorsQueryHookResult = ReturnType<typeof useCosmosValidatorsQuery>;
export type CosmosValidatorsLazyQueryHookResult = ReturnType<typeof useCosmosValidatorsLazyQuery>;
export type CosmosValidatorsQueryResult = ApolloReactCommon.QueryResult<ICosmosValidatorsQuery, ICosmosValidatorsQueryVariables>;
export const DailyPercentChangeDocument = gql`
    query dailyPercentChange($currency: String!, $fiat: String!) {
  dailyPercentChange(currency: $currency, fiat: $fiat)
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
 *      currency: // value for 'currency'
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
export const OasisAccountBalancesDocument = gql`
    query oasisAccountBalances($address: String!) {
  oasisAccountBalances(address: $address) {
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
    `;
export type OasisAccountBalancesComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IOasisAccountBalancesQuery, IOasisAccountBalancesQueryVariables>, "query"> & ({ variables: IOasisAccountBalancesQueryVariables; skip?: boolean; } | { skip: boolean; });

export const OasisAccountBalancesComponent = (props: OasisAccountBalancesComponentProps) => (
      <ApolloReactComponents.Query<IOasisAccountBalancesQuery, IOasisAccountBalancesQueryVariables> query={OasisAccountBalancesDocument} {...props} />
    );

export type IOasisAccountBalancesProps<TChildProps = {}> = ApolloReactHoc.DataProps<IOasisAccountBalancesQuery, IOasisAccountBalancesQueryVariables> & TChildProps;
export function withOasisAccountBalances<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IOasisAccountBalancesQuery,
  IOasisAccountBalancesQueryVariables,
  IOasisAccountBalancesProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IOasisAccountBalancesQuery, IOasisAccountBalancesQueryVariables, IOasisAccountBalancesProps<TChildProps>>(OasisAccountBalancesDocument, {
      alias: "oasisAccountBalances",
      ...operationOptions,
    });
}

/**
 * __useOasisAccountBalancesQuery__
 *
 * To run a query within a React component, call `useOasisAccountBalancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useOasisAccountBalancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOasisAccountBalancesQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useOasisAccountBalancesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IOasisAccountBalancesQuery, IOasisAccountBalancesQueryVariables>) {
        return ApolloReactHooks.useQuery<IOasisAccountBalancesQuery, IOasisAccountBalancesQueryVariables>(OasisAccountBalancesDocument, baseOptions);
      }
export function useOasisAccountBalancesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IOasisAccountBalancesQuery, IOasisAccountBalancesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IOasisAccountBalancesQuery, IOasisAccountBalancesQueryVariables>(OasisAccountBalancesDocument, baseOptions);
        }
export type OasisAccountBalancesQueryHookResult = ReturnType<typeof useOasisAccountBalancesQuery>;
export type OasisAccountBalancesLazyQueryHookResult = ReturnType<typeof useOasisAccountBalancesLazyQuery>;
export type OasisAccountBalancesQueryResult = ApolloReactCommon.QueryResult<IOasisAccountBalancesQuery, IOasisAccountBalancesQueryVariables>;
export const OasisAccountHistoryDocument = gql`
    query oasisAccountHistory($address: String!, $fiat: String!) {
  oasisAccountHistory(address: $address, fiat: $fiat) {
    date
    height
    address
    rewards
    balance
    meta {
      is_validator
      is_delegator
    }
    delegations {
      delegator
      validator
      amount
    }
    debonding_balance {
      balance
      shares
    }
    staked_balance {
      balance
      shares
    }
  }
}
    `;
export type OasisAccountHistoryComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IOasisAccountHistoryQuery, IOasisAccountHistoryQueryVariables>, "query"> & ({ variables: IOasisAccountHistoryQueryVariables; skip?: boolean; } | { skip: boolean; });

export const OasisAccountHistoryComponent = (props: OasisAccountHistoryComponentProps) => (
      <ApolloReactComponents.Query<IOasisAccountHistoryQuery, IOasisAccountHistoryQueryVariables> query={OasisAccountHistoryDocument} {...props} />
    );

export type IOasisAccountHistoryProps<TChildProps = {}> = ApolloReactHoc.DataProps<IOasisAccountHistoryQuery, IOasisAccountHistoryQueryVariables> & TChildProps;
export function withOasisAccountHistory<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IOasisAccountHistoryQuery,
  IOasisAccountHistoryQueryVariables,
  IOasisAccountHistoryProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IOasisAccountHistoryQuery, IOasisAccountHistoryQueryVariables, IOasisAccountHistoryProps<TChildProps>>(OasisAccountHistoryDocument, {
      alias: "oasisAccountHistory",
      ...operationOptions,
    });
}

/**
 * __useOasisAccountHistoryQuery__
 *
 * To run a query within a React component, call `useOasisAccountHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useOasisAccountHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOasisAccountHistoryQuery({
 *   variables: {
 *      address: // value for 'address'
 *      fiat: // value for 'fiat'
 *   },
 * });
 */
export function useOasisAccountHistoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IOasisAccountHistoryQuery, IOasisAccountHistoryQueryVariables>) {
        return ApolloReactHooks.useQuery<IOasisAccountHistoryQuery, IOasisAccountHistoryQueryVariables>(OasisAccountHistoryDocument, baseOptions);
      }
export function useOasisAccountHistoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IOasisAccountHistoryQuery, IOasisAccountHistoryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IOasisAccountHistoryQuery, IOasisAccountHistoryQueryVariables>(OasisAccountHistoryDocument, baseOptions);
        }
export type OasisAccountHistoryQueryHookResult = ReturnType<typeof useOasisAccountHistoryQuery>;
export type OasisAccountHistoryLazyQueryHookResult = ReturnType<typeof useOasisAccountHistoryLazyQuery>;
export type OasisAccountHistoryQueryResult = ApolloReactCommon.QueryResult<IOasisAccountHistoryQuery, IOasisAccountHistoryQueryVariables>;
export const OasisTransactionDocument = gql`
    query oasisTransaction($hash: String!) {
  oasisTransaction(hash: $hash) {
    hash
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
        to
        tokens
      }
      ... on OasisEscrowTakeEvent {
        type
        from
        to
        tokens
      }
      ... on OasisEscrowReclaimEvent {
        type
        from
        shares
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
}
    `;
export type OasisTransactionComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IOasisTransactionQuery, IOasisTransactionQueryVariables>, "query"> & ({ variables: IOasisTransactionQueryVariables; skip?: boolean; } | { skip: boolean; });

export const OasisTransactionComponent = (props: OasisTransactionComponentProps) => (
      <ApolloReactComponents.Query<IOasisTransactionQuery, IOasisTransactionQueryVariables> query={OasisTransactionDocument} {...props} />
    );

export type IOasisTransactionProps<TChildProps = {}> = ApolloReactHoc.DataProps<IOasisTransactionQuery, IOasisTransactionQueryVariables> & TChildProps;
export function withOasisTransaction<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  IOasisTransactionQuery,
  IOasisTransactionQueryVariables,
  IOasisTransactionProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, IOasisTransactionQuery, IOasisTransactionQueryVariables, IOasisTransactionProps<TChildProps>>(OasisTransactionDocument, {
      alias: "oasisTransaction",
      ...operationOptions,
    });
}

/**
 * __useOasisTransactionQuery__
 *
 * To run a query within a React component, call `useOasisTransactionQuery` and pass it any options that fit your needs.
 * When your component renders, `useOasisTransactionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOasisTransactionQuery({
 *   variables: {
 *      hash: // value for 'hash'
 *   },
 * });
 */
export function useOasisTransactionQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IOasisTransactionQuery, IOasisTransactionQueryVariables>) {
        return ApolloReactHooks.useQuery<IOasisTransactionQuery, IOasisTransactionQueryVariables>(OasisTransactionDocument, baseOptions);
      }
export function useOasisTransactionLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IOasisTransactionQuery, IOasisTransactionQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IOasisTransactionQuery, IOasisTransactionQueryVariables>(OasisTransactionDocument, baseOptions);
        }
export type OasisTransactionQueryHookResult = ReturnType<typeof useOasisTransactionQuery>;
export type OasisTransactionLazyQueryHookResult = ReturnType<typeof useOasisTransactionLazyQuery>;
export type OasisTransactionQueryResult = ApolloReactCommon.QueryResult<IOasisTransactionQuery, IOasisTransactionQueryVariables>;
export const OasisTransactionsDocument = gql`
    query oasisTransactions($address: String!, $startingPage: Float, $pageSize: Float) {
  oasisTransactions(address: $address, startingPage: $startingPage, pageSize: $pageSize) {
    page
    limit
    data {
      hash
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
          to
          tokens
        }
        ... on OasisEscrowTakeEvent {
          type
          from
          to
          tokens
        }
        ... on OasisEscrowReclaimEvent {
          type
          from
          shares
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
