import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client/core';

import { StrictTypedTypePolicies } from '@/__generated__/graphql';
import possibleTypes from '@/__generated__/graphqlPossibleTypes';
import { config } from '@/modules/core/utils/config';

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: config.serverApolloUrl,
  fetchOptions: {
    credentials: 'include',
  },
});

const typePolicies: StrictTypedTypePolicies = {
  // Top-level or scoping (organizing) types. Not interested in them, but in their children.
  Query: {
    merge: true,
  },
  MeQuery: {
    merge: true,
  },
  AdminQuery: {
    merge: true,
  },
  Mutation: {
    merge: true,
  },
  MeMutation: {
    merge: true,
  },
  AdminMutation: {
    merge: true,
  },

  // Metrics - No IDs, mostly simple values. Usually overwrite.
  AdminMetrics: {
    merge: true,
  },
  AdminFoodEntryMetrics: {
    merge: true,
  },

  // Models - These should always have their IDs specified
  User: {
    keyFields: ['userId'],
    merge: true,
  },
  UserSettings: {
    keyFields: ['userId'],
    merge: true,
  },
  FoodEntry: {
    keyFields: ['foodEntryId'],
  },
};

const cache = new InMemoryCache({
  possibleTypes: possibleTypes.possibleTypes,
  typePolicies,
});

export const serverApolloClient = new ApolloClient({
  name: 'calorie-counter-demo-client',
  link: httpLink,
  cache,
  connectToDevTools: config.enableGraphqlDebug,
  defaultOptions: {
    query: {
      errorPolicy: 'all',
    },
    watchQuery: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  assumeImmutableResults: true,
  credentials: 'include',
});
