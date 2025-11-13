import GraphQLJSON from 'graphql-type-json';

export const typeDefs = `#graphql
  scalar JSON

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