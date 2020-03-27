import { render } from "@testing-library/react";
import App from "App";
import { DEFAULT_CATALOG, DEFAULT_LOCALE, ILocale } from "i18n/catalog";
import { createMockClient } from "mock-apollo-client";
import store from "modules/create-store";
import actions from "modules/settings/actions";
import GovernancePage from "pages/GovernancePage";
import SettingsPage from "pages/SettingsPage";
import WalletPage from "pages/WalletPage";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { act, create } from "react-test-renderer";
import {
  createStringTranslationMethodFromLocale,
  createTranslationMethodFromLocale,
} from "tools/i18n-utils";

export const mockI18NProps = {
  setLocale: (locale: ILocale) => actions.updateSetting({ locale }),
  i18n: {
    locale: DEFAULT_LOCALE,
    t: createTranslationMethodFromLocale(DEFAULT_CATALOG),
    tString: createStringTranslationMethodFromLocale(DEFAULT_CATALOG),
  },
};

/**
 * Suppress verbose console messages for rendering app components in this
 * test suite.
 */
beforeAll(() => {
  // tslint:disable-next-line
  console.log = jest.fn();
  // tslint:disable-next-line
  console.warn = jest.fn();
  // tslint:disable-next-line
  console.error = jest.fn();
});

describe("App Component", () => {
  test("App component renders without crashing", () => {
    render(<App />);
  });
});

describe.skip("SettingsPage", () => {
  test("SettingsPage component renders without crashing", () => {
    const client = createMockClient();
    act(() => {
      create(
        <ReduxProvider store={store}>
          <ApolloProvider client={client}>
            <ApolloHooksProvider client={client}>
              <Router>
                <SettingsPage {...mockI18NProps} />
              </Router>
            </ApolloHooksProvider>
          </ApolloProvider>
        </ReduxProvider>,
      );
    });
  });
});

describe("WalletPage", () => {
  test("WalletPage component renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <ReduxProvider store={store}>
        <WalletPage {...mockI18NProps} />
      </ReduxProvider>,
      div,
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe("GovernancePage", () => {
  test("GovernancePage component renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <ReduxProvider store={store}>
        <GovernancePage {...mockI18NProps} />
      </ReduxProvider>,
      div,
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
