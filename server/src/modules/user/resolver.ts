import GraphQLJSON from 'graphql-type-json';
import { Resolvers } from '../../graphql/gqlTypes';
import { loginResolver } from './resolvers/login.resolver';
import { meResolver } from './resolvers/me.resolver';
import { MyContext } from '../../create-server';

export const userResolvers: Resolvers<MyContext> = {
  JSON: GraphQLJSON,
  Query: {
    me: meResolver,
  },
  Mutation: {
    login: loginResolver
  }
};