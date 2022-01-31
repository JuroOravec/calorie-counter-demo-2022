import { updateUserSettings } from '@/datasources/serverDb/modules/userSettings';
import type { GqlResolvers } from '@/__generated__/graphql';
import { gql2sdbUserSettingsUpdateInput } from './userSettingsTransformers';

export const userSettingsResolvers: GqlResolvers = {
  MeMutation: {
    updateUserSettings: async (_parent, { userSettings }, { serverDb, user }) => {
      const userId = user?.userId;
      if (!userId) return null;
      const userSettingsInput = gql2sdbUserSettingsUpdateInput({ userId, userSettings });
      const updatedUserSettings = await updateUserSettings(serverDb, userSettingsInput);
      return updatedUserSettings;
    },
  },
};
