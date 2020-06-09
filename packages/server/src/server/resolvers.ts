import {
  deriveNetworkFromAddress,
  ERRORS,
  getNetworkDefinitionFromIdentifier,
  getNetworkDefinitionFromTicker,
  IAccountBalancesQueryVariables,
  IAccountInformationQueryVariables,
  ICeloAccountHistoryQueryVariables,
  ICeloTransactionsQueryVariables,
  ICosmosAccountBalancesType,
  ICosmosTransactionsQueryVariables,
  IDailyPercentChangeQueryVariables,
  IDistributionCommunityPoolQueryVariables,
  IDistributionParametersQueryVariables,
  IFiatPriceHistoryQueryVariables,
  IGovernanceParametersTallyingQueryVariables,
  IGovernanceParametersVotingQueryVariables,
  IGovernanceProposalsQueryVariables,
  ILatestBlockQueryVariables,
  IOasisAccountHistoryQueryVariables,
  IOasisTransactionsQueryVariables,
  IOasisTransactionType,
  IPortfolioHistoryQueryVariables,
  IPricesQueryVariables,
  IQuery,
  IRewardsByValidatorQueryVariables,
  ISlashingParametersQueryVariables,
  IStakingParametersQueryVariables,
  IStakingPoolQueryVariables,
  ITransactionQueryVariables,
  IValidatorDistributionQueryVariables,
  IValidatorSetsQueryVariables,
  IValidatorsQueryVariables,
  NetworkDefinition,
} from "@anthem/utils";
import {
  standardizeTimestamps,
  validatePaginationParams,
} from "../tools/server-utils";
import UnionResolvers from "./resolve-types";
import CELO from "./sources/celo";
import COSMOS_EXTRACTOR from "./sources/cosmos-extractor";
import COSMOS_SDK from "./sources/cosmos-sdk";
import EXCHANGE_DATA_API from "./sources/exchange-data";
import FIAT_CURRENCIES from "./sources/fiat-currencies";
import OASIS from "./sources/oasis";

/** ===========================================================================
 * Resolvers
 * ============================================================================
 */

const blockUnsupportedNetworks = (
  network: NetworkDefinition,
  feature: "portfolio" | "transactions" | "balances",
) => {
  switch (feature) {
    case "portfolio":
      if (!network.supportsPortfolio) {
        throw new Error(ERRORS.NETWORK_NOT_SUPPORTED(network));
      }
      break;
    case "balances":
      if (!network.supportsBalances) {
        throw new Error(ERRORS.NETWORK_NOT_SUPPORTED(network));
      }
      break;
    case "transactions":
      if (!network.supportsTransactionsHistory) {
        throw new Error(ERRORS.NETWORK_NOT_SUPPORTED(network));
      }
      break;
  }
};

const resolvers = {
  ...UnionResolvers,

  Query: {
    /** =======================================================================
     * Cosmos Resolvers
     * ========================================================================
     */

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

    transaction: async (
      _: void,
      args: ITransactionQueryVariables,
    ): Promise<IQuery["transaction"]> => {
      const { txHash } = args;
      const network = getNetworkDefinitionFromIdentifier(args.network);
      blockUnsupportedNetworks(network, "transactions");
      return COSMOS_EXTRACTOR.getTransactionByHash(txHash, network);
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
      return COSMOS_EXTRACTOR.getTransactions(address, size, start, network);
    },

    rewardsByValidator: async (
      _: void,
      args: IRewardsByValidatorQueryVariables,
    ): Promise<IQuery["rewardsByValidator"]> => {
      const { address } = args;
      const network = deriveNetworkFromAddress(address);
      return COSMOS_SDK.fetchAvailableRewards(address, network);
    },

    accountBalances: async (
      _: void,
      args: IAccountBalancesQueryVariables,
    ): Promise<IQuery["accountBalances"]> => {
      const { address } = args;
      const network = deriveNetworkFromAddress(address);

      if (network.name === "OASIS") {
        return OASIS.fetchAccountBalances(address, network);
      } else if (network.name === "CELO") {
        return CELO.fetchAccountBalances(address, network);
      } else {
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

        const balances: ICosmosAccountBalancesType = { cosmos: result };
        return balances;
      }
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

    prices: async (
      _: void,
      args: IPricesQueryVariables,
    ): Promise<IQuery["prices"]> => {
      const { currency, versus } = args;
      const network = getNetworkDefinitionFromTicker(currency);

      if (!network.supportsFiatPrices) {
        throw new Error(ERRORS.NETWORK_NOT_SUPPORTED(network));
      }

      return EXCHANGE_DATA_API.fetchExchangeRate(currency, versus);
    },

    fiatPriceHistory: async (
      _: void,
      args: IFiatPriceHistoryQueryVariables,
    ): Promise<IQuery["fiatPriceHistory"]> => {
      const { fiat } = args;
      const network = getNetworkDefinitionFromIdentifier(args.network);

      if (!network.supportsFiatPrices) {
        throw new Error(ERRORS.NETWORK_NOT_SUPPORTED(network));
      }

      return EXCHANGE_DATA_API.fetchPortfolioFiatPriceHistory(fiat, network);
    },

    dailyPercentChange: async (
      _: void,
      args: IDailyPercentChangeQueryVariables,
    ): Promise<IQuery["dailyPercentChange"]> => {
      const { currency, fiat } = args;
      const network = getNetworkDefinitionFromTicker(currency);

      if (!network.supportsFiatPrices) {
        throw new Error(ERRORS.NETWORK_NOT_SUPPORTED(network));
      }

      return EXCHANGE_DATA_API.fetchDailyPercentChangeInPrice(currency, fiat);
    },

    fiatCurrencies: async (_: void): Promise<IQuery["fiatCurrencies"]> => {
      return FIAT_CURRENCIES;
    },

    /** =======================================================================
     * Oasis Resolvers
     * ========================================================================
     */

    oasisAccountHistory: async (
      _: void,
      args: IOasisAccountHistoryQueryVariables,
    ): Promise<IQuery["oasisAccountHistory"]> => {
      const { address } = args;
      const network = deriveNetworkFromAddress(address);
      blockUnsupportedNetworks(network, "portfolio");
      return OASIS.fetchAccountHistory(address, network);
    },

    oasisTransactions: async (
      _: void,
      args: IOasisTransactionsQueryVariables,
    ): Promise<IQuery["oasisTransactions"]> => {
      const { address, startingPage, pageSize } = args;
      const network = deriveNetworkFromAddress(address);
      const size = validatePaginationParams(pageSize, 25);
      const start = validatePaginationParams(startingPage, 1);
      blockUnsupportedNetworks(network, "transactions");
      return OASIS.fetchTransactions(address, start, size, network);
    },

    /** =======================================================================
     * Celo Resolvers
     * ========================================================================
     */

    celoAccountHistory: async (
      _: void,
      args: ICeloAccountHistoryQueryVariables,
    ): Promise<IQuery["celoAccountHistory"]> => {
      const { address } = args;
      const network = deriveNetworkFromAddress(address);
      blockUnsupportedNetworks(network, "portfolio");
      return CELO.fetchAccountHistory(address, network);
    },

    celoTransactions: async (
      _: void,
      args: ICeloTransactionsQueryVariables,
    ): Promise<IQuery["celoTransactions"]> => {
      const { address, startingPage, pageSize } = args;
      const network = deriveNetworkFromAddress(address);
      const size = validatePaginationParams(pageSize, 25);
      const start = validatePaginationParams(startingPage, 1);
      blockUnsupportedNetworks(network, "transactions");
      return CELO.fetchTransactions(address, start, size, network);
    },

    celoSystemBalances: async (): Promise<IQuery["celoSystemBalances"]> => {
      return CELO.fetchSystemBalances();
    },

    celoSystemHistory: async (): Promise<IQuery["celoSystemHistory"]> => {
      return CELO.fetchSystemHistory();
    },

    celoValidatorGroups: async (): Promise<IQuery["celoValidatorGroups"]> => {
      return CELO.fetchValidatorGroups();
    },
  },
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default resolvers;

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
