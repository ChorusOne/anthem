import fs from "fs";
import { GraphQLSchema } from "graphql";
import "graphql-import-node";
import { makeExecutableSchema } from "graphql-tools";
import path from "path";
import resolvers from "./resolvers";

/**
 * TODO: If Jest can load .graphql files correctly this can be removed and
 * converted to a normal import statement...
 */
const typeDefs = fs.readFileSync(
  path.join(__dirname, "../schema/schema.graphql"),
  "utf8",
);

/** ===========================================================================
 * Schema Configuration
 * ============================================================================
 */

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default schema;
