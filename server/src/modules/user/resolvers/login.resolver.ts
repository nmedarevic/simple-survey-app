import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import { Resolvers } from '../../../graphql/gqlTypes';
import { MyContext } from '../../../create-server';
import { UserModel } from '../../../db/types';

const ONE_HOUR = 1000 * 60 * 60;

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

  const user: UserModel = await db.get('SELECT * FROM users WHERE email = ?', args.email);

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
  
  if (typeof context.signToken === "undefined") {
    throw new GraphQLError("Invalid password", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        http: { status: 500 }
      }
    })
  }

  const token = context.signToken({ id: user.id, email: user.email, role: user.role }, ONE_HOUR)

  return token;
}