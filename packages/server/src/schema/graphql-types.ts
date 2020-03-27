export type Maybe<T> = T | null;
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
