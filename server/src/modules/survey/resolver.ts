import GraphQLJSON from 'graphql-type-json';
import { Resolvers, Submission } from '../../graphql/gqlTypes';
import { MyContext } from '../../index';
import { SurveyResponseModel } from '../../db/types';

export const surveyResolvers: Resolvers<MyContext> = {
  JSON: GraphQLJSON,
  Query: {
    survey: (_parent, _args, context) => {
      // Access the database from context
      const { db } = context;
      // Use db here as needed
      return {};
    },
    mySubmissions: async (_parent, _args, context) => {
      const { db } = context;

      const responses: SurveyResponseModel[] = await db.all('SELECT * FROM survey_responses WHERE user_id = ?', context.user.id);

      return responses.map((responseModel): Submission => {
        return {
          id: responseModel.id.toString(),
          userId: responseModel.user_id.toString(),
          submittedAt: responseModel.submitted_at,
          data: JSON.parse(responseModel.responses)
        }
      });
    },
    allSubmissions: async (_parent, _args, context) => {
      const { db } = context;
      
      const responses: SurveyResponseModel[] = await db.all('SELECT * FROM survey_responses');

      return responses.map((responseModel): Submission => {
        return {
          id: responseModel.id.toString(),
          userId: responseModel.user_id.toString(),
          submittedAt: responseModel.submitted_at,
          data: JSON.parse(responseModel.responses)
        }
      });
    },
  },
  Mutation: {
    submitSurvey: async (_parent, { survey_id, data }, context) => {
      const { db } = context;
      
      const userId = context.user.id
      const now = new Date()
      const result = await db.run(
        'INSERT INTO survey_responses (survey_id, user_id, responses, submitted_at) VALUES (?, ?, ?, ?)',
        survey_id, // hardcoded for now
        userId,
        JSON.stringify(data),
        now
      );

      return {
        userId: userId.toString(),
        id: result.lastID.toString(),
        data: data,
        submittedAt: now.toISOString(),
      };
    }
  }
};