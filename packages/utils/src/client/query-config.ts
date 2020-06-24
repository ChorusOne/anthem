import { Variables } from "graphql-request/dist/src/types";
import { NETWORK_ADDRESS_DEFAULTS } from "@anthem/utils";

/** ===========================================================================
 * Configuration for automatically runnings GraphQL queries against the
 * server.
 *
 * If a new query is added to the server, it may need new configuration added
 * if it accepts variables. This should be added in the `VARIABLES_CONFIG`
 * below.
 * ============================================================================
 */

export interface VarConfig {
  variables: Variables;
  testQuery: (s: string) => boolean;
}

const { COSMOS, OASIS, CELO } = NETWORK_ADDRESS_DEFAULTS;

/**
 * Variable config source of truth for which variables will be mapped
 * to which queries.
 */
const VARIABLES_CONFIG: ReadonlyArray<VarConfig> = [
  // Oasis APIs ---------------------------------------------------------------
  {
    variables: {
      fiat: "USD",
      address: OASIS.account,
    },
    testQuery: (gql: string) => {
      return (
        gql.includes("oasisAccountHistory") &&
        gql.includes("$address") &&
        gql.includes("$fiat")
      );
    },
  },
  {
    variables: {
      address: OASIS.account,
    },
    testQuery: (gql: string) => {
      return gql.includes("oasisTransactions") && gql.includes("$address");
    },
  },
  {
    variables: {
      hash: OASIS.tx_hash,
    },
    testQuery: (gql: string) =>
      gql.includes("oasisTransaction") && gql.includes("$hash"),
  },
  {
    variables: {
      address: OASIS.account,
    },
    testQuery: (gql: string) => gql.includes("oasisAccountBalances"),
  },
  // Celo APIs ----------------------------------------------------------------
  {
    variables: {
      fiat: "USD",
      address: CELO.account,
    },
    testQuery: (gql: string) => {
      return (
        gql.includes("celoAccountHistory") &&
        gql.includes("$address") &&
        gql.includes("$fiat")
      );
    },
  },
  {
    variables: {
      address: CELO.account,
    },
    testQuery: (gql: string) => {
      return gql.includes("celoTransactions") && gql.includes("$address");
    },
  },
  {
    variables: {
      address: CELO.account,
    },
    testQuery: (gql: string) => {
      return (
        gql.includes("celoGovernanceTransactions") && gql.includes("$address")
      );
    },
  },
  {
    variables: {
      hash: CELO.tx_hash,
    },
    testQuery: (gql: string) =>
      gql.includes("celoTransaction") && gql.includes("$hash"),
  },
  {
    variables: {
      address: CELO.account,
    },
    testQuery: (gql: string) => gql.includes("celoAccountBalances"),
  },
  // Cosmos APIs --------------------------------------------------------------
  {
    variables: {
      fiat: "USD",
      network: "COSMOS",
      validatorAddress: COSMOS.validator,
    },
    testQuery: (gql: string) => {
      return gql.includes("$fiat") && gql.includes("$validatorAddress");
    },
  },
  {
    variables: {
      fiat: "USD",
      currency: "ATOM",
    },
    testQuery: (gql: string) => {
      return gql.includes("$currency") && gql.includes("$fiat");
    },
  },
  {
    variables: {
      fiat: "USD",
      network: "COSMOS",
      address: COSMOS.account,
    },
    testQuery: (gql: string) => {
      return gql.includes("$fiat") && gql.includes("$address");
    },
  },
  {
    variables: {
      fiat: "USD",
      network: "COSMOS",
    },
    testQuery: (gql: string) => {
      return gql.includes("$fiat");
    },
  },
  {
    variables: {
      network: "COSMOS",
      address: COSMOS.account,
    },
    testQuery: (gql: string) => gql.includes("$address"),
  },
  {
    variables: {
      network: "COSMOS",
      hash: COSMOS.tx_hash,
    },
    testQuery: (gql: string) =>
      gql.includes("cosmosTransaction") && gql.includes("$hash"),
  },
  {
    variables: {
      network: "COSMOS",
      validatorAddress: COSMOS.validator,
    },
    testQuery: (gql: string) => gql.includes("$validatorAddress"),
  },
  {
    variables: {
      versus: "USD",
      currency: "ATOM",
    },
    testQuery: (gql: string) =>
      gql.includes("$currency") && gql.includes("$versus"),
  },
  {
    variables: {
      network: "COSMOS",
    },
    testQuery: (gql: string) => gql.includes("$network"),
  },
];

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { VARIABLES_CONFIG };
