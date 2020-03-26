import { QUERY_FILE_KEYS } from "../client/config";
import { requests } from "../client/query-utils";

describe("Query utils", () => {
  test("All QUERY_FILE_KEYS are mapped to requests", () => {
    const queryKeys = QUERY_FILE_KEYS.reduce((keys, key) => {
      keys.add(key);
      return keys;
    }, new Set());

    for (const rq of requests) {
      const [key, gql, variables] = rq;
      expect(queryKeys.has(key)).toBeTruthy();
      expect(typeof gql).toBe("string");
      expect(typeof variables).toBe("object");
    }
  });
});
