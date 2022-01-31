import {
  createFoodEntry,
  deleteFoodEntry,
  getAllFoodEntries,
  getFoodEntriesByUserId,
  updateFoodEntry,
} from '@/datasources/serverDb/modules/foodEntry';
import { getUserById } from '@/datasources/serverDb/modules/user';
import type { GqlResolvers } from '@/__generated__/graphql';
import {
  gql2sdbFoodEntryCreateInput,
  gql2sdbFoodEntryUpdateInput,
  sdb2gqlFoodEntry,
} from './foodEntryTransformers';
import { sdb2gqlUser } from '../user/userTransformers';

export const foodEntryResolvers: GqlResolvers = {
  //////////////////////////////
  // QUERIES
  //////////////////////////////

  MeQuery: {
    foodEntries: async (_parent, _args, { serverDb, user }) => {
      const userId = user!.userId;
      const foodEntries = await getFoodEntriesByUserId(serverDb, { userId });
      return foodEntries.map(sdb2gqlFoodEntry);
    },
  },

  AdminQuery: {
    foodEntries: async (_parent, { userId }, { serverDb }) => {
      const foodEntries = await (userId
        ? getFoodEntriesByUserId(serverDb, { userId })
        : getAllFoodEntries(serverDb));
      return foodEntries.map(sdb2gqlFoodEntry);
    },
  },

  //////////////////////////////
  // MUTATIONS
  //////////////////////////////

  MeMutation: {
    createFoodEntry: async (_parent, { foodEntry }, { serverDb, user }) => {
      const userId = user?.userId;
      if (!userId) return null;
      const foodEntryInput = gql2sdbFoodEntryCreateInput({ userId, foodEntry });
      const newFoodEntry = await createFoodEntry(serverDb, foodEntryInput);
      return sdb2gqlFoodEntry(newFoodEntry);
    },

    updateFoodEntry: async (_parent, { foodEntry }, { serverDb, user }) => {
      const userId = user?.userId;
      if (!userId) return null;
      const foodEntryInput = gql2sdbFoodEntryUpdateInput({ userId, foodEntry });
      const updatedFoodEntry = await updateFoodEntry(serverDb, foodEntryInput);
      return sdb2gqlFoodEntry(updatedFoodEntry);
    },

    deleteFoodEntry: async (_parent, { foodEntryId }, { serverDb, user }) => {
      const userId = user?.userId;
      if (!userId) return null;
      const deletedFoodEntry = await deleteFoodEntry(serverDb, { userId, foodEntryId });
      return sdb2gqlFoodEntry(deletedFoodEntry);
    },
  },

  AdminMutation: {
    createFoodEntry: async (_parent, { userId, foodEntry }, { serverDb }) => {
      const foodEntryInput = gql2sdbFoodEntryCreateInput({ userId, foodEntry });
      const newFoodEntry = await createFoodEntry(serverDb, foodEntryInput);
      return sdb2gqlFoodEntry(newFoodEntry);
    },

    updateFoodEntry: async (_parent, { userId, foodEntry }, { serverDb }) => {
      const foodEntryInput = gql2sdbFoodEntryUpdateInput({ userId, foodEntry });
      const newFoodEntry = await updateFoodEntry(serverDb, foodEntryInput);
      return sdb2gqlFoodEntry(newFoodEntry);
    },

    deleteFoodEntry: async (_parent, { userId, foodEntryId }, { serverDb }) => {
      const deletedFoodEntry = await deleteFoodEntry(serverDb, { userId, foodEntryId });
      return sdb2gqlFoodEntry(deletedFoodEntry);
    },
  },

  //////////////////////////////
  // TYPE RESOLVERS
  //////////////////////////////

  FoodEntry: {
    user: async ({ userId }, _context, { serverDb }) => {
      // TODO: How to handle if user doesn't exist?
      const user = await getUserById(serverDb, userId!);
      return sdb2gqlUser(user!);
    },
  },
};
