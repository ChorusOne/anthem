import {
  assertUnreachable,
  getValidatorAddressFromDelegatorAddress,
  ICosmosBalanceHistory,
  ICosmosCommissionHistory,
  ICosmosRewardHistory,
  IQuery,
  NETWORK_NAME,
  NetworkDefinition,
} from "@anthem/utils";
import { Pool } from "pg";
import { PaginationParams } from "../../resolvers/resolvers";
import ENV from "../../tools/server-env";
import {
  filterSanityCheckHeights,
  formatTransactionResponse,
  gatherEndOfDayBalanceValues,
  mapSumToBalance,
} from "../../tools/server-utils";
import { getSqlQueryString, SQLVariables } from "../../tools/sql-utils";

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
    case "POLKADOT":
    case "CELO":
    case "OASIS":
      // Not supported yet
      console.warn(`${network} is not supported yet!`);
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
    OFFSET @startingPage
    LIMIT @pageSize + 1
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
    SELECT address, height, timestamp, denom, sum(rewards) FROM rewards
    WHERE address = @address
    GROUP BY address, height, timestamp, chain, denom
    ORDER BY timestamp
  `;

  return getSqlQueryString(sql, variables);
};

const getRewardsQueryForValidator = () => (variables: SQLVariables): string => {
  const sql = `
    SELECT validator, height, timestamp, denom, sum(rewards) FROM val_rewards
    WHERE validator = @validatorAddress
    GROUP BY validator, height, timestamp, chain, denom
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
}): Promise<ICosmosBalanceHistory[]> => {
  const { address, network } = request;
  const variables = { address };
  const balanceQuery = getBalanceQueryForAddress();
  const query = balanceQuery(variables);
  const response = await queryPostgresCosmosSdkPool(network.name, query);
  return gatherEndOfDayBalanceValues(response);
};

const getPortfolioDelegatorRewards = async (request: {
  address: string;
  network: NetworkDefinition;
}): Promise<ICosmosRewardHistory[]> => {
  const { address, network } = request;
  const variables = { address };
  const rewardsQuery = getRewardsQueryForDelegator();
  const query = rewardsQuery(variables);
  const result = await queryPostgresCosmosSdkPool(network.name, query);
  if (result) {
    return result.filter(filterSanityCheckHeights).map(mapSumToBalance);
  } else {
    return [];
  }
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
}): Promise<ICosmosCommissionHistory[]> => {
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
): Promise<IQuery["cosmosTransaction"]> => {
  const variables = { hash: hash.toUpperCase() };
  const transactionQuery = getTransactionByHashQuery();
  const query = transactionQuery(variables);
  const response = await queryPostgresCosmosSdkPool(network.name, query);

  if (!response || !response.length) {
    throw new Error(`No transaction found for hash: ${hash}`);
  }

  const result = response.map(formatTransactionResponse);
  const transaction = result[0];
  return transaction;
};

export const getTransactions = async (
  args: PaginationParams,
): Promise<IQuery["cosmosTransactions"]> => {
  const { address, network, startingPage, pageSize } = args;
  /**
   * Determine the offset from the starting page, adjust by 1 and the requested
   * page size. For example, the 1st page offset should be 0,
   * hence: (1 - 1) * 25 -> 0.
   */
  const offset = (startingPage - 1) * pageSize;
  const variables = {
    address,
    pageSize,
    startingPage: offset,
  };
  const transactionsQuery = getTransactionsQuery();
  const query = transactionsQuery(variables);
  const response = await queryPostgresCosmosSdkPool(network.name, query);

  /**
   * Adjust the result to the requested page size. We request more to determine
   * if more results exist or not.
   */
  const pages = response.slice(0, pageSize);
  const moreResultsExist = response.length > pageSize;
  const result = pages.map(formatTransactionResponse);
  return {
    data: result,
    limit: pageSize,
    moreResultsExist,
    page: startingPage,
  };
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
