import {
  assertUnreachable,
  getValidatorAddressFromDelegatorAddress,
  IAccountInformation,
  ICosmosAccountBalances,
  IGovernanceProposal,
  IQuery,
  NetworkDefinition,
} from "@anthem/utils";
import { AxiosUtil, getHostFromNetworkName } from "../axios-utils";

/** ===========================================================================
 * Cosmos REST API Utils
 * ----------------------------------------------------------------------------
 * This file contains REST API utils for fetching data using the Cosmos
 * blockchain APIs.
 * ============================================================================
 */

/**
 * Apply some post processing for the response data for calling a LCD node.
 */
const postProcessResponse = (response: any, network: NetworkDefinition) => {
  const { name } = network;

  switch (name) {
    case "TERRA":
    case "COSMOS":
    case "KAVA":
      return response.result;
    case "OASIS":
    case "CELO":
      break;
    default:
      return assertUnreachable(name);
  }
};

/** ===========================================================================
 * Accounts and Balances
 * ============================================================================
 */

/**
 * Fetch balance data for an address.
 */
const fetchBalance = async (
  address: string,
  network: NetworkDefinition,
): Promise<ICosmosAccountBalances["balance"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(`${host}/bank/balances/${address}`);
  return postProcessResponse(response, network);
};

/**
 * Fetch delegations for an address.
 */
const fetchDelegations = async (
  address: string,
  network: NetworkDefinition,
): Promise<ICosmosAccountBalances["delegations"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(
    `${host}/staking/delegators/${address}/delegations`,
  );
  return postProcessResponse(response, network);
};

/**
 * Fetch reward for an address.
 */
const fetchRewards = async (
  address: string,
  network: NetworkDefinition,
): Promise<ICosmosAccountBalances["rewards"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(
    `${host}/distribution/delegators/${address}/rewards`,
  );

  const { result } = response;
  const { rewards } = result;
  if (rewards) {
    return result.rewards
      .map((x: any) => x.reward)
      .flat()
      .filter(Boolean);
  } else {
    return [];
  }
};

/**
 * Fetch unbonding delegations for an address.
 */
const fetchUnbondingDelegations = async (
  address: string,
  network: NetworkDefinition,
): Promise<ICosmosAccountBalances["unbonding"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(
    `${host}/staking/delegators/${address}/unbonding_delegations`,
  );
  return postProcessResponse(response, network);
};

/**
 * Decode the delegator address and determine the associated validator address
 * and fetch distributions for that validator, which may or may not exists. If
 * it exists, return the commissions data.
 */
const fetchCommissionsForValidator = async (
  address: string,
  network: NetworkDefinition,
): Promise<ICosmosAccountBalances["commissions"]> => {
  try {
    const validatorAddress = getValidatorAddressFromDelegatorAddress(
      address,
      network.name,
    );
    if (validatorAddress) {
      const validatorDistribution = await fetchValidatorDistribution(
        validatorAddress,
        network,
      );
      return validatorDistribution.val_commission;
    } else {
      return null;
    }
  } catch (err) {
    /**
     * Delegator address may not have an associated validator. If it does not,
     * this error block will run and we should return null.
     */
    return null;
  }
};

/**
 * Fetch account information for an address.
 */
const fetchAccountInformation = async (
  address: string,
  network: NetworkDefinition,
): Promise<IAccountInformation> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(`${host}/auth/accounts/${address}`);
  return postProcessResponse(response, network);
};

/** ===========================================================================
 * Validators
 * ============================================================================
 */

/**
 * Fetch validation distribution data.
 */
const fetchValidatorDistribution = async (
  validatorAddress: string,
  network: NetworkDefinition,
): Promise<IQuery["validatorDistribution"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(
    `${host}/distribution/validators/${validatorAddress}`,
  );
  return postProcessResponse(response, network);
};

/**
 * Fetch all validators.
 */
const fetchValidators = async (
  network: NetworkDefinition,
): Promise<IQuery["validators"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(`${host}/staking/validators`);
  return postProcessResponse(response, network);
};

/**
 * Fetch all validator sets.
 */
const fetchValidatorSets = async (
  network: NetworkDefinition,
): Promise<IQuery["validatorSets"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(`${host}/validatorsets/latest`);
  return postProcessResponse(response, network);
};

/** ===========================================================================
 * Blockchain Info: blocks, staking, governance, etc.
 * ============================================================================
 */

/**
 * Fetch latest block info.
 */
const fetchLatestBlock = async (
  network: NetworkDefinition,
): Promise<IQuery["latestBlock"]> => {
  const host = getHostFromNetworkName(network.name);
  return AxiosUtil.get(`${host}/blocks/latest`);
};

/**
 * Fetch latest staking pool data.
 */
const fetchStakingPool = async (
  network: NetworkDefinition,
): Promise<IQuery["stakingPool"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(`${host}/staking/pool`);
  return postProcessResponse(response, network);
};

/**
 * Fetch latest staking parameters data.
 */
const fetchStakingParameters = async (
  network: NetworkDefinition,
): Promise<IQuery["stakingParameters"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(`${host}/staking/parameters`);
  return postProcessResponse(response, network);
};

/**
 * Fetch latest governance proposals.
 */
const fetchGovernanceProposals = async (
  network: NetworkDefinition,
): Promise<IQuery["governanceProposals"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(`${host}/gov/proposals`);
  const result = postProcessResponse(response, network);

  if (network.name === "KAVA") {
    const kavaResult = result.map((proposal: IGovernanceProposal) => ({
      ...proposal,
      // @ts-ignore
      proposal_id: proposal.id,
    }));
    return kavaResult;
  } else {
    return result;
  }
};

/**
 * Fetch latest governance parameters deposit values.
 */
const fetchGovernanceParametersDeposit = async (
  network: NetworkDefinition,
): Promise<IQuery["governanceParametersDeposit"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(`${host}/gov/parameters/deposit`);
  return postProcessResponse(response, network);
};

/**
 * Fetch latest governance parameters tallying data.
 */
const fetchGovernanceParametersTallying = async (
  network: NetworkDefinition,
): Promise<IQuery["governanceParametersTallying"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(`${host}/gov/parameters/tallying`);
  return postProcessResponse(response, network);
};

/**
 * Fetch latest governance parameters voting data.
 */
const fetchGovernanceParametersVoting = async (
  network: NetworkDefinition,
): Promise<IQuery["governanceParametersVoting"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(`${host}/gov/parameters/voting`);
  return postProcessResponse(response, network);
};

/**
 * Fetch slashing signing parameters data.
 */
const fetchSlashingParameters = async (
  network: NetworkDefinition,
): Promise<IQuery["slashingParameters"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(`${host}/slashing/parameters`);
  return postProcessResponse(response, network);
};

/**
 * Fetch current distribution community pool.
 */
const fetchDistributionCommunityPool = async (
  network: NetworkDefinition,
): Promise<IQuery["distributionCommunityPool"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(`${host}/distribution/community_pool`);
  return postProcessResponse(response, network);
};

/**
 * Fetch distribution parameters data.
 */
const fetchDistributionParameters = async (
  network: NetworkDefinition,
): Promise<IQuery["distributionParameters"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(`${host}/distribution/parameters`);
  return postProcessResponse(response, network);
};

/**
 * Fetch detailed rewards response data which includes validator addresses.
 * The underlying API is the same as what's used in fetchRewards.
 */
const fetchAvailableRewards = async (
  address: string,
  network: NetworkDefinition,
): Promise<IQuery["rewardsByValidator"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(
    `${host}/distribution/delegators/${address}/rewards`,
  );

  return response.result.rewards || [];
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

const COSMOS_SDK = {
  fetchBalance,
  fetchDelegations,
  fetchRewards,
  fetchAvailableRewards,
  fetchAccountInformation,
  fetchUnbondingDelegations,
  fetchCommissionsForValidator,
  fetchValidatorDistribution,
  fetchValidators,
  fetchValidatorSets,
  fetchLatestBlock,
  fetchStakingPool,
  fetchStakingParameters,
  fetchGovernanceProposals,
  fetchGovernanceParametersDeposit,
  fetchGovernanceParametersTallying,
  fetchGovernanceParametersVoting,
  fetchSlashingParameters,
  fetchDistributionCommunityPool,
  fetchDistributionParameters,
};

export default COSMOS_SDK;
