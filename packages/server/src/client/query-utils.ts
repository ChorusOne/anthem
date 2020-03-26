import fs from "fs";
import path from "path";

import { Variables } from "graphql-request/dist/src/types";
import { QUERY_FILE_KEYS, VarConfig, VARIABLES_CONFIG } from "./config";

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
 *
 * @param  {string} gql
 * @returns Variables
 */
const getVariablesForRequest = (gql: string): Variables => {
  return VARIABLES_CONFIG.reduce((vars: Variables, configItem: VarConfig) => {
    if (Object.keys(vars).length) {
      return vars;
    }

    const { variables, test } = configItem;
    if (test(gql)) {
      return variables;
    } else {
      return vars;
    }
  }, {});
};

/**
 * Map the gql key to a file path.
 *
 * @param  {string} key
 * @returns readonly tuple with the `[key, filePath]`
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
 * Export
 * ============================================================================
 */

export { requests };
