import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { userResolvers } from "./modules/user/resolver";
import { surveyResolvers } from "./modules/survey/resolver";
import { readFileSync } from "fs";
import { join } from "path";
import { closeDatabase, getDatabase } from "./db/database";
import { Database } from "sqlite";
import jwt from "jsonwebtoken";

export interface MyContext {
  db: Database;
  token?: string;
  user?: any;
  signToken?: (payload: any, expiration: number) => string 
}

const signToken = (secret: string) => (payload: any, expiration: number) => {
  const token = jwt.sign(
    payload,
    secret, // secret key
    {expiresIn: expiration}
  );

  return token
}

const createServer = async () => {
  const db = await getDatabase();
  console.log('✅ Database connection established');

  const typeDefs = readFileSync(join(__dirname, './schema.graphql'), { encoding: 'utf-8' });
  
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers: [
      surveyResolvers,
      userResolvers
    ],
    includeStacktraceInErrorResponses: false,
  });

  process.on('SIGINT', closeDatabase);
  process.on('SIGTERM', closeDatabase);

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
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
}

createServer()