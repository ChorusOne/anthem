# Anthem Server

This is the GraphQL/Express server for Anthem.

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

## Deployment

```sh
yarn build
yarn prod
```

These commands build and run the app. There is a Dockerfile which can be build and run using Docker to be deployed in any containerized environment.
