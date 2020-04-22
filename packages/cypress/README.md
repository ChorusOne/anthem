# Anthem Cypress Tests

This is a set of Cypress e2e tests for Anthem.

## Development

To run the test suite, you need to have Anthem running. The easiest way to do this is to run Anthem in development mode using `yarn dev` from the root project directory. Once the Anthem client is running, you can run the Cypress tests with one of the following commands:

```sh
# Runs Cypress tests directly from the command line
$ yarn cypress:run

# Runs Cypress tests with the interactive Cypress UI
$ yarn cypress:open
```

To develop new tests or debug issues with existing tests, we recommend running Cypress with the interactive dashboard. The codebase follows the convention of using `data-cy` attributes for uniquely identifying HTML elements to be used in Cypress tests.
