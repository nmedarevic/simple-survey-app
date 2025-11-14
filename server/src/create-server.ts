import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { userResolvers } from "./modules/user/resolver";
import { surveyResolvers } from "./modules/survey/resolver";
import { readFileSync } from "fs";
import { join } from "path";
import { closeDatabase, getDatabase } from "./db/database";
import { Database } from "sqlite";
import jwt from "jsonwebtoken";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { authDirectiveTransformer, DecodedToken } from "./directives/auth.directive";

export interface MyContext {
  db: Database;
  token?: string;
  user?: DecodedToken;
  signToken?: (payload: any, expiration: number) => string 
}

export const signToken = (secret: string) => (payload: any, expiration: number) => {
  const token = jwt.sign(
    payload,
    secret, // secret key
    {expiresIn: expiration}
  );

  return token
}

export const createServer = async ({ port }: { port: number}) => {
  const db = await getDatabase();
  console.log('✅ Database connection established');

  const typeDefs = readFileSync(join(__dirname, './schema.graphql'), { encoding: 'utf-8' });
  
  // Create executable schema with directives
  let schema = makeExecutableSchema({
    typeDefs,
    resolvers: [
      surveyResolvers,
      userResolvers
    ],
  });

  // Apply the auth directive transformer
  schema = authDirectiveTransformer(schema, 'auth');
  
  const server = new ApolloServer<MyContext>({
    schema,
    includeStacktraceInErrorResponses: false,
  });

  process.on('SIGINT', closeDatabase);
  process.on('SIGTERM', closeDatabase);

  const { url } = await startStandaloneServer(server, {
    listen: { port: port },
    context: async ({ req }): Promise<MyContext> => {
      const token = req.headers.authorization || '';
      
      return {
        db,
        token,
        // this secret should be moved to an env var
        signToken: signToken("simple-secret")
      };
    },
  });
  
  console.log(`Server running on: ${url}`);

  return {
    url,
    port,
    server
  }
}