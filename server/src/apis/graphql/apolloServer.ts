import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import { flow } from 'lodash';

import type { ResolverContext } from './types';
import { rootSchema } from './modules/root/rootSchema';
import { userSchema } from './modules/user/userSchema';
import { userSettingsSchema } from './modules/userSettings/userSettingsSchema';
import { foodEntrySchema } from './modules/foodEntry/foodEntrySchema';
import { metricsSchema } from './modules/metrics/metricsSchema';
import { userResolvers } from './modules/user/userResolvers';
import { userSettingsResolvers } from './modules/userSettings/userSettingsResolvers';
import { rootResolvers } from './modules/root/rootResolvers';
import { foodEntryResolvers } from './modules/foodEntry/foodEntryResolvers';
import { metricsResolvers } from './modules/metrics/metricsResolvers';
import {
  authDirectiveTypeDefs,
  authDirectiveTransformer,
} from './directives/directiveAuth';

const createSchema = () => {
  const initialSchema = makeExecutableSchema({
    typeDefs: [
      rootSchema,
      userSchema,
      userSettingsSchema,
      foodEntrySchema,
      metricsSchema,
      authDirectiveTypeDefs,
    ],
    resolvers: [
      rootResolvers,
      userResolvers,
      userSettingsResolvers,
      foodEntryResolvers,
      metricsResolvers,
    ],
  });

  const transformSchema = flow(authDirectiveTransformer);
  const schema = transformSchema(initialSchema);
  return schema;
};

export const apolloServer = new ApolloServer({
  schema: createSchema(),
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  context: ({ req, res }): ResolverContext => {
    return req.context();
  },
});
