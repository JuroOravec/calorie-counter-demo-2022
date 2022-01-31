import type { GqlResolvers } from '@/__generated__/graphql';

export const rootResolvers: GqlResolvers = {
  Query: {
    // Let child resolvers process the queries
    me: async () => ({}),
    admin: async () => ({}),
  },

  MeQuery: {
    hello: () => 'World',
  },

  AdminQuery: {
    hello: () => 'World',
  },

  Mutation: {
    // Let child resolvers process the queries
    me: async () => ({}),
    admin: async () => ({}),
  },

  MeMutation: {
    hello: () => 'World',
  },

  AdminMutation: {
    hello: () => 'World',
  },
};
