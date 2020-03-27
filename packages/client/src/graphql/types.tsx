import * as ApolloReactCommon from "@apollo/react-common";
import * as ApolloReactComponents from "@apollo/react-components";
import * as ApolloReactHoc from "@apollo/react-hoc";
import * as ApolloReactHooks from "@apollo/react-hooks";
import gql from "graphql-tag";
import * as React from "react";
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
  readonly __typename?: "Account";
  readonly account_number: Scalars["String"];
  readonly address: Scalars["String"];
  readonly coins: Maybe<ReadonlyArray<IAccountCoin>>;
  readonly public_key: Maybe<IPubKey>;
  readonly sequence: Scalars["String"];
}

export interface IAccountBalances {
  readonly __typename?: "AccountBalances";
  readonly balance: Maybe<ReadonlyArray<IBalance>>;
  readonly rewards: Maybe<ReadonlyArray<IBalance>>;
  readonly delegations: Maybe<ReadonlyArray<IDelegation>>;
  readonly unbonding: Maybe<ReadonlyArray<IUnbondingDelegation>>;
  readonly commissions: Maybe<ReadonlyArray<IBalance>>;
}

export interface IAccountCoin {
  readonly __typename?: "AccountCoin";
  readonly denom: Scalars["String"];
  readonly amount: Scalars["String"];
}

export interface IAccountInformation {
  readonly __typename?: "AccountInformation";
  readonly type: Scalars["String"];
  readonly value: IAccount;
}

export interface IAvailableReward {
  readonly __typename?: "AvailableReward";
  readonly reward: Maybe<ReadonlyArray<IBalance>>;
  readonly validator_address: Scalars["String"];
}

export interface IBalance {
  readonly __typename?: "Balance";
  readonly denom: Scalars["String"];
  readonly amount: Scalars["String"];
}

export interface IBlock {
  readonly __typename?: "Block";
  readonly header: IBlockHeader;
}

export interface IBlockData {
  readonly __typename?: "BlockData";
  readonly block: IBlock;
}

export interface IBlockHeader {
  readonly __typename?: "BlockHeader";
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
  readonly __typename?: "Coin";
  readonly id: Scalars["String"];
  readonly symbol: Scalars["String"];
  readonly name: Scalars["String"];
}

export interface ICommissionRates {
  readonly __typename?: "CommissionRates";
  readonly rate: Scalars["String"];
  readonly max_rate: Scalars["String"];
  readonly max_change_rate: Scalars["String"];
}

export interface IDelegation {
  readonly __typename?: "Delegation";
  readonly delegator_address: Scalars["String"];
  readonly validator_address: Scalars["String"];
  readonly shares: Scalars["String"];
}

export interface IDistributionParameters {
  readonly __typename?: "DistributionParameters";
  readonly base_proposer_reward: Scalars["String"];
  readonly bonus_proposer_reward: Scalars["String"];
  readonly community_tax: Scalars["String"];
}

export interface IFiatCurrency {
  readonly __typename?: "FiatCurrency";
  readonly name: Scalars["String"];
  readonly symbol: Scalars["String"];
}

export interface IFiatPrice {
  readonly __typename?: "FiatPrice";
  readonly price: Scalars["Float"];
  readonly timestamp: Scalars["String"];
}

export interface IGovernanceParametersDeposit {
  readonly __typename?: "GovernanceParametersDeposit";
  readonly min_deposit: Maybe<ReadonlyArray<IBalance>>;
  readonly max_deposit_period: Scalars["String"];
}

export interface IGovernanceParametersTallying {
  readonly __typename?: "GovernanceParametersTallying";
  readonly threshold: Scalars["String"];
  readonly veto: Scalars["String"];
  readonly governance_penalty: Maybe<Scalars["String"]>;
}

export interface IGovernanceParametersVoting {
  readonly __typename?: "GovernanceParametersVoting";
  readonly voting_period: Scalars["String"];
}

export interface IGovernanceProposal {
  readonly __typename?: "GovernanceProposal";
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
  readonly __typename?: "LogMessage";
  readonly code: Maybe<Scalars["Int"]>;
  readonly message: Maybe<Scalars["String"]>;
  readonly success: Maybe<Scalars["Boolean"]>;
  readonly log: Maybe<Scalars["String"]>;
  readonly msg_index: Maybe<Scalars["String"]>;
}

export interface IMsgBeginRedelegate {
  readonly __typename?: "MsgBeginRedelegate";
  readonly amount: IBalance;
  readonly delegator_address: Maybe<Scalars["String"]>;
  readonly validator_src_address: Scalars["String"];
  readonly validator_dst_address: Scalars["String"];
}

export interface IMsgBeginRedelegateLegacy {
  readonly __typename?: "MsgBeginRedelegateLegacy";
  readonly shares_amount: Scalars["String"];
  readonly delegator_address: Maybe<Scalars["String"]>;
  readonly validator_src_address: Scalars["String"];
  readonly validator_dst_address: Scalars["String"];
}

export interface IMsgDelegate {
  readonly __typename?: "MsgDelegate";
  readonly amount: IBalance;
  readonly delegator_address: Maybe<Scalars["String"]>;
  readonly validator_address: Maybe<Scalars["String"]>;
}

export interface IMsgModifyWithdrawAddress {
  readonly __typename?: "MsgModifyWithdrawAddress";
  readonly withdraw_address: Maybe<Scalars["String"]>;
  readonly validator_address: Maybe<Scalars["String"]>;
}

export interface IMsgSend {
  readonly __typename?: "MsgSend";
  readonly amounts: Maybe<ReadonlyArray<IBalance>>;
  readonly to_address: Maybe<Scalars["String"]>;
  readonly from_address: Maybe<Scalars["String"]>;
}

export interface IMsgSubmitProposal {
  readonly __typename?: "MsgSubmitProposal";
  readonly title: Scalars["String"];
  readonly description: Scalars["String"];
  readonly proposal_type: Scalars["String"];
  readonly proposer: Scalars["String"];
  readonly initial_deposit: Maybe<ReadonlyArray<IBalance>>;
}

export interface IMsgVote {
  readonly __typename?: "MsgVote";
  readonly proposal_id: Scalars["String"];
  readonly voter: Scalars["String"];
  readonly option: Scalars["String"];
}

export interface IMsgWithdrawDelegationReward {
  readonly __typename?: "MsgWithdrawDelegationReward";
  readonly delegator_address: Maybe<Scalars["String"]>;
  readonly validator_address: Maybe<Scalars["String"]>;
}

export interface IMsgWithdrawValidatorCommission {
  readonly __typename?: "MsgWithdrawValidatorCommission";
  readonly validator_address: Maybe<Scalars["String"]>;
}

export interface IPortfolioBalance {
  readonly __typename?: "PortfolioBalance";
  readonly address: Scalars["String"];
  readonly denom: Scalars["String"];
  readonly balance: Scalars["String"];
  readonly height: Scalars["Int"];
  readonly timestamp: Scalars["String"];
  readonly chain: Scalars["String"];
}

export interface IPortfolioCommission {
  readonly __typename?: "PortfolioCommission";
  readonly balance: Scalars["String"];
  readonly height: Scalars["Int"];
  readonly validator: Scalars["String"];
  readonly timestamp: Scalars["String"];
}

export interface IPortfolioData {
  readonly __typename?: "PortfolioData";
  readonly balanceHistory: ReadonlyArray<IPortfolioBalance>;
  readonly delegations: ReadonlyArray<IPortfolioDelegation>;
  readonly unbondings: ReadonlyArray<IPortfolioDelegation>;
  readonly delegatorRewards: ReadonlyArray<IPortfolioReward>;
  readonly validatorCommissions: ReadonlyArray<IPortfolioCommission>;
  readonly fiatPriceHistory: ReadonlyArray<IFiatPrice>;
}

export interface IPortfolioDelegation {
  readonly __typename?: "PortfolioDelegation";
  readonly balance: Scalars["String"];
  readonly address: Scalars["String"];
  readonly timestamp: Scalars["String"];
}

export interface IPortfolioReward {
  readonly __typename?: "PortfolioReward";
  readonly balance: Scalars["String"];
  readonly height: Scalars["Int"];
  readonly address: Scalars["String"];
  readonly timestamp: Scalars["String"];
}

export interface IPrice {
  readonly __typename?: "Price";
  readonly price: Scalars["Float"];
}

export interface IPubKey {
  readonly __typename?: "PubKey";
  readonly type: Scalars["String"];
}

export interface IQuery {
  readonly __typename?: "Query";
  /** Cosmos APIs */
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
  /** CoinGecko Price APIs */
  readonly prices: IPrice;
  readonly coins: Maybe<ReadonlyArray<ICoin>>;
  readonly fiatCurrencies: ReadonlyArray<IFiatCurrency>;
  readonly oasis: Scalars["String"];
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
  readonly __typename?: "SlashingParameters";
  readonly max_evidence_age: Scalars["String"];
  readonly signed_blocks_window: Scalars["String"];
  readonly min_signed_per_window: Scalars["String"];
  readonly double_sign_unbond_duration: Maybe<Scalars["String"]>;
  readonly downtime_unbond_duration: Maybe<Scalars["String"]>;
  readonly slash_fraction_double_sign: Scalars["String"];
  readonly slash_fraction_downtime: Scalars["String"];
}

export interface IStakingParameters {
  readonly __typename?: "StakingParameters";
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
  readonly __typename?: "StakingPool";
  readonly loose_tokens: Maybe<Scalars["String"]>;
  readonly bonded_tokens: Maybe<Scalars["String"]>;
  readonly not_bonded_tokens: Maybe<Scalars["String"]>;
  readonly inflation_last_time: Maybe<Scalars["String"]>;
  readonly inflation: Maybe<Scalars["String"]>;
  readonly date_last_commission_reset: Maybe<Scalars["String"]>;
  readonly prev_bonded_shares: Maybe<Scalars["String"]>;
}

export interface ITag {
  readonly __typename?: "Tag";
  readonly key: Scalars["String"];
  readonly value: Maybe<Scalars["String"]>;
}

export interface ITallyResult {
  readonly __typename?: "TallyResult";
  readonly yes: Scalars["String"];
  readonly abstain: Scalars["String"];
  readonly no: Scalars["String"];
  readonly no_with_veto: Scalars["String"];
}

export interface ITransaction {
  readonly __typename?: "Transaction";
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
  readonly __typename?: "Tx";
  readonly type: Scalars["String"];
  readonly value: ITxValue;
}

export interface ITxFee {
  readonly __typename?: "TxFee";
  readonly amount: Maybe<ReadonlyArray<IBalance>>;
  readonly gas: Scalars["String"];
}

export interface ITxMsg {
  readonly __typename?: "TxMsg";
  readonly type: Scalars["String"];
  readonly value: Maybe<ITxMsgValue>;
}

/** Could collapse this into a single type with all optional fields: */
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
  readonly __typename?: "TxSignature";
  readonly pub_key: IPubKey;
  readonly signature: Scalars["String"];
}

export interface ITxValue {
  readonly __typename?: "TxValue";
  readonly fee: ITxFee;
  readonly memo: Scalars["String"];
  readonly msg: Maybe<ReadonlyArray<ITxMsg>>;
  readonly signatures: Maybe<ReadonlyArray<ITxSignature>>;
}

export interface IUnbondingDelegation {
  readonly __typename?: "UnbondingDelegation";
  readonly delegator_address: Scalars["String"];
  readonly validator_address: Scalars["String"];
  readonly entries: ReadonlyArray<IUnbondingDelegationEntry>;
}

export interface IUnbondingDelegationEntry {
  readonly __typename?: "UnbondingDelegationEntry";
  readonly balance: Scalars["String"];
  readonly initial_balance: Scalars["String"];
  readonly creation_height: Scalars["String"];
  readonly completion_time: Scalars["String"];
}

export interface IValidator {
  readonly __typename?: "Validator";
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
  readonly __typename?: "ValidatorCommission";
  readonly update_time: Scalars["String"];
  readonly commission_rates: ICommissionRates;
}

export interface IValidatorDescription {
  readonly __typename?: "ValidatorDescription";
  readonly moniker: Scalars["String"];
  readonly identity: Scalars["String"];
  readonly website: Scalars["String"];
  readonly details: Scalars["String"];
}

export interface IValidatorDistribution {
  readonly __typename?: "ValidatorDistribution";
  readonly operator_address: Scalars["String"];
  readonly self_bond_rewards: Maybe<ReadonlyArray<IBalance>>;
  readonly val_commission: Maybe<ReadonlyArray<IBalance>>;
}

export interface IValidatorSet {
  readonly __typename?: "ValidatorSet";
  readonly block_height: Scalars["Int"];
  readonly validators: Maybe<ReadonlyArray<IValidatorSetItem>>;
}

export interface IValidatorSetItem {
  readonly __typename?: "ValidatorSetItem";
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

export interface IOasisQueryVariables {}

export type IOasisQuery = { readonly __typename?: "Query" } & Pick<
  IQuery,
  "oasis"
>;

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
                | ({ readonly __typename?: "MsgModifyWithdrawAddress" } & Pick<
                    IMsgModifyWithdrawAddress,
                    "withdraw_address" | "validator_address"
                  >)
                | ({ readonly __typename?: "MsgBeginRedelegateLegacy" } & Pick<
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
                | ({ readonly __typename?: "MsgModifyWithdrawAddress" } & Pick<
                    IMsgModifyWithdrawAddress,
                    "withdraw_address" | "validator_address"
                  >)
                | ({ readonly __typename?: "MsgBeginRedelegateLegacy" } & Pick<
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
  ApolloReactComponents.QueryComponentOptions<
    IAccountBalancesQuery,
    IAccountBalancesQueryVariables
  >,
  "query"
> &
  (
    | { variables: IAccountBalancesQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const AccountBalancesComponent = (
  props: AccountBalancesComponentProps,
) => (
  <ApolloReactComponents.Query<
    IAccountBalancesQuery,
    IAccountBalancesQueryVariables
  >
    query={AccountBalancesDocument}
    {...props}
  />
);

export type IAccountBalancesProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  IAccountBalancesQuery,
  IAccountBalancesQueryVariables
> &
  TChildProps;
export function withAccountBalances<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    IAccountBalancesQuery,
    IAccountBalancesQueryVariables,
    IAccountBalancesProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    IAccountBalancesQuery,
    IAccountBalancesQueryVariables,
    IAccountBalancesProps<TChildProps>
  >(AccountBalancesDocument, {
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
export function useAccountBalancesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IAccountBalancesQuery,
    IAccountBalancesQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    IAccountBalancesQuery,
    IAccountBalancesQueryVariables
  >(AccountBalancesDocument, baseOptions);
}
export function useAccountBalancesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IAccountBalancesQuery,
    IAccountBalancesQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IAccountBalancesQuery,
    IAccountBalancesQueryVariables
  >(AccountBalancesDocument, baseOptions);
}
export type AccountBalancesQueryHookResult = ReturnType<
  typeof useAccountBalancesQuery
>;
export type AccountBalancesLazyQueryHookResult = ReturnType<
  typeof useAccountBalancesLazyQuery
>;
export type AccountBalancesQueryResult = ApolloReactCommon.QueryResult<
  IAccountBalancesQuery,
  IAccountBalancesQueryVariables
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
  ApolloReactComponents.QueryComponentOptions<
    IAccountInformationQuery,
    IAccountInformationQueryVariables
  >,
  "query"
> &
  (
    | { variables: IAccountInformationQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const AccountInformationComponent = (
  props: AccountInformationComponentProps,
) => (
  <ApolloReactComponents.Query<
    IAccountInformationQuery,
    IAccountInformationQueryVariables
  >
    query={AccountInformationDocument}
    {...props}
  />
);

export type IAccountInformationProps<
  TChildProps = {}
> = ApolloReactHoc.DataProps<
  IAccountInformationQuery,
  IAccountInformationQueryVariables
> &
  TChildProps;
export function withAccountInformation<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    IAccountInformationQuery,
    IAccountInformationQueryVariables,
    IAccountInformationProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    IAccountInformationQuery,
    IAccountInformationQueryVariables,
    IAccountInformationProps<TChildProps>
  >(AccountInformationDocument, {
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
export function useAccountInformationQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IAccountInformationQuery,
    IAccountInformationQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    IAccountInformationQuery,
    IAccountInformationQueryVariables
  >(AccountInformationDocument, baseOptions);
}
export function useAccountInformationLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IAccountInformationQuery,
    IAccountInformationQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IAccountInformationQuery,
    IAccountInformationQueryVariables
  >(AccountInformationDocument, baseOptions);
}
export type AccountInformationQueryHookResult = ReturnType<
  typeof useAccountInformationQuery
>;
export type AccountInformationLazyQueryHookResult = ReturnType<
  typeof useAccountInformationLazyQuery
>;
export type AccountInformationQueryResult = ApolloReactCommon.QueryResult<
  IAccountInformationQuery,
  IAccountInformationQueryVariables
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
  ApolloReactComponents.QueryComponentOptions<
    ICoinsQuery,
    ICoinsQueryVariables
  >,
  "query"
>;

export const CoinsComponent = (props: CoinsComponentProps) => (
  <ApolloReactComponents.Query<ICoinsQuery, ICoinsQueryVariables>
    query={CoinsDocument}
    {...props}
  />
);

export type ICoinsProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  ICoinsQuery,
  ICoinsQueryVariables
> &
  TChildProps;
export function withCoins<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    ICoinsQuery,
    ICoinsQueryVariables,
    ICoinsProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    ICoinsQuery,
    ICoinsQueryVariables,
    ICoinsProps<TChildProps>
  >(CoinsDocument, {
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
export function useCoinsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ICoinsQuery,
    ICoinsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<ICoinsQuery, ICoinsQueryVariables>(
    CoinsDocument,
    baseOptions,
  );
}
export function useCoinsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ICoinsQuery,
    ICoinsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<ICoinsQuery, ICoinsQueryVariables>(
    CoinsDocument,
    baseOptions,
  );
}
export type CoinsQueryHookResult = ReturnType<typeof useCoinsQuery>;
export type CoinsLazyQueryHookResult = ReturnType<typeof useCoinsLazyQuery>;
export type CoinsQueryResult = ApolloReactCommon.QueryResult<
  ICoinsQuery,
  ICoinsQueryVariables
>;
export const DailyPercentChangeDocument = gql`
  query dailyPercentChange($crypto: String!, $fiat: String!) {
    dailyPercentChange(crypto: $crypto, fiat: $fiat)
  }
`;
export type DailyPercentChangeComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<
    IDailyPercentChangeQuery,
    IDailyPercentChangeQueryVariables
  >,
  "query"
> &
  (
    | { variables: IDailyPercentChangeQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const DailyPercentChangeComponent = (
  props: DailyPercentChangeComponentProps,
) => (
  <ApolloReactComponents.Query<
    IDailyPercentChangeQuery,
    IDailyPercentChangeQueryVariables
  >
    query={DailyPercentChangeDocument}
    {...props}
  />
);

export type IDailyPercentChangeProps<
  TChildProps = {}
> = ApolloReactHoc.DataProps<
  IDailyPercentChangeQuery,
  IDailyPercentChangeQueryVariables
> &
  TChildProps;
export function withDailyPercentChange<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    IDailyPercentChangeQuery,
    IDailyPercentChangeQueryVariables,
    IDailyPercentChangeProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    IDailyPercentChangeQuery,
    IDailyPercentChangeQueryVariables,
    IDailyPercentChangeProps<TChildProps>
  >(DailyPercentChangeDocument, {
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
export function useDailyPercentChangeQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IDailyPercentChangeQuery,
    IDailyPercentChangeQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    IDailyPercentChangeQuery,
    IDailyPercentChangeQueryVariables
  >(DailyPercentChangeDocument, baseOptions);
}
export function useDailyPercentChangeLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IDailyPercentChangeQuery,
    IDailyPercentChangeQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IDailyPercentChangeQuery,
    IDailyPercentChangeQueryVariables
  >(DailyPercentChangeDocument, baseOptions);
}
export type DailyPercentChangeQueryHookResult = ReturnType<
  typeof useDailyPercentChangeQuery
>;
export type DailyPercentChangeLazyQueryHookResult = ReturnType<
  typeof useDailyPercentChangeLazyQuery
>;
export type DailyPercentChangeQueryResult = ApolloReactCommon.QueryResult<
  IDailyPercentChangeQuery,
  IDailyPercentChangeQueryVariables
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
  ApolloReactComponents.QueryComponentOptions<
    IDistributionCommunityPoolQuery,
    IDistributionCommunityPoolQueryVariables
  >,
  "query"
> &
  (
    | { variables: IDistributionCommunityPoolQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const DistributionCommunityPoolComponent = (
  props: DistributionCommunityPoolComponentProps,
) => (
  <ApolloReactComponents.Query<
    IDistributionCommunityPoolQuery,
    IDistributionCommunityPoolQueryVariables
  >
    query={DistributionCommunityPoolDocument}
    {...props}
  />
);

export type IDistributionCommunityPoolProps<
  TChildProps = {}
> = ApolloReactHoc.DataProps<
  IDistributionCommunityPoolQuery,
  IDistributionCommunityPoolQueryVariables
> &
  TChildProps;
export function withDistributionCommunityPool<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    IDistributionCommunityPoolQuery,
    IDistributionCommunityPoolQueryVariables,
    IDistributionCommunityPoolProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    IDistributionCommunityPoolQuery,
    IDistributionCommunityPoolQueryVariables,
    IDistributionCommunityPoolProps<TChildProps>
  >(DistributionCommunityPoolDocument, {
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
export function useDistributionCommunityPoolQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IDistributionCommunityPoolQuery,
    IDistributionCommunityPoolQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    IDistributionCommunityPoolQuery,
    IDistributionCommunityPoolQueryVariables
  >(DistributionCommunityPoolDocument, baseOptions);
}
export function useDistributionCommunityPoolLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IDistributionCommunityPoolQuery,
    IDistributionCommunityPoolQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IDistributionCommunityPoolQuery,
    IDistributionCommunityPoolQueryVariables
  >(DistributionCommunityPoolDocument, baseOptions);
}
export type DistributionCommunityPoolQueryHookResult = ReturnType<
  typeof useDistributionCommunityPoolQuery
>;
export type DistributionCommunityPoolLazyQueryHookResult = ReturnType<
  typeof useDistributionCommunityPoolLazyQuery
>;
export type DistributionCommunityPoolQueryResult = ApolloReactCommon.QueryResult<
  IDistributionCommunityPoolQuery,
  IDistributionCommunityPoolQueryVariables
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
  ApolloReactComponents.QueryComponentOptions<
    IDistributionParametersQuery,
    IDistributionParametersQueryVariables
  >,
  "query"
> &
  (
    | { variables: IDistributionParametersQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const DistributionParametersComponent = (
  props: DistributionParametersComponentProps,
) => (
  <ApolloReactComponents.Query<
    IDistributionParametersQuery,
    IDistributionParametersQueryVariables
  >
    query={DistributionParametersDocument}
    {...props}
  />
);

export type IDistributionParametersProps<
  TChildProps = {}
> = ApolloReactHoc.DataProps<
  IDistributionParametersQuery,
  IDistributionParametersQueryVariables
> &
  TChildProps;
export function withDistributionParameters<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    IDistributionParametersQuery,
    IDistributionParametersQueryVariables,
    IDistributionParametersProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    IDistributionParametersQuery,
    IDistributionParametersQueryVariables,
    IDistributionParametersProps<TChildProps>
  >(DistributionParametersDocument, {
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
export function useDistributionParametersQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IDistributionParametersQuery,
    IDistributionParametersQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    IDistributionParametersQuery,
    IDistributionParametersQueryVariables
  >(DistributionParametersDocument, baseOptions);
}
export function useDistributionParametersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IDistributionParametersQuery,
    IDistributionParametersQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IDistributionParametersQuery,
    IDistributionParametersQueryVariables
  >(DistributionParametersDocument, baseOptions);
}
export type DistributionParametersQueryHookResult = ReturnType<
  typeof useDistributionParametersQuery
>;
export type DistributionParametersLazyQueryHookResult = ReturnType<
  typeof useDistributionParametersLazyQuery
>;
export type DistributionParametersQueryResult = ApolloReactCommon.QueryResult<
  IDistributionParametersQuery,
  IDistributionParametersQueryVariables
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
  ApolloReactComponents.QueryComponentOptions<
    IFiatCurrenciesQuery,
    IFiatCurrenciesQueryVariables
  >,
  "query"
>;

export const FiatCurrenciesComponent = (
  props: FiatCurrenciesComponentProps,
) => (
  <ApolloReactComponents.Query<
    IFiatCurrenciesQuery,
    IFiatCurrenciesQueryVariables
  >
    query={FiatCurrenciesDocument}
    {...props}
  />
);

export type IFiatCurrenciesProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  IFiatCurrenciesQuery,
  IFiatCurrenciesQueryVariables
> &
  TChildProps;
export function withFiatCurrencies<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    IFiatCurrenciesQuery,
    IFiatCurrenciesQueryVariables,
    IFiatCurrenciesProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    IFiatCurrenciesQuery,
    IFiatCurrenciesQueryVariables,
    IFiatCurrenciesProps<TChildProps>
  >(FiatCurrenciesDocument, {
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
export function useFiatCurrenciesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IFiatCurrenciesQuery,
    IFiatCurrenciesQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    IFiatCurrenciesQuery,
    IFiatCurrenciesQueryVariables
  >(FiatCurrenciesDocument, baseOptions);
}
export function useFiatCurrenciesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IFiatCurrenciesQuery,
    IFiatCurrenciesQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IFiatCurrenciesQuery,
    IFiatCurrenciesQueryVariables
  >(FiatCurrenciesDocument, baseOptions);
}
export type FiatCurrenciesQueryHookResult = ReturnType<
  typeof useFiatCurrenciesQuery
>;
export type FiatCurrenciesLazyQueryHookResult = ReturnType<
  typeof useFiatCurrenciesLazyQuery
>;
export type FiatCurrenciesQueryResult = ApolloReactCommon.QueryResult<
  IFiatCurrenciesQuery,
  IFiatCurrenciesQueryVariables
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
  ApolloReactComponents.QueryComponentOptions<
    IFiatPriceHistoryQuery,
    IFiatPriceHistoryQueryVariables
  >,
  "query"
> &
  (
    | { variables: IFiatPriceHistoryQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const FiatPriceHistoryComponent = (
  props: FiatPriceHistoryComponentProps,
) => (
  <ApolloReactComponents.Query<
    IFiatPriceHistoryQuery,
    IFiatPriceHistoryQueryVariables
  >
    query={FiatPriceHistoryDocument}
    {...props}
  />
);

export type IFiatPriceHistoryProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  IFiatPriceHistoryQuery,
  IFiatPriceHistoryQueryVariables
> &
  TChildProps;
export function withFiatPriceHistory<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    IFiatPriceHistoryQuery,
    IFiatPriceHistoryQueryVariables,
    IFiatPriceHistoryProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    IFiatPriceHistoryQuery,
    IFiatPriceHistoryQueryVariables,
    IFiatPriceHistoryProps<TChildProps>
  >(FiatPriceHistoryDocument, {
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
export function useFiatPriceHistoryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IFiatPriceHistoryQuery,
    IFiatPriceHistoryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    IFiatPriceHistoryQuery,
    IFiatPriceHistoryQueryVariables
  >(FiatPriceHistoryDocument, baseOptions);
}
export function useFiatPriceHistoryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IFiatPriceHistoryQuery,
    IFiatPriceHistoryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IFiatPriceHistoryQuery,
    IFiatPriceHistoryQueryVariables
  >(FiatPriceHistoryDocument, baseOptions);
}
export type FiatPriceHistoryQueryHookResult = ReturnType<
  typeof useFiatPriceHistoryQuery
>;
export type FiatPriceHistoryLazyQueryHookResult = ReturnType<
  typeof useFiatPriceHistoryLazyQuery
>;
export type FiatPriceHistoryQueryResult = ApolloReactCommon.QueryResult<
  IFiatPriceHistoryQuery,
  IFiatPriceHistoryQueryVariables
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
  ApolloReactComponents.QueryComponentOptions<
    IGovernanceParametersDepositQuery,
    IGovernanceParametersDepositQueryVariables
  >,
  "query"
> &
  (
    | { variables: IGovernanceParametersDepositQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const GovernanceParametersDepositComponent = (
  props: GovernanceParametersDepositComponentProps,
) => (
  <ApolloReactComponents.Query<
    IGovernanceParametersDepositQuery,
    IGovernanceParametersDepositQueryVariables
  >
    query={GovernanceParametersDepositDocument}
    {...props}
  />
);

export type IGovernanceParametersDepositProps<
  TChildProps = {}
> = ApolloReactHoc.DataProps<
  IGovernanceParametersDepositQuery,
  IGovernanceParametersDepositQueryVariables
> &
  TChildProps;
export function withGovernanceParametersDeposit<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    IGovernanceParametersDepositQuery,
    IGovernanceParametersDepositQueryVariables,
    IGovernanceParametersDepositProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    IGovernanceParametersDepositQuery,
    IGovernanceParametersDepositQueryVariables,
    IGovernanceParametersDepositProps<TChildProps>
  >(GovernanceParametersDepositDocument, {
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
export function useGovernanceParametersDepositQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IGovernanceParametersDepositQuery,
    IGovernanceParametersDepositQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    IGovernanceParametersDepositQuery,
    IGovernanceParametersDepositQueryVariables
  >(GovernanceParametersDepositDocument, baseOptions);
}
export function useGovernanceParametersDepositLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IGovernanceParametersDepositQuery,
    IGovernanceParametersDepositQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IGovernanceParametersDepositQuery,
    IGovernanceParametersDepositQueryVariables
  >(GovernanceParametersDepositDocument, baseOptions);
}
export type GovernanceParametersDepositQueryHookResult = ReturnType<
  typeof useGovernanceParametersDepositQuery
>;
export type GovernanceParametersDepositLazyQueryHookResult = ReturnType<
  typeof useGovernanceParametersDepositLazyQuery
>;
export type GovernanceParametersDepositQueryResult = ApolloReactCommon.QueryResult<
  IGovernanceParametersDepositQuery,
  IGovernanceParametersDepositQueryVariables
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
  ApolloReactComponents.QueryComponentOptions<
    IGovernanceParametersTallyingQuery,
    IGovernanceParametersTallyingQueryVariables
  >,
  "query"
> &
  (
    | { variables: IGovernanceParametersTallyingQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const GovernanceParametersTallyingComponent = (
  props: GovernanceParametersTallyingComponentProps,
) => (
  <ApolloReactComponents.Query<
    IGovernanceParametersTallyingQuery,
    IGovernanceParametersTallyingQueryVariables
  >
    query={GovernanceParametersTallyingDocument}
    {...props}
  />
);

export type IGovernanceParametersTallyingProps<
  TChildProps = {}
> = ApolloReactHoc.DataProps<
  IGovernanceParametersTallyingQuery,
  IGovernanceParametersTallyingQueryVariables
> &
  TChildProps;
export function withGovernanceParametersTallying<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    IGovernanceParametersTallyingQuery,
    IGovernanceParametersTallyingQueryVariables,
    IGovernanceParametersTallyingProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    IGovernanceParametersTallyingQuery,
    IGovernanceParametersTallyingQueryVariables,
    IGovernanceParametersTallyingProps<TChildProps>
  >(GovernanceParametersTallyingDocument, {
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
export function useGovernanceParametersTallyingQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IGovernanceParametersTallyingQuery,
    IGovernanceParametersTallyingQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    IGovernanceParametersTallyingQuery,
    IGovernanceParametersTallyingQueryVariables
  >(GovernanceParametersTallyingDocument, baseOptions);
}
export function useGovernanceParametersTallyingLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IGovernanceParametersTallyingQuery,
    IGovernanceParametersTallyingQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IGovernanceParametersTallyingQuery,
    IGovernanceParametersTallyingQueryVariables
  >(GovernanceParametersTallyingDocument, baseOptions);
}
export type GovernanceParametersTallyingQueryHookResult = ReturnType<
  typeof useGovernanceParametersTallyingQuery
>;
export type GovernanceParametersTallyingLazyQueryHookResult = ReturnType<
  typeof useGovernanceParametersTallyingLazyQuery
>;
export type GovernanceParametersTallyingQueryResult = ApolloReactCommon.QueryResult<
  IGovernanceParametersTallyingQuery,
  IGovernanceParametersTallyingQueryVariables
>;
export const GovernanceParametersVotingDocument = gql`
  query governanceParametersVoting($network: String!) {
    governanceParametersVoting(network: $network) {
      voting_period
    }
  }
`;
export type GovernanceParametersVotingComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<
    IGovernanceParametersVotingQuery,
    IGovernanceParametersVotingQueryVariables
  >,
  "query"
> &
  (
    | { variables: IGovernanceParametersVotingQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const GovernanceParametersVotingComponent = (
  props: GovernanceParametersVotingComponentProps,
) => (
  <ApolloReactComponents.Query<
    IGovernanceParametersVotingQuery,
    IGovernanceParametersVotingQueryVariables
  >
    query={GovernanceParametersVotingDocument}
    {...props}
  />
);

export type IGovernanceParametersVotingProps<
  TChildProps = {}
> = ApolloReactHoc.DataProps<
  IGovernanceParametersVotingQuery,
  IGovernanceParametersVotingQueryVariables
> &
  TChildProps;
export function withGovernanceParametersVoting<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    IGovernanceParametersVotingQuery,
    IGovernanceParametersVotingQueryVariables,
    IGovernanceParametersVotingProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    IGovernanceParametersVotingQuery,
    IGovernanceParametersVotingQueryVariables,
    IGovernanceParametersVotingProps<TChildProps>
  >(GovernanceParametersVotingDocument, {
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
export function useGovernanceParametersVotingQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IGovernanceParametersVotingQuery,
    IGovernanceParametersVotingQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    IGovernanceParametersVotingQuery,
    IGovernanceParametersVotingQueryVariables
  >(GovernanceParametersVotingDocument, baseOptions);
}
export function useGovernanceParametersVotingLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IGovernanceParametersVotingQuery,
    IGovernanceParametersVotingQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IGovernanceParametersVotingQuery,
    IGovernanceParametersVotingQueryVariables
  >(GovernanceParametersVotingDocument, baseOptions);
}
export type GovernanceParametersVotingQueryHookResult = ReturnType<
  typeof useGovernanceParametersVotingQuery
>;
export type GovernanceParametersVotingLazyQueryHookResult = ReturnType<
  typeof useGovernanceParametersVotingLazyQuery
>;
export type GovernanceParametersVotingQueryResult = ApolloReactCommon.QueryResult<
  IGovernanceParametersVotingQuery,
  IGovernanceParametersVotingQueryVariables
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
  ApolloReactComponents.QueryComponentOptions<
    IGovernanceProposalsQuery,
    IGovernanceProposalsQueryVariables
  >,
  "query"
> &
  (
    | { variables: IGovernanceProposalsQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const GovernanceProposalsComponent = (
  props: GovernanceProposalsComponentProps,
) => (
  <ApolloReactComponents.Query<
    IGovernanceProposalsQuery,
    IGovernanceProposalsQueryVariables
  >
    query={GovernanceProposalsDocument}
    {...props}
  />
);

export type IGovernanceProposalsProps<
  TChildProps = {}
> = ApolloReactHoc.DataProps<
  IGovernanceProposalsQuery,
  IGovernanceProposalsQueryVariables
> &
  TChildProps;
export function withGovernanceProposals<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    IGovernanceProposalsQuery,
    IGovernanceProposalsQueryVariables,
    IGovernanceProposalsProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    IGovernanceProposalsQuery,
    IGovernanceProposalsQueryVariables,
    IGovernanceProposalsProps<TChildProps>
  >(GovernanceProposalsDocument, {
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
export function useGovernanceProposalsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IGovernanceProposalsQuery,
    IGovernanceProposalsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    IGovernanceProposalsQuery,
    IGovernanceProposalsQueryVariables
  >(GovernanceProposalsDocument, baseOptions);
}
export function useGovernanceProposalsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IGovernanceProposalsQuery,
    IGovernanceProposalsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IGovernanceProposalsQuery,
    IGovernanceProposalsQueryVariables
  >(GovernanceProposalsDocument, baseOptions);
}
export type GovernanceProposalsQueryHookResult = ReturnType<
  typeof useGovernanceProposalsQuery
>;
export type GovernanceProposalsLazyQueryHookResult = ReturnType<
  typeof useGovernanceProposalsLazyQuery
>;
export type GovernanceProposalsQueryResult = ApolloReactCommon.QueryResult<
  IGovernanceProposalsQuery,
  IGovernanceProposalsQueryVariables
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
  ApolloReactComponents.QueryComponentOptions<
    ILatestBlockQuery,
    ILatestBlockQueryVariables
  >,
  "query"
> &
  (
    | { variables: ILatestBlockQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const LatestBlockComponent = (props: LatestBlockComponentProps) => (
  <ApolloReactComponents.Query<ILatestBlockQuery, ILatestBlockQueryVariables>
    query={LatestBlockDocument}
    {...props}
  />
);

export type ILatestBlockProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  ILatestBlockQuery,
  ILatestBlockQueryVariables
> &
  TChildProps;
export function withLatestBlock<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    ILatestBlockQuery,
    ILatestBlockQueryVariables,
    ILatestBlockProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    ILatestBlockQuery,
    ILatestBlockQueryVariables,
    ILatestBlockProps<TChildProps>
  >(LatestBlockDocument, {
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
export function useLatestBlockQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ILatestBlockQuery,
    ILatestBlockQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    ILatestBlockQuery,
    ILatestBlockQueryVariables
  >(LatestBlockDocument, baseOptions);
}
export function useLatestBlockLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ILatestBlockQuery,
    ILatestBlockQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    ILatestBlockQuery,
    ILatestBlockQueryVariables
  >(LatestBlockDocument, baseOptions);
}
export type LatestBlockQueryHookResult = ReturnType<typeof useLatestBlockQuery>;
export type LatestBlockLazyQueryHookResult = ReturnType<
  typeof useLatestBlockLazyQuery
>;
export type LatestBlockQueryResult = ApolloReactCommon.QueryResult<
  ILatestBlockQuery,
  ILatestBlockQueryVariables
>;
export const OasisDocument = gql`
  query oasis {
    oasis
  }
`;
export type OasisComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<
    IOasisQuery,
    IOasisQueryVariables
  >,
  "query"
>;

export const OasisComponent = (props: OasisComponentProps) => (
  <ApolloReactComponents.Query<IOasisQuery, IOasisQueryVariables>
    query={OasisDocument}
    {...props}
  />
);

export type IOasisProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  IOasisQuery,
  IOasisQueryVariables
> &
  TChildProps;
export function withOasis<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    IOasisQuery,
    IOasisQueryVariables,
    IOasisProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    IOasisQuery,
    IOasisQueryVariables,
    IOasisProps<TChildProps>
  >(OasisDocument, {
    alias: "oasis",
    ...operationOptions,
  });
}

/**
 * __useOasisQuery__
 *
 * To run a query within a React component, call `useOasisQuery` and pass it any options that fit your needs.
 * When your component renders, `useOasisQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOasisQuery({
 *   variables: {
 *   },
 * });
 */
export function useOasisQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IOasisQuery,
    IOasisQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<IOasisQuery, IOasisQueryVariables>(
    OasisDocument,
    baseOptions,
  );
}
export function useOasisLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IOasisQuery,
    IOasisQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<IOasisQuery, IOasisQueryVariables>(
    OasisDocument,
    baseOptions,
  );
}
export type OasisQueryHookResult = ReturnType<typeof useOasisQuery>;
export type OasisLazyQueryHookResult = ReturnType<typeof useOasisLazyQuery>;
export type OasisQueryResult = ApolloReactCommon.QueryResult<
  IOasisQuery,
  IOasisQueryVariables
>;
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
  ApolloReactComponents.QueryComponentOptions<
    IPortfolioHistoryQuery,
    IPortfolioHistoryQueryVariables
  >,
  "query"
> &
  (
    | { variables: IPortfolioHistoryQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const PortfolioHistoryComponent = (
  props: PortfolioHistoryComponentProps,
) => (
  <ApolloReactComponents.Query<
    IPortfolioHistoryQuery,
    IPortfolioHistoryQueryVariables
  >
    query={PortfolioHistoryDocument}
    {...props}
  />
);

export type IPortfolioHistoryProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  IPortfolioHistoryQuery,
  IPortfolioHistoryQueryVariables
> &
  TChildProps;
export function withPortfolioHistory<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    IPortfolioHistoryQuery,
    IPortfolioHistoryQueryVariables,
    IPortfolioHistoryProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    IPortfolioHistoryQuery,
    IPortfolioHistoryQueryVariables,
    IPortfolioHistoryProps<TChildProps>
  >(PortfolioHistoryDocument, {
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
export function usePortfolioHistoryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IPortfolioHistoryQuery,
    IPortfolioHistoryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    IPortfolioHistoryQuery,
    IPortfolioHistoryQueryVariables
  >(PortfolioHistoryDocument, baseOptions);
}
export function usePortfolioHistoryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IPortfolioHistoryQuery,
    IPortfolioHistoryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IPortfolioHistoryQuery,
    IPortfolioHistoryQueryVariables
  >(PortfolioHistoryDocument, baseOptions);
}
export type PortfolioHistoryQueryHookResult = ReturnType<
  typeof usePortfolioHistoryQuery
>;
export type PortfolioHistoryLazyQueryHookResult = ReturnType<
  typeof usePortfolioHistoryLazyQuery
>;
export type PortfolioHistoryQueryResult = ApolloReactCommon.QueryResult<
  IPortfolioHistoryQuery,
  IPortfolioHistoryQueryVariables
>;
export const PricesDocument = gql`
  query prices($currency: String!, $versus: String!) {
    prices(currency: $currency, versus: $versus) {
      price
    }
  }
`;
export type PricesComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<
    IPricesQuery,
    IPricesQueryVariables
  >,
  "query"
> &
  ({ variables: IPricesQueryVariables; skip?: boolean } | { skip: boolean });

export const PricesComponent = (props: PricesComponentProps) => (
  <ApolloReactComponents.Query<IPricesQuery, IPricesQueryVariables>
    query={PricesDocument}
    {...props}
  />
);

export type IPricesProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  IPricesQuery,
  IPricesQueryVariables
> &
  TChildProps;
export function withPrices<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    IPricesQuery,
    IPricesQueryVariables,
    IPricesProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    IPricesQuery,
    IPricesQueryVariables,
    IPricesProps<TChildProps>
  >(PricesDocument, {
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
export function usePricesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IPricesQuery,
    IPricesQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<IPricesQuery, IPricesQueryVariables>(
    PricesDocument,
    baseOptions,
  );
}
export function usePricesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IPricesQuery,
    IPricesQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<IPricesQuery, IPricesQueryVariables>(
    PricesDocument,
    baseOptions,
  );
}
export type PricesQueryHookResult = ReturnType<typeof usePricesQuery>;
export type PricesLazyQueryHookResult = ReturnType<typeof usePricesLazyQuery>;
export type PricesQueryResult = ApolloReactCommon.QueryResult<
  IPricesQuery,
  IPricesQueryVariables
>;
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
  ApolloReactComponents.QueryComponentOptions<
    IRewardsByValidatorQuery,
    IRewardsByValidatorQueryVariables
  >,
  "query"
> &
  (
    | { variables: IRewardsByValidatorQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const RewardsByValidatorComponent = (
  props: RewardsByValidatorComponentProps,
) => (
  <ApolloReactComponents.Query<
    IRewardsByValidatorQuery,
    IRewardsByValidatorQueryVariables
  >
    query={RewardsByValidatorDocument}
    {...props}
  />
);

export type IRewardsByValidatorProps<
  TChildProps = {}
> = ApolloReactHoc.DataProps<
  IRewardsByValidatorQuery,
  IRewardsByValidatorQueryVariables
> &
  TChildProps;
export function withRewardsByValidator<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    IRewardsByValidatorQuery,
    IRewardsByValidatorQueryVariables,
    IRewardsByValidatorProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    IRewardsByValidatorQuery,
    IRewardsByValidatorQueryVariables,
    IRewardsByValidatorProps<TChildProps>
  >(RewardsByValidatorDocument, {
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
export function useRewardsByValidatorQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IRewardsByValidatorQuery,
    IRewardsByValidatorQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    IRewardsByValidatorQuery,
    IRewardsByValidatorQueryVariables
  >(RewardsByValidatorDocument, baseOptions);
}
export function useRewardsByValidatorLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IRewardsByValidatorQuery,
    IRewardsByValidatorQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IRewardsByValidatorQuery,
    IRewardsByValidatorQueryVariables
  >(RewardsByValidatorDocument, baseOptions);
}
export type RewardsByValidatorQueryHookResult = ReturnType<
  typeof useRewardsByValidatorQuery
>;
export type RewardsByValidatorLazyQueryHookResult = ReturnType<
  typeof useRewardsByValidatorLazyQuery
>;
export type RewardsByValidatorQueryResult = ApolloReactCommon.QueryResult<
  IRewardsByValidatorQuery,
  IRewardsByValidatorQueryVariables
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
  ApolloReactComponents.QueryComponentOptions<
    ISlashingParametersQuery,
    ISlashingParametersQueryVariables
  >,
  "query"
> &
  (
    | { variables: ISlashingParametersQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const SlashingParametersComponent = (
  props: SlashingParametersComponentProps,
) => (
  <ApolloReactComponents.Query<
    ISlashingParametersQuery,
    ISlashingParametersQueryVariables
  >
    query={SlashingParametersDocument}
    {...props}
  />
);

export type ISlashingParametersProps<
  TChildProps = {}
> = ApolloReactHoc.DataProps<
  ISlashingParametersQuery,
  ISlashingParametersQueryVariables
> &
  TChildProps;
export function withSlashingParameters<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    ISlashingParametersQuery,
    ISlashingParametersQueryVariables,
    ISlashingParametersProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    ISlashingParametersQuery,
    ISlashingParametersQueryVariables,
    ISlashingParametersProps<TChildProps>
  >(SlashingParametersDocument, {
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
export function useSlashingParametersQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ISlashingParametersQuery,
    ISlashingParametersQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    ISlashingParametersQuery,
    ISlashingParametersQueryVariables
  >(SlashingParametersDocument, baseOptions);
}
export function useSlashingParametersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ISlashingParametersQuery,
    ISlashingParametersQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    ISlashingParametersQuery,
    ISlashingParametersQueryVariables
  >(SlashingParametersDocument, baseOptions);
}
export type SlashingParametersQueryHookResult = ReturnType<
  typeof useSlashingParametersQuery
>;
export type SlashingParametersLazyQueryHookResult = ReturnType<
  typeof useSlashingParametersLazyQuery
>;
export type SlashingParametersQueryResult = ApolloReactCommon.QueryResult<
  ISlashingParametersQuery,
  ISlashingParametersQueryVariables
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
  ApolloReactComponents.QueryComponentOptions<
    IStakingParametersQuery,
    IStakingParametersQueryVariables
  >,
  "query"
> &
  (
    | { variables: IStakingParametersQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const StakingParametersComponent = (
  props: StakingParametersComponentProps,
) => (
  <ApolloReactComponents.Query<
    IStakingParametersQuery,
    IStakingParametersQueryVariables
  >
    query={StakingParametersDocument}
    {...props}
  />
);

export type IStakingParametersProps<
  TChildProps = {}
> = ApolloReactHoc.DataProps<
  IStakingParametersQuery,
  IStakingParametersQueryVariables
> &
  TChildProps;
export function withStakingParameters<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    IStakingParametersQuery,
    IStakingParametersQueryVariables,
    IStakingParametersProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    IStakingParametersQuery,
    IStakingParametersQueryVariables,
    IStakingParametersProps<TChildProps>
  >(StakingParametersDocument, {
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
export function useStakingParametersQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IStakingParametersQuery,
    IStakingParametersQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    IStakingParametersQuery,
    IStakingParametersQueryVariables
  >(StakingParametersDocument, baseOptions);
}
export function useStakingParametersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IStakingParametersQuery,
    IStakingParametersQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IStakingParametersQuery,
    IStakingParametersQueryVariables
  >(StakingParametersDocument, baseOptions);
}
export type StakingParametersQueryHookResult = ReturnType<
  typeof useStakingParametersQuery
>;
export type StakingParametersLazyQueryHookResult = ReturnType<
  typeof useStakingParametersLazyQuery
>;
export type StakingParametersQueryResult = ApolloReactCommon.QueryResult<
  IStakingParametersQuery,
  IStakingParametersQueryVariables
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
  ApolloReactComponents.QueryComponentOptions<
    IStakingPoolQuery,
    IStakingPoolQueryVariables
  >,
  "query"
> &
  (
    | { variables: IStakingPoolQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const StakingPoolComponent = (props: StakingPoolComponentProps) => (
  <ApolloReactComponents.Query<IStakingPoolQuery, IStakingPoolQueryVariables>
    query={StakingPoolDocument}
    {...props}
  />
);

export type IStakingPoolProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  IStakingPoolQuery,
  IStakingPoolQueryVariables
> &
  TChildProps;
export function withStakingPool<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    IStakingPoolQuery,
    IStakingPoolQueryVariables,
    IStakingPoolProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    IStakingPoolQuery,
    IStakingPoolQueryVariables,
    IStakingPoolProps<TChildProps>
  >(StakingPoolDocument, {
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
export function useStakingPoolQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IStakingPoolQuery,
    IStakingPoolQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    IStakingPoolQuery,
    IStakingPoolQueryVariables
  >(StakingPoolDocument, baseOptions);
}
export function useStakingPoolLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IStakingPoolQuery,
    IStakingPoolQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IStakingPoolQuery,
    IStakingPoolQueryVariables
  >(StakingPoolDocument, baseOptions);
}
export type StakingPoolQueryHookResult = ReturnType<typeof useStakingPoolQuery>;
export type StakingPoolLazyQueryHookResult = ReturnType<
  typeof useStakingPoolLazyQuery
>;
export type StakingPoolQueryResult = ApolloReactCommon.QueryResult<
  IStakingPoolQuery,
  IStakingPoolQueryVariables
>;
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
  ApolloReactComponents.QueryComponentOptions<
    ITransactionQuery,
    ITransactionQueryVariables
  >,
  "query"
> &
  (
    | { variables: ITransactionQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const TransactionComponent = (props: TransactionComponentProps) => (
  <ApolloReactComponents.Query<ITransactionQuery, ITransactionQueryVariables>
    query={TransactionDocument}
    {...props}
  />
);

export type ITransactionProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  ITransactionQuery,
  ITransactionQueryVariables
> &
  TChildProps;
export function withTransaction<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    ITransactionQuery,
    ITransactionQueryVariables,
    ITransactionProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    ITransactionQuery,
    ITransactionQueryVariables,
    ITransactionProps<TChildProps>
  >(TransactionDocument, {
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
export function useTransactionQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ITransactionQuery,
    ITransactionQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    ITransactionQuery,
    ITransactionQueryVariables
  >(TransactionDocument, baseOptions);
}
export function useTransactionLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ITransactionQuery,
    ITransactionQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    ITransactionQuery,
    ITransactionQueryVariables
  >(TransactionDocument, baseOptions);
}
export type TransactionQueryHookResult = ReturnType<typeof useTransactionQuery>;
export type TransactionLazyQueryHookResult = ReturnType<
  typeof useTransactionLazyQuery
>;
export type TransactionQueryResult = ApolloReactCommon.QueryResult<
  ITransactionQuery,
  ITransactionQueryVariables
>;
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
  ApolloReactComponents.QueryComponentOptions<
    ITransactionsQuery,
    ITransactionsQueryVariables
  >,
  "query"
> &
  (
    | { variables: ITransactionsQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const TransactionsComponent = (props: TransactionsComponentProps) => (
  <ApolloReactComponents.Query<ITransactionsQuery, ITransactionsQueryVariables>
    query={TransactionsDocument}
    {...props}
  />
);

export type ITransactionsProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  ITransactionsQuery,
  ITransactionsQueryVariables
> &
  TChildProps;
export function withTransactions<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    ITransactionsQuery,
    ITransactionsQueryVariables,
    ITransactionsProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    ITransactionsQuery,
    ITransactionsQueryVariables,
    ITransactionsProps<TChildProps>
  >(TransactionsDocument, {
    alias: "transactions",
    ...operationOptions,
  });
}

/**
 * __useTransactionsQuery__
 *
 * To run a query within a React component, call `useTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionsQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useTransactionsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ITransactionsQuery,
    ITransactionsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    ITransactionsQuery,
    ITransactionsQueryVariables
  >(TransactionsDocument, baseOptions);
}
export function useTransactionsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ITransactionsQuery,
    ITransactionsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    ITransactionsQuery,
    ITransactionsQueryVariables
  >(TransactionsDocument, baseOptions);
}
export type TransactionsQueryHookResult = ReturnType<
  typeof useTransactionsQuery
>;
export type TransactionsLazyQueryHookResult = ReturnType<
  typeof useTransactionsLazyQuery
>;
export type TransactionsQueryResult = ApolloReactCommon.QueryResult<
  ITransactionsQuery,
  ITransactionsQueryVariables
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
  ApolloReactComponents.QueryComponentOptions<
    IValidatorDistributionQuery,
    IValidatorDistributionQueryVariables
  >,
  "query"
> &
  (
    | { variables: IValidatorDistributionQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const ValidatorDistributionComponent = (
  props: ValidatorDistributionComponentProps,
) => (
  <ApolloReactComponents.Query<
    IValidatorDistributionQuery,
    IValidatorDistributionQueryVariables
  >
    query={ValidatorDistributionDocument}
    {...props}
  />
);

export type IValidatorDistributionProps<
  TChildProps = {}
> = ApolloReactHoc.DataProps<
  IValidatorDistributionQuery,
  IValidatorDistributionQueryVariables
> &
  TChildProps;
export function withValidatorDistribution<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    IValidatorDistributionQuery,
    IValidatorDistributionQueryVariables,
    IValidatorDistributionProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    IValidatorDistributionQuery,
    IValidatorDistributionQueryVariables,
    IValidatorDistributionProps<TChildProps>
  >(ValidatorDistributionDocument, {
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
export function useValidatorDistributionQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IValidatorDistributionQuery,
    IValidatorDistributionQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    IValidatorDistributionQuery,
    IValidatorDistributionQueryVariables
  >(ValidatorDistributionDocument, baseOptions);
}
export function useValidatorDistributionLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IValidatorDistributionQuery,
    IValidatorDistributionQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IValidatorDistributionQuery,
    IValidatorDistributionQueryVariables
  >(ValidatorDistributionDocument, baseOptions);
}
export type ValidatorDistributionQueryHookResult = ReturnType<
  typeof useValidatorDistributionQuery
>;
export type ValidatorDistributionLazyQueryHookResult = ReturnType<
  typeof useValidatorDistributionLazyQuery
>;
export type ValidatorDistributionQueryResult = ApolloReactCommon.QueryResult<
  IValidatorDistributionQuery,
  IValidatorDistributionQueryVariables
>;
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
  ApolloReactComponents.QueryComponentOptions<
    IValidatorSetsQuery,
    IValidatorSetsQueryVariables
  >,
  "query"
> &
  (
    | { variables: IValidatorSetsQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const ValidatorSetsComponent = (props: ValidatorSetsComponentProps) => (
  <ApolloReactComponents.Query<
    IValidatorSetsQuery,
    IValidatorSetsQueryVariables
  >
    query={ValidatorSetsDocument}
    {...props}
  />
);

export type IValidatorSetsProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  IValidatorSetsQuery,
  IValidatorSetsQueryVariables
> &
  TChildProps;
export function withValidatorSets<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    IValidatorSetsQuery,
    IValidatorSetsQueryVariables,
    IValidatorSetsProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    IValidatorSetsQuery,
    IValidatorSetsQueryVariables,
    IValidatorSetsProps<TChildProps>
  >(ValidatorSetsDocument, {
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
export function useValidatorSetsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IValidatorSetsQuery,
    IValidatorSetsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    IValidatorSetsQuery,
    IValidatorSetsQueryVariables
  >(ValidatorSetsDocument, baseOptions);
}
export function useValidatorSetsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IValidatorSetsQuery,
    IValidatorSetsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IValidatorSetsQuery,
    IValidatorSetsQueryVariables
  >(ValidatorSetsDocument, baseOptions);
}
export type ValidatorSetsQueryHookResult = ReturnType<
  typeof useValidatorSetsQuery
>;
export type ValidatorSetsLazyQueryHookResult = ReturnType<
  typeof useValidatorSetsLazyQuery
>;
export type ValidatorSetsQueryResult = ApolloReactCommon.QueryResult<
  IValidatorSetsQuery,
  IValidatorSetsQueryVariables
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
  ApolloReactComponents.QueryComponentOptions<
    IValidatorsQuery,
    IValidatorsQueryVariables
  >,
  "query"
> &
  (
    | { variables: IValidatorsQueryVariables; skip?: boolean }
    | { skip: boolean }
  );

export const ValidatorsComponent = (props: ValidatorsComponentProps) => (
  <ApolloReactComponents.Query<IValidatorsQuery, IValidatorsQueryVariables>
    query={ValidatorsDocument}
    {...props}
  />
);

export type IValidatorsProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  IValidatorsQuery,
  IValidatorsQueryVariables
> &
  TChildProps;
export function withValidators<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    IValidatorsQuery,
    IValidatorsQueryVariables,
    IValidatorsProps<TChildProps>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    IValidatorsQuery,
    IValidatorsQueryVariables,
    IValidatorsProps<TChildProps>
  >(ValidatorsDocument, {
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
export function useValidatorsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IValidatorsQuery,
    IValidatorsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<IValidatorsQuery, IValidatorsQueryVariables>(
    ValidatorsDocument,
    baseOptions,
  );
}
export function useValidatorsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IValidatorsQuery,
    IValidatorsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IValidatorsQuery,
    IValidatorsQueryVariables
  >(ValidatorsDocument, baseOptions);
}
export type ValidatorsQueryHookResult = ReturnType<typeof useValidatorsQuery>;
export type ValidatorsLazyQueryHookResult = ReturnType<
  typeof useValidatorsLazyQuery
>;
export type ValidatorsQueryResult = ApolloReactCommon.QueryResult<
  IValidatorsQuery,
  IValidatorsQueryVariables
>;
