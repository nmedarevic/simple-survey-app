import GraphQLJSON from 'graphql-type-json';

export const userResolvers = {
  JSON: GraphQLJSON,
  Query: {
    me: () => { return { id: "1" } },
  },
  Mutation: {
    login: () => ({})
  }
};