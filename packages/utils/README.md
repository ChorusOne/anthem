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