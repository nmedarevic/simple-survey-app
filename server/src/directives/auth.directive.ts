import { GraphQLError } from 'graphql';
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import jwt from 'jsonwebtoken';
import { Role } from '../graphql/gqlTypes';
import { GraphQLSchema } from 'graphql';

const JWT_SECRET = 'simple-secret'; // Should match the secret used in index.ts

export interface DecodedToken {
  id: number;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export const authDirectiveTransformer = (schema: GraphQLSchema, directiveName: string) => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      
      if (authDirective) {
        const { requires } = authDirective;
        const { resolve = defaultFieldResolver } = fieldConfig;
        
        fieldConfig.resolve = async function (source, args, context, info) {
          // Extract token from context
          const token = context.token?.replace('Bearer ', '') || '';
          
          if (!token) {
            throw new GraphQLError('Authentication required', {
              extensions: {
                code: 'UNAUTHENTICATED',
                http: { status: 401 },
              },
            });
          }

          let decoded: DecodedToken;
          
          try {
            decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
          } catch (error) {
            throw new GraphQLError('Invalid or expired token', {
              extensions: {
                code: 'UNAUTHENTICATED',
                http: { status: 401 },
              },
            });
          }

          // Check if the user has the required role
          if (requires && decoded.role !== requires) {
            throw new GraphQLError(`Access denied. Required role: ${requires}`, {
              extensions: {
                code: 'FORBIDDEN',
                http: { status: 403 },
              },
            });
          }

          // Add the decoded user to the context for use in resolvers
          context.user = decoded;

          return resolve(source, args, context, info);
        };
        
        return fieldConfig;
      }
    },
  });
};

// Default field resolver (imported from graphql in production, defined here for clarity)
const defaultFieldResolver = (source: any, args: any, contextValue: any, info: any) => {
  if (typeof source === 'object' && source !== null) {
    return source[info.fieldName];
  }
};

