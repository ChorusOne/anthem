import { IQuery } from "../../schema/graphql-types";
import {} from "../../tools/utils";
import { AxiosUtil, getHostFromNetworkName } from "../axios-utils";
import { NetworkDefinition } from "./networks";

/** ===========================================================================
 * Oasis REST API Utils
 * ----------------------------------------------------------------------------
 * This file contains REST API utils for fetching data using the Oasis
 * blockchain APIs.
 * ============================================================================
 */

/**
 * Fetch account balances.
 */
const fetchAccountBalances = async (
  address: string,
  network: NetworkDefinition,
): Promise<IQuery["accountBalances"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get(`${host}/account/${address}`);

  console.log(response);

  return {
    balance: [
      {
        denom: "oasis",
        amount: response.balance,
      },
    ],
    rewards: [],
    delegations: [],
    unbonding: [],
    commissions: [],
  };
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

const OASIS = {
  fetchAccountBalances,
};

export default OASIS;
