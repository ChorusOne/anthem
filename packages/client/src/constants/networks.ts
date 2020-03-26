/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

export interface NetworkMetadata {
  name: NETWORK_NAME;
  ticker: string;
  denom: COIN_DENOMS;
  descriptor: string;
  chainId: string;
  coinGeckoTicker: string;
}

interface NetworksMap {
  [key: string]: NetworkMetadata;
}

/** ===========================================================================
 * Networks
 * ---------------------------------------------------------------------------
 * - Definitions of networks and their metadata for the support networks.
 * ============================================================================
 */

export type COIN_DENOMS = "uatom" | "ukava" | "uluna";

export type NETWORK_NAME = "COSMOS" | "TERRA" | "KAVA";

const NETWORKS: NetworksMap = {
  COSMOS: {
    name: "COSMOS",
    denom: "uatom",
    ticker: "atom",
    descriptor: "ATOM",
    chainId: "cosmoshub-3",
    coinGeckoTicker: "cosmos",
  },
  TERRA: {
    name: "TERRA",
    denom: "uluna",
    ticker: "luna",
    descriptor: "LUNA",
    chainId: "columbus-3",
    coinGeckoTicker: "terra-luna",
  },
  KAVA: {
    name: "KAVA",
    denom: "ukava",
    ticker: "kava",
    descriptor: "KAVA",
    chainId: "kava-2",
    coinGeckoTicker: "kava",
  },
};

const AVAILABLE_NETWORKS = Object.values(NETWORKS).filter(n => n.name);

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { AVAILABLE_NETWORKS };

export default NETWORKS;
