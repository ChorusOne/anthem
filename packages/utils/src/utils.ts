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
 * Determine the network for a given address using the address prefix.
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
  } else if (address.length === 44) {
    return NETWORKS.OASIS;
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
  const network = Object.values(NETWORKS).find(n => n.ticker === ticker);

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
  const operatorAddress = bech32.encode("cosmos", decodedAddress.words);
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
