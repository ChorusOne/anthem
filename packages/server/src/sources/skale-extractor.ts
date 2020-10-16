import { NetworkDefinition } from "@anthem/utils";
import { AxiosUtil, getHostFromNetworkName } from "../tools/axios-utils";

export const fetchBalance = async (
  address: string,
  network: NetworkDefinition,
) => {
  const host = getHostFromNetworkName(network.name);

  // TODO: fix typings
  // const response: any = await AxiosUtil.get(
  //   `${host}/current/${address}/balance`,
  // );

  return {
    address: "0x96aA945360B76e18ea5a1cFf3Ebd9b5B8ffa518E",
    height: "21345566q342",
    skaleTokenBalance: "2222",
    skaleTokenLockedBalance: "1111",
    skaleTokenDelegatedBalance: "1234",
    skaleUSDValue: "12345",
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
};
