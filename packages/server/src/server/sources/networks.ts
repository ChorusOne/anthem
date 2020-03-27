/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

import ENV from "src/tools/env-utils";

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

export type COIN_DENOMS = "uatom" | "ukava" | "uluna" | "oasis";

export type NETWORK_NAME = "COSMOS" | "TERRA" | "KAVA" | "OASIS";

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

let NETWORKS_LIST = NETWORKS;

if (!ENV.DEVELOPMENT) {
  NETWORKS_LIST = {
    ...NETWORKS_LIST,
    OASIS: {
      name: "OASIS",
      denom: "oasis",
      descriptor: "OASIS",
      coinGeckoTicker: "oasis",
      cryptoCompareTicker: "OASIS",
    },
  };
}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default NETWORKS_LIST;
