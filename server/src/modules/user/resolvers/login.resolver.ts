import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import { Resolvers } from '../../../graphql/gqlTypes';
import { MyContext } from '../../..';

export const loginResolver:Resolvers<MyContext>["Mutation"]["login"] = async (_parent, args: { email: string; password: string }, context) => {
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