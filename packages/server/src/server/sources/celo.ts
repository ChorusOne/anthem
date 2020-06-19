import {
  ICeloAccountBalances,
  ICeloGovernanceProposal,
  ICeloTransaction,
  ICeloTransactionTags,
  IQuery,
  NetworkDefinition,
} from "@anthem/utils";
import { AxiosUtil, getHostFromNetworkName } from "../axios-utils";
import { PaginationParams } from "../resolvers/resolvers";

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
    nonce: number;
    gasLimit: number;
    gasPrice: number;
    gasUsed: number;
    feeCurrency: string | null;
    gatewayFeeRecipient: string | null;
    gatewayFee: number;
    to: string;
    value: number;
    raw: any;
  };
}

interface CeloGovernanceProposalResponse {
  proposalID: number;
  index: number;
  blockNumber: number;
  stage: string;
  proposer: string;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  description: string;
  proposalEpoch: number;
  referendumEpoch: number;
  executionEpoch: number;
  expirationEpoch: number;
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
): Promise<ICeloAccountBalances> => {
  const host = getHostFromNetworkName(network.name);
  const url = `${host}/accounts/${address}`;
  const response = await AxiosUtil.get<ICeloAccountBalances>(url);
  return response;
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
const fetchTransaction = async (hash: string): Promise<ICeloTransaction> => {
  const host = getHostFromNetworkName("CELO");
  const path = `system/transactions/${hash}`;
  const url = `${host}/${path}`;
  const response = await AxiosUtil.get<{
    transaction: CeloTransactionResponse;
  }>(url);
  return formatCeloTransaction(response.transaction);
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

/**
 * Fetch current governance proposals
 */
const fetchGovernanceProposals = async (): Promise<IQuery["celoGovernanceProposals"]> => {
  // Real API:
  // const host = getHostFromNetworkName("CELO");
  // const url = `${host}/system/referendum_proposals`;
  // const response = AxiosUtil.get<CeloGovernanceProposalResponse[]>(url);

  const mockProposals: CeloGovernanceProposalResponse[] = [
    {
      proposalID: 1,
      index: 0,
      blockNumber: 144000,
      stage: "Referendum",
      proposer: "0xf3eb910da09b8af348e0e5b6636da442cfa79239",
      yesVotes: 4.775186165115204e24,
      noVotes: 0,
      abstainVotes: 0,
      description:
        "https://gist.github.com/aslawson/a1f693f0e4c5fd391eac463237c4182a",
      proposalEpoch: 1588120122,
      referendumEpoch: 1588206522,
      executionEpoch: 1588379322,
      expirationEpoch: 1588638522,
    },
    {
      proposalID: 2,
      index: 0,
      blockNumber: 130000,
      stage: "Referendum",
      proposer: "0xf3eb910da09b8af348e0e5b6636da442cfa79239",
      yesVotes: 3.134e23,
      noVotes: 0,
      abstainVotes: 0,
      description:
        "https://gist.github.com/aslawson/a1f693f0e4c5fd391eac463237c4182a",
      proposalEpoch: 1588120122,
      referendumEpoch: 1588206522,
      executionEpoch: 1588379322,
      expirationEpoch: 1588638522,
    },
  ];

  const result = await transformGovernanceProposals(mockProposals);
  return result;
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
    parameters: JSON.stringify(tag.parameters), // Return tags as JSON
  };
};

/**
 * Transform Celo transaction response data.
 */
const formatCeloTransaction = (tx: CeloTransactionResponse) => {
  const { raw, ...details } = tx.details;
  const result: ICeloTransaction = {
    ...tx,
    details,
    tags: tx.tags.map(stringifyTags),
  };

  return result;
};

/**
 * Fetch the actual gist content for each proposal.
 */
const transformGovernanceProposals = async (
  proposals: CeloGovernanceProposalResponse[],
): Promise<ICeloGovernanceProposal[]> => {
  return Promise.all(
    proposals.map(async content => {
      const gist = content.description;
      return {
        ...content,
        gist,
        description: await fetchProposalGistContent(gist),
      };
    }),
  );
};

/**
 * Given a proposal GitHub gist link fetch the raw content.
 */
const fetchProposalGistContent = async (gistUrl: string) => {
  try {
    const url = `${gistUrl}/raw`;
    const description = await AxiosUtil.get<string>(url);
    return description;
  } catch (err) {
    return "";
  }
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
  fetchGovernanceProposals,
};

export default CELO;
