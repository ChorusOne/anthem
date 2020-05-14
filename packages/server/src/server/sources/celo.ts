import { IDelegation, IQuery, NetworkDefinition } from "@anthem/utils";
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

interface CeloAccountResponse {
  address: string;
  height: string;
  goldTokenBalance: string;
  totalLockedGoldBalance: string;
  nonVotingLockedGoldBalance: string;
  votingLockedGoldBalance: string;
  pendingWithdrawalBalance: string;
  celoUSDValue: string;
  delegations: CeloDelegation[];
}

interface CeloAccountSnapshot {
  snapshotDate: string;
  address: string;
  height: string;
  snapshotReward: string;
  goldTokenBalance: string;
  totalLockedGoldBalance: string;
  nonVotingLockedGoldBalance: string;
  votingLockedGoldBalance: string;
  pendingWithdrawalBalance: string;
  celoUSDValue: string;
  delegations: CeloDelegation[];
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
): Promise<IQuery["accountBalances"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get<CeloAccountResponse>(
    `${host}/account/${address}`,
  );

  const {
    delegations,
    goldTokenBalance,
    totalLockedGoldBalance,
    nonVotingLockedGoldBalance,
    votingLockedGoldBalance,
    pendingWithdrawalBalance,
  } = response;

  return {
    balance: [
      {
        denom: network.denom,
        amount: goldTokenBalance,
      },
    ],
    rewards: [
      {
        denom: network.denom,
        amount: pendingWithdrawalBalance,
      },
    ],
    delegations: delegations.map(x => convertDelegations(x, address)),
    unbonding: [],
    commissions: [],
  };
};

/**
 * Fetch account history.
 */
const fetchAccountHistory = async (
  address: string,
  network: NetworkDefinition,
): Promise<IQuery["celoAccountHistory"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get<CeloAccountSnapshot[]>(
    `${host}/history/${address}`,
  );

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

  // TODO: Implement
  // const response = await AxiosUtil.get<any[]>(
  //   `${host}/account/${address}/events`,
  // );

  return {
    page: 1,
    limit: 25,
    moreResultsExist: false,
    data: [],
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
