import GraphQLJSON from 'graphql-type-json';
import { Resolvers } from '../../graphql/gqlTypes';
import { MyContext } from '../../index';

export const surveyResolvers: Resolvers<MyContext> = {
  JSON: GraphQLJSON,
  Query: {
    survey: (_parent, _args, context) => {
      // Access the database from context
      const { db } = context;
      // Use db here as needed
      return {};
    },
    mySubmissions: (_parent, _args, context) => {
      const { db } = context;
      return {};
    },
    allSubmissions: (_parent, _args, context) => {
      const { db } = context;
      return {};
    },
  },
  Mutation: {
    submitSurvey: async (_parent, { data }, context) => {
      const { db } = context;
      
      const userId = context.user.id
      const result = await db.run(
        'INSERT INTO surveys (data, created_by) VALUES (?, ?)',
        data,
        userId
      );
console.log('\n\n', result, '\n\n');
      return {
        userId: "id",
        id: "iddd",
        data: {},
        createdAt: "",
      };
    }
  }
};