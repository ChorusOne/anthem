import fs from "fs";

import { QUERY_FILE_KEYS } from "../src/client/config";

const keysString = `
export default ${JSON.stringify(QUERY_FILE_KEYS)};
`;

/**
 * Save the list of query keys to a file.
 */
((keys: string) => {
  fs.writeFileSync("src/client/query-keys.ts", keys);
  console.log("Query keys saved\n");
})(keysString);
