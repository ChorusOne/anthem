import fs from "fs";
import { request } from "graphql-request";
import { Variables } from "graphql-request/dist/src/types";
import path from "path";
import { VarConfig, VARIABLES_CONFIG } from "./query-config";
import QUERY_FILE_KEYS from "./resolver-query-keys";

/** ===========================================================================
 * Script file with code to auto-query the GraphQL server with all existing
 * GraphQL queries and recording the responses.
 *
 * This generates fixed mock data which can be used to run the server in
 * offline mode.
 * ============================================================================
 */

export type RequestData = readonly [string, string, { [key: string]: any }];
export type RequestArray = ReadonlyArray<RequestData>;

/**
 * For a given gql string, return the associated variables that gql query
 * requires, or an empty object if there are none.
 */
const getVariablesForRequest = (gql: string): Variables => {
  // Find the matching variable config
  const config = VARIABLES_CONFIG.find(x => x.test(gql));
  if (config) {
    return config.variables;
  }

  return {};
};

/**
 * Map the gql key to a file path.
 */
const keyToFilePath = (key: string): readonly [string, string] => {
  return [key, `./gql/queries/${key}.gql`];
};

/**
 * Map query file keys to tuples of [key, JSON].
 */
const requests: RequestArray = QUERY_FILE_KEYS.map(keyToFilePath).map(
  ([key, file]) => {
    const query = fs.readFileSync(path.join(__dirname, file), "utf8");
    const variables = getVariablesForRequest(query);
    return [key, query, variables];
  },
);

/** ===========================================================================
 * File Utils
 * ============================================================================
 */

const PATH = "./src/client/data";

/**
 * Write a GraphQL response to a file.
 */
const writeGraphQLResponseToFile = (key: string, response: any) => {
  const json = JSON.stringify(response);
  fs.writeFileSync(`${PATH}/${key}.json`, json, "utf8");
};

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

// Override PORT if local port is different
const PORT = process.env.PORT || 8000;
const GRAPHQL_URL = `http://localhost:${PORT}/graphql`;

/**
 * Make a request against the GraphQL server and write the response as JSON
 * data to a file.
 */
const graphql = async (requestData: RequestData) => {
  const [key, query, variables] = requestData;
  console.log(`- Processing query, key: ${key}`);
  const result = await request(GRAPHQL_URL, query, variables);
  writeGraphQLResponseToFile(key, result);
};

/**
 * Warn user they need to have the server running for this to work.
 */
const message =
  "\nRunning requests against GraphQL server - make sure you have the server running!\n";

console.log(message);

/**
 * For each request, make the request and record the data.
 */
for (const rq of requests) {
  graphql(rq);
}
