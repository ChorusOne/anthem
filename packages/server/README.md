# Anthem Server

This is the GraphQL server application for Anthem.

## Project Overview

This is a GraphQL server written in TypeScript using Apollo-Express.

- [GraphQL](https://graphql.org/): A query language for your API.
- [Express](https://expressjs.com/): A NodeJS web application framework.
- [Apollo Express](https://www.apollographql.com/docs/apollo-server/v1/servers/express/): For integrating Apollo with Express.
- [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript.
- [TSLint](https://palantir.github.io/tslint/): A linter for TypeScript, with extensions for immutability and other tools like Blueprint.
- [Prettier](https://prettier.io/): An opinionated code formatter for JavaScript and related languages.
- [Jest](https://jestjs.io/): The JavaScript test runner.
- [Yarn](https://yarnpkg.com/en/): For dependency management.

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

## Deployment

```sh
yarn build
yarn prod
```

These commands build and run the app. There is a Dockerfile which can be build and run using Docker to be deployed in any containerized environment.
