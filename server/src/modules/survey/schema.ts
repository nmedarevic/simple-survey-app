import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

export const typeDefs = `#graphql
  type Survey {
    id: ID!
    schema: JSON!
    version: String!
  }

  type Submission {
    id: ID!
    userId: ID!
    createdAt: String!
    data: JSON!
  }

  type Query {
    survey: Survey!
    mySubmissions: [Submission!]!   # RESPONDER only
    allSubmissions: [Submission!]!  # REVIEWER only
  }

  type Mutation {
    submitSurvey(data: JSON!): Submission!            # RESPONDER only
  }
`;