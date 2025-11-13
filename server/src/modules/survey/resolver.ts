import GraphQLJSON from 'graphql-type-json';
export const surveyResolvers = {
  JSON: GraphQLJSON,
  Query: {
    survey: () => ({}),
    mySubmissions: () => ({}),
    allSubmissions: () => ({}),
  },
  Mutation: {
    submitSurvey: () => ({})
  }
};