import { getUserRoles } from '@/datasources/serverDb/modules/userRoles';
import {
  DEFAULT_USER_SETTINGS,
  getUserSettings,
} from '@/datasources/serverDb/modules/userSettings';
import type { GqlResolvers, GqlUserRoleType } from '@/__generated__/graphql';
import { sdb2gqlUser } from './userTransformers';

export const userResolvers: GqlResolvers = {
  MeQuery: {
    user: async (_parent, _args, { user }) => {
      if (!user?.userId) return null;
      return sdb2gqlUser(user);
    },
  },

  User: {
    userRoles: async ({ userId }, _args, { serverDb }) => {
      if (!userId) return [];
      const userRoles = await getUserRoles(serverDb, { userId });
      return userRoles.map((role) => role.role as GqlUserRoleType);
    },

    userSettings: async ({ userId }, _args, { serverDb }) => {
      const defaultSettings = { ...DEFAULT_USER_SETTINGS, userId };
      if (!userId) return defaultSettings;

      const userSettings = await getUserSettings(serverDb, { userId });
      return userSettings ?? defaultSettings;
    },
  },
};
