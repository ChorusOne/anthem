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
  test: (s: string) => boolean;
}

/**
 * Variable config source of truth for which variables will be mapped
 * to which queries.
 */
const VARIABLES_CONFIG: ReadonlyArray<VarConfig> = [
  // Oasis APIs ---------------------------------------------------------------
  {
    variables: {
      fiat: "USD",
      address: "LL2rD5jOQoO9QWyPOw8BhEX1i15mGhdrEcDVOaOAYVk=",
    },
    test: (gql: string) => {
      return (
        gql.includes("oasisAccountHistory") &&
        gql.includes("$address") &&
        gql.includes("$fiat")
      );
    },
  },
  {
    variables: {
      address: "LL2rD5jOQoO9QWyPOw8BhEX1i15mGhdrEcDVOaOAYVk=",
    },
    test: (gql: string) => {
      return gql.includes("oasisTransactions") && gql.includes("$address");
    },
  },
  // Celo APIs ----------------------------------------------------------------
  {
    variables: {
      fiat: "USD",
      address: "0xaaA0f78431F31d1395ABAC444DD239aA50459b7F=",
    },
    test: (gql: string) => {
      return (
        gql.includes("celoAccountHistory") &&
        gql.includes("$address") &&
        gql.includes("$fiat")
      );
    },
  },
  {
    variables: {
      address: "0xaaA0f78431F31d1395ABAC444DD239aA50459b7F=",
    },
    test: (gql: string) => {
      return gql.includes("celoTransactions") && gql.includes("$address");
    },
  },
  // Cosmos APIs --------------------------------------------------------------
  {
    variables: {
      fiat: "USD",
      network: "COSMOS",
      validatorAddress: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
    },
    test: (gql: string) => {
      return gql.includes("$fiat") && gql.includes("$validatorAddress");
    },
  },
  {
    variables: {
      fiat: "USD",
      currency: "ATOM",
    },
    test: (gql: string) => {
      return gql.includes("$currency") && gql.includes("$fiat");
    },
  },
  {
    variables: {
      fiat: "USD",
      network: "COSMOS",
      address: "cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd",
    },
    test: (gql: string) => {
      return gql.includes("$fiat") && gql.includes("$address");
    },
  },
  {
    variables: {
      fiat: "USD",
      network: "COSMOS",
    },
    test: (gql: string) => {
      return gql.includes("$fiat");
    },
  },
  {
    variables: {
      network: "COSMOS",
      address: "cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd",
    },
    test: (gql: string) => gql.includes("$address"),
  },
  {
    variables: {
      network: "COSMOS",
      txHash:
        "E0BC81E3B76F70466D8F235F02EDD3F3E23E8C52A40D27A650BC14A9E6F8239C",
    },
    test: (gql: string) => gql.includes("$txHash"),
  },
  {
    variables: {
      network: "COSMOS",
      validatorAddress: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
    },
    test: (gql: string) => gql.includes("$validatorAddress"),
  },
  {
    variables: {
      versus: "USD",
      currency: "ATOM",
    },
    test: (gql: string) => gql.includes("$currency") && gql.includes("$versus"),
  },
  {
    variables: {
      network: "COSMOS",
    },
    test: (gql: string) => gql.includes("$network"),
  },
];

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { VARIABLES_CONFIG };
