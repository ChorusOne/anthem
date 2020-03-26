# Chariot

<img width="423" alt="Screen Shot 2019-10-21 at 7 36 54 AM" src="https://user-images.githubusercontent.com/18126719/67205662-ccbc8000-f3d5-11e9-9efe-ff07c7c125ad.png">

## Project Overview

**This is a GraphQL server written in TypeScript using Apollo-Express.**

- [GraphQL](https://graphql.org/): A query language for your API.
- [Express](https://expressjs.com/): A NodeJS web application framework.
- [Apollo Express](https://www.apollographql.com/docs/apollo-server/v1/servers/express/): For integrating Apollo with Express.
- [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript.
- [TSLint](https://palantir.github.io/tslint/): A linter for TypeScript, with extensions for immutability and other tools like Blueprint.
- [Prettier](https://prettier.io/): An opinionated code formatter for JavaScript and related languages.
- [Jest](https://jestjs.io/): The JavaScript test runner.
- [Yarn](https://yarnpkg.com/en/): For dependency management.

## Local Development

To run Chariot you will need [Node](https://nodejs.org/en/), [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/lang/en/docs/) installed. We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage different versions of Node. The fastest way to get started is to just install nvm and yarn, and use nvm to install Node:

```bash
# Install nvm
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash

# Install yarn
$ brew install yarn

# Install Node LTS using nvm
$ nvm install lts/*

# Set Node LTS as default Node version with nvm
$ nvm alias default lts/*
```

Now, in the project directory, you can run:

```sh
# Setup the .env file
yarn setup

# Install dependencies
yarn install

# Start the server
yarn start
```

**Important note:** To connect to the Postgres database which hosts extracted Cosmos Hub datasets, you will need to obtain the connection credentials from another Chorus developer and add them to your local `.env` file.

This will run the app in the development mode. Open [http://localhost:8000](http://localhost:8000/graphql) to view the GraphiQL API Explorer.

We recommend using the [VS Code editor](https://code.visualstudio.com/) because of it's excellent TypeScript integration. If you use VS Code, the included `.vscode` folder will recommend settings and extensions for your workspace. You can easily install the recommended extensions, if you do not have them. This will include extensions which integrate Prettier and TSLint with your editor, for instance.

## Client Data

Some tooling exists to automatically generate and record API responses and GraphQL responses for supporting queries. Separate data is recorded for running the server in offline mode and for testing purposes. To update these sets of mock data, follow these steps:

```sh
# Generates all GQL queries for the GraphQL Schema
$ yarn gql

# Runs the server with RECORDING_API_MODE flag enabled
$ yarn mocks:recording

# Records mock data responses
$ yarn mocks:generate:all
```

If a new query is added in the future which uses new variables, these variables will need to be added in the `client/config.ts` file.

## Testing

This project is written in TypeScript to take advantage of static typing and uses other tools like Prettier and TSLint to establish consistent code styling. All of these tools are integrated and configuration in the runnable project scripts and tests. For instance you can run:

```sh
# Runs Prettier
$ yarn prettier

# Runs TSLint
$ yarn tslint

# Runs the TypeScript compiler
$ yarn tsc

# Runs the project unit tests using Jest
$ yarn test:unit

# Runs the unit tests in Jest watch mode
$ yarn test:watch

# Runs all the above tests
$ yarn test
```

You can also run `yarn prettier:fix` or `yarn tslint:fix` to use the auto-fix options for these tools to fix any issues. Normally, any linting/styling issues should be fixed automatically on-save if you are using VS Code with the recommended extensions.

The overall approach to testing for this project follows the idea of the ["testing pyramid"](https://martinfowler.com/articles/practical-test-pyramid.html) and looks like this:

1. Static analysis (TypeScript, TSLint, and Prettier).
2. Unit tests: ideally 100% test coverage of all functions (Jest test runner). The GraphQL resolver methods and other helper methods can be unit tested.
3. Integration tests: cover the functionality of the entire server, end to end. This exists in `integration.test.ts` and using recorded API responses to test a mock version of the server.

## Data Integrity Tests

There is a subfolder `sherlock` which includes some scripts for running tests against the extracted Cosmos SDK datasets. These scripts query our internal extracted dataset and an LCD node and compare the results to ensure they match. These tests are currently in development but are somewhat stable. To run any of the tests, follow the repo setup instructions above and then you can run the `npm script` commands prefixed with `sherlock`. The commands are:

```sh
# Run the test suite
$ yarn sherlock

# Run a debug script to see some debug log output about the current extractor state
$ yarn extractor:status
```

## Contributing

We use the [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) for developing new features. Briefly, this involves pulling the `master` branch, developing your fix or feature on a new branch, and then creating a pull request for your code changes. It is recommended to try to keep pull requests simple and confined to a concise set of changes to make it easy to review and merge code. Pull requests require review and all status checks (continuous integration checks, for instance) to pass before merging is allowed.

When merging code we recommend choosing the "Squash and Merge" option to reduce all your pull request commits to a single commit on the `master` branch. This approach should get the primary git history clear. For example, maybe you have 15 commits on a branch where you develop a new feature but then squash these to a single commit `Implement settings page and components`. If the commit should contain additional context, it can be included in the commit description.

## Deployment

```sh
yarn build
yarn prod
```

These commands build and run the app. There is a Dockerfile which can be build and run using Docker to be deployed in any containerized environment.
