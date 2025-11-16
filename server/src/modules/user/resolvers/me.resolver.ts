import { GraphQLError } from 'graphql';
import { Resolvers } from '../../../graphql/gqlTypes';
import { MyContext } from '../../../create-server';
import { UserModel } from '../../../db/types';

export const meResolver: Resolvers<MyContext>["Query"]["me"] = async (_parent, _args, context) => {
  // Access the database from context
  const { db, user } = context;
  
  if (!user?.id) {
    throw new GraphQLError('User not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });
  }
  
  // You can use db here
  const currentUser: UserModel = await db.get('SELECT * FROM users WHERE id = ?', user.id);
  
  if (!currentUser) {
    throw new GraphQLError('User not found', {
      extensions: {
        code: 'NOT_FOUND',
        http: { status: 404 },
      },
    });
  }
  
  return { id: currentUser.id.toString(), email: currentUser.email, role: currentUser.role };
};

