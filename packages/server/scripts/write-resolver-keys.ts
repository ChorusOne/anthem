import fs from "fs";
import resolvers from "../src/resolvers/resolvers";

/**
 * Derive all the query keys from the current resolver set.
 */
const QUERY_FILE_KEYS: ReadonlyArray<string> = Object.keys(resolvers.Query);

const rawKeysFileString = `
export default ${JSON.stringify(QUERY_FILE_KEYS)};
`;

/**
 * Save the list of query keys to a file.
 */
const writeKeysToDisk = (keys: string) => {
  fs.writeFileSync("../utils/src/client/resolver-query-keys.ts", keys);
  console.log("Query keys saved!\n");
};

/**
 * Write the keys file.
 */
writeKeysToDisk(rawKeysFileString);
