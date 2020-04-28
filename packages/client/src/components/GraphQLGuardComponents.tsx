import { Spinner } from "@blueprintjs/core";
import React from "react";
import { QueryResult } from "react-apollo";
import { QueryHookResult } from "react-apollo-hooks";
import { isGraphQLResponseDataEmpty } from "tools/client-utils";
import { tFnString } from "tools/i18n-utils";
import { Centered } from "./SharedComponents";

/** ===========================================================================
 * GraphQLGuardComponents
 * ----------------------------------------------------------------------------
 * Wrapper components which can surround GraphQL data and provide default
 * loading and error state behavior to avoid tedious, repetitive, manual
 * implementation.
 * ============================================================================
 */

type ChildrenType = ReactNode | ((data: any) => ReactNode);

/**
 * Guard for rendering UI dependant on GraphQL data. Renders loading or
 * error fallback UI components if the response is in loading or error state,
 * or, otherwise returns `null` and allows the caller to render some UI
 * instead.
 */
export const GraphQLGuardComponent = (graphqlQueryResponse: {
  result: QueryResult | QueryHookResult<any, any>;
  dataKey: string;
  isLoading?: boolean;
  loadingComponent?: JSX.Element;
  errorComponent?: JSX.Element;
  tString: tFnString;
  children: ChildrenType;
  allowErrorResponses?: boolean;
}): JSX.Element => {
  const {
    result,
    tString,
    dataKey,
    children,
    isLoading,
    errorComponent,
    loadingComponent,
    allowErrorResponses,
  } = graphqlQueryResponse;
  const { error, loading } = result;

  let data;
  if (dataKey) {
    if (dataKey in result) {
      data = result[dataKey as keyof typeof result];
    }
  } else {
    data = result.data;
  }

  if (loading || isLoading) {
    return (
      loadingComponent || (
        <Centered>
          <Spinner />
        </Centered>
      )
    );
  } else if (
    !allowErrorResponses &&
    (error || (!loading && isGraphQLResponseDataEmpty(data)))
  ) {
    return (
      errorComponent || (
        <Centered>
          <p style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>
            {tString("Error fetching data...")}
          </p>
        </Centered>
      )
    );
  }

  if (typeof children === "function") {
    return children(data);
  } else {
    return children;
  }
};

type keypathType = ReadonlyArray<string> | string;

/**
 * Retrieve data from an object at the specified key or key path. Returns
 * null if they operation fails (the key path is invalid).
 */
const keyPath = (data: { [key: string]: any }, keys: keypathType) => {
  const path = typeof keys === "string" ? [keys] : keys;
  try {
    return path.reduce((result, key) => result[key], data);
  } catch (err) {
    return null;
  }
};

type ResultObject = QueryResult | QueryHookResult<any, any>;
type NamedResultObject = readonly [ResultObject, keypathType];

/**
 * The same as `GraphQLGuardComponent` but accepts an array of `results`
 * and only renders the provided children if all the results have been
 * fetched successfully without error.
 */
export const GraphQLGuardComponentMultipleQueries = (graphqlQueryResponse: {
  results: ReadonlyArray<NamedResultObject>;
  loadingComponent?: JSX.Element;
  errorComponent?: JSX.Element;
  tString: tFnString;
  children: ChildrenType;
  allowErrorResponses?: boolean;
}): JSX.Element => {
  const {
    results,
    tString,
    children,
    errorComponent,
    loadingComponent,
    allowErrorResponses,
  } = graphqlQueryResponse;

  const anyQueryIsLoading = results.find(([x]) => x.loading);
  const anyQueryHasError = results.find(([x]) => x.error !== undefined);

  if (anyQueryIsLoading) {
    return (
      loadingComponent || (
        <Centered>
          <Spinner />
        </Centered>
      )
    );
  } else if (anyQueryHasError && !allowErrorResponses) {
    return (
      errorComponent || (
        <Centered>
          <p style={{ fontSize: 16, fontWeight: 500 }}>
            {tString("Error fetching data...")}
          </p>
        </Centered>
      )
    );
  }

  if (typeof children === "function") {
    // Pass the result data to the children function
    const data = results.map(([result, keys]) => keyPath(result, keys));
    return children(data);
  } else {
    return children;
  }
};
