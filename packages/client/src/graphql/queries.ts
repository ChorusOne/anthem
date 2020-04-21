import { graphql, QueryOpts, QueryResult } from "react-apollo";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import { AccountBalancesDocument } from "@anthem/utils";
import {
  // AccountBalancesDocument,
  AccountInformationDocument,
  DailyPercentChangeDocument,
  FiatCurrenciesDocument,
  FiatPriceHistoryDocument,
  IQuery,
  PortfolioHistoryDocument,
  PricesDocument,
  RewardsByValidatorDocument,
  TransactionsDocument,
  ValidatorsDocument,
} from "graphql/types";
import ENV from "lib/client-env";
import { ReduxStoreState } from "modules/root";

/** ===========================================================================
 * GraphQL Data:
 * ============================================================================
 */

const addressSelector = (state: ReduxStoreState) => state.ledger.ledger.address;
const networkSelector = (state: ReduxStoreState) => state.ledger.ledger.network;
const fiatSelector = (state: ReduxStoreState) =>
  state.settings.fiatCurrency.symbol;

export const graphqlSelector = createSelector(
  [addressSelector, networkSelector, fiatSelector],
  (address, network, fiat) => {
    return {
      fiat,
      address,
      versus: fiat,
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

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

const getQueryConfig = (pollInterval: number | undefined) => (
  variableKeys?: ReadonlyArray<VariablesKeys>,
) => ({
  options: (props: GraphQLConfigProps): QueryOpts => {
    const variables: { [k: string]: string } = {};

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
  | "network";

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
 * Query Providers
 * ----------------------------------------------------------------------------
 * These are helpers to make it easy to fetch data from GraphQL APIs and
 * provide the response data components.
 * ============================================================================
 */

/**
 * AccountBalance
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

/**
 * AtomPriceData
 */

interface AtomPriceDataQueryResult extends QueryResult {
  data: void;
  prices: IQuery["prices"];
}

export interface AtomPriceDataProps {
  prices: AtomPriceDataQueryResult;
}

export const withAtomPriceData = graphql(PricesDocument, {
  name: "prices",
  ...fastPollingConfig(["versus", "currency"]),
});

/**
 * DailyPercentageChange
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

/**
 * RewardsByValidator
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

/**
 * Portfolio History
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

/**
 * FiatPriceHistory
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

/**
 * FiatCurrencies
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

/**
 * AccountInformation
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

/**
 * Transactions
 */

interface TransactionsQueryResult extends QueryResult {
  data: void;
  transactions: IQuery["transactions"];
}

export interface TransactionsProps {
  transactions: TransactionsQueryResult;
}

export const withTransactions = graphql(TransactionsDocument, {
  name: "transactions",
  ...noPollingConfig(["address"]),
});

/**
 * Validators
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
