# Anthem Utils Package

This package contains common utils, tools, and types used throughout the Anthem codebase.

## Package Overview

The `utils/` package contains:

* Shared type definitions.
* Shared functions, utilities, and constants.
* Tools for generating TypeScript type definitions for the GraphQL schema.
* Tools for generating mock response data for the GraphQL API, which is used to test and develop the client application.

Here are some of the useful commands:

```sh
# Compile the utils/ package code
$ yarn build

# Compile the utils/ package code in watch mode
$ yarn watch

# Generate the type definitions for the GraphQL schema
$ yarn build:types

# Generate .gql files from the GraphQL schema
$ yarn gql

# Helper command to generate .gql files
$ yarn gqlgen

# Full command to run record server API responses
$ yarn record

# Empty the mock client response data directories
$ yarn mocks:refresh

# Run the script to query the server and record responses
$ yarn mocks:generate
```

Note that if you are making changes to the `utils` package, you will have to re-compile the package for those changes to be picked up in any other packages which import code from `utils`. The easiest way to do this is to just run the compiler in watch mode, especially if you are frequently making changes.

## Union Types

You main find yourself running the GraphQL code generation tool and getting an unhelpful error like this:

```sh
yarn run v1.22.4
$ graphql-build --outputFile=./src/schema
(node:23756) UnhandledPromiseRejectionWarning: Error: Command failed: graphql-codegen --config ./codegen.yml
Something went wrong
  at ChildProcess.exithandler (child_process.js:303:12)
  at ChildProcess.emit (events.js:311:20)
  at maybeClose (internal/child_process.js:1021:16)
  at Process.ChildProcess._handle.onexit (internal/child_process.js:286:5)
```

Where the original error thrown from `graphql-codegen` doesn't propagated out clearly in the output messages. If this happens, you can run the build command directly with:

```sh
# In the packages/utils directory, run:
$ yarn graphql-codegen --config ./codegen.yml
```

This should give you a better error. It's likely this error comes from conflicting field names in a union type definition, e.g.

```sh
AggregateError:
  GraphQLDocumentError: Fields "delegations" conflict because they return conflicting types [Delegation!] and [CeloDelegation!]!. Use different aliases on the fields to fetch both if this was intentional.
```

If you are defining a new union type, you will have to take care no of the child fields overlap but have different type definitions. This is a somewhat unfortunate limitation of GraphQL.