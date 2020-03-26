import * as Sentry from "@sentry/node";
import chalk from "chalk";
import { NextFunction, Request, Response } from "express";
import { GraphQLError } from "graphql";

import ENV from "./env-utils";

/**
 * Helper to log and format errors.
 *
 * @param  {GraphQLError} error
 * @returns GraphQLError
 */
export const formatError = (error: GraphQLError): GraphQLError => {
  if (ENV.ENABLE_LOGGING) {
    console.log(chalk.red("Request Failed:"));
    console.log(chalk.red(`- ${JSON.stringify(error)}\n`));
  }

  // Report to Sentry
  Sentry.captureException(error);

  return error;
};

/**
 * Logger util to log server requests.
 *
 * @param  {Request} req
 * @param  {Response} _
 * @param  {NextFunction} next
 */
export const logger = (req: Request, _: Response, next: NextFunction) => {
  if (ENV.ENABLE_LOGGING) {
    const { body } = req;
    const { operationName, variables } = body;

    /* Don't log introspection query (clutter): */
    if (Boolean(operationName) && operationName !== "IntrospectionQuery") {
      console.log(chalk.blue("Request Received:"));
      console.log(
        `- Query: ${operationName}\n- Variables: ${JSON.stringify(
          variables,
        )}\n`,
      );
    }
  }

  return next();
};
