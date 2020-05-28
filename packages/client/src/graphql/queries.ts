import {
  AccountBalancesDocument,
  AccountInformationDocument,
  CeloAccountHistoryDocument,
  CeloTransactionsDocument,
  CosmosTransactionsDocument,
  DailyPercentChangeDocument,
  FiatCurrenciesDocument,
  FiatPriceHistoryDocument,
  IQuery,
  OasisTransactionsDocument,
  PortfolioHistoryDocument,
  PricesDocument,
  RewardsByValidatorDocument,
  StakingPoolDocument,
  ValidatorsDocument,
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
      crypto: network.ticker,
      networkDefinition: network,
      currency: network.coinGeckoTicker,
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
  | "crypto"
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
 * AccountBalance
 * ============================================================================
 */

interface AccountBalancesQueryResult extends QueryResult {
  data: void;
  accountBalances: IQuery["accountBalances"];
}

export interface AccountBalancesProps {
  accountBalances: AccountBalancesQueryResult;
}

export const withAccountBalances = graphql(AccountBalancesDocument, {
  name: "accountBalances",
  ...fastPollingConfig(["address"]),
});

/** ===========================================================================
 * AtomPriceData
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
 * DailyPercentageChange
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
  ...fastPollingConfig(["crypto", "fiat"]),
});

/** ===========================================================================
 * RewardsByValidator
 * ============================================================================
 */

interface RewardsByValidatorQueryResult extends QueryResult {
  data: void;
  rewardsByValidator: IQuery["rewardsByValidator"];
}

export interface RewardsByValidatorProps {
  rewardsByValidator: RewardsByValidatorQueryResult;
}

export const withRewardsByValidatorQuery = graphql(RewardsByValidatorDocument, {
  name: "rewardsByValidator",
  ...slowPollingConfig(["address"]),
});

/** ===========================================================================
 * Portfolio History
 * ============================================================================
 */

export interface PortfolioHistoryQueryResult extends QueryResult {
  data: void;
  portfolioHistory: IQuery["portfolioHistory"];
}

export interface PortfolioHistoryProps {
  portfolioHistory: PortfolioHistoryQueryResult;
}

export const withPortfolioHistoryDataQuery = graphql(PortfolioHistoryDocument, {
  name: "portfolioHistory",
  ...slowPollingConfig(["address", "fiat"]),
});

/** ===========================================================================
 * FiatPriceHistory
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
 * FiatCurrencies
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
 * AccountInformation
 * ============================================================================
 */

interface AccountInformationQueryResult extends QueryResult {
  data: void;
  accountInformation: IQuery["accountInformation"];
}

export interface AccountInformationProps {
  accountInformation: AccountInformationQueryResult;
}

export const withAccountInformation = graphql(AccountInformationDocument, {
  name: "accountInformation",
  ...slowPollingConfig(["address"]),
});

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
 * Validators
 * ============================================================================
 */

interface ValidatorsQueryResult extends QueryResult {
  data: void;
  validators: IQuery["validators"];
}

export interface ValidatorsProps {
  validators: ValidatorsQueryResult;
}

export const withValidators = graphql(ValidatorsDocument, {
  name: "validators",
  ...noPollingConfig(["network"]),
});

/** ===========================================================================
 * Staking Pool
 * ============================================================================
 */

interface StakingPoolQueryResult extends QueryResult {
  data: void;
  stakingPool: IQuery["stakingPool"];
}

export interface StakingPoolProps {
  stakingPool: StakingPoolQueryResult;
}

export const withStakingPool = graphql(StakingPoolDocument, {
  name: "stakingPool",
  ...noPollingConfig(["network"]),
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
 * Celo Account History
 * ============================================================================
 */

interface CeloAccountHistoryQueryResult extends QueryResult {
  data: void;
  celoAccountHistory: IQuery["celoAccountHistory"];
}

export interface CeoTransactionsProps {
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

export interface CeoTransactionsProps {
  transactions: CeloTransactionsQueryResult;
}

export const withCeloTransactions = graphql(CeloTransactionsDocument, {
  name: "transactions",
  ...noPollingConfig(["address", "startingPage"]),
});
