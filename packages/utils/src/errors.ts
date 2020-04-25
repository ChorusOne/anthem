import { NetworkDefinition } from "./networks";

// Type definition for expected request failure objects.
export interface RequestFailure {
  type: ERROR_TYPES;
  message: string;
}

// Definitive error types.
enum ERROR_TYPES {
  NETWORK_NOT_SUPPORTED = "NETWORK_NOT_SUPPORTED",
}

/**
 * Explicit error codes provided by the server and parsed by the client.
 */
export const ERRORS = {
  [ERROR_TYPES.NETWORK_NOT_SUPPORTED]: (network: NetworkDefinition) =>
    JSON.stringify({
      type: ERROR_TYPES.NETWORK_NOT_SUPPORTED,
      message: `${network.name} network is not supported yet.`,
    }),
};
