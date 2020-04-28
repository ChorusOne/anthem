/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

export interface NetworkDefinition {
  name: NETWORK_NAME;
  ticker: string;
  denom: COIN_DENOMS;
  descriptor: string;
  chainId: string;
  coinGeckoTicker: string;
  cryptoCompareTicker: string;
  supportsFiatPrices: boolean;
  supportsLedger: boolean;
  available: boolean; // Flag to officially show/hide the network in Anthem
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

export type COIN_DENOMS = "uatom" | "ukava" | "uluna" | "oasis";

export type NETWORK_NAME = "COSMOS" | "TERRA" | "KAVA" | "OASIS";

const NETWORKS: NetworksMap = {
  COSMOS: {
    name: "COSMOS",
    denom: "uatom",
    ticker: "atom",
    descriptor: "ATOM",
    chainId: "cosmoshub-3",
    coinGeckoTicker: "cosmos",
    cryptoCompareTicker: "ATOM",
    supportsFiatPrices: true,
    supportsLedger: true,
    available: true,
  },
  TERRA: {
    name: "TERRA",
    denom: "uluna",
    ticker: "luna",
    descriptor: "LUNA",
    chainId: "columbus-3",
    coinGeckoTicker: "terra-luna",
    cryptoCompareTicker: "LUNA",
    supportsFiatPrices: true,
    supportsLedger: true,
    available: true,
  },
  KAVA: {
    name: "KAVA",
    denom: "ukava",
    ticker: "kava",
    descriptor: "KAVA",
    chainId: "kava-2",
    coinGeckoTicker: "kava",
    cryptoCompareTicker: "KAVA",
    supportsFiatPrices: true,
    supportsLedger: true,
    available: true,
  },
  OASIS: {
    name: "OASIS",
    denom: "oasis",
    ticker: "oasis",
    descriptor: "OASIS",
    chainId: "oasis-2",
    coinGeckoTicker: "oasis",
    cryptoCompareTicker: "OASIS",
    supportsFiatPrices: false,
    supportsLedger: false,
    available: false,
  },
};

// Refactor to improve this whitelisting logic
const AVAILABLE_NETWORKS = Object.values(NETWORKS).filter(n => n.available);

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { NETWORKS, AVAILABLE_NETWORKS };
