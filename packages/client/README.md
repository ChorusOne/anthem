# Anthem Client

This is the client web dashboard for Anthem.

## Project Overview

This is a React web application written in TypeScript using React-Apollo and Redux.

- [React](https://reactjs.org/): A JavaScript library for building user interfaces.
- [BlueprintJS](https://blueprintjs.com/): A React-based UI kit component library.
- [Styled Components](https://www.styled-components.com/): CSS-in-JS component approach to styling.
- [React Router](https://reacttraining.com/react-router/web/guides/quick-start): A declarative routing library built for React.
- [React Context](https://reactjs.org/docs/context.html): For managing and sharing some state throughout the application.
- [Redux](https://redux.js.org) + [RxJS](https://rxjs-dev.firebaseapp.com) & [Redux Observable](https://redux-observable.js.org): For managing most global state, side effects, and application logic.
- [Apollo](https://www.apollographql.com/docs/react/): For fetching and managing data.
- [GraphQL](https://graphql.org/): A query language for your API.
- [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript.
- [TSLint](https://palantir.github.io/tslint/): A linter for TypeScript, with extensions for immutability and other tools like Blueprint.
- [Prettier](https://prettier.io/): An opinionated code formatter for JavaScript and related languages.
- [Jest](https://jestjs.io/): The JavaScript test runner.
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro): A simple testing library for React.
- [React Hooks Testing Library](https://react-hooks-testing-library.com/): A new library to test custom React Hooks.
- [Cypress](https://www.cypress.io/): An end-to-end testing framework for web applications.
- [CircleCI](https://circleci.com): For continuous integration and deployment.
- [DangerJS](https://danger.systems/js/): Automation for common code review tasks.
- [Yarn](https://yarnpkg.com/en/): For dependency management.
- [Segment](https://segment.com/docs/) and [Amplitude](https://developers.amplitude.com) for product analytics.

## Testing

This project is built in TypeScript to take advantage of static typing and uses other tools like Prettier and TSLint to establish consistent code styling. All of these tools are integrated and configuration in the runnable project scripts and tests. For instance you can run:

```sh
# runs Prettier
$ yarn prettier

# runs TSLint
$ yarn tslint

# runs the TypeScript compiler
$ yarn tsc

# runs the project unit tests using Jest
$ yarn test

# runs the unit tests in Jest watch mode
$ yarn test

# runs all the above tests
$ yarn test
```

You can also run `yarn prettier:fix` or `yarn tslint:fix` to use the auto-fix options for these tools to fix any issues. Normally, any linting/styling issues should be fixed automatically on-save if you are using VS Code with the recommended extensions.

The overall approach to testing for this project follows the idea of the ["testing pyramid"](https://martinfowler.com/articles/practical-test-pyramid.html) and looks like this:

1. Static analysis (TypeScript, TSLint, and Prettier).
2. Unit tests: ideally 100% test coverage of all functions (Jest test runner).
3. Integration tests: entire application or major components can be tested or mocked using React snapshot testing.
4. UI testing/E2E/Acceptance Tests. We use Cypress for e2e/integration testing. You can run the Cypress test suite by running `yarn dev` to launch the app in testing mode and `yarn cypress` to launch the Cypress test runner.

Using these approaches, our goal is to have total test coverage for the entire application. These tests will be automated and run continuously against code changes so developers can ship code frequently to production with confidence and get feedback quickly and early whenever their changes introduce bugs or regressions.

## Deployment

```sh
yarn build
```

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes. Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

Anthem is currently continuously deployed using Netlify and updates are pushed on any commits to `master`.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started). To learn React, check out the [React documentation](https://reactjs.org/).
