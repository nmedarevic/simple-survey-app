import GraphQLJSON from 'graphql-type-json';
import { Resolvers, Role } from '../../graphql/gqlTypes';
import { loginResolver } from './resolvers/login.resolver';
import { MyContext } from '../../create-server';

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
    login: loginResolver
  }
};