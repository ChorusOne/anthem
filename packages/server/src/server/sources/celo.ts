import {
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
  address: string,
  startingPage: number,
  pageSize: number,
  network: NetworkDefinition,
): Promise<IQuery["celoTransactions"]> => {
  const host = getHostFromNetworkName(network.name);
  const params = `limit=${pageSize + 1}&page=${startingPage}`;
  const url = `${host}/accounts/${address}/transactions?${params}`;
  const response = await AxiosUtil.get<CeloTransactionResponse[]>(url);

  const pages = response.slice(0, pageSize);
  const moreResultsExist = response.length > pageSize;
  const formattedResponse: ICeloTransaction[] = pages.map(x => ({
    ...x,
    details: x.details.transaction,
    tags: x.tags.map(stringifyTags),
  }));

  return {
    limit: pageSize,
    moreResultsExist,
    page: startingPage,
    data: formattedResponse,
  };
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

/** ===========================================================================
 * Export
 * ============================================================================
 */

const CELO = {
  fetchAccountBalances,
  fetchAccountHistory,
  fetchTransactions,
};

export default CELO;
