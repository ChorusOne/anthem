import fs from "fs";
import { GraphQLSchema } from "graphql";
import "graphql-import-node";
import { makeExecutableSchema } from "graphql-tools";
import path from "path";
import resolvers from "../resolvers/resolvers";

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
