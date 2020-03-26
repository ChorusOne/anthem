import { FocusStyleManager } from "@blueprintjs/core";
import * as Sentry from "@sentry/browser";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import { Provider as ReduxProvider } from "react-redux";
import { Router as ReactRouter } from "react-router-dom";

import AppContainer from "containers/AppContainer";
import { ThemeProvider } from "containers/ThemeContainer";
import client from "graphql/apollo-client";
import ENV from "lib/env-lib";
import store, { history } from "modules/create-store";

/* Disable focus styles for mouse events */
FocusStyleManager.onlyShowFocusOnTabs();

/* Initialize Sentry */
Sentry.init({ dsn: ENV.SENTRY_DSN });

/** ===========================================================================
 * This is the top level App file which renders the app.
 * ============================================================================
 */

const App: React.FC = () => {
  return (
    <ReduxProvider store={store}>
      <ApolloProvider client={client}>
        <ApolloHooksProvider client={client}>
          <ReactRouter history={history}>
            <ThemeProvider>
              <AppContainer />
            </ThemeProvider>
          </ReactRouter>
        </ApolloHooksProvider>
      </ApolloProvider>
    </ReduxProvider>
  );
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default App;
