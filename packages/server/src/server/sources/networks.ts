/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

export interface NetworkDefinition {
  name: NETWORK_NAME;
  denom: COIN_DENOMS;
  descriptor: string;
  coinGeckoTicker: string;
  cryptoCompareTicker: string;
}

interface NetworksMap {
  [key: string]: NetworkDefinition;
}

/** ===========================================================================
 * Networks
 * ---------------------------------------------------------------------------
 * - Definitions of networks and their metadata for the support networks.
 *
 * - TODO: This file is duplicated in the Anthem codebase as well. It could
 * be consolidated so Anthem fetches the list of supported networks from
 * Chariot when it loads.
 * ============================================================================
 */

export type COIN_DENOMS = "uatom" | "ukava" | "uluna";

export type NETWORK_NAME = "COSMOS" | "TERRA" | "KAVA";

const NETWORKS: NetworksMap = {
  COSMOS: {
    name: "COSMOS",
    denom: "uatom",
    descriptor: "ATOM",
    coinGeckoTicker: "cosmos",
    cryptoCompareTicker: "ATOM",
  },
  TERRA: {
    name: "TERRA",
    denom: "uluna",
    descriptor: "LUNA",
    coinGeckoTicker: "luna",
    cryptoCompareTicker: "LUNA",
  },
  KAVA: {
    name: "KAVA",
    denom: "ukava",
    descriptor: "KAVA",
    coinGeckoTicker: "kava",
    cryptoCompareTicker: "KAVA",
  },
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default NETWORKS;
