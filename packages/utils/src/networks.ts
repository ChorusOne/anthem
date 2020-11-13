/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface NetworkFeatureMeta {
  supportsBalances: boolean;
  supportsPortfolio: boolean;
  supportsTransactionsHistory: boolean;
  supportsValidatorsList: boolean;
  supportsGovernance: boolean;
}

export interface NetworkDefinition extends NetworkFeatureMeta {
  available: boolean; // Flag to officially show/hide the network in Anthem
  name: NETWORK_NAME;
  denom: COIN_DENOMS;
  denomsList: Array<Partial<COIN_DENOMS>>;
  descriptor: string;
  chainId: string;
  cryptoCompareTicker: string;
  supportsFiatPrices: boolean;
  ledgerAppVersion: string;
  supportsLedger: boolean;
  ledgerAppName: string;
  ledgerDocsLink: string;
  denominationSize: number;
  customChartTabs: Set<string>;
  expectedReward: number | null;
}

interface NetworksMap {
  [key: string]: NetworkDefinition;
}

interface Addresses {
  account: string;
  validator: string;
  tx_hash: string;
}

/**
 * Address defaults to be used in various places, e.g. fetching fixed client
 * data for app development and in the Cypress tests to interact with the
 * app.
 *
 * More values can be filled in as needed.
 */
const NETWORK_ADDRESS_DEFAULTS: { [key: string]: Addresses } = {
  COSMOS: {
    account: "cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd",
    validator: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
    tx_hash: "E0BC81E3B76F70466D8F235F02EDD3F3E23E8C52A40D27A650BC14A9E6F8239C",
  },
  TERRA: {
    account: "terra15urq2dtp9qce4fyc85m6upwm9xul30496lytpd",
    validator: "terravaloper15urq2dtp9qce4fyc85m6upwm9xul30496sgk37",
    tx_hash: "9D8F4938F842A84DF39D793F9FFE6491C919230828507BCC4E58B187BE88064D",
  },
  KAVA: {
    account: "",
    validator: "",
    tx_hash: "",
  },
  OASIS: {
    account: "oasis1qqhjc0phd0wg43luhly2ufsuw2h3gc5v3ukk4ku2",
    validator: "oasis1qpn83e8hm3gdhvpfv66xj3qsetkj3ulmkugmmxn3",
    tx_hash: "076625844d57e7ce4c270a79d769b2a7ab6e6d12d8d3ec2fa566eee2d0f89f03",
  },
  CELO: {
    account: "0x47b2dB6af05a55d42Ed0F3731735F9479ABF0673",
    validator: "0x81cef0668e15639D0b101bdc3067699309D73BED",
    tx_hash:
      "0xdb33159c19e457e500adae015e4923d3851f355f7319c3ded15a8cfe4503d002",
  },
};

/** ===========================================================================
 * Networks
 * ---------------------------------------------------------------------------
 * This is the source of truth for all supported or in-development networks
 * for Anthem. The network definitions include various configuration details
 * and flags which dictate their usage and features in Anthem.
 * ============================================================================
 */

export type TERRA_DENOMS = "ukrw" | "uluna" | "uusd" | "usdr" | "umnt";

export type COIN_DENOMS =
  | "uatom"
  | "ukava"
  | TERRA_DENOMS
  | "ROSE"
  | "CELO"
  | "DOT";

export type NETWORK_NAME =
  | "COSMOS"
  | "TERRA"
  | "KAVA"
  | "OASIS"
  | "CELO"
  | "POLKADOT";

export interface CoinDenom {
  denom: string;
  name: string;
}

export const TERRA_DENOMS_LIST: TERRA_DENOMS[] = [
  "ukrw",
  "uluna",
  "uusd",
  "usdr",
  "umnt",
];

export const COIN_DENOM_MAP = {
  uluna: "LUNA",
  ukrw: "TerraKRW",
  uusd: "TerraUSD",
  usdr: "TerraSDR",
  umnt: "Terra Mongolian Tughrik",
  uatom: "ATOM",
  ukava: "KAVA",
  ROSE: "ROSE",
  CELO: "CELO",
};

export const coinDenomToName = (denom: string): string => {
  const name = COIN_DENOM_MAP[denom];
  return name ? name : denom;
};

export const denomToCoinDenom = (denom: string): CoinDenom => {
  const name = COIN_DENOM_MAP[denom];
  return { denom, name };
};

export const getDefaultDenomFromNetwork = (
  network: NetworkDefinition,
): CoinDenom => {
  return {
    denom: network.denom,
    name: network.descriptor,
  };
};

const NETWORKS: NetworksMap = {
  COSMOS: {
    available: true,
    name: "COSMOS",
    denom: "uatom",
    denomsList: ["uatom"],
    descriptor: "ATOM",
    chainId: "cosmoshub-3",
    cryptoCompareTicker: "ATOM",
    ledgerAppVersion: "1.1.1",
    ledgerAppName: "Cosmos",
    ledgerDocsLink:
      "https://hub.cosmos.network/master/resources/ledger.html#install-the-cosmos-ledger-application",
    supportsLedger: true,
    supportsFiatPrices: true,
    supportsBalances: true,
    supportsPortfolio: true,
    supportsTransactionsHistory: true,
    supportsValidatorsList: true,
    supportsGovernance: false,
    denominationSize: 1e6, // 1 ATOM = 1,000,000 uatom
    customChartTabs: new Set(),
    expectedReward: 9,
  },
  TERRA: {
    available: true,
    name: "TERRA",
    denom: "uluna",
    denomsList: TERRA_DENOMS_LIST,
    descriptor: "LUNA",
    chainId: "columbus-3",
    cryptoCompareTicker: "LUNA",
    ledgerAppVersion: "1.1.1",
    ledgerAppName: "Cosmos",
    ledgerDocsLink: "https://docs.terra.money/docs/node-ledger-nano-support",
    supportsLedger: true,
    supportsFiatPrices: true,
    supportsBalances: true,
    supportsPortfolio: true,
    supportsTransactionsHistory: true,
    supportsValidatorsList: true,
    supportsGovernance: false,
    denominationSize: 1e6,
    customChartTabs: new Set(),
    expectedReward: 13,
  },
  KAVA: {
    available: true,
    name: "KAVA",
    denom: "ukava",
    denomsList: ["ukava"],
    descriptor: "KAVA",
    chainId: "kava-3",
    cryptoCompareTicker: "KAVA",
    ledgerAppVersion: "1.1.1",
    ledgerAppName: "Cosmos",
    ledgerDocsLink:
      "https://medium.com/kava-labs/configure-ledger-nano-s-for-use-with-kava-4c3b00aeca32",
    supportsLedger: true,
    supportsFiatPrices: true,
    supportsBalances: true,
    supportsPortfolio: false,
    supportsTransactionsHistory: false,
    supportsValidatorsList: true,
    supportsGovernance: false,
    denominationSize: 1e6,
    customChartTabs: new Set(),
    expectedReward: 9,
  },
  CELO: {
    available: true,
    name: "CELO",
    denom: "CELO",
    denomsList: ["CELO"],
    descriptor: "CELO",
    chainId: "celo",
    cryptoCompareTicker: "CELO",
    ledgerAppVersion: "1.0.1",
    ledgerAppName: "Celo",
    ledgerDocsLink: "https://docs.celo.org/celo-gold-holder-guide/ledger",
    supportsLedger: true,
    supportsFiatPrices: true,
    supportsBalances: true,
    supportsPortfolio: true,
    supportsTransactionsHistory: true,
    supportsValidatorsList: true,
    supportsGovernance: true,
    denominationSize: 1e18, // 1 cGLD = 1000000000000000000 wei
    customChartTabs: new Set(["VOTING", "CUSD"]),
    expectedReward: 8,
  },
  OASIS: {
    available: true,
    name: "OASIS",
    denom: "ROSE", // For Amber testnet
    denomsList: ["ROSE"],
    descriptor: "ROSE",
    chainId: "oasis",
    cryptoCompareTicker: "OASIS",
    ledgerAppVersion: "1.8.1",
    ledgerAppName: "Oasis",
    ledgerDocsLink: "https://docs.oasis.dev/general/",
    supportsLedger: true,
    supportsFiatPrices: false,
    supportsBalances: true,
    supportsPortfolio: true,
    supportsTransactionsHistory: true,
    supportsValidatorsList: true,
    supportsGovernance: false,
    denominationSize: 1e9,
    customChartTabs: new Set(),
    expectedReward: null,
  },
  POLKADOT: {
    available: false,
    name: "POLKADOT",
    denom: "DOT",
    denomsList: ["DOT"],
    descriptor: "DOT",
    chainId: "n/a",
    cryptoCompareTicker: "DOT",
    ledgerAppVersion: "4.18.0",
    ledgerAppName: "Polkadot",
    ledgerDocsLink: "https://wiki.polkadot.network/docs/en/learn-ledger",
    supportsLedger: false,
    supportsFiatPrices: false,
    supportsBalances: false,
    supportsPortfolio: false,
    supportsTransactionsHistory: false,
    supportsValidatorsList: false,
    supportsGovernance: false,
    denominationSize: 1e9,
    customChartTabs: new Set(),
    expectedReward: null,
  },
};

// Refactor to improve this whitelisting logic
const AVAILABLE_NETWORKS = Object.values(NETWORKS).filter(n => n.available);

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { NETWORKS, AVAILABLE_NETWORKS, NETWORK_ADDRESS_DEFAULTS };
