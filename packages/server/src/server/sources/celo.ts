import {
  CeloTransaction,
  ICeloAccountBalances,
  ICeloAccountBalancesType,
  ICeloTransaction,
  ICeloTransactionDetails,
  ICeloTransactionTags,
  IDelegation,
  IQuery,
  NetworkDefinition,
} from "@anthem/utils";
import { AxiosUtil, getHostFromNetworkName } from "../axios-utils";
import { PaginationParams } from "../resolvers";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface CeloDelegation {
  group: string;
  totalVotes: string;
  activeVotes: string;
  pendingVotes: string;
}

interface CeloAccountSnapshot {
  snapshotDate: string;
  address: string;
  height: string;
  snapshotReward: string;
  availableGoldBalance: string;
  totalLockedGoldBalance: string;
  nonVotingLockedGoldBalance: string;
  votingLockedGoldBalance: string;
  pendingWithdrawalBalance: string;
  celoUSDValue: string;
  delegations: CeloDelegation[];
}

interface CeloTransactionResponse {
  blockNumber: number;
  hash: string;
  timestamp: string;
  from: string;
  to: string;
  tags: ICeloTransactionTags[];
  logs: any; // Not used yet
  details: {
    transaction: ICeloTransactionDetails;
  };
}

/** ===========================================================================
 * Celo REST API Utils
 * ----------------------------------------------------------------------------
 * This file contains the utils for fetching Celo Network data.
 * ============================================================================
 */

/**
 * Fetch Celo account balances.
 */
const fetchAccountBalances = async (
  address: string,
  network: NetworkDefinition,
): Promise<ICeloAccountBalancesType> => {
  const host = getHostFromNetworkName(network.name);
  const url = `${host}/accounts/${address}`;
  const response = await AxiosUtil.get<ICeloAccountBalances>(url);
  return { celo: response };
};

/**
 * Fetch account history.
 */
const fetchAccountHistory = async (
  address: string,
  network: NetworkDefinition,
): Promise<IQuery["celoAccountHistory"]> => {
  const host = getHostFromNetworkName(network.name);
  const url = `${host}/accounts/${address}/history`;
  const response = await AxiosUtil.get<CeloAccountSnapshot[]>(url);

  return response;
};

/**
 * Fetch transactions history.
 */
const fetchTransactions = async (
  args: PaginationParams,
): Promise<IQuery["celoTransactions"]> => {
  const { address, network, startingPage, pageSize } = args;
  const host = getHostFromNetworkName(network.name);
  const params = `limit=${pageSize + 1}&page=${startingPage}`;
  const url = `${host}/accounts/${address}/transactions?${params}`;
  const response = await AxiosUtil.get<CeloTransactionResponse[]>(url);

  const pages = response.slice(0, pageSize);
  const moreResultsExist = response.length > pageSize;
  const formattedResponse: ICeloTransaction[] = pages.map(
    formatCeloTransaction,
  );

  return {
    limit: pageSize,
    moreResultsExist,
    page: startingPage,
    data: formattedResponse,
  };
};

/**
 * Fetch a single transaction by hash.
 */
const fetchTransaction = async (hash: string): Promise<CeloTransaction> => {
  const host = getHostFromNetworkName("CELO");
  const path = `system/transactions/${hash}`;
  const url = `${host}/${path}`;
  const response = await AxiosUtil.get<CeloTransaction>(url);
  return formatCeloTransaction(response);
};

/**
 * Fetch system balances.
 */
const fetchSystemBalances = async (): Promise<IQuery["celoSystemBalances"]> => {
  const host = getHostFromNetworkName("CELO");
  const url = `${host}/system/balances`;
  return AxiosUtil.get<IQuery["celoSystemBalances"]>(url);
};

/**
 * Fetch system history.
 */
const fetchSystemHistory = async (): Promise<IQuery["celoSystemHistory"]> => {
  const host = getHostFromNetworkName("CELO");
  const url = `${host}/system/history`;
  return AxiosUtil.get<IQuery["celoSystemHistory"]>(url);
};

/**
 * Fetch system validator groups list.
 */
const fetchValidatorGroups = async (): Promise<IQuery["celoValidatorGroups"]> => {
  const host = getHostFromNetworkName("CELO");
  const url = `${host}/system/validator_groups`;
  return AxiosUtil.get<IQuery["celoValidatorGroups"]>(url);
};

/** ===========================================================================
 * Utils
 * ============================================================================
 */

/**
 * Return the tags as a JSON string to avoid creating a GraphQL union
 * type for the tags data.
 */
const stringifyTags = (tag: ICeloTransactionTags) => {
  return {
    eventname: tag.eventname,
    source: tag.source,
    prettyname: tag.prettyname,
    parameters: JSON.stringify(tag.parameters), // Return tags as JSON
  };
};

/**
 * Transform the delegations to match the expected GraphQL schema
 * definition.
 */
const convertDelegations = (
  delegation: CeloDelegation,
  address: string,
): IDelegation => {
  return {
    delegator_address: address,
    validator_address: delegation.group,
    shares: delegation.totalVotes,
  };
};

/**
 * Transform Celo transaction response data.
 */
const formatCeloTransaction = (tx: CeloTransactionResponse) => {
  return {
    ...tx,
    details: tx.details.transaction,
    tags: tx.tags.map(stringifyTags),
  };
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

const CELO = {
  fetchAccountBalances,
  fetchAccountHistory,
  fetchTransactions,
  fetchTransaction,
  fetchSystemBalances,
  fetchSystemHistory,
  fetchValidatorGroups,
};

export default CELO;
