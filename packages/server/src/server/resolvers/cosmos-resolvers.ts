import {
  deriveNetworkFromAddress,
  getNetworkDefinitionFromIdentifier,
  ICosmosAccountBalances,
  ICosmosAccountBalancesQueryVariables,
  ICosmosAccountHistoryQueryVariables,
  ICosmosAccountInformationQueryVariables,
  ICosmosDistributionCommunityPoolQueryVariables,
  ICosmosDistributionParametersQueryVariables,
  ICosmosGovernanceParametersTallyingQueryVariables,
  ICosmosGovernanceParametersVotingQueryVariables,
  ICosmosGovernanceProposalsQueryVariables,
  ICosmosLatestBlockQueryVariables,
  ICosmosRewardsByValidatorQueryVariables,
  ICosmosSlashingParametersQueryVariables,
  ICosmosStakingParametersQueryVariables,
  ICosmosStakingPoolQueryVariables,
  ICosmosTransactionQueryVariables,
  ICosmosTransactionsQueryVariables,
  ICosmosValidatorDistributionQueryVariables,
  ICosmosValidatorSetsQueryVariables,
  ICosmosValidatorsQueryVariables,
  IQuery,
} from "@anthem/utils";
import {
  blockUnsupportedNetworks,
  standardizeTimestamps,
  validatePaginationParams,
} from "../../tools/server-utils";
import COSMOS_EXTRACTOR from "../sources/cosmos-extractor";
import COSMOS_SDK from "../sources/cosmos-sdk";
import EXCHANGE_DATA_API from "../sources/fiat-price-data";

/** =======================================================================
 * Cosmos Resolvers
 * ========================================================================
 */

const CosmosResolvers = {
  cosmosAccountHistory: async (
    _: void,
    args: ICosmosAccountHistoryQueryVariables,
  ): Promise<IQuery["cosmosAccountHistory"]> => {
    const { address, fiat } = args;
    const network = deriveNetworkFromAddress(address);

    blockUnsupportedNetworks(network, "COSMOS", "portfolio");

    // Fetch fiat price history data
    const fiatPriceHistory = await EXCHANGE_DATA_API.fetchPortfolioFiatPriceHistory(
      fiat,
      network,
    );

    // Assemble request arguments
    const requestArgs = {
      network,
      address,
    };

    const [
      delegatorRewards,
      delegations,
      unbondings,
      balanceHistory,
      validatorCommissions,
    ] = await Promise.all([
      COSMOS_EXTRACTOR.getPortfolioDelegatorRewards(requestArgs),
      COSMOS_EXTRACTOR.getPortfolioDelegations(requestArgs),
      COSMOS_EXTRACTOR.getPortfolioUnbondings(requestArgs),
      COSMOS_EXTRACTOR.getPortfolioBalanceHistory(requestArgs),
      COSMOS_EXTRACTOR.getPortfolioValidatorRewards(requestArgs),
    ]);

    return {
      delegatorRewards: standardizeTimestamps(delegatorRewards),
      delegations: standardizeTimestamps(delegations),
      unbondings: standardizeTimestamps(unbondings),
      balanceHistory: standardizeTimestamps(balanceHistory),
      validatorCommissions: standardizeTimestamps(validatorCommissions),
      fiatPriceHistory,
    };
  },

  cosmosTransaction: async (
    _: void,
    args: ICosmosTransactionQueryVariables,
  ): Promise<IQuery["cosmosTransaction"]> => {
    const { hash } = args;
    const network = getNetworkDefinitionFromIdentifier(args.network);
    blockUnsupportedNetworks(network, "COSMOS", "transactions");
    return COSMOS_EXTRACTOR.getTransactionByHash(hash, network);
  },

  cosmosTransactions: async (
    _: void,
    args: ICosmosTransactionsQueryVariables,
  ): Promise<IQuery["cosmosTransactions"]> => {
    const { address, startingPage, pageSize } = args;
    const size = validatePaginationParams(pageSize, 25);
    const start = validatePaginationParams(startingPage, 1);
    const network = deriveNetworkFromAddress(address);
    blockUnsupportedNetworks(network, "COSMOS", "transactions");
    const params = {
      address,
      network,
      pageSize: size,
      startingPage: start,
    };
    return COSMOS_EXTRACTOR.getTransactions(params);
  },

  cosmosRewardsByValidator: async (
    _: void,
    args: ICosmosRewardsByValidatorQueryVariables,
  ): Promise<IQuery["cosmosRewardsByValidator"]> => {
    const { address } = args;
    const network = deriveNetworkFromAddress(address);
    return COSMOS_SDK.fetchAvailableRewards(address, network);
  },

  cosmosAccountBalances: async (
    _: void,
    args: ICosmosAccountBalancesQueryVariables,
  ): Promise<IQuery["cosmosAccountBalances"]> => {
    const { address } = args;
    const network = deriveNetworkFromAddress(address);
    const [
      balance,
      delegations,
      rewards,
      unbonding,
      commissions,
    ] = await Promise.all([
      COSMOS_SDK.fetchBalance(address, network),
      COSMOS_SDK.fetchDelegations(address, network),
      COSMOS_SDK.fetchRewards(address, network),
      COSMOS_SDK.fetchUnbondingDelegations(address, network),
      COSMOS_SDK.fetchCommissionsForValidator(address, network),
    ]);

    const result = {
      balance,
      delegations,
      rewards,
      unbonding,
      commissions,
    };

    const balances: ICosmosAccountBalances = result;
    return balances;
  },

  cosmosAccountInformation: async (
    _: void,
    args: ICosmosAccountInformationQueryVariables,
  ): Promise<IQuery["cosmosAccountInformation"]> => {
    /**
     * TODO: There a "validator vesting accounts" on Kava which have a
     * different return type for this API.
     */
    const { address } = args;
    const network = deriveNetworkFromAddress(address);
    return COSMOS_SDK.fetchAccountInformation(address, network);
  },

  cosmosValidatorDistribution: async (
    _: void,
    args: ICosmosValidatorDistributionQueryVariables,
  ): Promise<IQuery["cosmosValidatorDistribution"]> => {
    const { validatorAddress } = args;
    const network = deriveNetworkFromAddress(validatorAddress);
    return COSMOS_SDK.fetchValidatorDistribution(validatorAddress, network);
  },

  cosmosValidators: async (
    _: void,
    args: ICosmosValidatorsQueryVariables,
  ): Promise<IQuery["cosmosValidators"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    blockUnsupportedNetworks(network, "COSMOS");

    return COSMOS_SDK.fetchValidators(network);
  },

  cosmosValidatorSets: async (
    _: void,
    args: ICosmosValidatorSetsQueryVariables,
  ): Promise<IQuery["cosmosValidatorSets"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchValidatorSets(network);
  },

  cosmosLatestBlock: async (
    _: void,
    args: ICosmosLatestBlockQueryVariables,
  ): Promise<IQuery["cosmosLatestBlock"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchLatestBlock(network);
  },

  cosmosStakingPool: async (
    _: void,
    args: ICosmosStakingPoolQueryVariables,
  ): Promise<IQuery["cosmosStakingPool"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchStakingPool(network);
  },

  cosmosStakingParameters: async (
    _: void,
    args: ICosmosStakingParametersQueryVariables,
  ): Promise<IQuery["cosmosStakingParameters"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchStakingParameters(network);
  },

  cosmosGovernanceProposals: async (
    _: void,
    args: ICosmosGovernanceProposalsQueryVariables,
  ): Promise<IQuery["cosmosGovernanceProposals"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchGovernanceProposals(network);
  },

  cosmosGovernanceParametersDeposit: async (
    _: void,
    args: ICosmosGovernanceParametersTallyingQueryVariables,
  ): Promise<IQuery["cosmosGovernanceParametersDeposit"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchGovernanceParametersDeposit(network);
  },

  cosmosGovernanceParametersTallying: async (
    _: void,
    args: ICosmosGovernanceParametersTallyingQueryVariables,
  ): Promise<IQuery["cosmosGovernanceParametersTallying"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchGovernanceParametersTallying(network);
  },

  cosmosGovernanceParametersVoting: async (
    _: void,
    args: ICosmosGovernanceParametersVotingQueryVariables,
  ): Promise<IQuery["cosmosGovernanceParametersVoting"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchGovernanceParametersVoting(network);
  },

  cosmosSlashingParameters: async (
    _: void,
    args: ICosmosSlashingParametersQueryVariables,
  ): Promise<IQuery["cosmosSlashingParameters"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchSlashingParameters(network);
  },

  cosmosDistributionCommunityPool: async (
    _: void,
    args: ICosmosDistributionCommunityPoolQueryVariables,
  ): Promise<IQuery["cosmosDistributionCommunityPool"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchDistributionCommunityPool(network);
  },

  cosmosDistributionParameters: async (
    _: void,
    args: ICosmosDistributionParametersQueryVariables,
  ): Promise<IQuery["cosmosDistributionParameters"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchDistributionParameters(network);
  },
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default CosmosResolvers;

/** ===========================================================================
 * Multi Network Support Note
 *
 * [~] addressHistoryData
 * [ ] rewardsByValidator
 * [ ] fiatPriceHistory - Crypto Compare API data for TERRA and KAVA???
 * [?] dailyPercentChange
 * [~] accountBalances (TERRA results unreliable)
 * [x] accountInformation - minor differences on Kava
 * [~] transaction
 * [~] transactions
 * [x] validatorDistribution
 * [x] validators
 * [x] validatorSets (not TERRA)
 * [x] latestBlock
 * [x] stakingPool (not TERRA)
 * [x] stakingParameters
 * [x] governanceProposals (not TERRA)
 * [x] governanceParametersDeposit (not TERRA)
 * [x] governanceParametersTallying (not TERRA)
 * [x] governanceParametersVoting (not TERRA)
 * [x] slashingParameters
 * [x] distributionCommunityPool (not TERRA)
 * [x] distributionParameters (not TERRA)
 * [x] prices
 * [x] coins
 * [x] fiatCurrencies
 * ============================================================================
 */
