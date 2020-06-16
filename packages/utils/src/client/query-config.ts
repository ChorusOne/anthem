import { Variables } from "graphql-request/dist/src/types";

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

const COSMOS = "cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd";
const COSMOS_TX =
  "E0BC81E3B76F70466D8F235F02EDD3F3E23E8C52A40D27A650BC14A9E6F8239C";
const COSMOS_VALIDATOR = "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707";

const OASIS = "LL2rD5jOQoO9QWyPOw8BhEX1i15mGhdrEcDVOaOAYVk=";
const OASIS_TX = ""; // TODO: ???

const CELO = "0x91E317a5437c0AFD7c99BfC9c120927131Cda2D2";
const CELO_TX =
  "0xdb33159c19e457e500adae015e4923d3851f355f7319c3ded15a8cfe4503d002";

/**
 * Variable config source of truth for which variables will be mapped
 * to which queries.
 */
const VARIABLES_CONFIG: ReadonlyArray<VarConfig> = [
  // Oasis APIs ---------------------------------------------------------------
  {
    variables: {
      fiat: "USD",
      address: OASIS,
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
      address: OASIS,
    },
    testQuery: (gql: string) => {
      return gql.includes("oasisTransactions") && gql.includes("$address");
    },
  },
  // Celo APIs ----------------------------------------------------------------
  {
    variables: {
      fiat: "USD",
      address: CELO,
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
      address: CELO,
    },
    testQuery: (gql: string) => {
      return gql.includes("celoTransactions") && gql.includes("$address");
    },
  },
  // Cosmos APIs --------------------------------------------------------------
  {
    variables: {
      fiat: "USD",
      network: "COSMOS",
      validatorAddress: COSMOS_VALIDATOR,
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
      address: COSMOS,
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
      address: COSMOS,
    },
    testQuery: (gql: string) => gql.includes("$address"),
  },
  {
    variables: {
      network: "COSMOS",
      hash: COSMOS_TX,
    },
    testQuery: (gql: string) =>
      gql.includes("cosmosTransaction") && gql.includes("$hash"),
  },
  {
    variables: {
      hash: OASIS_TX,
    },
    testQuery: (gql: string) =>
      gql.includes("oasisTransaction") && gql.includes("$hash"),
  },
  {
    variables: {
      hash: CELO_TX,
    },
    testQuery: (gql: string) =>
      gql.includes("celoTransaction") && gql.includes("$hash"),
  },
  {
    variables: {
      network: "COSMOS",
      validatorAddress: COSMOS_VALIDATOR,
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
