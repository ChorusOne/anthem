/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface NetworkFeatureMeta {
  balancesUnsupported?: boolean;
  portfolioUnsupported?: boolean;
  transactionsListUnsupported?: boolean;
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
}

interface NetworksMap {
  [key: string]: NetworkDefinition;
}

/** ===========================================================================
 * Networks
 * ---------------------------------------------------------------------------
 * Definitions of networks and their metadata for the support networks.
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
    supportsFiatPrices: true,
    supportsLedger: true,
    ledgerAppName: "Cosmos",
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
    supportsFiatPrices: true,
    supportsLedger: true,
    ledgerAppName: "Cosmos",
    balancesUnsupported: true,
    portfolioUnsupported: true,
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
    supportsFiatPrices: true,
    supportsLedger: true,
    ledgerAppName: "Cosmos",
    balancesUnsupported: true,
    portfolioUnsupported: true,
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
    supportsFiatPrices: false,
    supportsLedger: false,
    ledgerAppName: "Cosmos",
    portfolioUnsupported: true,
    transactionsListUnsupported: true,
  },
  CELO: {
    available: true,
    name: "CELO",
    denom: "cGLD",
    ticker: "celo",
    descriptor: "CELO",
    chainId: "celo",
    coinGeckoTicker: "celo",
    cryptoCompareTicker: "CELO",
    ledgerAppVersion: "1.0.1",
    supportsFiatPrices: false,
    supportsLedger: true,
    ledgerAppName: "Celo",
    // available: false,
    // supportsLedger: false,
    balancesUnsupported: true,
    portfolioUnsupported: true,
    transactionsListUnsupported: true,
  },
};

// Refactor to improve this whitelisting logic
const AVAILABLE_NETWORKS = Object.values(NETWORKS).filter(n => n.available);

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { NETWORKS, AVAILABLE_NETWORKS };
