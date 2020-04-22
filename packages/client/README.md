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
