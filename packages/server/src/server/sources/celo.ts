import {
  ICeloAccountBalances,
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

interface CeloGovernanceProposalHistoryResponse {
  queuedProposals: GenericProposalHistory[];
  approvalProposals: GenericProposalHistory[];
  referendumProposals: GenericProposalHistory[];
  executionProposals: GenericProposalHistory[];
  expiredProposals: GenericProposalHistory[];
}

// Only contains shard type definitions common to each proposal type
interface GenericProposalHistory {
  proposalID: number;
  stage: string;
  proposer: string;
  description: string;
}

const mockProposals = {
  queuedProposals: [
    {
      proposalID: 1,
      index: 0,
      currentBlockNumber: 400000,
      stage: "Queued",
      proposer: "0xf3eb910da09b8af348e0e5b6636da442cfa79239",
      upvotes: 1.4285841e24,
      description:
        "https://github.com/celo-org/celo-proposals/blob/master/CGPs/0001.md",
      proposalEpoch: 1589480751,
      referendumEpoch: 1589567151,
      executionEpoch: 1589739951,
      expirationEpoch: 1589999151,
      queuedAtBlockNumber: 381386,
      deposit: 100000000000000000000,
      queuedAtTimestamp: 1589480751,
    },
    {
      proposalID: 2,
      index: 1,
      currentBlockNumber: 400000,
      stage: "Queued",
      proposer: "0xf3eb910da09b8af348e0e5b6636da442cfa79239",
      upvotes: 2.135001e23,
      description:
        "https://github.com/celo-org/celo-proposals/blob/master/CGPs/0002.md",
      proposalEpoch: 1589481016,
      referendumEpoch: 1589567416,
      executionEpoch: 1589740216,
      expirationEpoch: 1589999416,
      queuedAtBlockNumber: 381439,
      deposit: 100000000000000000000,
      queuedAtTimestamp: 1589481016,
    },
  ],
  approvalProposals: [
    {
      proposalID: 3,
      index: 0,
      currentBlockNumber: 410000,
      stage: "Approval",
      proposer: "0xf3eb910da09b8af348e0e5b6636da442cfa79239",
      description:
        "https://github.com/celo-org/celo-proposals/blob/master/CGPs/0001.md",
      proposalEpoch: 1589574880,
      referendumEpoch: 1589661280,
      executionEpoch: 1589834080,
      expirationEpoch: 1590093280,
      queuedAtBlockNumber: 381386,
      deposit: 100000000000000000000,
      queuedAtTimestamp: 1589480751,
    },
    {
      proposalID: 4,
      index: 1,
      currentBlockNumber: 410000,
      stage: "Approval",
      proposer: "0xf3eb910da09b8af348e0e5b6636da442cfa79239",
      description:
        "https://github.com/celo-org/celo-proposals/blob/master/CGPs/0002.md",
      proposalEpoch: 1589574880,
      referendumEpoch: 1589661280,
      executionEpoch: 1589834080,
      expirationEpoch: 1590093280,
      queuedAtBlockNumber: 381439,
      deposit: 100000000000000000000,
      queuedAtTimestamp: 1589481016,
    },
  ],
  referendumProposals: [
    {
      proposalID: 5,
      index: 0,
      currentBlockNumber: 450000,
      stage: "Referendum",
      proposer: "0xf3eb910da09b8af348e0e5b6636da442cfa79239",
      yesVotes: 4.726916770837158e25,
      noVotes: 0,
      abstainVotes: 0,
      description:
        "https://github.com/celo-org/celo-proposals/blob/master/CGPs/0001.md",
      proposalEpoch: 1589574880,
      referendumEpoch: 1589661280,
      executionEpoch: 1589834080,
      expirationEpoch: 1590093280,
      queuedAtBlockNumber: 381386,
      deposit: 100000000000000000000,
      queuedAtTimestamp: 1589480751,
    },
    {
      proposalID: 6,
      index: 1,
      currentBlockNumber: 450000,
      stage: "Referendum",
      proposer: "0xf3eb910da09b8af348e0e5b6636da442cfa79239",
      yesVotes: 4.728916770837158e25,
      noVotes: 0,
      abstainVotes: 0,
      description:
        "https://github.com/celo-org/celo-proposals/blob/master/CGPs/0002.md",
      proposalEpoch: 1589574880,
      referendumEpoch: 1589661280,
      executionEpoch: 1589834080,
      expirationEpoch: 1590093280,
      queuedAtBlockNumber: 381439,
      deposit: 100000000000000000000,
      queuedAtTimestamp: 1589481016,
    },
  ],
  executionProposals: [
    {
      proposalID: 7,
      index: 0,
      currentBlockNumber: 452035,
      stage: "Execution",
      proposer: "0xf3eb910da09b8af348e0e5b6636da442cfa79239",
      yesVotes: 4.726916770837158e25,
      noVotes: 0,
      abstainVotes: 0,
      description:
        "https://github.com/celo-org/celo-proposals/blob/master/CGPs/0001.md",
      proposalEpoch: 1589574880,
      referendumEpoch: 1589661280,
      executionEpoch: 1589834080,
      expirationEpoch: 1590093280,
      queuedAtBlockNumber: 381386,
      deposit: 100000000000000000000,
      queuedAtTimestamp: 1589480751,
    },
    {
      proposalID: 8,
      index: 1,
      currentBlockNumber: 452035,
      stage: "Execution",
      proposer: "0xf3eb910da09b8af348e0e5b6636da442cfa79239",
      yesVotes: 4.728916770837158e25,
      noVotes: 0,
      abstainVotes: 0,
      description:
        "https://github.com/celo-org/celo-proposals/blob/master/CGPs/0002.md",
      proposalEpoch: 1589574880,
      referendumEpoch: 1589661280,
      executionEpoch: 1589834080,
      expirationEpoch: 1590093280,
      queuedAtBlockNumber: 381439,
      deposit: 100000000000000000000,
      queuedAtTimestamp: 1589481016,
    },
  ],
  expiredProposals: [
    {
      proposalID: 9,
      currentBlockNumber: 453000,
      stage: "Expiration",
      proposer: "0xf3eb910da09b8af348e0e5b6636da442cfa79239",
      executed: true,
      queuedAtBlockNumber: 91471,
      deposit: 100000000000000000000,
      queuedAtTimestamp: 1588031167,
      description:
        "https://gist.github.com/aslawson/a1f693f0e4c5fd391eac463237c4182a",
    },
  ],
};

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
  // const host = getHostFromNetworkName("CELO");
  // const url = `${host}/system/proposals_history`;
  // const response = await AxiosUtil.get<CeloGovernanceProposalHistoryResponse>(
  //   url,
  // );

  // return addGistContentToProposals(response);
  return addGistContentToProposals(mockProposals);
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
 * Transform the proposal history by fetching and adding the GitHub gist
 * content to the proposals.
 */
const addGistContentToProposals = async (
  proposalHistory: CeloGovernanceProposalHistoryResponse,
) => {
  const entries = Object.entries(proposalHistory);
  const result: { [key: string]: any } = {};

  for (const [key, value] of entries) {
    const gists = await fetchGistContentForProposalList(value);
    result[key] = gists;
  }

  return result as IQuery["celoGovernanceProposals"];
};

/**
 * Fetch the actual gist content for each proposal.
 */
const fetchGistContentForProposalList = async (
  proposals: GenericProposalHistory[],
): Promise<GenericProposalHistory[]> => {
  return Promise.all(
    proposals.map(async content => {
      const gist = content.description;
      const gistContent = await fetchProposalGistContent(gist);
      return {
        ...content,
        gist,
        description: gistContent,
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
