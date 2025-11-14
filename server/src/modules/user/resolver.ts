import GraphQLJSON from 'graphql-type-json';
import { Resolvers, Role } from '../../graphql/gqlTypes';
import { loginResolver } from './resolvers/login.resolver';
import { MyContext } from '../../create-server';
import { UserModel } from '../../db/types';

export const userResolvers: Resolvers<MyContext> = {
  JSON: GraphQLJSON,
  Query: {
    me: async (_parent, _args, context) => { 
      // Access the database from context
      const { db, user } = context;
      
      // You can use db here
      const currentUser: UserModel = await db.get('SELECT * FROM users WHERE id = ?', user?.id);
      
      return { id: currentUser.id.toString(), email: currentUser.email, role: currentUser.role };
    },
  },
  Mutation: {
    login: loginResolver
  }
};