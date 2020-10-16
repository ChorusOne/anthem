import {
  deriveNetworkFromAddress,
  getNetworkDefinitionFromIdentifier,
  IQuery,
  ISkaleAccountBalances,
  ISkaleAccountBalancesQueryVariables,
  NETWORK_NAME,
  NETWORKS,
} from "@anthem/utils";
import COSMOS_EXTRACTOR from "../sources/cosmos-extractor";
import COSMOS_SDK from "../sources/cosmos-sdk";
import EXCHANGE_DATA_API from "../sources/fiat-price-data";
import { fetchBalance } from "../sources/skale-extractor";
import {
  blockUnsupportedNetworks,
  standardizeTimestamps,
  validatePaginationParams,
} from "../tools/server-utils";

export const SkaleResolvers = {
  skaleAccountBalances: async (
    _: void,
    args: ISkaleAccountBalancesQueryVariables,
  ): Promise<ISkaleAccountBalances> => {
    const { address } = args;
    const network = NETWORKS.SKALE || deriveNetworkFromAddress(address); // TODO: fix it to use deriveNetworkFromAddress
    const response = await fetchBalance(address, network);

    return {
      ...response,
      delegations: [
        {
          address: "1234567890",
          validatorId: "987654321",
          amount: 1234,
          delegationPeriod: 123456,
          created: 987654321,
          started: 123456789,
          finished: 987654321,
          info: "info schminfo",
        },
      ],
    };
  },
};
