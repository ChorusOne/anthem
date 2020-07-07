import {
  CeloAccountBalancesDocument,
  CeloAccountHistoryDocument,
  CeloGovernanceProposalsDocument,
  CeloGovernanceTransactionsDocument,
  CeloSystemBalancesDocument,
  CeloTransactionDocument,
  CeloTransactionsDocument,
  CeloValidatorGroupsDocument,
  CosmosAccountBalancesDocument,
  CosmosAccountHistoryDocument,
  CosmosAccountInformationDocument,
  CosmosRewardsByValidatorDocument,
  CosmosStakingPoolDocument,
  CosmosTransactionsDocument,
  CosmosValidatorsDocument,
  DailyPercentChangeDocument,
  FiatCurrenciesDocument,
  FiatPriceHistoryDocument,
  IQuery,
  NetworkSummariesDocument,
  OasisAccountBalancesDocument,
  OasisAccountHistoryDocument,
  OasisTransactionsDocument,
  PricesDocument,
} from "@anthem/utils";
import ENV from "lib/client-env";
import { ReduxStoreState } from "modules/root";
import { graphql, QueryOpts, QueryResult } from "react-apollo";
import { connect } from "react-redux";
import { createSelector } from "reselect";

/** ===========================================================================
 * Query Providers
 * ----------------------------------------------------------------------------
 * These are helpers to make it easy to fetch data from GraphQL APIs and
 * provide the response data components.
 * ============================================================================
 */

const addressSelector = (state: ReduxStoreState) => state.ledger.ledger.address;
const networkSelector = (state: ReduxStoreState) => state.ledger.ledger.network;
const transactionsPageSelectors = (state: ReduxStoreState) =>
  state.transaction.transactionsPage;
const fiatSelector = (state: ReduxStoreState) =>
  state.settings.fiatCurrency.symbol;

export const graphqlSelector = createSelector(
  [addressSelector, networkSelector, fiatSelector, transactionsPageSelectors],
  (address, network, fiat, startingPage) => {
    return {
      fiat,
      address,
      versus: fiat,
      startingPage,
      network: network.name,
      networkDefinition: network,
      currency: network.cryptoCompareTicker,
    };
  },
);

const mapGraphQLVariablesToProps = (state: ReduxStoreState) => ({
  graphql: graphqlSelector(state),
});

export type GraphQLConfigProps = ReturnType<typeof mapGraphQLVariablesToProps>;

export const withGraphQLVariables = connect(mapGraphQLVariablesToProps);

const getQueryConfig = (pollInterval: number | undefined) => (
  variableKeys?: ReadonlyArray<VariablesKeys>,
) => ({
  options: (props: GraphQLConfigProps): QueryOpts => {
    const variables: { [k: string]: string | number } = {};

    if (variableKeys) {
      for (const key of variableKeys) {
        variables[key] = props.graphql[key];
      }
    }

    return {
      variables,
      pollInterval,
    };
  },
  skip: (props: GraphQLConfigProps) => {
    return props.graphql.address === "";
  },
});

type VariablesKeys =
  | "address"
  | "fiat"
  | "currency"
  | "versus"
  | "network"
  | "startingPage";

const slowPollingConfig = (variableKeys: ReadonlyArray<VariablesKeys>) => {
  return getQueryConfig(ENV.SLOW_POLL_INTERVAL)(variableKeys);
};

const fastPollingConfig = (variableKeys: ReadonlyArray<VariablesKeys>) => {
  return getQueryConfig(ENV.FAST_POLL_INTERVAL)(variableKeys);
};

const noPollingConfig = (variableKeys?: ReadonlyArray<VariablesKeys>) => {
  return getQueryConfig(undefined)(variableKeys);
};

/** ===========================================================================
 * Fiat Prices
 * ============================================================================
 */

interface FiatPriceDataQueryResult extends QueryResult {
  data: void;
  prices: IQuery["prices"];
}

export interface FiatPriceDataProps {
  prices: FiatPriceDataQueryResult;
}

export const withFiatPriceData = graphql(PricesDocument, {
  name: "prices",
  ...fastPollingConfig(["versus", "currency"]),
});

/** ===========================================================================
 * Daily Percentage Change
 * ============================================================================
 */

interface DailyPercentChangeQueryResult extends QueryResult {
  data: void;
  dailyPercentChange: IQuery["dailyPercentChange"];
}

export interface DailyPercentChangeProps {
  dailyPercentChange: DailyPercentChangeQueryResult;
}

export const withDailyPercentChange = graphql(DailyPercentChangeDocument, {
  name: "dailyPercentChange",
  ...fastPollingConfig(["currency", "fiat"]),
});

/** ===========================================================================
 * Fiat Price History
 * ============================================================================
 */

interface FiatPriceHistoryQueryResult extends QueryResult {
  data: void;
  fiatPriceHistory: IQuery["fiatPriceHistory"];
}

export interface FiatPriceHistoryProps {
  fiatPriceHistory: FiatPriceHistoryQueryResult;
}

export const withFiatPriceHistory = graphql(FiatPriceHistoryDocument, {
  name: "fiatPriceHistory",
  ...noPollingConfig(["fiat", "network"]),
});

/** ===========================================================================
 * Fiat Currencies
 * ============================================================================
 */

interface FiatCurrenciesQueryResult extends QueryResult {
  data: void;
  fiatCurrencies: IQuery["fiatCurrencies"];
}

export interface FiatCurrenciesProps {
  fiatCurrencies: FiatCurrenciesQueryResult;
}

export const withFiatCurrencies = graphql(FiatCurrenciesDocument, {
  name: "fiatCurrencies",
  ...noPollingConfig(),
});

/** ===========================================================================
 * Network Summaries
 * ============================================================================
 */

interface NetworkSummariesDataQueryResult extends QueryResult {
  data: void;
  networkSummaries: IQuery["networkSummaries"];
}

export interface NetworkSummariesDataProps {
  networkSummaries: NetworkSummariesDataQueryResult;
}

export const withNetworkSummariesData = graphql(NetworkSummariesDocument, {
  name: "networkSummaries",
  ...noPollingConfig(["fiat"]),
});

/** ===========================================================================
 * Cosmos Account Balances
 * ============================================================================
 */

interface AccountBalancesQueryResult extends QueryResult {
  data: void;
  cosmosAccountBalances: IQuery["cosmosAccountBalances"];
}

export interface CosmosAccountBalancesProps {
  cosmosAccountBalances: AccountBalancesQueryResult;
}

export const withCosmosAccountBalances = graphql(
  CosmosAccountBalancesDocument,
  {
    name: "cosmosAccountBalances",
    ...fastPollingConfig(["address"]),
  },
);

/** ===========================================================================
 * Cosmos Rewards By Validator
 * ============================================================================
 */

interface RewardsByValidatorQueryResult extends QueryResult {
  data: void;
  cosmosRewardsByValidator: IQuery["cosmosRewardsByValidator"];
}

export interface RewardsByValidatorProps {
  cosmosRewardsByValidator: RewardsByValidatorQueryResult;
}

export const withRewardsByValidatorQuery = graphql(
  CosmosRewardsByValidatorDocument,
  {
    name: "cosmosRewardsByValidator",
    ...slowPollingConfig(["address"]),
  },
);

/** ===========================================================================
 * Cosmos Account History
 * ============================================================================
 */

export interface CosmosAccountHistoryQueryResult extends QueryResult {
  data: void;
  cosmosAccountHistory: IQuery["cosmosAccountHistory"];
}

export interface CosmosAccountHistoryProps {
  cosmosAccountHistory: CosmosAccountHistoryQueryResult;
}

export const withCosmosAccountHistory = graphql(CosmosAccountHistoryDocument, {
  name: "cosmosAccountHistory",
  ...slowPollingConfig(["address", "fiat"]),
});

/** ===========================================================================
 * Cosmos AccountInformation
 * ============================================================================
 */

interface AccountInformationQueryResult extends QueryResult {
  data: void;
  cosmosAccountInformation: IQuery["cosmosAccountInformation"];
}

export interface AccountInformationProps {
  cosmosAccountInformation: AccountInformationQueryResult;
}

export const withAccountInformation = graphql(
  CosmosAccountInformationDocument,
  {
    name: "cosmosAccountInformation",
    ...slowPollingConfig(["address"]),
  },
);

/** ===========================================================================
 * Cosmos Transactions
 * ============================================================================
 */

interface CosmosTransactionsQueryResult extends QueryResult {
  data: void;
  cosmosTransactions: IQuery["cosmosTransactions"];
}

export interface CosmosTransactionsProps {
  transactions: CosmosTransactionsQueryResult;
}

export const withCosmosTransactions = graphql(CosmosTransactionsDocument, {
  name: "transactions",
  ...noPollingConfig(["address", "startingPage"]),
});

/** ===========================================================================
 * Cosmos Validators
 * ============================================================================
 */

interface ValidatorsQueryResult extends QueryResult {
  data: void;
  cosmosValidators: IQuery["cosmosValidators"];
}

export interface ValidatorsProps {
  cosmosValidators: ValidatorsQueryResult;
}

export const withValidators = graphql(CosmosValidatorsDocument, {
  name: "cosmosValidators",
  ...noPollingConfig(["network"]),
});

/** ===========================================================================
 * Cosmos Staking Pool
 * ============================================================================
 */

interface StakingPoolQueryResult extends QueryResult {
  data: void;
  cosmosStakingPool: IQuery["cosmosStakingPool"];
}

export interface StakingPoolProps {
  cosmosStakingPool: StakingPoolQueryResult;
}

export const withStakingPool = graphql(CosmosStakingPoolDocument, {
  name: "cosmosStakingPool",
  ...noPollingConfig(["network"]),
});

/** ===========================================================================
 * Oasis Account Balances
 * ============================================================================
 */

interface OasisAccountBalancesQueryResult extends QueryResult {
  data: void;
  oasisAccountBalances: IQuery["oasisAccountBalances"];
}

export interface OasisAccountBalancesProps {
  oasisAccountBalances: OasisAccountBalancesQueryResult;
}

export const withOasisAccountBalances = graphql(OasisAccountBalancesDocument, {
  name: "oasisAccountBalances",
  ...fastPollingConfig(["address"]),
});

/** ===========================================================================
 * Oasis Account History
 * ============================================================================
 */

interface OasisAccountHistoryQueryResult extends QueryResult {
  data: void;
  oasisAccountHistory: IQuery["oasisAccountHistory"];
}

export interface OasisAccountHistoryProps {
  oasisAccountHistory: OasisAccountHistoryQueryResult;
}

export const withOasisAccountHistory = graphql(OasisAccountHistoryDocument, {
  name: "oasisAccountHistory",
  ...noPollingConfig(["address", "fiat"]),
});

/** ===========================================================================
 * Oasis Transactions
 * ============================================================================
 */

interface OasisTransactionsQueryResult extends QueryResult {
  data: void;
  oasisTransactions: IQuery["oasisTransactions"];
}

export interface OasisTransactionsProps {
  transactions: OasisTransactionsQueryResult;
}

export const withOasisTransactions = graphql(OasisTransactionsDocument, {
  name: "transactions",
  ...noPollingConfig(["address", "startingPage"]),
});

/** ===========================================================================
 * Celo System Balances
 * ============================================================================
 */

interface CeloSystemBalancesQueryResult extends QueryResult {
  data: void;
  celoSystemBalances: IQuery["celoSystemBalances"];
}

export interface CeloSystemBalancesProps {
  celoSystemBalances: CeloSystemBalancesQueryResult;
}

export const withCeloSystemBalances = graphql(CeloSystemBalancesDocument, {
  name: "celoSystemBalances",
  ...noPollingConfig([]),
});

/** ===========================================================================
 * Celo Account Balances
 * ============================================================================
 */

interface CeloAccountBalancesQueryResult extends QueryResult {
  data: void;
  celoAccountBalances: IQuery["celoAccountBalances"];
}

export interface CeloAccountBalancesProps {
  celoAccountBalances: CeloAccountBalancesQueryResult;
}

export const withCeloAccountBalances = graphql(CeloAccountBalancesDocument, {
  name: "celoAccountBalances",
  ...fastPollingConfig(["address"]),
});

/** ===========================================================================
 * Celo Account History
 * ============================================================================
 */

interface CeloAccountHistoryQueryResult extends QueryResult {
  data: void;
  celoAccountHistory: IQuery["celoAccountHistory"];
}

export interface CeloAccountHistoryProps {
  celoAccountHistory: CeloAccountHistoryQueryResult;
}

export const withCeloAccountHistory = graphql(CeloAccountHistoryDocument, {
  name: "celoAccountHistory",
  ...noPollingConfig(["address", "fiat"]),
});

/** ===========================================================================
 * Celo Transactions
 * ============================================================================
 */

interface CeloTransactionsQueryResult extends QueryResult {
  data: void;
  celoTransactions: IQuery["celoTransactions"];
}

export interface CeloTransactionsProps {
  transactions: CeloTransactionsQueryResult;
}

export const withCeloTransactions = graphql(CeloTransactionsDocument, {
  name: "transactions",
  ...noPollingConfig(["address", "startingPage"]),
});

/** ===========================================================================
 * Celo Transaction
 * ============================================================================
 */

interface CeloTransactionQueryResult extends QueryResult {
  data: void;
  celoTransaction: IQuery["celoTransaction"];
}

export interface CeloTransactionProps {
  transactions: CeloTransactionQueryResult;
}

export const withCeloTransaction = graphql(CeloTransactionDocument, {
  name: "transaction",
  ...noPollingConfig(["address", "startingPage"]),
});

/** ===========================================================================
 * Celo Validator Groups
 * ============================================================================
 */

interface CeloValidatorsQueryResult extends QueryResult {
  data: void;
  celoValidatorGroups: IQuery["celoValidatorGroups"];
}

export interface CeloValidatorsProps {
  celoValidatorGroups: CeloValidatorsQueryResult;
}

export const withCeloValidatorGroups = graphql(CeloValidatorGroupsDocument, {
  name: "celoValidatorGroups",
  ...noPollingConfig(["address", "fiat"]),
});

/** ===========================================================================
 * Celo Governance Proposals
 * ============================================================================
 */

interface CeloGovernanceProposalsQueryResult extends QueryResult {
  data: void;
  celoGovernanceProposals: IQuery["celoGovernanceProposals"];
}

export interface CeloGovernanceProposalsProps {
  celoGovernanceProposals: CeloGovernanceProposalsQueryResult;
}

export const withCeloGovernanceProposals = graphql(
  CeloGovernanceProposalsDocument,
  {
    name: "celoGovernanceProposals",
    ...noPollingConfig(["address", "fiat"]),
  },
);

/** ===========================================================================
 * Celo Governance Transactions History
 * ============================================================================
 */

interface CeloGovernanceTransactionsQueryResult extends QueryResult {
  data: void;
  celoGovernanceTransactions: IQuery["celoGovernanceTransactions"];
}

export interface CeloGovernanceTransactionsProps {
  transactions: CeloGovernanceTransactionsQueryResult;
}

export const withCeloGovernanceTransactions = graphql(
  CeloGovernanceTransactionsDocument,
  {
    name: "transactions",
    ...noPollingConfig(["address"]),
  },
);
