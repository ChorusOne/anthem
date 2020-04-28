import { IQuery, NetworkDefinition } from "@anthem/utils";
import { AxiosUtil, getHostFromNetworkName } from "../axios-utils";

/** ===========================================================================
 * Oasis REST API Utils
 * ----------------------------------------------------------------------------
 * This file contains REST API utils for fetching data using the Oasis
 * blockchain APIs.
 * ============================================================================
 */

interface OasisDelegation {
  delegator: string;
  validator: string;
  amount: string;
}

interface OasisAccountResponse {
  address: string;
  balance: string;
  height: number;
  delegations: OasisDelegation[];
  meta: {
    is_validator: boolean;
    is_delegator: boolean;
  };
}

/**
 * Fetch Oasis account balances.
 */
const fetchAccountBalances = async (
  address: string,
  network: NetworkDefinition,
): Promise<IQuery["accountBalances"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get<OasisAccountResponse>(
    `${host}/account/${address}`,
  );

  return {
    balance: [
      {
        denom: "oasis",
        amount: response.balance,
      },
    ],
    rewards: [],
    delegations: response.delegations.map(d => ({
      delegator_address: d.delegator,
      validator_address: d.validator,
      shares: d.amount,
    })),
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
