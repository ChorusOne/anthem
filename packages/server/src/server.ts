import * as Sentry from "@sentry/node";
import { ApolloServer } from "apollo-server-express";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import prometheusMiddleware from "express-prometheus-middleware";
import depthLimit from "graphql-depth-limit";
import { createServer } from "http";
import restAPI from "./server/rest-api";
import schema from "./server/schema";
import ENV from "./tools/server-env";
import { formatError, logger } from "./tools/server-utils";

/** ===========================================================================
 * Server Configuration
 * ============================================================================
 */

// Initialize Sentry
Sentry.init({ dsn: ENV.SENTRY_DSN });

// Create Express app
const app = express();

// Configure Prometheus middleware for metrics
app.use(
  prometheusMiddleware({
    metricsPath: "/metrics",
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
  }),
);

// Remove x-powered-by headers
app.disable("x-powered-by");

// Create the server
const server = new ApolloServer({
  schema,
  formatError,
  introspection: ENV.ENABLE_GRAPHIQL,
  validationRules: [depthLimit(7)],
});

// App configuration
app.use("*", cors());
app.use(bodyParser.json());

// Add API routes
app.use("/api", restAPI);

// Add logging function
app.use("/graphql", logger);

server.applyMiddleware({ app, path: "/graphql" });

const httpServer = createServer(app);

// Run the server
httpServer.listen({ port: ENV.PORT }, (): void =>
  console.log(
    `\nGraphQL is now running${
      ENV.RECORD_CLIENT_DATA ? " in mock recording mode" : ""
    } on http://localhost:${ENV.PORT}/graphql\n`,
  ),
);
