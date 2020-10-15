import { NetworkDefinition } from "@anthem/utils";
import { AxiosUtil, getHostFromNetworkName } from "../tools/axios-utils";

export const fetchBalance = async (
  address: string,
  network: NetworkDefinition,
) => {
  const host = getHostFromNetworkName(network.name);

  // TODO: fix typings
  const response: any = await AxiosUtil.get(
    `${host}/current/${address}/balance`,
  );

  return response;
};
