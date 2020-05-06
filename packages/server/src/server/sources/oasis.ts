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

interface TxBurn {
  owner: string;
  tokens: string;
}

interface TxEscrow {
  add?: {
    owner: string;
    escrow: string;
    tokens: string;
  };
  take?: {
    owner: string;
    tokens: string;
  };
  reclaim?: {
    owner: string;
    escrow: string;
    tokens: string;
  };
}

interface TxTransfer {
  to: string;
  from: string;
  tokens: string;
}

interface OasisTransaction {
  date: string;
  height?: string;
  escrow?: TxEscrow;
  burn?: TxBurn;
  transfer?: TxTransfer;
}

const fetchTransactions = async (
  address: string,
  pageSize: number,
  startingPage: number,
  network: NetworkDefinition,
): Promise<IQuery["oasisTransactions"]> => {
  const host = getHostFromNetworkName(network.name);
  const response = await AxiosUtil.get<OasisTransaction>(
    `${host}/account/${address}/events`,
  );

  console.log(response);
  // return OASIS_TXS;

  return {
    page: 1,
    limit: 25,
    data: [],
    moreResultsExist: true,
  };
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

const OASIS = {
  fetchAccountBalances,
  fetchTransactions,
};

export default OASIS;
