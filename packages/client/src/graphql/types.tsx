import gql from "graphql-tag";
import * as React from "react";
import * as ReactApollo from "react-apollo";
import * as ReactApolloHooks from "react-apollo-hooks";
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
  readonly account_number: Scalars["String"];
  readonly address: Scalars["String"];
  readonly coins: Maybe<ReadonlyArray<IAccountCoin>>;
  readonly public_key: Maybe<IPubKey>;
  readonly sequence: Scalars["String"];
}

export interface IAccountBalances {
  __typename?: "AccountBalances";
  readonly balance: Maybe<ReadonlyArray<IBalance>>;
  readonly rewards: Maybe<ReadonlyArray<IBalance>>;
  readonly delegations: Maybe<ReadonlyArray<IDelegation>>;
  readonly unbonding: Maybe<ReadonlyArray<IUnbondingDelegation>>;
  readonly commissions: Maybe<ReadonlyArray<IBalance>>;
}

export interface IAccountCoin {
  __typename?: "AccountCoin";
  readonly denom: Scalars["String"];
  readonly amount: Scalars["String"];
}

export interface IAccountInformation {
  __typename?: "AccountInformation";
  readonly type: Scalars["String"];
  readonly value: IAccount;
}

export interface IAvailableReward {
  __typename?: "AvailableReward";
  readonly reward: Maybe<ReadonlyArray<IBalance>>;
  readonly validator_address: Scalars["String"];
}

export interface IBalance {
  __typename?: "Balance";
  readonly denom: Scalars["String"];
  readonly amount: Scalars["String"];
}

export interface IBlock {
  __typename?: "Block";
  readonly header: IBlockHeader;
}

export interface IBlockData {
  __typename?: "BlockData";
  readonly block: IBlock;
}

export interface IBlockHeader {
  __typename?: "BlockHeader";
  readonly chain_id: Scalars["String"];
  readonly height: Scalars["String"];
  readonly time: Scalars["String"];
  readonly num_txs: Scalars["String"];
  readonly total_txs: Scalars["String"];
  readonly last_commit_hash: Scalars["String"];
  readonly data_hash: Scalars["String"];
  readonly validators_hash: Scalars["String"];
  readonly next_validators_hash: Scalars["String"];
  readonly consensus_hash: Scalars["String"];
  readonly app_hash: Scalars["String"];
  readonly last_results_hash: Scalars["String"];
  readonly evidence_hash: Scalars["String"];
  readonly proposer_address: Scalars["String"];
}

export interface ICoin {
  __typename?: "Coin";
  readonly id: Scalars["String"];
  readonly symbol: Scalars["String"];
  readonly name: Scalars["String"];
}

export interface ICommissionRates {
  __typename?: "CommissionRates";
  readonly rate: Scalars["String"];
  readonly max_rate: Scalars["String"];
  readonly max_change_rate: Scalars["String"];
}

export interface IDelegation {
  __typename?: "Delegation";
  readonly delegator_address: Scalars["String"];
  readonly validator_address: Scalars["String"];
  readonly shares: Scalars["String"];
}

export interface IDistributionParameters {
  __typename?: "DistributionParameters";
  readonly base_proposer_reward: Scalars["String"];
  readonly bonus_proposer_reward: Scalars["String"];
  readonly community_tax: Scalars["String"];
}

export interface IFiatCurrency {
  __typename?: "FiatCurrency";
  readonly name: Scalars["String"];
  readonly symbol: Scalars["String"];
}

export interface IFiatPrice {
  __typename?: "FiatPrice";
  readonly price: Scalars["Float"];
  readonly timestamp: Scalars["String"];
}

export interface IGovernanceParametersDeposit {
  __typename?: "GovernanceParametersDeposit";
  readonly min_deposit: Maybe<ReadonlyArray<IBalance>>;
  readonly max_deposit_period: Scalars["String"];
}

export interface IGovernanceParametersTallying {
  __typename?: "GovernanceParametersTallying";
  readonly threshold: Scalars["String"];
  readonly veto: Scalars["String"];
  readonly governance_penalty: Maybe<Scalars["String"]>;
}

export interface IGovernanceParametersVoting {
  __typename?: "GovernanceParametersVoting";
  readonly voting_period: Scalars["String"];
}

export interface IGovernanceProposal {
  __typename?: "GovernanceProposal";
  readonly proposal_id: Maybe<Scalars["Int"]>;
  readonly title: Maybe<Scalars["String"]>;
  readonly description: Maybe<Scalars["String"]>;
  readonly proposal_type: Maybe<Scalars["String"]>;
  readonly proposal_status: Scalars["String"];
  readonly final_tally_result: ITallyResult;
  readonly submit_time: Scalars["String"];
  readonly total_deposit: Maybe<ReadonlyArray<IBalance>>;
  readonly voting_start_time: Scalars["String"];
}

export interface ILogMessage {
  __typename?: "LogMessage";
  readonly code: Maybe<Scalars["Int"]>;
  readonly message: Maybe<Scalars["String"]>;
  readonly success: Maybe<Scalars["Boolean"]>;
  readonly log: Maybe<Scalars["String"]>;
  readonly msg_index: Maybe<Scalars["String"]>;
}

export interface IMsgBeginRedelegate {
  __typename?: "MsgBeginRedelegate";
  readonly amount: IBalance;
  readonly delegator_address: Maybe<Scalars["String"]>;
  readonly validator_src_address: Scalars["String"];
  readonly validator_dst_address: Scalars["String"];
}

export interface IMsgBeginRedelegateLegacy {
  __typename?: "MsgBeginRedelegateLegacy";
  readonly shares_amount: Scalars["String"];
  readonly delegator_address: Maybe<Scalars["String"]>;
  readonly validator_src_address: Scalars["String"];
  readonly validator_dst_address: Scalars["String"];
}

export interface IMsgDelegate {
  __typename?: "MsgDelegate";
  readonly amount: IBalance;
  readonly delegator_address: Maybe<Scalars["String"]>;
  readonly validator_address: Maybe<Scalars["String"]>;
}

export interface IMsgModifyWithdrawAddress {
  __typename?: "MsgModifyWithdrawAddress";
  readonly withdraw_address: Maybe<Scalars["String"]>;
  readonly validator_address: Maybe<Scalars["String"]>;
}

export interface IMsgSend {
  __typename?: "MsgSend";
  readonly amounts: Maybe<ReadonlyArray<IBalance>>;
  readonly to_address: Maybe<Scalars["String"]>;
  readonly from_address: Maybe<Scalars["String"]>;
}

export interface IMsgSubmitProposal {
  __typename?: "MsgSubmitProposal";
  readonly title: Scalars["String"];
  readonly description: Scalars["String"];
  readonly proposal_type: Scalars["String"];
  readonly proposer: Scalars["String"];
  readonly initial_deposit: Maybe<ReadonlyArray<IBalance>>;
}

export interface IMsgVote {
  __typename?: "MsgVote";
  readonly proposal_id: Scalars["String"];
  readonly voter: Scalars["String"];
  readonly option: Scalars["String"];
}

export interface IMsgWithdrawDelegationReward {
  __typename?: "MsgWithdrawDelegationReward";
  readonly delegator_address: Maybe<Scalars["String"]>;
  readonly validator_address: Maybe<Scalars["String"]>;
}

export interface IMsgWithdrawValidatorCommission {
  __typename?: "MsgWithdrawValidatorCommission";
  readonly validator_address: Maybe<Scalars["String"]>;
}

export interface IPortfolioBalance {
  __typename?: "PortfolioBalance";
  readonly address: Scalars["String"];
  readonly denom: Scalars["String"];
  readonly balance: Scalars["String"];
  readonly height: Scalars["Int"];
  readonly timestamp: Scalars["String"];
  readonly chain: Scalars["String"];
}

export interface IPortfolioCommission {
  __typename?: "PortfolioCommission";
  readonly balance: Scalars["String"];
  readonly height: Scalars["Int"];
  readonly validator: Scalars["String"];
  readonly timestamp: Scalars["String"];
}

export interface IPortfolioData {
  __typename?: "PortfolioData";
  readonly balanceHistory: ReadonlyArray<IPortfolioBalance>;
  readonly delegations: ReadonlyArray<IPortfolioDelegation>;
  readonly unbondings: ReadonlyArray<IPortfolioDelegation>;
  readonly delegatorRewards: ReadonlyArray<IPortfolioReward>;
  readonly validatorCommissions: ReadonlyArray<IPortfolioCommission>;
  readonly fiatPriceHistory: ReadonlyArray<IFiatPrice>;
}

export interface IPortfolioDelegation {
  __typename?: "PortfolioDelegation";
  readonly balance: Scalars["String"];
  readonly address: Scalars["String"];
  readonly timestamp: Scalars["String"];
}

export interface IPortfolioReward {
  __typename?: "PortfolioReward";
  readonly balance: Scalars["String"];
  readonly height: Scalars["Int"];
  readonly address: Scalars["String"];
  readonly timestamp: Scalars["String"];
}

export interface IPrice {
  __typename?: "Price";
  readonly price: Scalars["Float"];
}

export interface IPubKey {
  __typename?: "PubKey";
  readonly type: Scalars["String"];
}

export interface IQuery {
  __typename?: "Query";
  readonly portfolioHistory: IPortfolioData;
  readonly fiatPriceHistory: ReadonlyArray<IFiatPrice>;
  readonly dailyPercentChange: Scalars["String"];
  readonly accountBalances: IAccountBalances;
  readonly rewardsByValidator: ReadonlyArray<IAvailableReward>;
  readonly accountInformation: IAccountInformation;
  readonly transaction: Maybe<ITransaction>;
  readonly transactions: ReadonlyArray<ITransaction>;
  readonly validatorDistribution: IValidatorDistribution;
  readonly validators: ReadonlyArray<IValidator>;
  readonly validatorSets: IValidatorSet;
  readonly latestBlock: IBlockData;
  readonly stakingPool: IStakingPool;
  readonly stakingParameters: IStakingParameters;
  readonly governanceProposals: ReadonlyArray<IGovernanceProposal>;
  readonly governanceParametersDeposit: IGovernanceParametersDeposit;
  readonly governanceParametersTallying: IGovernanceParametersTallying;
  readonly governanceParametersVoting: IGovernanceParametersVoting;
  readonly slashingParameters: ISlashingParameters;
  readonly distributionCommunityPool: ReadonlyArray<IBalance>;
  readonly distributionParameters: IDistributionParameters;
  readonly prices: IPrice;
  readonly coins: Maybe<ReadonlyArray<ICoin>>;
  readonly fiatCurrencies: ReadonlyArray<IFiatCurrency>;
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

export interface IQueryTransactionsArgs {
  address: Scalars["String"];
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

export interface ISlashingParameters {
  __typename?: "SlashingParameters";
  readonly max_evidence_age: Scalars["String"];
  readonly signed_blocks_window: Scalars["String"];
  readonly min_signed_per_window: Scalars["String"];
  readonly double_sign_unbond_duration: Maybe<Scalars["String"]>;
  readonly downtime_unbond_duration: Maybe<Scalars["String"]>;
  readonly slash_fraction_double_sign: Scalars["String"];
  readonly slash_fraction_downtime: Scalars["String"];
}

export interface IStakingParameters {
  __typename?: "StakingParameters";
  readonly inflation_rate_change: Maybe<Scalars["String"]>;
  readonly inflation_max: Maybe<Scalars["String"]>;
  readonly inflation_min: Maybe<Scalars["String"]>;
  readonly goal_bonded: Maybe<Scalars["String"]>;
  readonly unbonding_time: Scalars["String"];
  readonly max_validators: Scalars["Int"];
  readonly max_entries: Scalars["Int"];
  readonly bond_denom: Scalars["String"];
}

export interface IStakingPool {
  __typename?: "StakingPool";
  readonly loose_tokens: Maybe<Scalars["String"]>;
  readonly bonded_tokens: Maybe<Scalars["String"]>;
  readonly not_bonded_tokens: Maybe<Scalars["String"]>;
  readonly inflation_last_time: Maybe<Scalars["String"]>;
  readonly inflation: Maybe<Scalars["String"]>;
  readonly date_last_commission_reset: Maybe<Scalars["String"]>;
  readonly prev_bonded_shares: Maybe<Scalars["String"]>;
}

export interface ITag {
  __typename?: "Tag";
  readonly key: Scalars["String"];
  readonly value: Maybe<Scalars["String"]>;
}

export interface ITallyResult {
  __typename?: "TallyResult";
  readonly yes: Scalars["String"];
  readonly abstain: Scalars["String"];
  readonly no: Scalars["String"];
  readonly no_with_veto: Scalars["String"];
}

export interface ITransaction {
  __typename?: "Transaction";
  readonly hash: Scalars["String"];
  readonly height: Scalars["String"];
  readonly log: ReadonlyArray<Maybe<ILogMessage>>;
  readonly gaswanted: Scalars["String"];
  readonly gasused: Scalars["String"];
  readonly memo: Maybe<Scalars["String"]>;
  readonly fees: ITxFee;
  readonly tags: Maybe<ReadonlyArray<ITag>>;
  readonly msgs: ReadonlyArray<ITxMsg>;
  readonly timestamp: Scalars["String"];
  readonly chain: Scalars["String"];
}

export interface ITx {
  __typename?: "Tx";
  readonly type: Scalars["String"];
  readonly value: ITxValue;
}

export interface ITxFee {
  __typename?: "TxFee";
  readonly amount: Maybe<ReadonlyArray<IBalance>>;
  readonly gas: Scalars["String"];
}

export interface ITxMsg {
  __typename?: "TxMsg";
  readonly type: Scalars["String"];
  readonly value: Maybe<ITxMsgValue>;
}

export type ITxMsgValue =
  | IMsgSend
  | IMsgVote
  | IMsgDelegate
  | IMsgSubmitProposal
  | IMsgBeginRedelegate
  | IMsgModifyWithdrawAddress
  | IMsgBeginRedelegateLegacy
  | IMsgWithdrawDelegationReward
  | IMsgWithdrawValidatorCommission;

export interface ITxSignature {
  __typename?: "TxSignature";
  readonly pub_key: IPubKey;
  readonly signature: Scalars["String"];
}

export interface ITxValue {
  __typename?: "TxValue";
  readonly fee: ITxFee;
  readonly memo: Scalars["String"];
  readonly msg: Maybe<ReadonlyArray<ITxMsg>>;
  readonly signatures: Maybe<ReadonlyArray<ITxSignature>>;
}

export interface IUnbondingDelegation {
  __typename?: "UnbondingDelegation";
  readonly delegator_address: Scalars["String"];
  readonly validator_address: Scalars["String"];
  readonly entries: ReadonlyArray<IUnbondingDelegationEntry>;
}

export interface IUnbondingDelegationEntry {
  __typename?: "UnbondingDelegationEntry";
  readonly balance: Scalars["String"];
  readonly initial_balance: Scalars["String"];
  readonly creation_height: Scalars["String"];
  readonly completion_time: Scalars["String"];
}

export interface IValidator {
  __typename?: "Validator";
  readonly operator_address: Scalars["String"];
  readonly consensus_pubkey: Scalars["String"];
  readonly jailed: Scalars["Boolean"];
  readonly status: Scalars["Int"];
  readonly tokens: Scalars["String"];
  readonly delegator_shares: Scalars["String"];
  readonly description: IValidatorDescription;
  readonly unbonding_height: Scalars["String"];
  readonly unbonding_time: Scalars["String"];
  readonly commission: IValidatorCommission;
  readonly min_self_delegation: Scalars["String"];
}

export interface IValidatorCommission {
  __typename?: "ValidatorCommission";
  readonly update_time: Scalars["String"];
  readonly commission_rates: ICommissionRates;
}

export interface IValidatorDescription {
  __typename?: "ValidatorDescription";
  readonly moniker: Scalars["String"];
  readonly identity: Scalars["String"];
  readonly website: Scalars["String"];
  readonly details: Scalars["String"];
}

export interface IValidatorDistribution {
  __typename?: "ValidatorDistribution";
  readonly operator_address: Scalars["String"];
  readonly self_bond_rewards: Maybe<ReadonlyArray<IBalance>>;
  readonly val_commission: Maybe<ReadonlyArray<IBalance>>;
}

export interface IValidatorSet {
  __typename?: "ValidatorSet";
  readonly block_height: Scalars["Int"];
  readonly validators: Maybe<ReadonlyArray<IValidatorSetItem>>;
}

export interface IValidatorSetItem {
  __typename?: "ValidatorSetItem";
  readonly address: Scalars["String"];
  readonly pub_key: Scalars["String"];
  readonly voting_power: Scalars["String"];
  readonly proposer_priority: Scalars["String"];
}
export interface IAccountBalancesQueryVariables {
  address: Scalars["String"];
}

export type IAccountBalancesQuery = { readonly __typename?: "Query" } & {
  readonly accountBalances: { readonly __typename?: "AccountBalances" } & {
    readonly balance: Maybe<
      ReadonlyArray<
        { readonly __typename?: "Balance" } & Pick<IBalance, "denom" | "amount">
      >
    >;
    readonly rewards: Maybe<
      ReadonlyArray<
        { readonly __typename?: "Balance" } & Pick<IBalance, "denom" | "amount">
      >
    >;
    readonly delegations: Maybe<
      ReadonlyArray<
        { readonly __typename?: "Delegation" } & Pick<
          IDelegation,
          "delegator_address" | "validator_address" | "shares"
        >
      >
    >;
    readonly unbonding: Maybe<
      ReadonlyArray<
        { readonly __typename?: "UnbondingDelegation" } & Pick<
          IUnbondingDelegation,
          "delegator_address" | "validator_address"
        > & {
            readonly entries: ReadonlyArray<
              { readonly __typename?: "UnbondingDelegationEntry" } & Pick<
                IUnbondingDelegationEntry,
                | "balance"
                | "initial_balance"
                | "creation_height"
                | "completion_time"
              >
            >;
          }
      >
    >;
    readonly commissions: Maybe<
      ReadonlyArray<
        { readonly __typename?: "Balance" } & Pick<IBalance, "denom" | "amount">
      >
    >;
  };
};

export interface IAccountInformationQueryVariables {
  address: Scalars["String"];
}

export type IAccountInformationQuery = { readonly __typename?: "Query" } & {
  readonly accountInformation: {
    readonly __typename?: "AccountInformation";
  } & Pick<IAccountInformation, "type"> & {
      readonly value: { readonly __typename?: "Account" } & Pick<
        IAccount,
        "account_number" | "address" | "sequence"
      > & {
          readonly coins: Maybe<
            ReadonlyArray<
              { readonly __typename?: "AccountCoin" } & Pick<
                IAccountCoin,
                "denom" | "amount"
              >
            >
          >;
          readonly public_key: Maybe<
            { readonly __typename?: "PubKey" } & Pick<IPubKey, "type">
          >;
        };
    };
};

export interface ICoinsQueryVariables {}

export type ICoinsQuery = { readonly __typename?: "Query" } & {
  readonly coins: Maybe<
    ReadonlyArray<
      { readonly __typename?: "Coin" } & Pick<ICoin, "id" | "symbol" | "name">
    >
  >;
};

export interface IDailyPercentChangeQueryVariables {
  crypto: Scalars["String"];
  fiat: Scalars["String"];
}

export type IDailyPercentChangeQuery = { readonly __typename?: "Query" } & Pick<
  IQuery,
  "dailyPercentChange"
>;

export interface IDistributionCommunityPoolQueryVariables {
  network: Scalars["String"];
}

export type IDistributionCommunityPoolQuery = {
  readonly __typename?: "Query";
} & {
  readonly distributionCommunityPool: ReadonlyArray<
    { readonly __typename?: "Balance" } & Pick<IBalance, "denom" | "amount">
  >;
};

export interface IDistributionParametersQueryVariables {
  network: Scalars["String"];
}

export type IDistributionParametersQuery = { readonly __typename?: "Query" } & {
  readonly distributionParameters: {
    readonly __typename?: "DistributionParameters";
  } & Pick<
    IDistributionParameters,
    "base_proposer_reward" | "bonus_proposer_reward" | "community_tax"
  >;
};

export interface IFiatCurrenciesQueryVariables {}

export type IFiatCurrenciesQuery = { readonly __typename?: "Query" } & {
  readonly fiatCurrencies: ReadonlyArray<
    { readonly __typename?: "FiatCurrency" } & Pick<
      IFiatCurrency,
      "name" | "symbol"
    >
  >;
};

export interface IFiatPriceHistoryQueryVariables {
  fiat: Scalars["String"];
  network: Scalars["String"];
}

export type IFiatPriceHistoryQuery = { readonly __typename?: "Query" } & {
  readonly fiatPriceHistory: ReadonlyArray<
    { readonly __typename?: "FiatPrice" } & Pick<
      IFiatPrice,
      "price" | "timestamp"
    >
  >;
};

export interface IGovernanceParametersDepositQueryVariables {
  network: Scalars["String"];
}

export type IGovernanceParametersDepositQuery = {
  readonly __typename?: "Query";
} & {
  readonly governanceParametersDeposit: {
    readonly __typename?: "GovernanceParametersDeposit";
  } & Pick<IGovernanceParametersDeposit, "max_deposit_period"> & {
      readonly min_deposit: Maybe<
        ReadonlyArray<
          { readonly __typename?: "Balance" } & Pick<
            IBalance,
            "denom" | "amount"
          >
        >
      >;
    };
};

export interface IGovernanceParametersTallyingQueryVariables {
  network: Scalars["String"];
}

export type IGovernanceParametersTallyingQuery = {
  readonly __typename?: "Query";
} & {
  readonly governanceParametersTallying: {
    readonly __typename?: "GovernanceParametersTallying";
  } & Pick<
    IGovernanceParametersTallying,
    "threshold" | "veto" | "governance_penalty"
  >;
};

export interface IGovernanceParametersVotingQueryVariables {
  network: Scalars["String"];
}

export type IGovernanceParametersVotingQuery = {
  readonly __typename?: "Query";
} & {
  readonly governanceParametersVoting: {
    readonly __typename?: "GovernanceParametersVoting";
  } & Pick<IGovernanceParametersVoting, "voting_period">;
};

export interface IGovernanceProposalsQueryVariables {
  network: Scalars["String"];
}

export type IGovernanceProposalsQuery = { readonly __typename?: "Query" } & {
  readonly governanceProposals: ReadonlyArray<
    { readonly __typename?: "GovernanceProposal" } & Pick<
      IGovernanceProposal,
      | "proposal_id"
      | "title"
      | "description"
      | "proposal_type"
      | "proposal_status"
      | "submit_time"
      | "voting_start_time"
    > & {
        readonly final_tally_result: {
          readonly __typename?: "TallyResult";
        } & Pick<ITallyResult, "yes" | "abstain" | "no" | "no_with_veto">;
        readonly total_deposit: Maybe<
          ReadonlyArray<
            { readonly __typename?: "Balance" } & Pick<
              IBalance,
              "denom" | "amount"
            >
          >
        >;
      }
  >;
};

export interface ILatestBlockQueryVariables {
  network: Scalars["String"];
}

export type ILatestBlockQuery = { readonly __typename?: "Query" } & {
  readonly latestBlock: { readonly __typename?: "BlockData" } & {
    readonly block: { readonly __typename?: "Block" } & {
      readonly header: { readonly __typename?: "BlockHeader" } & Pick<
        IBlockHeader,
        | "chain_id"
        | "height"
        | "time"
        | "num_txs"
        | "total_txs"
        | "last_commit_hash"
        | "data_hash"
        | "validators_hash"
        | "next_validators_hash"
        | "consensus_hash"
        | "app_hash"
        | "last_results_hash"
        | "evidence_hash"
        | "proposer_address"
      >;
    };
  };
};

export interface IPortfolioHistoryQueryVariables {
  address: Scalars["String"];
  fiat: Scalars["String"];
}

export type IPortfolioHistoryQuery = { readonly __typename?: "Query" } & {
  readonly portfolioHistory: { readonly __typename?: "PortfolioData" } & {
    readonly balanceHistory: ReadonlyArray<
      { readonly __typename?: "PortfolioBalance" } & Pick<
        IPortfolioBalance,
        "address" | "denom" | "balance" | "height" | "timestamp" | "chain"
      >
    >;
    readonly delegations: ReadonlyArray<
      { readonly __typename?: "PortfolioDelegation" } & Pick<
        IPortfolioDelegation,
        "balance" | "address" | "timestamp"
      >
    >;
    readonly unbondings: ReadonlyArray<
      { readonly __typename?: "PortfolioDelegation" } & Pick<
        IPortfolioDelegation,
        "balance" | "address" | "timestamp"
      >
    >;
    readonly delegatorRewards: ReadonlyArray<
      { readonly __typename?: "PortfolioReward" } & Pick<
        IPortfolioReward,
        "balance" | "height" | "address" | "timestamp"
      >
    >;
    readonly validatorCommissions: ReadonlyArray<
      { readonly __typename?: "PortfolioCommission" } & Pick<
        IPortfolioCommission,
        "balance" | "height" | "validator" | "timestamp"
      >
    >;
    readonly fiatPriceHistory: ReadonlyArray<
      { readonly __typename?: "FiatPrice" } & Pick<
        IFiatPrice,
        "price" | "timestamp"
      >
    >;
  };
};

export interface IPricesQueryVariables {
  currency: Scalars["String"];
  versus: Scalars["String"];
}

export type IPricesQuery = { readonly __typename?: "Query" } & {
  readonly prices: { readonly __typename?: "Price" } & Pick<IPrice, "price">;
};

export interface IRewardsByValidatorQueryVariables {
  address: Scalars["String"];
}

export type IRewardsByValidatorQuery = { readonly __typename?: "Query" } & {
  readonly rewardsByValidator: ReadonlyArray<
    { readonly __typename?: "AvailableReward" } & Pick<
      IAvailableReward,
      "validator_address"
    > & {
        readonly reward: Maybe<
          ReadonlyArray<
            { readonly __typename?: "Balance" } & Pick<
              IBalance,
              "denom" | "amount"
            >
          >
        >;
      }
  >;
};

export interface ISlashingParametersQueryVariables {
  network: Scalars["String"];
}

export type ISlashingParametersQuery = { readonly __typename?: "Query" } & {
  readonly slashingParameters: {
    readonly __typename?: "SlashingParameters";
  } & Pick<
    ISlashingParameters,
    | "max_evidence_age"
    | "signed_blocks_window"
    | "min_signed_per_window"
    | "double_sign_unbond_duration"
    | "downtime_unbond_duration"
    | "slash_fraction_double_sign"
    | "slash_fraction_downtime"
  >;
};

export interface IStakingParametersQueryVariables {
  network: Scalars["String"];
}

export type IStakingParametersQuery = { readonly __typename?: "Query" } & {
  readonly stakingParameters: {
    readonly __typename?: "StakingParameters";
  } & Pick<
    IStakingParameters,
    | "inflation_rate_change"
    | "inflation_max"
    | "inflation_min"
    | "goal_bonded"
    | "unbonding_time"
    | "max_validators"
    | "max_entries"
    | "bond_denom"
  >;
};

export interface IStakingPoolQueryVariables {
  network: Scalars["String"];
}

export type IStakingPoolQuery = { readonly __typename?: "Query" } & {
  readonly stakingPool: { readonly __typename?: "StakingPool" } & Pick<
    IStakingPool,
    | "loose_tokens"
    | "bonded_tokens"
    | "not_bonded_tokens"
    | "inflation_last_time"
    | "inflation"
    | "date_last_commission_reset"
    | "prev_bonded_shares"
  >;
};

export interface ITransactionQueryVariables {
  txHash: Scalars["String"];
  network: Scalars["String"];
}

export type ITransactionQuery = { readonly __typename?: "Query" } & {
  readonly transaction: Maybe<
    { readonly __typename?: "Transaction" } & Pick<
      ITransaction,
      | "hash"
      | "height"
      | "gaswanted"
      | "gasused"
      | "memo"
      | "timestamp"
      | "chain"
    > & {
        readonly log: ReadonlyArray<
          Maybe<
            { readonly __typename?: "LogMessage" } & Pick<
              ILogMessage,
              "code" | "message" | "success" | "log" | "msg_index"
            >
          >
        >;
        readonly fees: { readonly __typename?: "TxFee" } & Pick<
          ITxFee,
          "gas"
        > & {
            readonly amount: Maybe<
              ReadonlyArray<
                { readonly __typename?: "Balance" } & Pick<
                  IBalance,
                  "denom" | "amount"
                >
              >
            >;
          };
        readonly tags: Maybe<
          ReadonlyArray<
            { readonly __typename?: "Tag" } & Pick<ITag, "key" | "value">
          >
        >;
        readonly msgs: ReadonlyArray<
          { readonly __typename?: "TxMsg" } & Pick<ITxMsg, "type"> & {
              readonly value: Maybe<
                | ({ readonly __typename?: "MsgSend" } & Pick<
                    IMsgSend,
                    "to_address" | "from_address"
                  > & {
                      readonly amounts: Maybe<
                        ReadonlyArray<
                          { readonly __typename?: "Balance" } & Pick<
                            IBalance,
                            "denom" | "amount"
                          >
                        >
                      >;
                    })
                | ({ readonly __typename?: "MsgVote" } & Pick<
                    IMsgVote,
                    "proposal_id" | "voter" | "option"
                  >)
                | ({ readonly __typename?: "MsgDelegate" } & Pick<
                    IMsgDelegate,
                    "delegator_address" | "validator_address"
                  > & {
                      readonly amount: {
                        readonly __typename?: "Balance";
                      } & Pick<IBalance, "denom" | "amount">;
                    })
                | ({ readonly __typename?: "MsgSubmitProposal" } & Pick<
                    IMsgSubmitProposal,
                    "title" | "description" | "proposal_type" | "proposer"
                  > & {
                      readonly initial_deposit: Maybe<
                        ReadonlyArray<
                          { readonly __typename?: "Balance" } & Pick<
                            IBalance,
                            "denom" | "amount"
                          >
                        >
                      >;
                    })
                | ({ readonly __typename?: "MsgBeginRedelegate" } & Pick<
                    IMsgBeginRedelegate,
                    | "delegator_address"
                    | "validator_src_address"
                    | "validator_dst_address"
                  > & {
                      readonly amount: {
                        readonly __typename?: "Balance";
                      } & Pick<IBalance, "denom" | "amount">;
                    })
                | ({
                    readonly __typename?: "MsgModifyWithdrawAddress";
                  } & Pick<
                    IMsgModifyWithdrawAddress,
                    "withdraw_address" | "validator_address"
                  >)
                | ({
                    readonly __typename?: "MsgBeginRedelegateLegacy";
                  } & Pick<
                    IMsgBeginRedelegateLegacy,
                    | "shares_amount"
                    | "delegator_address"
                    | "validator_src_address"
                    | "validator_dst_address"
                  >)
                | ({
                    readonly __typename?: "MsgWithdrawDelegationReward";
                  } & Pick<
                    IMsgWithdrawDelegationReward,
                    "delegator_address" | "validator_address"
                  >)
                | ({
                    readonly __typename?: "MsgWithdrawValidatorCommission";
                  } & Pick<
                    IMsgWithdrawValidatorCommission,
                    "validator_address"
                  >)
              >;
            }
        >;
      }
  >;
};

export interface ITransactionsQueryVariables {
  address: Scalars["String"];
}

export type ITransactionsQuery = { readonly __typename?: "Query" } & {
  readonly transactions: ReadonlyArray<
    { readonly __typename?: "Transaction" } & Pick<
      ITransaction,
      | "hash"
      | "height"
      | "gaswanted"
      | "gasused"
      | "memo"
      | "timestamp"
      | "chain"
    > & {
        readonly log: ReadonlyArray<
          Maybe<
            { readonly __typename?: "LogMessage" } & Pick<
              ILogMessage,
              "code" | "message" | "success" | "log" | "msg_index"
            >
          >
        >;
        readonly fees: { readonly __typename?: "TxFee" } & Pick<
          ITxFee,
          "gas"
        > & {
            readonly amount: Maybe<
              ReadonlyArray<
                { readonly __typename?: "Balance" } & Pick<
                  IBalance,
                  "denom" | "amount"
                >
              >
            >;
          };
        readonly tags: Maybe<
          ReadonlyArray<
            { readonly __typename?: "Tag" } & Pick<ITag, "key" | "value">
          >
        >;
        readonly msgs: ReadonlyArray<
          { readonly __typename?: "TxMsg" } & Pick<ITxMsg, "type"> & {
              readonly value: Maybe<
                | ({ readonly __typename?: "MsgSend" } & Pick<
                    IMsgSend,
                    "to_address" | "from_address"
                  > & {
                      readonly amounts: Maybe<
                        ReadonlyArray<
                          { readonly __typename?: "Balance" } & Pick<
                            IBalance,
                            "denom" | "amount"
                          >
                        >
                      >;
                    })
                | ({ readonly __typename?: "MsgVote" } & Pick<
                    IMsgVote,
                    "proposal_id" | "voter" | "option"
                  >)
                | ({ readonly __typename?: "MsgDelegate" } & Pick<
                    IMsgDelegate,
                    "delegator_address" | "validator_address"
                  > & {
                      readonly amount: {
                        readonly __typename?: "Balance";
                      } & Pick<IBalance, "denom" | "amount">;
                    })
                | ({ readonly __typename?: "MsgSubmitProposal" } & Pick<
                    IMsgSubmitProposal,
                    "title" | "description" | "proposal_type" | "proposer"
                  > & {
                      readonly initial_deposit: Maybe<
                        ReadonlyArray<
                          { readonly __typename?: "Balance" } & Pick<
                            IBalance,
                            "denom" | "amount"
                          >
                        >
                      >;
                    })
                | ({ readonly __typename?: "MsgBeginRedelegate" } & Pick<
                    IMsgBeginRedelegate,
                    | "delegator_address"
                    | "validator_src_address"
                    | "validator_dst_address"
                  > & {
                      readonly amount: {
                        readonly __typename?: "Balance";
                      } & Pick<IBalance, "denom" | "amount">;
                    })
                | ({
                    readonly __typename?: "MsgModifyWithdrawAddress";
                  } & Pick<
                    IMsgModifyWithdrawAddress,
                    "withdraw_address" | "validator_address"
                  >)
                | ({
                    readonly __typename?: "MsgBeginRedelegateLegacy";
                  } & Pick<
                    IMsgBeginRedelegateLegacy,
                    | "shares_amount"
                    | "delegator_address"
                    | "validator_src_address"
                    | "validator_dst_address"
                  >)
                | ({
                    readonly __typename?: "MsgWithdrawDelegationReward";
                  } & Pick<
                    IMsgWithdrawDelegationReward,
                    "delegator_address" | "validator_address"
                  >)
                | ({
                    readonly __typename?: "MsgWithdrawValidatorCommission";
                  } & Pick<
                    IMsgWithdrawValidatorCommission,
                    "validator_address"
                  >)
              >;
            }
        >;
      }
  >;
};

export interface IValidatorDistributionQueryVariables {
  validatorAddress: Scalars["String"];
}

export type IValidatorDistributionQuery = { readonly __typename?: "Query" } & {
  readonly validatorDistribution: {
    readonly __typename?: "ValidatorDistribution";
  } & Pick<IValidatorDistribution, "operator_address"> & {
      readonly self_bond_rewards: Maybe<
        ReadonlyArray<
          { readonly __typename?: "Balance" } & Pick<
            IBalance,
            "denom" | "amount"
          >
        >
      >;
      readonly val_commission: Maybe<
        ReadonlyArray<
          { readonly __typename?: "Balance" } & Pick<
            IBalance,
            "denom" | "amount"
          >
        >
      >;
    };
};

export interface IValidatorsQueryVariables {
  network: Scalars["String"];
}

export type IValidatorsQuery = { readonly __typename?: "Query" } & {
  readonly validators: ReadonlyArray<
    { readonly __typename?: "Validator" } & Pick<
      IValidator,
      | "operator_address"
      | "consensus_pubkey"
      | "jailed"
      | "status"
      | "tokens"
      | "delegator_shares"
      | "unbonding_height"
      | "unbonding_time"
      | "min_self_delegation"
    > & {
        readonly description: {
          readonly __typename?: "ValidatorDescription";
        } & Pick<
          IValidatorDescription,
          "moniker" | "identity" | "website" | "details"
        >;
        readonly commission: {
          readonly __typename?: "ValidatorCommission";
        } & Pick<IValidatorCommission, "update_time"> & {
            readonly commission_rates: {
              readonly __typename?: "CommissionRates";
            } & Pick<ICommissionRates, "rate" | "max_rate" | "max_change_rate">;
          };
      }
  >;
};

export interface IValidatorSetsQueryVariables {
  network: Scalars["String"];
}

export type IValidatorSetsQuery = { readonly __typename?: "Query" } & {
  readonly validatorSets: { readonly __typename?: "ValidatorSet" } & Pick<
    IValidatorSet,
    "block_height"
  > & {
      readonly validators: Maybe<
        ReadonlyArray<
          { readonly __typename?: "ValidatorSetItem" } & Pick<
            IValidatorSetItem,
            "address" | "pub_key" | "voting_power" | "proposer_priority"
          >
        >
      >;
    };
};

export const AccountBalancesDocument = gql`
  query accountBalances($address: String!) {
    accountBalances(address: $address) {
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
export type AccountBalancesComponentProps = Omit<
  ReactApollo.QueryProps<IAccountBalancesQuery, IAccountBalancesQueryVariables>,
  "query"
> &
  (
    | { variables: IAccountBalancesQueryVariables; skip?: false }
    | { skip: true });

export const AccountBalancesComponent = (
  props: AccountBalancesComponentProps,
) => (
  <ReactApollo.Query<IAccountBalancesQuery, IAccountBalancesQueryVariables>
    query={AccountBalancesDocument}
    {...props}
  />
);

export type IAccountBalancesProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<IAccountBalancesQuery, IAccountBalancesQueryVariables>
> &
  TChildProps;
export function withAccountBalances<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IAccountBalancesQuery,
    IAccountBalancesQueryVariables,
    IAccountBalancesProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IAccountBalancesQuery,
    IAccountBalancesQueryVariables,
    IAccountBalancesProps<TChildProps>
  >(AccountBalancesDocument, {
    alias: "withAccountBalances",
    ...operationOptions,
  });
}

export function useAccountBalancesQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    IAccountBalancesQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    IAccountBalancesQuery,
    IAccountBalancesQueryVariables
  >(AccountBalancesDocument, baseOptions);
}
export type AccountBalancesQueryHookResult = ReturnType<
  typeof useAccountBalancesQuery
>;
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
export type AccountInformationComponentProps = Omit<
  ReactApollo.QueryProps<
    IAccountInformationQuery,
    IAccountInformationQueryVariables
  >,
  "query"
> &
  (
    | { variables: IAccountInformationQueryVariables; skip?: false }
    | { skip: true });

export const AccountInformationComponent = (
  props: AccountInformationComponentProps,
) => (
  <ReactApollo.Query<
    IAccountInformationQuery,
    IAccountInformationQueryVariables
  >
    query={AccountInformationDocument}
    {...props}
  />
);

export type IAccountInformationProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<
    IAccountInformationQuery,
    IAccountInformationQueryVariables
  >
> &
  TChildProps;
export function withAccountInformation<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IAccountInformationQuery,
    IAccountInformationQueryVariables,
    IAccountInformationProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IAccountInformationQuery,
    IAccountInformationQueryVariables,
    IAccountInformationProps<TChildProps>
  >(AccountInformationDocument, {
    alias: "withAccountInformation",
    ...operationOptions,
  });
}

export function useAccountInformationQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    IAccountInformationQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    IAccountInformationQuery,
    IAccountInformationQueryVariables
  >(AccountInformationDocument, baseOptions);
}
export type AccountInformationQueryHookResult = ReturnType<
  typeof useAccountInformationQuery
>;
export const CoinsDocument = gql`
  query coins {
    coins {
      id
      symbol
      name
    }
  }
`;
export type CoinsComponentProps = Omit<
  ReactApollo.QueryProps<ICoinsQuery, ICoinsQueryVariables>,
  "query"
>;

export const CoinsComponent = (props: CoinsComponentProps) => (
  <ReactApollo.Query<ICoinsQuery, ICoinsQueryVariables>
    query={CoinsDocument}
    {...props}
  />
);

export type ICoinsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<ICoinsQuery, ICoinsQueryVariables>
> &
  TChildProps;
export function withCoins<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    ICoinsQuery,
    ICoinsQueryVariables,
    ICoinsProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    ICoinsQuery,
    ICoinsQueryVariables,
    ICoinsProps<TChildProps>
  >(CoinsDocument, {
    alias: "withCoins",
    ...operationOptions,
  });
}

export function useCoinsQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<ICoinsQueryVariables>,
) {
  return ReactApolloHooks.useQuery<ICoinsQuery, ICoinsQueryVariables>(
    CoinsDocument,
    baseOptions,
  );
}
export type CoinsQueryHookResult = ReturnType<typeof useCoinsQuery>;
export const DailyPercentChangeDocument = gql`
  query dailyPercentChange($crypto: String!, $fiat: String!) {
    dailyPercentChange(crypto: $crypto, fiat: $fiat)
  }
`;
export type DailyPercentChangeComponentProps = Omit<
  ReactApollo.QueryProps<
    IDailyPercentChangeQuery,
    IDailyPercentChangeQueryVariables
  >,
  "query"
> &
  (
    | { variables: IDailyPercentChangeQueryVariables; skip?: false }
    | { skip: true });

export const DailyPercentChangeComponent = (
  props: DailyPercentChangeComponentProps,
) => (
  <ReactApollo.Query<
    IDailyPercentChangeQuery,
    IDailyPercentChangeQueryVariables
  >
    query={DailyPercentChangeDocument}
    {...props}
  />
);

export type IDailyPercentChangeProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<
    IDailyPercentChangeQuery,
    IDailyPercentChangeQueryVariables
  >
> &
  TChildProps;
export function withDailyPercentChange<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IDailyPercentChangeQuery,
    IDailyPercentChangeQueryVariables,
    IDailyPercentChangeProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IDailyPercentChangeQuery,
    IDailyPercentChangeQueryVariables,
    IDailyPercentChangeProps<TChildProps>
  >(DailyPercentChangeDocument, {
    alias: "withDailyPercentChange",
    ...operationOptions,
  });
}

export function useDailyPercentChangeQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    IDailyPercentChangeQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    IDailyPercentChangeQuery,
    IDailyPercentChangeQueryVariables
  >(DailyPercentChangeDocument, baseOptions);
}
export type DailyPercentChangeQueryHookResult = ReturnType<
  typeof useDailyPercentChangeQuery
>;
export const DistributionCommunityPoolDocument = gql`
  query distributionCommunityPool($network: String!) {
    distributionCommunityPool(network: $network) {
      denom
      amount
    }
  }
`;
export type DistributionCommunityPoolComponentProps = Omit<
  ReactApollo.QueryProps<
    IDistributionCommunityPoolQuery,
    IDistributionCommunityPoolQueryVariables
  >,
  "query"
> &
  (
    | { variables: IDistributionCommunityPoolQueryVariables; skip?: false }
    | { skip: true });

export const DistributionCommunityPoolComponent = (
  props: DistributionCommunityPoolComponentProps,
) => (
  <ReactApollo.Query<
    IDistributionCommunityPoolQuery,
    IDistributionCommunityPoolQueryVariables
  >
    query={DistributionCommunityPoolDocument}
    {...props}
  />
);

export type IDistributionCommunityPoolProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<
    IDistributionCommunityPoolQuery,
    IDistributionCommunityPoolQueryVariables
  >
> &
  TChildProps;
export function withDistributionCommunityPool<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IDistributionCommunityPoolQuery,
    IDistributionCommunityPoolQueryVariables,
    IDistributionCommunityPoolProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IDistributionCommunityPoolQuery,
    IDistributionCommunityPoolQueryVariables,
    IDistributionCommunityPoolProps<TChildProps>
  >(DistributionCommunityPoolDocument, {
    alias: "withDistributionCommunityPool",
    ...operationOptions,
  });
}

export function useDistributionCommunityPoolQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    IDistributionCommunityPoolQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    IDistributionCommunityPoolQuery,
    IDistributionCommunityPoolQueryVariables
  >(DistributionCommunityPoolDocument, baseOptions);
}
export type DistributionCommunityPoolQueryHookResult = ReturnType<
  typeof useDistributionCommunityPoolQuery
>;
export const DistributionParametersDocument = gql`
  query distributionParameters($network: String!) {
    distributionParameters(network: $network) {
      base_proposer_reward
      bonus_proposer_reward
      community_tax
    }
  }
`;
export type DistributionParametersComponentProps = Omit<
  ReactApollo.QueryProps<
    IDistributionParametersQuery,
    IDistributionParametersQueryVariables
  >,
  "query"
> &
  (
    | { variables: IDistributionParametersQueryVariables; skip?: false }
    | { skip: true });

export const DistributionParametersComponent = (
  props: DistributionParametersComponentProps,
) => (
  <ReactApollo.Query<
    IDistributionParametersQuery,
    IDistributionParametersQueryVariables
  >
    query={DistributionParametersDocument}
    {...props}
  />
);

export type IDistributionParametersProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<
    IDistributionParametersQuery,
    IDistributionParametersQueryVariables
  >
> &
  TChildProps;
export function withDistributionParameters<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IDistributionParametersQuery,
    IDistributionParametersQueryVariables,
    IDistributionParametersProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IDistributionParametersQuery,
    IDistributionParametersQueryVariables,
    IDistributionParametersProps<TChildProps>
  >(DistributionParametersDocument, {
    alias: "withDistributionParameters",
    ...operationOptions,
  });
}

export function useDistributionParametersQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    IDistributionParametersQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    IDistributionParametersQuery,
    IDistributionParametersQueryVariables
  >(DistributionParametersDocument, baseOptions);
}
export type DistributionParametersQueryHookResult = ReturnType<
  typeof useDistributionParametersQuery
>;
export const FiatCurrenciesDocument = gql`
  query fiatCurrencies {
    fiatCurrencies {
      name
      symbol
    }
  }
`;
export type FiatCurrenciesComponentProps = Omit<
  ReactApollo.QueryProps<IFiatCurrenciesQuery, IFiatCurrenciesQueryVariables>,
  "query"
>;

export const FiatCurrenciesComponent = (
  props: FiatCurrenciesComponentProps,
) => (
  <ReactApollo.Query<IFiatCurrenciesQuery, IFiatCurrenciesQueryVariables>
    query={FiatCurrenciesDocument}
    {...props}
  />
);

export type IFiatCurrenciesProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<IFiatCurrenciesQuery, IFiatCurrenciesQueryVariables>
> &
  TChildProps;
export function withFiatCurrencies<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IFiatCurrenciesQuery,
    IFiatCurrenciesQueryVariables,
    IFiatCurrenciesProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IFiatCurrenciesQuery,
    IFiatCurrenciesQueryVariables,
    IFiatCurrenciesProps<TChildProps>
  >(FiatCurrenciesDocument, {
    alias: "withFiatCurrencies",
    ...operationOptions,
  });
}

export function useFiatCurrenciesQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    IFiatCurrenciesQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    IFiatCurrenciesQuery,
    IFiatCurrenciesQueryVariables
  >(FiatCurrenciesDocument, baseOptions);
}
export type FiatCurrenciesQueryHookResult = ReturnType<
  typeof useFiatCurrenciesQuery
>;
export const FiatPriceHistoryDocument = gql`
  query fiatPriceHistory($fiat: String!, $network: String!) {
    fiatPriceHistory(fiat: $fiat, network: $network) {
      price
      timestamp
    }
  }
`;
export type FiatPriceHistoryComponentProps = Omit<
  ReactApollo.QueryProps<
    IFiatPriceHistoryQuery,
    IFiatPriceHistoryQueryVariables
  >,
  "query"
> &
  (
    | { variables: IFiatPriceHistoryQueryVariables; skip?: false }
    | { skip: true });

export const FiatPriceHistoryComponent = (
  props: FiatPriceHistoryComponentProps,
) => (
  <ReactApollo.Query<IFiatPriceHistoryQuery, IFiatPriceHistoryQueryVariables>
    query={FiatPriceHistoryDocument}
    {...props}
  />
);

export type IFiatPriceHistoryProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<IFiatPriceHistoryQuery, IFiatPriceHistoryQueryVariables>
> &
  TChildProps;
export function withFiatPriceHistory<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IFiatPriceHistoryQuery,
    IFiatPriceHistoryQueryVariables,
    IFiatPriceHistoryProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IFiatPriceHistoryQuery,
    IFiatPriceHistoryQueryVariables,
    IFiatPriceHistoryProps<TChildProps>
  >(FiatPriceHistoryDocument, {
    alias: "withFiatPriceHistory",
    ...operationOptions,
  });
}

export function useFiatPriceHistoryQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    IFiatPriceHistoryQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    IFiatPriceHistoryQuery,
    IFiatPriceHistoryQueryVariables
  >(FiatPriceHistoryDocument, baseOptions);
}
export type FiatPriceHistoryQueryHookResult = ReturnType<
  typeof useFiatPriceHistoryQuery
>;
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
export type GovernanceParametersDepositComponentProps = Omit<
  ReactApollo.QueryProps<
    IGovernanceParametersDepositQuery,
    IGovernanceParametersDepositQueryVariables
  >,
  "query"
> &
  (
    | { variables: IGovernanceParametersDepositQueryVariables; skip?: false }
    | { skip: true });

export const GovernanceParametersDepositComponent = (
  props: GovernanceParametersDepositComponentProps,
) => (
  <ReactApollo.Query<
    IGovernanceParametersDepositQuery,
    IGovernanceParametersDepositQueryVariables
  >
    query={GovernanceParametersDepositDocument}
    {...props}
  />
);

export type IGovernanceParametersDepositProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<
    IGovernanceParametersDepositQuery,
    IGovernanceParametersDepositQueryVariables
  >
> &
  TChildProps;
export function withGovernanceParametersDeposit<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IGovernanceParametersDepositQuery,
    IGovernanceParametersDepositQueryVariables,
    IGovernanceParametersDepositProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IGovernanceParametersDepositQuery,
    IGovernanceParametersDepositQueryVariables,
    IGovernanceParametersDepositProps<TChildProps>
  >(GovernanceParametersDepositDocument, {
    alias: "withGovernanceParametersDeposit",
    ...operationOptions,
  });
}

export function useGovernanceParametersDepositQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    IGovernanceParametersDepositQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    IGovernanceParametersDepositQuery,
    IGovernanceParametersDepositQueryVariables
  >(GovernanceParametersDepositDocument, baseOptions);
}
export type GovernanceParametersDepositQueryHookResult = ReturnType<
  typeof useGovernanceParametersDepositQuery
>;
export const GovernanceParametersTallyingDocument = gql`
  query governanceParametersTallying($network: String!) {
    governanceParametersTallying(network: $network) {
      threshold
      veto
      governance_penalty
    }
  }
`;
export type GovernanceParametersTallyingComponentProps = Omit<
  ReactApollo.QueryProps<
    IGovernanceParametersTallyingQuery,
    IGovernanceParametersTallyingQueryVariables
  >,
  "query"
> &
  (
    | { variables: IGovernanceParametersTallyingQueryVariables; skip?: false }
    | { skip: true });

export const GovernanceParametersTallyingComponent = (
  props: GovernanceParametersTallyingComponentProps,
) => (
  <ReactApollo.Query<
    IGovernanceParametersTallyingQuery,
    IGovernanceParametersTallyingQueryVariables
  >
    query={GovernanceParametersTallyingDocument}
    {...props}
  />
);

export type IGovernanceParametersTallyingProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<
    IGovernanceParametersTallyingQuery,
    IGovernanceParametersTallyingQueryVariables
  >
> &
  TChildProps;
export function withGovernanceParametersTallying<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IGovernanceParametersTallyingQuery,
    IGovernanceParametersTallyingQueryVariables,
    IGovernanceParametersTallyingProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IGovernanceParametersTallyingQuery,
    IGovernanceParametersTallyingQueryVariables,
    IGovernanceParametersTallyingProps<TChildProps>
  >(GovernanceParametersTallyingDocument, {
    alias: "withGovernanceParametersTallying",
    ...operationOptions,
  });
}

export function useGovernanceParametersTallyingQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    IGovernanceParametersTallyingQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    IGovernanceParametersTallyingQuery,
    IGovernanceParametersTallyingQueryVariables
  >(GovernanceParametersTallyingDocument, baseOptions);
}
export type GovernanceParametersTallyingQueryHookResult = ReturnType<
  typeof useGovernanceParametersTallyingQuery
>;
export const GovernanceParametersVotingDocument = gql`
  query governanceParametersVoting($network: String!) {
    governanceParametersVoting(network: $network) {
      voting_period
    }
  }
`;
export type GovernanceParametersVotingComponentProps = Omit<
  ReactApollo.QueryProps<
    IGovernanceParametersVotingQuery,
    IGovernanceParametersVotingQueryVariables
  >,
  "query"
> &
  (
    | { variables: IGovernanceParametersVotingQueryVariables; skip?: false }
    | { skip: true });

export const GovernanceParametersVotingComponent = (
  props: GovernanceParametersVotingComponentProps,
) => (
  <ReactApollo.Query<
    IGovernanceParametersVotingQuery,
    IGovernanceParametersVotingQueryVariables
  >
    query={GovernanceParametersVotingDocument}
    {...props}
  />
);

export type IGovernanceParametersVotingProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<
    IGovernanceParametersVotingQuery,
    IGovernanceParametersVotingQueryVariables
  >
> &
  TChildProps;
export function withGovernanceParametersVoting<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IGovernanceParametersVotingQuery,
    IGovernanceParametersVotingQueryVariables,
    IGovernanceParametersVotingProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IGovernanceParametersVotingQuery,
    IGovernanceParametersVotingQueryVariables,
    IGovernanceParametersVotingProps<TChildProps>
  >(GovernanceParametersVotingDocument, {
    alias: "withGovernanceParametersVoting",
    ...operationOptions,
  });
}

export function useGovernanceParametersVotingQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    IGovernanceParametersVotingQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    IGovernanceParametersVotingQuery,
    IGovernanceParametersVotingQueryVariables
  >(GovernanceParametersVotingDocument, baseOptions);
}
export type GovernanceParametersVotingQueryHookResult = ReturnType<
  typeof useGovernanceParametersVotingQuery
>;
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
export type GovernanceProposalsComponentProps = Omit<
  ReactApollo.QueryProps<
    IGovernanceProposalsQuery,
    IGovernanceProposalsQueryVariables
  >,
  "query"
> &
  (
    | { variables: IGovernanceProposalsQueryVariables; skip?: false }
    | { skip: true });

export const GovernanceProposalsComponent = (
  props: GovernanceProposalsComponentProps,
) => (
  <ReactApollo.Query<
    IGovernanceProposalsQuery,
    IGovernanceProposalsQueryVariables
  >
    query={GovernanceProposalsDocument}
    {...props}
  />
);

export type IGovernanceProposalsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<
    IGovernanceProposalsQuery,
    IGovernanceProposalsQueryVariables
  >
> &
  TChildProps;
export function withGovernanceProposals<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IGovernanceProposalsQuery,
    IGovernanceProposalsQueryVariables,
    IGovernanceProposalsProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IGovernanceProposalsQuery,
    IGovernanceProposalsQueryVariables,
    IGovernanceProposalsProps<TChildProps>
  >(GovernanceProposalsDocument, {
    alias: "withGovernanceProposals",
    ...operationOptions,
  });
}

export function useGovernanceProposalsQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    IGovernanceProposalsQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    IGovernanceProposalsQuery,
    IGovernanceProposalsQueryVariables
  >(GovernanceProposalsDocument, baseOptions);
}
export type GovernanceProposalsQueryHookResult = ReturnType<
  typeof useGovernanceProposalsQuery
>;
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
export type LatestBlockComponentProps = Omit<
  ReactApollo.QueryProps<ILatestBlockQuery, ILatestBlockQueryVariables>,
  "query"
> &
  ({ variables: ILatestBlockQueryVariables; skip?: false } | { skip: true });

export const LatestBlockComponent = (props: LatestBlockComponentProps) => (
  <ReactApollo.Query<ILatestBlockQuery, ILatestBlockQueryVariables>
    query={LatestBlockDocument}
    {...props}
  />
);

export type ILatestBlockProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<ILatestBlockQuery, ILatestBlockQueryVariables>
> &
  TChildProps;
export function withLatestBlock<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    ILatestBlockQuery,
    ILatestBlockQueryVariables,
    ILatestBlockProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    ILatestBlockQuery,
    ILatestBlockQueryVariables,
    ILatestBlockProps<TChildProps>
  >(LatestBlockDocument, {
    alias: "withLatestBlock",
    ...operationOptions,
  });
}

export function useLatestBlockQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<ILatestBlockQueryVariables>,
) {
  return ReactApolloHooks.useQuery<
    ILatestBlockQuery,
    ILatestBlockQueryVariables
  >(LatestBlockDocument, baseOptions);
}
export type LatestBlockQueryHookResult = ReturnType<typeof useLatestBlockQuery>;
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
export type PortfolioHistoryComponentProps = Omit<
  ReactApollo.QueryProps<
    IPortfolioHistoryQuery,
    IPortfolioHistoryQueryVariables
  >,
  "query"
> &
  (
    | { variables: IPortfolioHistoryQueryVariables; skip?: false }
    | { skip: true });

export const PortfolioHistoryComponent = (
  props: PortfolioHistoryComponentProps,
) => (
  <ReactApollo.Query<IPortfolioHistoryQuery, IPortfolioHistoryQueryVariables>
    query={PortfolioHistoryDocument}
    {...props}
  />
);

export type IPortfolioHistoryProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<IPortfolioHistoryQuery, IPortfolioHistoryQueryVariables>
> &
  TChildProps;
export function withPortfolioHistory<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IPortfolioHistoryQuery,
    IPortfolioHistoryQueryVariables,
    IPortfolioHistoryProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IPortfolioHistoryQuery,
    IPortfolioHistoryQueryVariables,
    IPortfolioHistoryProps<TChildProps>
  >(PortfolioHistoryDocument, {
    alias: "withPortfolioHistory",
    ...operationOptions,
  });
}

export function usePortfolioHistoryQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    IPortfolioHistoryQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    IPortfolioHistoryQuery,
    IPortfolioHistoryQueryVariables
  >(PortfolioHistoryDocument, baseOptions);
}
export type PortfolioHistoryQueryHookResult = ReturnType<
  typeof usePortfolioHistoryQuery
>;
export const PricesDocument = gql`
  query prices($currency: String!, $versus: String!) {
    prices(currency: $currency, versus: $versus) {
      price
    }
  }
`;
export type PricesComponentProps = Omit<
  ReactApollo.QueryProps<IPricesQuery, IPricesQueryVariables>,
  "query"
> &
  ({ variables: IPricesQueryVariables; skip?: false } | { skip: true });

export const PricesComponent = (props: PricesComponentProps) => (
  <ReactApollo.Query<IPricesQuery, IPricesQueryVariables>
    query={PricesDocument}
    {...props}
  />
);

export type IPricesProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<IPricesQuery, IPricesQueryVariables>
> &
  TChildProps;
export function withPrices<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IPricesQuery,
    IPricesQueryVariables,
    IPricesProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IPricesQuery,
    IPricesQueryVariables,
    IPricesProps<TChildProps>
  >(PricesDocument, {
    alias: "withPrices",
    ...operationOptions,
  });
}

export function usePricesQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<IPricesQueryVariables>,
) {
  return ReactApolloHooks.useQuery<IPricesQuery, IPricesQueryVariables>(
    PricesDocument,
    baseOptions,
  );
}
export type PricesQueryHookResult = ReturnType<typeof usePricesQuery>;
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
export type RewardsByValidatorComponentProps = Omit<
  ReactApollo.QueryProps<
    IRewardsByValidatorQuery,
    IRewardsByValidatorQueryVariables
  >,
  "query"
> &
  (
    | { variables: IRewardsByValidatorQueryVariables; skip?: false }
    | { skip: true });

export const RewardsByValidatorComponent = (
  props: RewardsByValidatorComponentProps,
) => (
  <ReactApollo.Query<
    IRewardsByValidatorQuery,
    IRewardsByValidatorQueryVariables
  >
    query={RewardsByValidatorDocument}
    {...props}
  />
);

export type IRewardsByValidatorProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<
    IRewardsByValidatorQuery,
    IRewardsByValidatorQueryVariables
  >
> &
  TChildProps;
export function withRewardsByValidator<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IRewardsByValidatorQuery,
    IRewardsByValidatorQueryVariables,
    IRewardsByValidatorProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IRewardsByValidatorQuery,
    IRewardsByValidatorQueryVariables,
    IRewardsByValidatorProps<TChildProps>
  >(RewardsByValidatorDocument, {
    alias: "withRewardsByValidator",
    ...operationOptions,
  });
}

export function useRewardsByValidatorQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    IRewardsByValidatorQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    IRewardsByValidatorQuery,
    IRewardsByValidatorQueryVariables
  >(RewardsByValidatorDocument, baseOptions);
}
export type RewardsByValidatorQueryHookResult = ReturnType<
  typeof useRewardsByValidatorQuery
>;
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
export type SlashingParametersComponentProps = Omit<
  ReactApollo.QueryProps<
    ISlashingParametersQuery,
    ISlashingParametersQueryVariables
  >,
  "query"
> &
  (
    | { variables: ISlashingParametersQueryVariables; skip?: false }
    | { skip: true });

export const SlashingParametersComponent = (
  props: SlashingParametersComponentProps,
) => (
  <ReactApollo.Query<
    ISlashingParametersQuery,
    ISlashingParametersQueryVariables
  >
    query={SlashingParametersDocument}
    {...props}
  />
);

export type ISlashingParametersProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<
    ISlashingParametersQuery,
    ISlashingParametersQueryVariables
  >
> &
  TChildProps;
export function withSlashingParameters<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    ISlashingParametersQuery,
    ISlashingParametersQueryVariables,
    ISlashingParametersProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    ISlashingParametersQuery,
    ISlashingParametersQueryVariables,
    ISlashingParametersProps<TChildProps>
  >(SlashingParametersDocument, {
    alias: "withSlashingParameters",
    ...operationOptions,
  });
}

export function useSlashingParametersQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    ISlashingParametersQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    ISlashingParametersQuery,
    ISlashingParametersQueryVariables
  >(SlashingParametersDocument, baseOptions);
}
export type SlashingParametersQueryHookResult = ReturnType<
  typeof useSlashingParametersQuery
>;
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
export type StakingParametersComponentProps = Omit<
  ReactApollo.QueryProps<
    IStakingParametersQuery,
    IStakingParametersQueryVariables
  >,
  "query"
> &
  (
    | { variables: IStakingParametersQueryVariables; skip?: false }
    | { skip: true });

export const StakingParametersComponent = (
  props: StakingParametersComponentProps,
) => (
  <ReactApollo.Query<IStakingParametersQuery, IStakingParametersQueryVariables>
    query={StakingParametersDocument}
    {...props}
  />
);

export type IStakingParametersProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<
    IStakingParametersQuery,
    IStakingParametersQueryVariables
  >
> &
  TChildProps;
export function withStakingParameters<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IStakingParametersQuery,
    IStakingParametersQueryVariables,
    IStakingParametersProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IStakingParametersQuery,
    IStakingParametersQueryVariables,
    IStakingParametersProps<TChildProps>
  >(StakingParametersDocument, {
    alias: "withStakingParameters",
    ...operationOptions,
  });
}

export function useStakingParametersQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    IStakingParametersQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    IStakingParametersQuery,
    IStakingParametersQueryVariables
  >(StakingParametersDocument, baseOptions);
}
export type StakingParametersQueryHookResult = ReturnType<
  typeof useStakingParametersQuery
>;
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
export type StakingPoolComponentProps = Omit<
  ReactApollo.QueryProps<IStakingPoolQuery, IStakingPoolQueryVariables>,
  "query"
> &
  ({ variables: IStakingPoolQueryVariables; skip?: false } | { skip: true });

export const StakingPoolComponent = (props: StakingPoolComponentProps) => (
  <ReactApollo.Query<IStakingPoolQuery, IStakingPoolQueryVariables>
    query={StakingPoolDocument}
    {...props}
  />
);

export type IStakingPoolProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<IStakingPoolQuery, IStakingPoolQueryVariables>
> &
  TChildProps;
export function withStakingPool<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IStakingPoolQuery,
    IStakingPoolQueryVariables,
    IStakingPoolProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IStakingPoolQuery,
    IStakingPoolQueryVariables,
    IStakingPoolProps<TChildProps>
  >(StakingPoolDocument, {
    alias: "withStakingPool",
    ...operationOptions,
  });
}

export function useStakingPoolQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<IStakingPoolQueryVariables>,
) {
  return ReactApolloHooks.useQuery<
    IStakingPoolQuery,
    IStakingPoolQueryVariables
  >(StakingPoolDocument, baseOptions);
}
export type StakingPoolQueryHookResult = ReturnType<typeof useStakingPoolQuery>;
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
export type TransactionComponentProps = Omit<
  ReactApollo.QueryProps<ITransactionQuery, ITransactionQueryVariables>,
  "query"
> &
  ({ variables: ITransactionQueryVariables; skip?: false } | { skip: true });

export const TransactionComponent = (props: TransactionComponentProps) => (
  <ReactApollo.Query<ITransactionQuery, ITransactionQueryVariables>
    query={TransactionDocument}
    {...props}
  />
);

export type ITransactionProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<ITransactionQuery, ITransactionQueryVariables>
> &
  TChildProps;
export function withTransaction<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    ITransactionQuery,
    ITransactionQueryVariables,
    ITransactionProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    ITransactionQuery,
    ITransactionQueryVariables,
    ITransactionProps<TChildProps>
  >(TransactionDocument, {
    alias: "withTransaction",
    ...operationOptions,
  });
}

export function useTransactionQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<ITransactionQueryVariables>,
) {
  return ReactApolloHooks.useQuery<
    ITransactionQuery,
    ITransactionQueryVariables
  >(TransactionDocument, baseOptions);
}
export type TransactionQueryHookResult = ReturnType<typeof useTransactionQuery>;
export const TransactionsDocument = gql`
  query transactions($address: String!) {
    transactions(address: $address) {
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
export type TransactionsComponentProps = Omit<
  ReactApollo.QueryProps<ITransactionsQuery, ITransactionsQueryVariables>,
  "query"
> &
  ({ variables: ITransactionsQueryVariables; skip?: false } | { skip: true });

export const TransactionsComponent = (props: TransactionsComponentProps) => (
  <ReactApollo.Query<ITransactionsQuery, ITransactionsQueryVariables>
    query={TransactionsDocument}
    {...props}
  />
);

export type ITransactionsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<ITransactionsQuery, ITransactionsQueryVariables>
> &
  TChildProps;
export function withTransactions<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    ITransactionsQuery,
    ITransactionsQueryVariables,
    ITransactionsProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    ITransactionsQuery,
    ITransactionsQueryVariables,
    ITransactionsProps<TChildProps>
  >(TransactionsDocument, {
    alias: "withTransactions",
    ...operationOptions,
  });
}

export function useTransactionsQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<ITransactionsQueryVariables>,
) {
  return ReactApolloHooks.useQuery<
    ITransactionsQuery,
    ITransactionsQueryVariables
  >(TransactionsDocument, baseOptions);
}
export type TransactionsQueryHookResult = ReturnType<
  typeof useTransactionsQuery
>;
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
export type ValidatorDistributionComponentProps = Omit<
  ReactApollo.QueryProps<
    IValidatorDistributionQuery,
    IValidatorDistributionQueryVariables
  >,
  "query"
> &
  (
    | { variables: IValidatorDistributionQueryVariables; skip?: false }
    | { skip: true });

export const ValidatorDistributionComponent = (
  props: ValidatorDistributionComponentProps,
) => (
  <ReactApollo.Query<
    IValidatorDistributionQuery,
    IValidatorDistributionQueryVariables
  >
    query={ValidatorDistributionDocument}
    {...props}
  />
);

export type IValidatorDistributionProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<
    IValidatorDistributionQuery,
    IValidatorDistributionQueryVariables
  >
> &
  TChildProps;
export function withValidatorDistribution<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IValidatorDistributionQuery,
    IValidatorDistributionQueryVariables,
    IValidatorDistributionProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IValidatorDistributionQuery,
    IValidatorDistributionQueryVariables,
    IValidatorDistributionProps<TChildProps>
  >(ValidatorDistributionDocument, {
    alias: "withValidatorDistribution",
    ...operationOptions,
  });
}

export function useValidatorDistributionQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    IValidatorDistributionQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    IValidatorDistributionQuery,
    IValidatorDistributionQueryVariables
  >(ValidatorDistributionDocument, baseOptions);
}
export type ValidatorDistributionQueryHookResult = ReturnType<
  typeof useValidatorDistributionQuery
>;
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
export type ValidatorsComponentProps = Omit<
  ReactApollo.QueryProps<IValidatorsQuery, IValidatorsQueryVariables>,
  "query"
> &
  ({ variables: IValidatorsQueryVariables; skip?: false } | { skip: true });

export const ValidatorsComponent = (props: ValidatorsComponentProps) => (
  <ReactApollo.Query<IValidatorsQuery, IValidatorsQueryVariables>
    query={ValidatorsDocument}
    {...props}
  />
);

export type IValidatorsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<IValidatorsQuery, IValidatorsQueryVariables>
> &
  TChildProps;
export function withValidators<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IValidatorsQuery,
    IValidatorsQueryVariables,
    IValidatorsProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IValidatorsQuery,
    IValidatorsQueryVariables,
    IValidatorsProps<TChildProps>
  >(ValidatorsDocument, {
    alias: "withValidators",
    ...operationOptions,
  });
}

export function useValidatorsQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<IValidatorsQueryVariables>,
) {
  return ReactApolloHooks.useQuery<IValidatorsQuery, IValidatorsQueryVariables>(
    ValidatorsDocument,
    baseOptions,
  );
}
export type ValidatorsQueryHookResult = ReturnType<typeof useValidatorsQuery>;
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
export type ValidatorSetsComponentProps = Omit<
  ReactApollo.QueryProps<IValidatorSetsQuery, IValidatorSetsQueryVariables>,
  "query"
> &
  ({ variables: IValidatorSetsQueryVariables; skip?: false } | { skip: true });

export const ValidatorSetsComponent = (props: ValidatorSetsComponentProps) => (
  <ReactApollo.Query<IValidatorSetsQuery, IValidatorSetsQueryVariables>
    query={ValidatorSetsDocument}
    {...props}
  />
);

export type IValidatorSetsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<IValidatorSetsQuery, IValidatorSetsQueryVariables>
> &
  TChildProps;
export function withValidatorSets<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IValidatorSetsQuery,
    IValidatorSetsQueryVariables,
    IValidatorSetsProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IValidatorSetsQuery,
    IValidatorSetsQueryVariables,
    IValidatorSetsProps<TChildProps>
  >(ValidatorSetsDocument, {
    alias: "withValidatorSets",
    ...operationOptions,
  });
}

export function useValidatorSetsQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<IValidatorSetsQueryVariables>,
) {
  return ReactApolloHooks.useQuery<
    IValidatorSetsQuery,
    IValidatorSetsQueryVariables
  >(ValidatorSetsDocument, baseOptions);
}
export type ValidatorSetsQueryHookResult = ReturnType<
  typeof useValidatorSetsQuery
>;
