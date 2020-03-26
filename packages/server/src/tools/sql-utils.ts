import sqlString from "sqlstring";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

export interface SQLVariables {
  [key: string]: string | number;
}

/** ===========================================================================
 * SQL Queries Utils
 * ============================================================================
 */

/**
 * Trim duplicate whitespace and newlines.
 *
 * @param  {string} q
 */
export const trimQuery = (q: string): string => {
  return q.replace(/\s+/g, " ").replace(/\n/, "");
};

/**
 * Escape and format a user submitted address into a SQL query string and
 * return a URI encoded query string.
 *
 * @param  {string} sql
 * @param  {string} address
 * @returns string
 */
export const getSqlQueryString = (
  sql: string,
  variables: SQLVariables = {},
  enforceVariablesExist: boolean = true,
): string => {
  let query = sql;
  /* Interpolate all the variables into the query */
  Object.entries(variables).forEach(([key, value]) => {
    const pattern = `@${key}`;
    if (enforceVariablesExist && !query.includes(pattern)) {
      throw new Error(
        `Invalid variables received for query, expected: ${pattern}`,
      );
    }

    query = query.replace(new RegExp(pattern, "g"), sqlString.escape(value));
  });

  return trimQuery(query);
};
