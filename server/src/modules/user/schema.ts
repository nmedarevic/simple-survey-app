import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    role: Role!
  }

  enum Role { 
    RESPONDER 
    REVIEWER 
  }

  type Submission {
    id: ID!
    userId: ID!
    createdAt: String!
    data: JSON!
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): String!
  }
`;