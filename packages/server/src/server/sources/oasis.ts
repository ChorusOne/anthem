import { IQuery, NetworkDefinition } from "@anthem/utils";
import {} from "../../tools/utils";
import { AxiosUtil, getHostFromNetworkName } from "../axios-utils";

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
  // const response = await AxiosUtil.get(`${host}/account/${address}`);

  // Return fake data:
  return {
    balance: [
      {
        denom: "oasis",
        amount: "8461776366",
      },
    ],
    rewards: [],
    delegations: [
      {
        delegator_address: "CVzqFIADD2Ed0khGBNf4Rvh7vSNtrL1ULTkWYQszDpc=",
        validator_address: "CVzqFIADD2Ed0khGBNf4Rvh7vSNtrL1ULTkWYQszDpc=",
        shares: "10540852281084",
      },
    ],
    unbonding: [],
    commissions: [],
  };

  // return {
  //   balance: [
  //     {
  //       denom: "oasis",
  //       amount: response.balance,
  //     },
  //   ],
  //   rewards: [],
  //   delegations: [],
  //   unbonding: [],
  //   commissions: [],
  // };
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

const OASIS = {
  fetchAccountBalances,
};

export default OASIS;
