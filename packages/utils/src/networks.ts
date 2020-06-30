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
  descriptor: string;
  chainId: string;
  cryptoCompareTicker: string;
  supportsFiatPrices: boolean;
  ledgerAppVersion: string;
  supportsLedger: boolean;
  ledgerAppName: string;
  ledgerDocsLink: string;
  denominationSize: number;
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
    account: "",
    validator: "",
    tx_hash: "",
  },
  KAVA: {
    account: "",
    validator: "",
    tx_hash: "",
  },
  OASIS: {
    account: "oasis1qqhjc0phd0wg43luhly2ufsuw2h3gc5v3ukk4ku2",
    validator: "",
    tx_hash: "756d7f36d88002b7195a25cc0050b365e00324d3187f4ae986bc66d6bbe63d4b",
  },
  CELO: {
    account: "0x47b2dB6af05a55d42Ed0F3731735F9479ABF0673",
    validator: "",
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

export type COIN_DENOMS = "uatom" | "ukava" | "uluna" | "AMBR" | "CELO";

export type NETWORK_NAME = "COSMOS" | "TERRA" | "KAVA" | "OASIS" | "CELO";

const NETWORKS: NetworksMap = {
  COSMOS: {
    available: true,
    name: "COSMOS",
    denom: "uatom",
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
  },
  TERRA: {
    available: true,
    name: "TERRA",
    denom: "uluna",
    descriptor: "LUNA",
    chainId: "columbus-3",
    cryptoCompareTicker: "LUNA",
    ledgerAppVersion: "1.1.1",
    ledgerAppName: "Cosmos",
    ledgerDocsLink: "https://docs.terra.money/docs/node-ledger-nano-support",
    supportsLedger: true,
    supportsFiatPrices: true,
    supportsBalances: true,
    supportsPortfolio: false,
    supportsTransactionsHistory: false,
    supportsValidatorsList: true,
    supportsGovernance: false,
    denominationSize: 1e6,
  },
  KAVA: {
    available: true,
    name: "KAVA",
    denom: "ukava",
    descriptor: "KAVA",
    chainId: "kava-2",
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
  },
  OASIS: {
    available: true,
    name: "OASIS",
    denom: "AMBR", // For Amber testnet
    descriptor: "AMBR",
    chainId: "oasis",
    cryptoCompareTicker: "OASIS",
    ledgerAppVersion: "n/a",
    ledgerAppName: "n/a",
    ledgerDocsLink: "n/a",
    supportsLedger: false,
    supportsFiatPrices: false,
    supportsBalances: true,
    supportsPortfolio: true,
    supportsTransactionsHistory: true,
    supportsValidatorsList: false,
    supportsGovernance: false,
    denominationSize: 1e9,
  },
  CELO: {
    // available: true,
    available: false,
    name: "CELO",
    denom: "CELO",
    descriptor: "CELO",
    chainId: "celo",
    cryptoCompareTicker: "CGLD",
    ledgerAppVersion: "1.0.1",
    ledgerAppName: "Celo",
    ledgerDocsLink: "https://docs.celo.org/celo-gold-holder-guide/ledger",
    // supportsLedger: true,
    supportsLedger: false,
    supportsFiatPrices: true,
    supportsBalances: true,
    supportsPortfolio: true,
    supportsTransactionsHistory: true,
    supportsValidatorsList: true,
    supportsGovernance: true,
    denominationSize: 1e18, // 1 cGLD = 1000000000000000000 wei
  },
};

// Refactor to improve this whitelisting logic
const AVAILABLE_NETWORKS = Object.values(NETWORKS).filter(n => n.available);

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { NETWORKS, AVAILABLE_NETWORKS, NETWORK_ADDRESS_DEFAULTS };
