import {
  IAccountBalances,
  IAccountInformation,
  IGovernanceProposal,
  IQuery,
} from "../../schema/graphql-types";
import {
  assertUnreachable,
  getValidatorAddressFromDelegatorAddress,
} from "../../tools/utils";
import { AxiosUtil, getHostFromNetworkName } from "../axios-utils";
import { NetworkDefinition } from "./networks";

/** ===========================================================================
 * Cosmos REST API Utils
 * ----------------------------------------------------------------------------
 * This file contains REST API utils for fetching data using the Cosmos
 * blockchain APIs.
 * ============================================================================
 */

/**
 * Apply some post processing for the response data for calling a LCD node.
 *
 * NOTE: Currently Kava is running a newer version of CosmosSDK which returns
 * height and result data for all queries. So for Kava we read this result
 * field, for other networks we do not.
 *
 * @param  {any} response
 * @param  {NetworkDefinition} network
 */
const postProcessResponse = (response: any, network: NetworkDefinition) => {
  const { name } = network;

  switch (name) {
    case "TERRA":
    case "COSMOS":
    case "KAVA":
      return response.result;
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
 *
 * @param  {string} address
 * @returns Promise with balance data
 */
const fetchBalance = async (
  address: string,
  network: NetworkDefinition,
): Promise<IAccountBalances["balance"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(`${host}/bank/balances/${address}`);
  return postProcessResponse(response, network);
};

/**
 * Fetch delegations for an address.
 *
 * @param  {string} address
 * @returns Promise
 */
const fetchDelegations = async (
  address: string,
  network: NetworkDefinition,
): Promise<IAccountBalances["delegations"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(
    `${host}/staking/delegators/${address}/delegations`,
  );
  return postProcessResponse(response, network);
};

/**
 * Fetch reward for an address.
 *
 * @param  {string} address
 * @returns Promise
 */
const fetchRewards = async (
  address: string,
  network: NetworkDefinition,
): Promise<IAccountBalances["rewards"]> => {
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
 *
 * @param  {string} address
 * @returns Promise
 */
const fetchUnbondingDelegations = async (
  address: string,
  network: NetworkDefinition,
): Promise<IAccountBalances["unbonding"]> => {
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
 *
 * @param  {string} address
 * @returns Promise
 */
const fetchCommissionsForValidator = async (
  address: string,
  network: NetworkDefinition,
): Promise<IAccountBalances["commissions"]> => {
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
 *
 * @param  {string} address
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
 *
 * @param  {string} validatorAddress
 * @returns Promise
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
 *
 * @returns Promise
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
 *
 * @returns Promise
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
 *
 * @returns Promise
 */
const fetchLatestBlock = async (
  network: NetworkDefinition,
): Promise<IQuery["latestBlock"]> => {
  const host = getHostFromNetworkName(network.name);
  return AxiosUtil.get(`${host}/blocks/latest`);
};

/**
 * Fetch latest staking pool data.
 *
 * @returns Promise
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
 *
 * @returns Promise
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
 *
 * @returns Promise
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
 *
 * @returns Promise
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
 *
 * @returns Promise
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
 *
 * @returns Promise
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
 *
 * @returns Promise
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
 *
 * @returns Promise
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
 *
 * @returns Promise
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
 *
 * @param  {string} address
 * @returns Promise
 */
const fetchAvailableRewards = async (
  address: string,
  network: NetworkDefinition,
): Promise<IQuery["rewardsByValidator"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(
    `${host}/distribution/delegators/${address}/rewards`,
  );
  return response.result.rewards;
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
