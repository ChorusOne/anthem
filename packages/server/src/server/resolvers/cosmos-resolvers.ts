import {
  deriveNetworkFromAddress,
  getNetworkDefinitionFromIdentifier,
  IAccountInformationQueryVariables,
  ICosmosAccountBalances,
  ICosmosAccountBalancesQueryVariables,
  ICosmosTransactionQueryVariables,
  ICosmosTransactionsQueryVariables,
  IDistributionCommunityPoolQueryVariables,
  IDistributionParametersQueryVariables,
  IGovernanceParametersTallyingQueryVariables,
  IGovernanceParametersVotingQueryVariables,
  IGovernanceProposalsQueryVariables,
  ILatestBlockQueryVariables,
  IPortfolioHistoryQueryVariables,
  IQuery,
  IRewardsByValidatorQueryVariables,
  ISlashingParametersQueryVariables,
  IStakingParametersQueryVariables,
  IStakingPoolQueryVariables,
  IValidatorDistributionQueryVariables,
  IValidatorSetsQueryVariables,
  IValidatorsQueryVariables,
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
  portfolioHistory: async (
    _: void,
    args: IPortfolioHistoryQueryVariables,
  ): Promise<IQuery["portfolioHistory"]> => {
    const { address, fiat } = args;
    const network = deriveNetworkFromAddress(address);

    blockUnsupportedNetworks(network, "portfolio");

    let sanitizedAddress = address;
    if (network.name === "TERRA") {
      sanitizedAddress = `${address}\0`;
    }

    // Fetch fiat price history data
    const fiatPriceHistory = await EXCHANGE_DATA_API.fetchPortfolioFiatPriceHistory(
      fiat,
      network,
    );

    // Assemble request arguments
    const requestArgs = {
      network,
      address: sanitizedAddress,
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
    blockUnsupportedNetworks(network, "transactions");
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
    blockUnsupportedNetworks(network, "transactions");
    const params = {
      address,
      network,
      pageSize: size,
      startingPage: start,
    };
    return COSMOS_EXTRACTOR.getTransactions(params);
  },

  rewardsByValidator: async (
    _: void,
    args: IRewardsByValidatorQueryVariables,
  ): Promise<IQuery["rewardsByValidator"]> => {
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

  accountInformation: async (
    _: void,
    args: IAccountInformationQueryVariables,
  ): Promise<IQuery["accountInformation"]> => {
    /**
     * TODO: There a "validator vesting accounts" on Kava which have a
     * different return type for this API.
     */
    const { address } = args;
    const network = deriveNetworkFromAddress(address);
    return COSMOS_SDK.fetchAccountInformation(address, network);
  },

  validatorDistribution: async (
    _: void,
    args: IValidatorDistributionQueryVariables,
  ): Promise<IQuery["validatorDistribution"]> => {
    const { validatorAddress } = args;
    const network = deriveNetworkFromAddress(validatorAddress);
    return COSMOS_SDK.fetchValidatorDistribution(validatorAddress, network);
  },

  validators: async (
    _: void,
    args: IValidatorsQueryVariables,
  ): Promise<IQuery["validators"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchValidators(network);
  },

  validatorSets: async (
    _: void,
    args: IValidatorSetsQueryVariables,
  ): Promise<IQuery["validatorSets"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchValidatorSets(network);
  },

  latestBlock: async (
    _: void,
    args: ILatestBlockQueryVariables,
  ): Promise<IQuery["latestBlock"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchLatestBlock(network);
  },

  stakingPool: async (
    _: void,
    args: IStakingPoolQueryVariables,
  ): Promise<IQuery["stakingPool"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchStakingPool(network);
  },

  stakingParameters: async (
    _: void,
    args: IStakingParametersQueryVariables,
  ): Promise<IQuery["stakingParameters"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchStakingParameters(network);
  },

  governanceProposals: async (
    _: void,
    args: IGovernanceProposalsQueryVariables,
  ): Promise<IQuery["governanceProposals"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchGovernanceProposals(network);
  },

  governanceParametersDeposit: async (
    _: void,
    args: IGovernanceParametersTallyingQueryVariables,
  ): Promise<IQuery["governanceParametersDeposit"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchGovernanceParametersDeposit(network);
  },

  governanceParametersTallying: async (
    _: void,
    args: IGovernanceParametersTallyingQueryVariables,
  ): Promise<IQuery["governanceParametersTallying"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchGovernanceParametersTallying(network);
  },

  governanceParametersVoting: async (
    _: void,
    args: IGovernanceParametersVotingQueryVariables,
  ): Promise<IQuery["governanceParametersVoting"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchGovernanceParametersVoting(network);
  },

  slashingParameters: async (
    _: void,
    args: ISlashingParametersQueryVariables,
  ): Promise<IQuery["slashingParameters"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchSlashingParameters(network);
  },

  distributionCommunityPool: async (
    _: void,
    args: IDistributionCommunityPoolQueryVariables,
  ): Promise<IQuery["distributionCommunityPool"]> => {
    const network = getNetworkDefinitionFromIdentifier(args.network);
    return COSMOS_SDK.fetchDistributionCommunityPool(network);
  },

  distributionParameters: async (
    _: void,
    args: IDistributionParametersQueryVariables,
  ): Promise<IQuery["distributionParameters"]> => {
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
