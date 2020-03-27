import { Pool } from "pg";
import {
  IPortfolioBalance,
  IPortfolioCommission,
  IPortfolioReward,
  IQuery,
} from "../../schema/graphql-types";
import ENV from "../../tools/env-utils";
import { getSqlQueryString, SQLVariables } from "../../tools/sql-utils";
import {
  assertUnreachable,
  filterSanityCheckHeights,
  formatTransactionResponse,
  getValidatorAddressFromDelegatorAddress,
  mapSumToBalance,
} from "../../tools/utils";
import { NETWORK_NAME, NetworkDefinition } from "./networks";

/** ===========================================================================
 * Postgres Pool
 * ============================================================================
 */

const cosmosPool = new Pool({ database: ENV.COSMOS_DB });
const terraPool = new Pool({ database: ENV.TERRA_DB });
const kavaPool = new Pool({ database: ENV.KAVA_DB });

export const cosmosSdkPools = {
  cosmosPool,
  terraPool,
  kavaPool,
};

/**
 * Execute a query against the appropriate cosmos-sdk database pool.
 */
export const queryPostgresCosmosSdkPool = async (
  network: NETWORK_NAME,
  query: string,
): Promise<any> => {
  let response;

  switch (network) {
    case "COSMOS":
      response = await cosmosPool.query(query);
      break;
    case "TERRA":
      response = await terraPool.query(query);
      break;
    case "KAVA":
      response = await kavaPool.query(query);
      break;
    case "OASIS":
      // Not supported yet
      return;
    default:
      return assertUnreachable(network);
  }

  return response.rows;
};

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

const getTransactionByHashQuery = () => (variables: SQLVariables): string => {
  const sql = `
    SELECT * FROM transactions WHERE hash = @hash
  `;

  return getSqlQueryString(sql, variables);
};

const getTransactionsQuery = () => (variables: SQLVariables): string => {
  const sql = `
  SELECT * FROM transactions
  WHERE hash IN (SELECT hash FROM message_addresses WHERE address = @address)
  ORDER BY timestamp DESC
  LIMIT 25
  `;

  return getSqlQueryString(sql, variables);
};

const getBalanceQueryForAddress = () => (variables: SQLVariables): string => {
  const sql = `
    SELECT * FROM balance
    WHERE address = @address
    ORDER BY timestamp
  `;

  return getSqlQueryString(sql, variables);
};

const getRewardsQueryForDelegator = () => (variables: SQLVariables): string => {
  const sql = `
    SELECT address, height, timestamp, sum(rewards) FROM rewards
    WHERE address = @address
    GROUP BY address, height, timestamp, chain
    ORDER BY timestamp
  `;

  return getSqlQueryString(sql, variables);
};

const getRewardsQueryForValidator = () => (variables: SQLVariables): string => {
  const sql = `
    SELECT validator, height, timestamp, sum(rewards) FROM val_rewards
    WHERE validator = @validatorAddress
    GROUP BY validator, height, timestamp, chain
    ORDER BY timestamp
  `;

  return getSqlQueryString(sql, variables);
};

const getDelegationsQuery = () => (variables: SQLVariables): string => {
  const sql = `
    SELECT address, timestamp, sum(shares) FROM delegations
    WHERE address = @address
    GROUP BY address, timestamp, chain
    ORDER BY timestamp
  `;

  return getSqlQueryString(sql, variables);
};

const getUnbondingsQuery = () => (variables: SQLVariables): string => {
  const sql = `
    SELECT address, timestamp, sum(tokens) FROM unbondings
    WHERE address = @address
    GROUP BY address, timestamp, chain
    ORDER BY timestamp
  `;

  return getSqlQueryString(sql, variables);
};

/** ===========================================================================
 * Extractor API Helpers
 * ============================================================================
 */

const getPortfolioBalanceHistory = async (request: {
  address: string;
  network: NetworkDefinition;
}): Promise<IPortfolioBalance[]> => {
  const { address, network } = request;
  const variables = { address };
  const balanceQuery = getBalanceQueryForAddress();
  const query = balanceQuery(variables);
  return queryPostgresCosmosSdkPool(network.name, query);
};

const getPortfolioDelegatorRewards = async (request: {
  address: string;
  network: NetworkDefinition;
}): Promise<IPortfolioReward[]> => {
  const { address, network } = request;
  const variables = { address };
  const rewardsQuery = getRewardsQueryForDelegator();
  const query = rewardsQuery(variables);
  const result = await queryPostgresCosmosSdkPool(network.name, query);
  return result.filter(filterSanityCheckHeights).map(mapSumToBalance);
};

const getPortfolioDelegations = async (request: {
  address: string;
  network: NetworkDefinition;
}) => {
  const { address, network } = request;
  const variables = { address };
  const delegationsQuery = getDelegationsQuery();
  const query = delegationsQuery(variables);
  const result = await queryPostgresCosmosSdkPool(network.name, query);
  return result.map(mapSumToBalance);
};

const getPortfolioUnbondings = async (request: {
  address: string;
  network: NetworkDefinition;
}) => {
  const { address, network } = request;
  const variables = { address };
  const unbondingsQuery = getUnbondingsQuery();
  const query = unbondingsQuery(variables);
  const result = await queryPostgresCosmosSdkPool(network.name, query);
  return result.map(mapSumToBalance);
};

const getPortfolioValidatorRewards = async (request: {
  address: string;
  network: NetworkDefinition;
}): Promise<IPortfolioCommission[]> => {
  const { address, network } = request;
  const validatorAddress = getValidatorAddressFromDelegatorAddress(
    address,
    network.name,
  );

  if (validatorAddress) {
    const variables = { validatorAddress };
    const rewardsQuery = getRewardsQueryForValidator();
    const query = rewardsQuery(variables);
    const result = await queryPostgresCosmosSdkPool(network.name, query);
    return result.filter(filterSanityCheckHeights).map(mapSumToBalance);
  } else {
    return [];
  }
};

export const getTransactionByHash = async (
  hash: string,
  network: NetworkDefinition,
): Promise<IQuery["transaction"]> => {
  const variables = { hash: hash.toUpperCase() };
  const transactionQuery = getTransactionByHashQuery();
  const query = transactionQuery(variables);
  const response = await queryPostgresCosmosSdkPool(network.name, query);
  const result = response.map(formatTransactionResponse);
  const transaction = result[0] || null;
  return transaction;
};

export const getTransactions = async (
  address: string,
  network: NetworkDefinition,
): Promise<IQuery["transactions"]> => {
  const variables = { address };
  const transactionsQuery = getTransactionsQuery();
  const query = transactionsQuery(variables);
  const response = await queryPostgresCosmosSdkPool(network.name, query);
  const result = response.map(formatTransactionResponse);
  return result;
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

const COSMOS_EXTRACTOR = {
  getTransactionByHash,
  getTransactions,
  getPortfolioUnbondings,
  getPortfolioDelegations,
  getPortfolioBalanceHistory,
  getPortfolioDelegatorRewards,
  getPortfolioValidatorRewards,
};

export default COSMOS_EXTRACTOR;
