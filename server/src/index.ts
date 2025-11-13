import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { userResolvers } from "./modules/user/resolver";
import { surveyResolvers } from "./modules/survey/resolver";
import { typeDefs as userTypeDefs } from "./modules/user/schema";
import { typeDefs as surveyTypeDefs } from "./modules/survey/schema";

const createServer = async () => {
  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  
  const server = new ApolloServer({
    typeDefs: [userTypeDefs, surveyTypeDefs],
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
  });
  console.log(`🚀  Server ready at: ${url}`);
}

createServer()