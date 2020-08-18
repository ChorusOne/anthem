import {
  assertUnreachable,
  COIN_DENOMS,
  deriveNetworkFromAddress,
  getValidatorAddressFromDelegatorAddress,
  ICeloValidatorGroup,
  ICosmosAccountBalances,
  ICosmosBalance,
  ICosmosTransaction,
  ICosmosValidator,
  IQuery,
  IUnbondingDelegationEntry,
  NETWORK_NAME,
  NetworkDefinition,
  NETWORKS,
  RequestFailure,
} from "@anthem/utils";
import { ApolloError } from "apollo-client";
import BigNumber from "bignumber.js";
import queryString from "query-string";
import { AvailableReward } from "ui/CreateTransactionForm";
import Toast from "ui/Toast";
import {
  convertCryptoToFiat,
  denomToUnit,
  formatCurrencyAmount,
} from "./currency-utils";
import { formatFiatPriceDate } from "./date-utils";
import {
  add,
  addValuesInList,
  divide,
  GenericNumberType,
  isGreaterThanOrEqualTo,
  multiply,
  subtract,
  toBigNumber,
} from "./math-utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

// Reference: https://cosmos.network/docs/spec/addresses/bech32.html
export enum COSMOS_ADDRESS_ENUM {
  ACCOUNT_ADDRESS = "cosmos",
  ACCOUNT_PUBLIC_KEY = "cosmospub",
  VALIDATOR_OPERATOR_ADDRESS = "cosmosvaloper",
  VALIDATOR_CONSENSUS_ADDRESS = "cosmosvalcons",
  VALIDATOR_CONSENSUS_PUBLIC_KEY = "cosmosvalconspub",
  VALIDATOR_OPERATOR_PUBLIC_KEY = "cosmosvaloperpub",
}

export enum KAVA_ADDRESS_ENUM {
  ACCOUNT_ADDRESS = "kava",
  ACCOUNT_PUBLIC_KEY = "kavapub",
  VALIDATOR_OPERATOR_ADDRESS = "kavavaloper",
  VALIDATOR_CONSENSUS_ADDRESS = "kavavalcons",
  VALIDATOR_CONSENSUS_PUBLIC_KEY = "kavavalconspub",
  VALIDATOR_OPERATOR_PUBLIC_KEY = "kavavaloperpub",
}

export enum TERRA_ADDRESS_ENUM {
  ACCOUNT_ADDRESS = "terra",
  ACCOUNT_PUBLIC_KEY = "terrapub",
  VALIDATOR_OPERATOR_ADDRESS = "terravaloper",
  VALIDATOR_CONSENSUS_ADDRESS = "terravalcons",
  VALIDATOR_CONSENSUS_PUBLIC_KEY = "terravalconspub",
  VALIDATOR_OPERATOR_PUBLIC_KEY = "terravaloperpub",
}

// TODO: Implement
export enum OASIS_ADDRESS_ENUM {
  ACCOUNT_ADDRESS = "",
  ACCOUNT_PUBLIC_KEY = "",
  VALIDATOR_OPERATOR_ADDRESS = "",
  VALIDATOR_CONSENSUS_ADDRESS = "",
  VALIDATOR_CONSENSUS_PUBLIC_KEY = "",
  VALIDATOR_OPERATOR_PUBLIC_KEY = "",
}

/** =======================================================
 * Common Util Helper Methods
 * ========================================================
 */

/**
 * Determine if a given route link is on the current active route.
 */
export const onActiveRoute = (path: string, route: string): boolean => {
  return path === route;
};

/**
 * Determine if the given tab is active given the current route.
 */
export const onActiveTab = (pathname: string, tab: string): boolean => {
  const path = pathname.split("/")[2];
  return !!path && path.toLowerCase() === tab.toLowerCase();
};

/**
 * Identity function.
 */
export const identity = <T extends {}>(x: T): T => x;

/**
 * Parse the query parameters from the current url.
 */
export const getQueryParamsFromUrl = (paramString: string) => {
  return queryString.parse(paramString);
};

/**
 * Crudely determine if some path string is included in the current URL.
 */
export const onPath = (url: string, pathString: string): boolean => {
  return url.includes(pathString);
};

/**
 * Return true if a URL pathname is on a page which includes the
 * address= param.
 */
export const onPageWhichIncludesAddressParam = (pathname: string) => {
  return /total|available|staking|voting|rewards|commissions|cusd|delegate|governance/.test(
    pathname,
  );
};

/**
 * Check if a pathname includes a chart view.
 */
export const onChartTab = (pathname?: string) => {
  return (
    !!pathname &&
    /total|available|staking|voting|rewards|commissions|cusd/.test(pathname)
  );
};

/**
 * Get the transactions from the url.
 */
export const getTransactionHashFromUrl = (url: string) => {
  return url.split("/")[3];
};

/**
 * Base chart tabs which are shared across networks.
 *
 * TODO: Refactor these to be part of the networks configuration.
 */
const BASE_CHART_TAB_MAP = {
  TOTAL: "TOTAL",
  AVAILABLE: "AVAILABLE",
  STAKING: "STAKING",
  REWARDS: "REWARDS",
  COMMISSIONS: "COMMISSIONS",
};

const ALL_POSSIBLE_CHART_TAB_MAP = {
  TOTAL: "TOTAL",
  AVAILABLE: "AVAILABLE",
  STAKING: "STAKING",
  VOTING: "VOTING",
  REWARDS: "REWARDS",
  COMMISSIONS: "COMMISSIONS",
  CUSD: "cUSD",
};

export type BASE_CHART_TABS =
  | "TOTAL"
  | "AVAILABLE"
  | "STAKING"
  | "REWARDS"
  | "COMMISSIONS";

export type ALL_POSSIBLE_CHART_TABS =
  | "TOTAL"
  | "AVAILABLE"
  | "STAKING"
  | "VOTING"
  | "REWARDS"
  | "COMMISSIONS"
  | "CUSD";

/**
 * Get the list of chart tabs which are available for a network.
 */
export const getChartTabsForNetwork = (
  network: NetworkDefinition,
  commissionsAvailable: boolean,
) => {
  const result: { [key: string]: string } = {};

  for (const [key, value] of Object.entries(ALL_POSSIBLE_CHART_TAB_MAP)) {
    if (key in BASE_CHART_TAB_MAP || network.customChartTabs.has(key)) {
      if (key === "COMMISSIONS" && !commissionsAvailable) {
        continue;
      }

      if (key === "STAKING" && network.name === "CELO") {
        continue;
      } else {
        result[key] = value;
      }
    }
  }

  return result;
};

/**
 *  Determine if a string is a valid chart tab key.
 */
export const isChartTabValidForNetwork = (
  tab: string,
  network: NetworkDefinition,
): Nullable<ALL_POSSIBLE_CHART_TABS> => {
  const name = tab.toUpperCase() as ALL_POSSIBLE_CHART_TABS;

  if (name in BASE_CHART_TAB_MAP) {
    return name;
  } else if (
    name in ALL_POSSIBLE_CHART_TAB_MAP &&
    network.customChartTabs.has(name)
  ) {
    return name;
  } else {
    return null;
  }
};

/**
 * Get the default active tab for a network.
 */
export const getDefaultChartTabForNetwork = (
  activeTab: ALL_POSSIBLE_CHART_TABS,
  network: NetworkDefinition,
): ALL_POSSIBLE_CHART_TABS => {
  if (isChartTabValidForNetwork(activeTab, network)) {
    return activeTab;
  } else {
    return "TOTAL";
  }
};

/**
 * Return information on which dashboard tab the user is viewing from the
 * given url location.
 */
export const getPortfolioTypeFromUrl = (
  path: string,
): ALL_POSSIBLE_CHART_TABS | null => {
  let result = null;

  if (onPath(path, "/total")) {
    result = ALL_POSSIBLE_CHART_TAB_MAP.TOTAL;
  } else if (onPath(path, "/available")) {
    result = ALL_POSSIBLE_CHART_TAB_MAP.AVAILABLE;
  } else if (onPath(path, "/rewards")) {
    result = ALL_POSSIBLE_CHART_TAB_MAP.REWARDS;
  } else if (onPath(path, "/staking")) {
    result = ALL_POSSIBLE_CHART_TAB_MAP.STAKING;
  } else if (onPath(path, "/commissions")) {
    result = ALL_POSSIBLE_CHART_TAB_MAP.COMMISSIONS;
  } else if (onPath(path, "/cusd")) {
    result = ALL_POSSIBLE_CHART_TAB_MAP.CUSD;
  }

  if (result) {
    return result as ALL_POSSIBLE_CHART_TABS;
  }

  return null;
};

/**
 * Initialize the network when the app launches.
 */
export const initializeNetwork = (
  url: string,
  address: string,
): NetworkDefinition => {
  const network = url.split("/")[1];
  const networkDefinition = NETWORKS[network.toUpperCase()];
  if (networkDefinition) {
    return networkDefinition;
  } else if (address) {
    const derivedNetwork = deriveNetworkFromAddress(address);
    return derivedNetwork;
  } else {
    return NETWORKS.COSMOS;
  }
};

/**
 * Helper to return the block explorer URL for a transaction.
 */
export const getBlockExplorerUrlForTransaction = (
  hash: string,
  network: NETWORK_NAME,
) => {
  switch (network) {
    case "COSMOS":
      return `https://www.mintscan.io/txs/${hash}`;
    case "KAVA":
      return `https://kava.mintscan.io/txs/${hash}`;
    case "TERRA":
      return `https://terra.stake.id/?#/tx/${hash}`;
    case "OASIS":
      console.warn("[TODO]: Implement Block Explorer url for Oasis");
      return "";
    case "CELO":
      console.warn("[TODO]: Implement Block Explorer url for Celo");
      return "";
    default:
      return assertUnreachable(network);
  }
};

/**
 * Find a denom `ICosmosBalance` in a list of balances. The denom may not exist.
 */
const findDenomsInList = (
  denom: string,
  list: Maybe<ICosmosBalance[]>,
): Nullable<ICosmosBalance[]> => {
  if (!list) {
    return null;
  }

  const result = list.filter(balance => balance.denom === denom);

  if (result) {
    return result;
  } else {
    return null;
  }
};

/**
 * Aggregate multiple values in a list and add them up.
 */
const aggregateCurrencyValuesFromList = (
  balances: any,
  key: string,
  denom: string,
) => {
  const values = balances
    // Filter by denom, if the entry has a denom field
    .filter((x: any) => {
      if (x.denom !== undefined) {
        return x.denom === denom;
      } else {
        return true;
      }
    })
    .map((x: any) => x[key]);

  // Add all the values
  return addValuesInList(values, toBigNumber);
};

/**
 * Get a percentage from a total.
 */
export const getPercentage = (
  value: GenericNumberType,
  total: GenericNumberType,
) => {
  return toBigNumber(value)
    .dividedBy(toBigNumber(total))
    .multipliedBy(100)
    .toNumber();
};

interface AccountBalancesResult {
  balance: string;
  rewards: string;
  delegations: string;
  unbonding: string;
  commissions: string;
  total: string;
  balanceFiat: string;
  delegationsFiat: string;
  rewardsFiat: string;
  unbondingFiat: string;
  commissionsFiat: string;
  totalFiat: string;
  percentages: number[];
}
/**
 * Parse the account balances data and return string balance
 * values for all the address balances.
 */
export const getAccountBalances = (
  accountBalancesData: ICosmosAccountBalances | undefined,
  rate: number,
  network: NetworkDefinition,
  denom: string,
  maximumFractionDigits?: number,
): AccountBalancesResult => {
  const { denominationSize } = network;
  const defaultResult = {
    balance: "",
    rewards: "",
    delegations: "",
    unbonding: "",
    commissions: "",
    total: "",
    balanceFiat: "",
    delegationsFiat: "",
    rewardsFiat: "",
    unbondingFiat: "",
    commissionsFiat: "",
    totalFiat: "",
    percentages: [],
  };

  if (!accountBalancesData) {
    return defaultResult;
  }

  const data = accountBalancesData;

  if (!data) {
    return defaultResult;
  }

  let balanceResult = new BigNumber("0");
  let rewardsResult = new BigNumber("0");
  let delegationResult = new BigNumber("0");
  let unbondingResult = new BigNumber("0");
  let commissionsResult = new BigNumber("0");

  const atomsBalance = findDenomsInList(denom, data.balance);
  if (atomsBalance) {
    balanceResult = aggregateCurrencyValuesFromList(
      atomsBalance,
      "amount",
      denom,
    );
  }

  const rewardsBalance = findDenomsInList(denom, data.rewards);
  if (rewardsBalance) {
    rewardsResult = aggregateCurrencyValuesFromList(
      rewardsBalance,
      "amount",
      denom,
    );
  }

  if (data.delegations) {
    delegationResult = aggregateCurrencyValuesFromList(
      data.delegations,
      "shares",
      denom,
    );
  }

  if (data.unbonding) {
    const unbondingBalances = data.unbonding.reduce(
      (entries: IUnbondingDelegationEntry[], x) => {
        return entries.concat(x.entries);
      },
      [],
    );

    unbondingResult = aggregateCurrencyValuesFromList(
      unbondingBalances,
      "balance",
      denom,
    );
  }

  if (data.commissions) {
    commissionsResult = aggregateCurrencyValuesFromList(
      data.commissions,
      "amount",
      denom,
    );
  }

  const totalResult = balanceResult
    .plus(rewardsResult)
    .plus(delegationResult)
    .plus(unbondingResult)
    .plus(commissionsResult);

  const [
    balance,
    rewards,
    delegations,
    unbonding,
    commissions,
    total,
    balanceFiat,
    delegationsFiat,
    rewardsFiat,
    unbondingFiat,
    commissionsFiat,
    totalFiat,
  ]: ReadonlyArray<string> = [
    denomToUnit(balanceResult, denominationSize, String),
    denomToUnit(rewardsResult, denominationSize, String),
    denomToUnit(delegationResult, denominationSize, String),
    denomToUnit(unbondingResult, denominationSize, String),
    denomToUnit(commissionsResult, denominationSize, String),
    denomToUnit(totalResult, denominationSize, String),
    // The rate is undefined for non fiat supported networks
    rate ? convertCryptoToFiat(rate, balanceResult, network) : "0",
    rate ? convertCryptoToFiat(rate, delegationResult, network) : "0",
    rate ? convertCryptoToFiat(rate, rewardsResult, network) : "0",
    rate ? convertCryptoToFiat(rate, unbondingResult, network) : "0",
    rate ? convertCryptoToFiat(rate, commissionsResult, network) : "0",
    rate ? convertCryptoToFiat(rate, totalResult, network) : "0",
  ].map(x => formatCurrencyAmount(x, maximumFractionDigits));

  const percentages: number[] = [
    getPercentage(balanceResult, totalResult),
    getPercentage(delegationResult, totalResult),
    getPercentage(rewardsResult, totalResult),
    getPercentage(unbondingResult, totalResult),
    getPercentage(commissionsResult, totalResult),
  ];

  return {
    balance,
    rewards,
    delegations,
    unbonding,
    commissions,
    total,
    balanceFiat,
    delegationsFiat,
    rewardsFiat,
    unbondingFiat,
    commissionsFiat,
    totalFiat,
    percentages,
  };
};

/**
 * Simple helper to determine if data from a GraphQL query can be rendered or
 * not.
 */
export const canRenderGraphQL = (graphqlProps: {
  data?: any;
  loading: boolean;
  error?: ApolloError;
}): boolean => {
  return !graphqlProps.loading && !graphqlProps.error && graphqlProps.data;
};

/**
 * Abbreviate a blockchain address in the typical fashion, e.g.
 * cosmos12az976k62c4qlsfy0tz2ujtw73vvhpqntwenje -> cosmos12...hpqntwenje
 */
export const abbreviateAddress = (
  address: string,
  offset: number = 8,
): string => {
  const endIndex = address.length - offset;
  return `${address.slice(0, 8)}...${address.slice(endIndex)}`;
};

/**
 * Flexibly format an address string and adapt to mobile view.
 */
export const formatAddressString = (
  address: Maybe<string>,
  shouldAbbreviate: boolean,
  endOffset?: number,
): string => {
  if (!address) {
    return "";
  }

  return shouldAbbreviate ? abbreviateAddress(address, endOffset) : address;
};

/**
 * Trim leading zeroes from a string value.
 */
export const trimZeroes = (str: string): string => {
  let result = "";
  let leadingZeroes = str.charAt(str.length - 1) === "0";

  for (let i = str.length - 1; i > -1; i--) {
    const char = str.charAt(i);

    if (char !== "0" || !leadingZeroes) {
      result = str.charAt(i) + result;
      leadingZeroes = false;
    }
  }

  return result;
};

/**
 * Race a promise returning function against a fixed timer.
 */
export const race = async <T extends {}>(
  promiseFn: () => Promise<T>,
  raceTimeout: number = 1500,
  timeoutMessage: string = "race timeout occurred",
) => {
  const timeout = new Promise((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(timeoutMessage);
    }, raceTimeout);
  });

  return Promise.race([promiseFn(), timeout]);
};

export interface PriceHistoryMap {
  [key: string]: number;
}

/**
 * Convert the fiat price history data to a map with date keys.
 */
export const getFiatPriceHistoryMap = (
  fiatPriceHistory: IQuery["fiatPriceHistory"],
  format?: string,
): PriceHistoryMap => {
  if (fiatPriceHistory) {
    return fiatPriceHistory.reduce((priceMap, { timestamp, price }) => {
      return {
        ...priceMap,
        [formatFiatPriceDate(timestamp, format)]: price,
      };
    }, {});
  }

  return {};
};

/**
 * Get the price value from the price history data for a given transaction
 * timestamp.
 */
export const getPriceFromTransactionTimestamp = (
  timestamp: string,
  priceHistory: PriceHistoryMap,
): string => {
  const date = formatFiatPriceDate(new Date(Number(timestamp)));
  if (date in priceHistory) {
    return String(priceHistory[date]);
  }

  return "";
};

export type ValidatorOperatorAddressMap<V> = Map<string, V>;

/**
 * Reduce a list of validators to a map keyed by the operator_address for
 * faster lookup.
 */
export const getValidatorOperatorAddressMap = <V extends {}>(
  validatorList: V[],
  getAddressFn: (validator: V) => string,
): ValidatorOperatorAddressMap<V> => {
  return validatorList.reduce((addressMap, validator) => {
    const address = getAddressFn(validator);
    addressMap.set(address.toUpperCase(), validator);
    return addressMap;
  }, new Map());
};

/**
 * Get a validator name from a delegator address, if a validator exists
 * with that address.
 */
export const getValidatorNameFromAddress = (
  validatorOperatorAddressMap: ValidatorOperatorAddressMap<ICosmosValidator>,
  address: string,
  networkName: NETWORK_NAME,
): Nullable<ICosmosValidator> => {
  const validatorAddress = getValidatorAddressFromDelegatorAddress(
    address,
    networkName,
  );

  if (
    validatorAddress &&
    validatorOperatorAddressMap.has(validatorAddress.toUpperCase())
  ) {
    const validator = validatorOperatorAddressMap.get(
      validatorAddress.toUpperCase(),
    );
    return validator || null;
  }

  return null;
};

/**
 * Artificially wait the provided amount of time.
 */
export const wait = async (time: number = 1000) => {
  await new Promise((_: any) => setTimeout(_, time));
};

/**
 * On a failed request the data key became an empty object, rather than
 * `undefined`...???
 *
 * Determine if there is any data present in a response.
 */
export const isGraphQLResponseDataEmpty = (x?: any) => {
  if (Array.isArray(x)) {
    return false;
  }

  return !Boolean(x) || !Object.keys(x).length;
};

const isChorusOne = (moniker: string) => moniker === "Chorus One";

/**
 * Sort validators list and put Chorus 1st and Certus 2nd. Apply no sorting
 * to the rest of the list.
 */
export const sortValidatorsChorusOnTop = <V extends {}>(
  validators: V[],
  validatorNameGetter: (v: V) => string,
): V[] => {
  if (!validators) {
    return [];
  }

  const reordered = new Array(validators.length);

  for (let i = 0; i < validators.length; i++) {
    const validator = validators[i];
    if (isChorusOne(validatorNameGetter(validator))) {
      reordered[0] = validator;
    } else {
      reordered[i + 1] = validator;
    }
  }

  return reordered;
};

export enum COSMOS_VALIDATORS_SORT_FILTER {
  CUSTOM_DEFAULT = "CUSTOM_DEFAULT",
  NAME = "NAME",
  VOTING_POWER = "VOTING_POWER",
  COMMISSION = "COMMISSION",
}

/**
 * Handle sorting the validators list by different parameters.
 */
export const sortValidatorsList = (
  validators: ICosmosValidator[],
  sortField: COSMOS_VALIDATORS_SORT_FILTER,
  sortAscending: boolean,
  totalStake: string,
) => {
  const list = validators.slice();
  let result = [];

  switch (sortField) {
    case COSMOS_VALIDATORS_SORT_FILTER.CUSTOM_DEFAULT:
      return sortValidatorsChorusOnTop<ICosmosValidator>(
        list,
        v => v.description.moniker,
      );
    case COSMOS_VALIDATORS_SORT_FILTER.NAME:
      result = list.sort((a, b) => {
        const aName = a.description.moniker;
        const bName = b.description.moniker;
        if (sortAscending) {
          return aName.localeCompare(bName);
        } else {
          return bName.localeCompare(aName);
        }
      });
      break;
    case COSMOS_VALIDATORS_SORT_FILTER.VOTING_POWER:
      result = list.sort((a, b) => {
        const aPower = divide(a.tokens, totalStake, Number);
        const bPower = divide(b.tokens, totalStake, Number);
        return sortAscending ? aPower - bPower : bPower - aPower;
      });
      break;
    case COSMOS_VALIDATORS_SORT_FILTER.COMMISSION:
      result = list.sort((a, b) => {
        const aRate = Number(a.commission.commission_rates.rate);
        const bRate = Number(b.commission.commission_rates.rate);
        return sortAscending ? aRate - bRate : bRate - aRate;
      });
      break;
    default:
      return assertUnreachable(sortField);
  }

  return sortValidatorsChorusOnTop<ICosmosValidator>(
    result,
    v => v.description.moniker,
  );
};

export const getCeloVotesAvailablePercentage = (
  capacity: number,
  votingPower: number,
) => {
  const open = subtract(capacity, votingPower, Number);
  const fraction = divide(open, capacity, Number);
  const percent = multiply(fraction, 100, Number);
  return percent;
};

export enum CELO_VALIDATORS_LIST_SORT_FILTER {
  CUSTOM_DEFAULT = "CUSTOM_DEFAULT",
  NAME = "NAME",
  VOTING_POWER = "VOTING_POWER",
  OPEN_VOTES = "OPEN_VOTES",
}

/**
 * Handle sorting the validators list by different parameters.
 */
export const sortCeloValidatorsList = (
  validators: ICeloValidatorGroup[],
  sortField: CELO_VALIDATORS_LIST_SORT_FILTER,
  sortAscending: boolean,
) => {
  const list = validators.slice();
  let result: ICeloValidatorGroup[] = [];

  switch (sortField) {
    case CELO_VALIDATORS_LIST_SORT_FILTER.CUSTOM_DEFAULT:
      result = list;
      break;
    case CELO_VALIDATORS_LIST_SORT_FILTER.NAME:
      result = list.sort((a, b) => {
        const aName = a.name;
        const bName = b.name;
        if (sortAscending) {
          return aName.localeCompare(bName);
        } else {
          return bName.localeCompare(aName);
        }
      });
      break;
    case CELO_VALIDATORS_LIST_SORT_FILTER.VOTING_POWER:
      result = list.sort((a, b) => {
        const aFraction = Number(a.votingPowerFraction);
        const bFraction = Number(b.votingPowerFraction);
        return sortAscending ? aFraction - bFraction : bFraction - aFraction;
      });
      break;
    case CELO_VALIDATORS_LIST_SORT_FILTER.OPEN_VOTES:
      result = list.sort((a, b) => {
        const aOpen = getCeloVotesAvailablePercentage(
          a.capacityAvailable,
          a.votingPower,
        );
        const bOpen = getCeloVotesAvailablePercentage(
          b.capacityAvailable,
          b.votingPower,
        );
        return sortAscending ? aOpen - bOpen : bOpen - aOpen;
      });
      break;
    default:
      return assertUnreachable(sortField);
  }

  return sortValidatorsChorusOnTop<ICeloValidatorGroup>(result, v => v.name);
};

/**
 * Capitalize some string for consistent formatting regardless of the
 * original casing.
 */
export const capitalizeString = (input: string): string => {
  return `${input.charAt(0).toUpperCase()}${input.slice(1).toLowerCase()}`;
};

/**
 * Get all the rewards which are available for withdrawal for a user.
 */
export const mapRewardsToAvailableRewards = (
  rewardsData: IQuery["cosmosRewardsByValidator"],
  network: NetworkDefinition,
) => {
  /**
   * Get all the rewards for the selected network denom.
   */
  const availableNetworkRewards = rewardsData
    .filter(x => x.reward !== null)
    .map(reward => {
      // It's not null!
      const denomRewards = reward.reward!.find(r => r.denom === network.denom);
      if (denomRewards) {
        return {
          ...denomRewards,
          validator_address: reward.validator_address,
        };
      }

      return null;
    })
    .filter(Boolean) as ReadonlyArray<AvailableReward>;

  /**
   * Only return rewards greater than 1.
   */
  const availableRewards = availableNetworkRewards.filter(reward =>
    isGreaterThanOrEqualTo(reward.amount, 1),
  );

  return availableRewards;
};

// Copy some text to a clipboard.
// Reference: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
export const copyTextToClipboard = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (!successful) {
      throw new Error("Failed to copy text");
    }

    Toast.success(`Copied ${text} to clipboard.`);
  } catch (err) {
    Toast.danger(`Failed to copy ${text} to clipboard!`);
  }

  document.body.removeChild(textArea);
};

/**
 * Format a chain id, e.g. cosmoshub-2 -> Cosmos Hub 2.
 * NOTE: This is hard-coded to format cosmos network chain
 * ids and will need to be updated to support other networks.
 */
export const justFormatChainString = (chain: string) => {
  const id = chain.slice(-1);
  return `Cosmos Hub ${id}`;
};

/**
 * Parse an error field from a GraphQL request failure and return
 * the formatted error code, if it exists. Expected request failures
 * which are handled by the GraphQL server can be parsed in this way.
 */
export const parseGraphQLError = (error?: {
  message: string;
}): Nullable<RequestFailure> => {
  try {
    if (error) {
      const expectedJSON = error.message.replace("GraphQL error: ", "");
      const result = JSON.parse(expectedJSON);
      return result;
    }
  } catch (err) {
    // no-op
  }

  return null;
};

/**
 * Try to convert a raw transaction result fetched from the LCD API to
 * the data model which matches our GraphQL transaction data.
 *
 * If this fails just return null, and the result will be disregarded.
 *
 * TODO: Update this to work with Cosmos Hub 3 transactions data model.
 */
export const adaptRawTransactionData = (
  rawTransaction: any,
  chainId: string,
): Nullable<ICosmosTransaction> => {
  try {
    const tx = rawTransaction;
    const adaptedTransactionResult: ICosmosTransaction = {
      chain: chainId,
      fees: {
        amount: null,
        gas: tx.gas,
      },
      gasused: rawTransaction.gas_used,
      gaswanted: rawTransaction.gas_wanted,
      hash: rawTransaction.txhash,
      height: rawTransaction.height,
      log: rawTransaction.logs,
      memo: "",
      msgs: [],
      tags: [],
      timestamp: String(new Date(rawTransaction.timestamp).getTime()),
    };

    return adaptedTransactionResult;
  } catch (err) {
    return null;
  }
};

/**
 * Format a validator commission rate.
 */
export const formatCommissionRate = (rate: string) => {
  return multiply(rate, 100, Number).toFixed(2);
};

/**
 * Format the validators voting power. The voting power is the validator
 * stake divided by the entire network stake.
 */
export const getPercentageFromTotal = (fraction: string, total: string) => {
  const share = divide(fraction, total);
  const power = multiply(share, 100, Number).toFixed(2);
  return power;
};

interface Stake {
  percentage: string;
  rewards: string;
  validator: ICosmosValidator;
}

interface StakingInformation {
  total: string;
  delegations: Stake[];
}

/**
 * Combine the rewards available for withdrawal with the validators list
 * to get additional validator metadata.
 */
export const deriveCurrentDelegationsInformation = (
  staking: IQuery["cosmosAccountBalances"]["delegations"],
  validators: ICosmosValidator[],
  network: NetworkDefinition,
): StakingInformation => {
  if (!staking) {
    return {
      total: "0",
      delegations: [],
    };
  }

  const delegationsData = [];
  let total = 0;

  // Iterate through the rewards and combine with the validator list data
  for (const data of staking) {
    const validator = validators.find(
      x => x.operator_address === data.validator_address,
    );
    const { shares } = data;
    if (!validator || !shares) {
      continue;
    } else {
      total = add(total, shares, Number);
      delegationsData.push({
        validator,
        rewards: shares,
      });
    }
  }

  // Sort the result by rewards amount
  const sortedByReward = delegationsData.sort((a, b) =>
    subtract(b.rewards, a.rewards, Number),
  );

  // Combine with the percentages
  const delegations: Stake[] = sortedByReward.map(x => {
    return {
      ...x,
      percentage: getPercentageFromTotal(x.rewards, String(total)),
    };
  });

  const denomSize = network.denominationSize;

  // Return the summary result
  return {
    total: formatCurrencyAmount(denomToUnit(total, denomSize), 2),
    delegations,
  };
};
