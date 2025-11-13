export const typeDefs = `#graphql
  scalar JSON

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