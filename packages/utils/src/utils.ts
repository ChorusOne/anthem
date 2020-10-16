import bech32 from "bech32";
import { NETWORKS, NetworkDefinition, NETWORK_NAME } from "./networks";

/**
 * Assert a condition cannot occur. Used for writing exhaustive switch
 * blocks (e.g. see unwrapOkValueIfExists).
 */
export const assertUnreachable = (x: never): never => {
  throw new Error(
    `Panicked! Received a value which should not exist: ${JSON.stringify(x)}`,
  );
};

/**
 * Wait some time.
 */
export const wait = async (time: number = 1000) => {
  await new Promise((res: any) => setTimeout(res, time));
};

/**
 * Determine the network for a given address using the address prefix.
 *
 * NOTE: Polkadot address validation was hard-coded and has been
 * removed.
 */
export const deriveNetworkFromAddress = (
  address: string,
): NetworkDefinition => {
  if (address.substring(0, 6) === "cosmos") {
    return NETWORKS.COSMOS;
  } else if (address.substring(0, 5) === "terra") {
    return NETWORKS.TERRA;
  } else if (address.substring(0, 4) === "kava") {
    return NETWORKS.KAVA;
  } else if (address.substring(0, 5) === "oasis") {
    return NETWORKS.OASIS;
  } else if (address.substring(0, 2) === "0x" && address.length === 42) {
    return NETWORKS.SKALE; // TODO: find a way to distinguish Celo and Skale
  } else if (address.substring(0, 2) === "0x" && address.length === 42) {
    return NETWORKS.CELO;
  } else if (address.length === 48) {
    // NOTE: This check based on length === 48 may need to change!
    return NETWORKS.POLKADOT;
  }

  throw new Error(
    `Unrecognized address ${address} with no associated network!`,
  );
};

/**
 * Get the network definition from a provided network name.
 */
export const getNetworkDefinitionFromIdentifier = (networkName: string) => {
  const name = networkName.toUpperCase();

  if (name in NETWORKS) {
    return NETWORKS[name];
  }

  throw new Error(
    `Unsupported or invalid network name ${networkName} supplied!`,
  );
};

/**
 * Get the network definition from a provided network price ticker.
 */
export const getNetworkDefinitionFromTicker = (ticker: string) => {
  const network = Object.values(NETWORKS).find(
    n => ticker === n.cryptoCompareTicker,
  );

  if (network) {
    return network;
  } else {
    throw new Error(
      `Unsupported or invalid network ticker ${ticker} supplied!`,
    );
  }
};

/**
 * Get network enums.
 */
const getCosmosSdkAddressEnumsForNetwork = (name: NETWORK_NAME) => {
  const networkPrefix = name.toLowerCase();
  return {
    ACCOUNT_ADDRESS: `${networkPrefix}`,
    ACCOUNT_PUBLIC_KEY: `${networkPrefix}pub`,
    VALIDATOR_OPERATOR_ADDRESS: `${networkPrefix}valoper`,
    VALIDATOR_CONSENSUS_ADDRESS: `${networkPrefix}valcons`,
    VALIDATOR_CONSENSUS_PUBLIC_KEY: `${networkPrefix}valconspub`,
    VALIDATOR_OPERATOR_PUBLIC_KEY: `${networkPrefix}valoperpub`,
  };
};

/**
 * Convert a validator address to its associated delegator address.
 */
export const validatorAddressToOperatorAddress = (validatorAddress: string) => {
  const decodedAddress = bech32.decode(validatorAddress);
  const prefix = validatorAddress.slice(0, validatorAddress.indexOf("valoper"));
  const operatorAddress = bech32.encode(prefix, decodedAddress.words);
  return operatorAddress;
};

/**
 * Decode a validator address using bech32 and re-encode it to derive the
 * associated validator address.
 */
export const getValidatorAddressFromDelegatorAddress = (
  address: string,
  network: NETWORK_NAME,
): string | null => {
  try {
    const networkAddressEnum = getCosmosSdkAddressEnumsForNetwork(network);
    const decodedAddress = bech32.decode(address);
    const validatorAddress = bech32.encode(
      networkAddressEnum.VALIDATOR_OPERATOR_ADDRESS,
      decodedAddress.words,
    );

    return validatorAddress;
  } catch (err) {
    return null;
  }
};
