import { computed, ComputedRef, ref, Ref, watch } from 'vue';

import {
  GqlMeUserSettingsFragment,
  GqlupdateMeUserSettingsMutation,
  GqlupdateMeUserSettingsMutationVariables,
  usegetMeUserSettingsQuery,
  useupdateMeUserSettingsMutation,
} from '@/__generated__/graphql';
import type { ApolloError } from '@apollo/client';
import { createUpdateOperation } from '@/modules/core/utils/crudOperations';

export interface UserSettings {
  userId: string;
  caloriesLimitDaily: number;
  priceLimitMonthly: number;
}

export interface UseGetUserSettings {
  userSettings: ComputedRef<UserSettings | null>;
  userSettingsError: Ref<ApolloError | null>;
  userSettingsLoading: Ref<boolean>;
}

const transformUserSettings = (
  settings: GqlMeUserSettingsFragment,
): UserSettings => ({
  userId: settings.userId,
  caloriesLimitDaily: settings.caloriesLimitDaily,
  priceLimitMonthly: settings.priceLimitMonthly,
});

/** CRUD composable for UserSettings */
export const useUserSettings = () => {
  /** List of user settings object. Used so we can use the crud operations helpers */
  const userSettingsList: Ref<UserSettings[]> = ref([]);

  const userSettings = computed((): UserSettings | null => {
    return userSettingsList.value[0] ?? null;
  });

  const { mutate: doUpdateUserSettings, loading: updateUserSettingsLoading, error: updateUserSettingsError } = useupdateMeUserSettingsMutation({}); // prettier-ignore
  const { result: userSettingsResult, loading: getUserSettingsLoading, error: getUserSettingsError } = usegetMeUserSettingsQuery({
    fetchPolicy: 'cache-first',
  }); // prettier-ignore

  watch(
    userSettingsResult,
    (newUserSettingsResult) => {
      const settings = newUserSettingsResult?.me?.user?.userSettings;
      // Overwrite our list
      userSettingsList.value = settings
        ? [transformUserSettings(settings)]
        : [];
    },
    { immediate: true },
  );

  const updateUserSettings = createUpdateOperation<
    UserSettings,
    GqlupdateMeUserSettingsMutation,
    GqlupdateMeUserSettingsMutationVariables
  >({
    listRef: userSettingsList,
    mutateFn: doUpdateUserSettings,
    transformResult: (res) => {
      const entry = res?.data?.me?.updateUserSettings ?? null;
      return entry ? transformUserSettings(entry) : null;
    },
    itemId: (item) => item.userId,
  });

  return {
    userSettings,
    getUserSettingsError,
    getUserSettingsLoading,
    updateUserSettings,
    updateUserSettingsError,
    updateUserSettingsLoading,
  };
};
