import type { GqlUserSettingsUpdateInput } from '@/__generated__/graphql';
import { ServerDbUserSettingsUpdateInput } from '@/datasources/serverDb/modules/userSettings';

export const gql2sdbUserSettingsUpdateInput = ({
  userId,
  userSettings,
}: {
  userId: string;
  userSettings: GqlUserSettingsUpdateInput;
}): ServerDbUserSettingsUpdateInput => ({
  userId,
  caloriesLimitDaily: userSettings.caloriesLimitDaily ?? undefined,
  priceLimitMonthly: userSettings.priceLimitMonthly ?? undefined,
});
