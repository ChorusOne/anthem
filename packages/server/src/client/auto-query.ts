import fs from "fs";
import { request } from "graphql-request";
import ENV from "../tools/server-env";
import { RequestData, requests } from "./query-utils";

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

/**
 * Check if a file exists or not.
 */
const responseFileExists = (key: string) => {
  return fs.existsSync(`${PATH}/${key}.json`);
};

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */
const PORT = ENV.PORT;
const GRAPHQL_URL = `http://localhost:${PORT}/graphql`;

/**
 * Make a request against the GraphQL server and write the response as JSON
 * data to a file.
 */
const graphql = async (requestData: RequestData) => {
  const [key, query, variables] = requestData;

  // Only run for new queries which do not have mocked data yet by default:
  if (ENV.RUN_ALL_MOCKS || !responseFileExists(key)) {
    console.log(`- Processing query, key: ${key}`);
    const result = await request(GRAPHQL_URL, query, variables);
    writeGraphQLResponseToFile(key, result);
  }
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
