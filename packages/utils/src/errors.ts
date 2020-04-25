import { NetworkDefinition } from "./networks";

enum ERROR_TYPES {
  NETWORK_NOT_SUPPORTED = "NETWORK_NOT_SUPPORTED",
}

export interface RequestFailure {
  type: ERROR_TYPES;
  message: string;
}

export const ERRORS = {
  [ERROR_TYPES.NETWORK_NOT_SUPPORTED]: (network: NetworkDefinition) =>
    JSON.stringify({
      type: ERROR_TYPES.NETWORK_NOT_SUPPORTED,
      message: `${network.name} network is not supported yet.`,
    }),
};
