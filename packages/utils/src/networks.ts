/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface NetworkFeatureMeta {
  supportsBalances: boolean;
  supportsPortfolio: boolean;
  supportsTransactionsHistory: boolean;
  supportsValidatorsList: boolean;
}

export interface NetworkDefinition extends NetworkFeatureMeta {
  available: boolean; // Flag to officially show/hide the network in Anthem
  name: NETWORK_NAME;
  ticker: string;
  denom: COIN_DENOMS;
  descriptor: string;
  chainId: string;
  coinGeckoTicker: string;
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

/** ===========================================================================
 * Networks
 * ---------------------------------------------------------------------------
 * This is the source of truth for all supported or in-development networks
 * for Anthem. The network definitions include various configuration details
 * and flags which dictate their usage and features in Anthem.
 * ============================================================================
 */

export type COIN_DENOMS = "uatom" | "ukava" | "uluna" | "oasis" | "cGLD";

export type NETWORK_NAME = "COSMOS" | "TERRA" | "KAVA" | "OASIS" | "CELO";

const NETWORKS: NetworksMap = {
  COSMOS: {
    available: true,
    name: "COSMOS",
    denom: "uatom",
    ticker: "atom",
    descriptor: "ATOM",
    chainId: "cosmoshub-3",
    coinGeckoTicker: "cosmos",
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
    denominationSize: 1e6, // 1 ATOM = 1,000,000 uatom
  },
  TERRA: {
    available: true,
    name: "TERRA",
    denom: "uluna",
    ticker: "luna",
    descriptor: "LUNA",
    chainId: "columbus-3",
    coinGeckoTicker: "terra-luna",
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
    denominationSize: 1e6,
  },
  KAVA: {
    available: true,
    name: "KAVA",
    denom: "ukava",
    ticker: "kava",
    descriptor: "KAVA",
    chainId: "kava-2",
    coinGeckoTicker: "kava",
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
    denominationSize: 1e6,
  },
  OASIS: {
    available: false,
    name: "OASIS",
    denom: "oasis",
    ticker: "oasis",
    descriptor: "OASIS",
    chainId: "oasis",
    coinGeckoTicker: "oasis",
    cryptoCompareTicker: "OASIS",
    ledgerAppVersion: "n/a",
    ledgerAppName: "n/a",
    ledgerDocsLink: "n/a",
    supportsLedger: false,
    supportsFiatPrices: false,
    supportsBalances: true,
    supportsPortfolio: false,
    supportsTransactionsHistory: true,
    supportsValidatorsList: false,
    denominationSize: 1e6, // TODO: What is the denomination size?
  },
  CELO: {
    // available: true,
    available: false,
    name: "CELO",
    denom: "cGLD",
    ticker: "celo",
    descriptor: "CELO",
    chainId: "celo",
    coinGeckoTicker: "celo",
    cryptoCompareTicker: "CELO",
    ledgerAppVersion: "1.0.1",
    ledgerAppName: "Celo",
    ledgerDocsLink: "https://docs.celo.org/celo-gold-holder-guide/ledger",
    // supportsLedger: true,
    supportsLedger: false,
    supportsFiatPrices: false,
    supportsBalances: true,
    supportsPortfolio: false,
    supportsTransactionsHistory: false,
    supportsValidatorsList: false,
    denominationSize: 1e18, // 1 cGLD = 1000000000000000000 wei
  },
};

// Refactor to improve this whitelisting logic
const AVAILABLE_NETWORKS = Object.values(NETWORKS).filter(n => n.available);

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { NETWORKS, AVAILABLE_NETWORKS };
