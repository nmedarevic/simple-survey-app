import GraphQLJSON from 'graphql-type-json';
import { Resolvers, Role } from '../../graphql/gqlTypes';
import { MyContext } from '../../index';
import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';

export const userResolvers: Resolvers<MyContext> = {
  JSON: GraphQLJSON,
  Query: {
    me: (_parent, _args, context) => { 
      // Access the database from context
      const { db, user } = context;
      
      // You can use db here
      // const currentUser = await db.get('SELECT * FROM users WHERE id = ?', user?.id);
      
      return { id: "1", email: "", role: Role.Responder };
    },
  },
  Mutation: {
    login: async (_parent, args: { email: string; password: string }, context) => {
      if (!args.email || !args.password) {
        throw new GraphQLError('Email and password are required', {
          extensions: {
            code: 'BAD_USER_INPUT',
            http: { status: 400 },
          },
        });
      }

      const { db } = context;

      const user = await db.get('SELECT * FROM users WHERE email = ?', args.email);
      
      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: {
            code: "NOT_FOUND",
            http: { status: 404 }
          }
        })
      }
      
      const isMatch = await bcrypt.compare(args.password, user.password);
      
      if (!isMatch) {
        throw new GraphQLError("Invalid password", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 }
          }
        })
      }
      
      // Return token or user data
      return "generated-token-here";
    }
  }
};