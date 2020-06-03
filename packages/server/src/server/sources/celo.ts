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
  const url = `${host}/accounts/${address}/balances`;
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
  pageSize: number,
  startingPage: number,
  network: NetworkDefinition,
): Promise<IQuery["celoTransactions"]> => {
  const host = getHostFromNetworkName(network.name);

  const url = `${host}/accounts/${address}/transactions`;
  const response = await AxiosUtil.get<CeloTransactionResponse[]>(url);

  // TODO: Improve
  const formattedResponse: ICeloTransaction[] = response.map(x => ({
    ...x,
    details: x.details.transaction,
    tags: x.tags.map(t => ({
      tag: t.tag,
      parameters: JSON.stringify(t.parameters), // Return tags as JSON
    })),
  }));

  return {
    page: 1,
    limit: 25,
    moreResultsExist: false,
    data: formattedResponse,
  };
};

/** ===========================================================================
 * Utils
 * ============================================================================
 */

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
