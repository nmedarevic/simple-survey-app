import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { userResolvers } from "./modules/user/resolver";
import { surveyResolvers } from "./modules/survey/resolver";
import { typeDefs as userTypeDefs } from "./modules/user/schema";
import { typeDefs as surveyTypeDefs } from "./modules/survey/schema";
import { readFileSync } from "fs";
import path, { join } from "path";

const createServer = async () => {
  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const typeDefs = readFileSync(join(__dirname, './schema.graphql'), { encoding: 'utf-8' });
  
  const server = new ApolloServer({
    typeDefs,
    resolvers: [
      surveyResolvers,
      userResolvers
    ],
  });
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      // get the user token from the headers
      const token = req.headers.authorization || '';
      // try to retrieve a user with the token
      // const user = getUser(token);
      // // optionally block the user
      // // we could also check user roles/permissions here
      // if (!user)
      //   // throwing a `GraphQLError` here allows us to specify an HTTP status code,
      //   // standard `Error`s will have a 500 status code by default
      //   throw new GraphQLError('User is not authenticated', {
      //     extensions: {
      //       code: 'UNAUTHENTICATED',
      //       http: { status: 401 },
      //     }
      //   });
      // add the user to the context
      // return { user };
      return {}
    },
  });
  console.log(`🚀  Server ready at: ${url}`);
}

createServer()