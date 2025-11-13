import GraphQLJSON from 'graphql-type-json';
import { Resolvers, Role } from '../../graphql/gqlTypes';
import { MyContext } from '../../index';
import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import { loginResolver } from './resolvers/login.resolver';

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