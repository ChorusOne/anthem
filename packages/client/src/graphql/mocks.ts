import { RESOLVER_QUERY_KEYS } from "@anthem/utils";
import { SchemaLink } from "apollo-link-schema";
import { addMockFunctionsToSchema, makeExecutableSchema } from "graphql-tools";
import { loader } from "graphql.macro";
import { IQuery } from "./types";

/** ===========================================================================
 * Mock GraphQL Configuration for running in Offline Dev Mode
 * ----------------------------------------------------------------------------
 * See: https://www.apollographql.com/docs/graphql-tools/mocking/
 * ============================================================================
 */

// Load the schema file
const schemaString = loader("./schema.graphql");

const keys = RESOLVER_QUERY_KEYS as ReadonlyArray<QueryKeyUnion>;

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

// Add delay time to simulate loading behavior:
const MOCK_DELAY_TIME = 0;

// Add custom delays for specific queries
const QUERY_LOAD_TIMES = {
  // accountBalances: 1e10,
  // addressHistoryData: 1e10,
};

type QueryKeyUnion = keyof IQuery;

// Add query keys to simulate request failure:
const failKeysList: ReadonlyArray<QueryKeyUnion> = [];

const SHOULD_FAIL_KEYS: Set<QueryKeyUnion> = new Set(failKeysList);

/** ===========================================================================
 * Utils
 * ============================================================================
 */

/**
 * Determine the delay time for a query. Queries have a global delay time
 * which can be overridden by specific delay times for individual queries.
 */
const getDelayTime = (key: QueryKeyUnion): number => {
  if (key in QUERY_LOAD_TIMES) {
    return QUERY_LOAD_TIMES[key as keyof typeof QUERY_LOAD_TIMES];
  } else {
    return MOCK_DELAY_TIME;
  }
};

/**
 * Determine if a query should fail or not. If it should, throw an error.
 */
const handleMaybeFailQuery = (key: QueryKeyUnion) => {
  if (SHOULD_FAIL_KEYS.has(key)) {
    throw new Error("Request failed!");
  }
};

/**
 * Artificial delay function.
 */
const artificialDelay = async (key: QueryKeyUnion) => {
  await new Promise((r: any) => setTimeout(r, getDelayTime(key)));
};

/** ===========================================================================
 * Mock Resolvers Configuration
 * ============================================================================
 */

/**
 * Read fixed response JSON data from a file.
 */
const getQueryResolverFromKey = (key: QueryKeyUnion) => async (
  _: void,
  args: { [key: string]: any },
) => {
  // Handle optional failures
  handleMaybeFailQuery(key);

  try {
    // Handle optional delay
    await artificialDelay(key);

    // Get saved response data from utils/ package client/data directory
    const json = require(`../../../utils/src/client/data/${key}.json`);

    // Return response JSON
    return json[key];
  } catch (err) {
    /**
     * If this happens it's possible the query is not mocked yet and no
     * response data has been recorded.
     */
    throw new Error(
      `Failed to return mock data for key: ${key}, error: - ${err.message}`,
    );
  }
};

/**
 * Create the mock query resolvers, using the query resolver keys in the
 * real resolvers file.
 */
const mockQueryResolvers = keys.reduce((mockResolvers, key) => {
  return {
    ...mockResolvers,
    [key]: getQueryResolverFromKey(key),
  };
}, {});

/**
 * Create the new mock resolvers.
 */
const mocks = {
  Query: () => mockQueryResolvers,
};

const typeResolvers = {
  TxMsgValue: {
    /**
     * This has to be overridden here because the logic is different since
     * the recorded response JSON has already been processed and transformed.
     */
    __resolveType(obj: any) {
      if (obj.amounts && obj.amounts.length) {
        return "MsgSend";
      } else if (obj.amount) {
        return "MsgDelegate";
      }

      if (obj.delegator_address) {
        return "MsgWithdrawDelegationReward";
      }

      if (obj.validator_address) {
        return "MsgWithdrawValidatorCommission";
      }

      if (obj.proposal_id) {
        return "MsgVote";
      }

      return null;
    },
  },
};

/** ===========================================================================
 * Mocks Configuration
 * ============================================================================
 */

const getSchemaLink = () => {
  // Make a GraphQL schema with no resolvers
  const schema = makeExecutableSchema({
    typeDefs: schemaString,
    resolvers: typeResolvers,
  });

  // Add mocks, modifies schema in place
  addMockFunctionsToSchema({ schema, mocks, preserveResolvers: true });

  return new SchemaLink({ schema });
};

/** ===========================================================================
 * Exp
 * ============================================================================
 */

export default getSchemaLink;
