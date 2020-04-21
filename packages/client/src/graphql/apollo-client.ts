import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import ENV from "lib/client-env";
import getSchemaLink from "./mocks";

/** ===========================================================================
 * Fragment Matcher
 * ----------------------------------------------------------------------------
 * This is for correcting matching union type fragment query results.
 *
 * Reference:
 * 1: https://www.apollographql.com/docs/react/advanced/fragments/
 * 2: https://graphql-code-generator.com/docs/plugins/fragment-matcher
 * ============================================================================
 */

// import introspectionResult from "graphql/introspection-result.json";
import introspectionResult from "@anthem/utils";

const fragmentMatcher = new IntrospectionFragmentMatcher({
  // The type is correct:
  introspectionQueryResultData: introspectionResult as any,
});

const cache = new InMemoryCache({
  fragmentMatcher,
});

const getHttpLink = () => {
  return new HttpLink({
    uri: ENV.GRAPHQL_URL,
  });
};

/** ===========================================================================
 * Apollo Client Setup
 * ----------------------------------------------------------------------------
 * ApolloClient is used for fetching and managing data from GraphQL.
 * ============================================================================
 */

const client = new ApolloClient({
  cache,
  link: ENV.ENABLE_MOCK_APIS ? getSchemaLink() : getHttpLink(),
});

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default client;
