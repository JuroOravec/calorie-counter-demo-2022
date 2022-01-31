import { useLazyQuery } from '@vue/apollo-composable';
import { Ref, ref, watch } from 'vue';
import orderBy from 'lodash/orderBy';
import { format } from 'date-fns';

import {
  getAdminFoodEntriesDocument,
  getMeFoodEntriesDocument,
  GqlAdminFoodEntryFragment,
  GqlcreateAdminFoodEntryMutation,
  GqlcreateAdminFoodEntryMutationVariables,
  GqlcreateMeFoodEntryMutation,
  GqlcreateMeFoodEntryMutationVariables,
  GqldeleteAdminFoodEntryMutation,
  GqldeleteAdminFoodEntryMutationVariables,
  GqldeleteMeFoodEntryMutation,
  GqldeleteMeFoodEntryMutationVariables,
  GqlgetAdminFoodEntriesQuery,
  GqlgetAdminFoodEntriesQueryVariables,
  GqlgetMeFoodEntriesQuery,
  GqlgetMeFoodEntriesQueryVariables,
  GqlMeFoodEntryFragment,
  GqlupdateAdminFoodEntryMutation,
  GqlupdateAdminFoodEntryMutationVariables,
  GqlupdateMeFoodEntryMutation,
  GqlupdateMeFoodEntryMutationVariables,
  usecreateAdminFoodEntryMutation,
  usecreateMeFoodEntryMutation,
  usedeleteAdminFoodEntryMutation,
  usedeleteMeFoodEntryMutation,
  useupdateAdminFoodEntryMutation,
  useupdateMeFoodEntryMutation,
} from '@/__generated__/graphql';
import { transformUser, User } from '../user/useUser';
import {
  createCreateOperation,
  createDeleteOperation,
  createUpdateOperation,
} from '@/modules/core/utils/crudOperations';

export interface FoodEntry {
  foodEntryId: string;
  calories: number;
  date: Date;
  name: string;
  price: number | null;
}

export interface AdminFoodEntry {
  foodEntryId: string;
  calories: number;
  date: Date;
  name: string;
  price: number | null;
  user: User;
}

export const formatFoodEntryDate = (date: Date) => format(date, 'yyyy-MM-dd');

const transformFoodEntry = (foodEntry: GqlMeFoodEntryFragment): FoodEntry => ({
  foodEntryId: foodEntry.foodEntryId,
  name: foodEntry.name,
  calories: foodEntry.calories,
  date: new Date(foodEntry.date),
  price: foodEntry.price ?? null,
});

const transformAdminFoodEntry = (
  foodEntry: GqlAdminFoodEntryFragment,
): AdminFoodEntry => ({
  ...transformFoodEntry(foodEntry),
  user: transformUser(foodEntry.user),
});

/** CRUD composable for FoodEntry */
export const useFoodEntry = () => {
  const foodEntries: Ref<FoodEntry[]> = ref([]);

  const { mutate: doCreateFoodEntry, loading: createFoodEntryLoading, error: createFoodEntryError } = usecreateMeFoodEntryMutation({}); // prettier-ignore
  const { mutate: doUpdateFoodEntry, loading: updateFoodEntryLoading, error: updateFoodEntryError } = useupdateMeFoodEntryMutation({}); // prettier-ignore
  const { mutate: doDeleteFoodEntry, loading: deleteFoodEntryLoading, error: deleteFoodEntryError } = usedeleteMeFoodEntryMutation({}); // prettier-ignore
  const { result: foodEntriesResult, load: getFoodEntries, loading: getFoodEntriesLoading, error: getFoodEntriesError } = useLazyQuery<GqlgetMeFoodEntriesQuery, GqlgetMeFoodEntriesQueryVariables>(getMeFoodEntriesDocument); // prettier-ignore

  watch(
    foodEntriesResult,
    (newFoodEntriesResult) => {
      // Overwrite our list
      foodEntries.value =
        newFoodEntriesResult?.me?.foodEntries?.map(transformFoodEntry) ?? [];
    },
    { immediate: true },
  );

  const createFoodEntry = createCreateOperation<
    FoodEntry,
    GqlcreateMeFoodEntryMutation,
    GqlcreateMeFoodEntryMutationVariables
  >({
    listRef: foodEntries,
    mutateFn: doCreateFoodEntry,
    transformResult: (res) => {
      const entry = res?.data?.me?.createFoodEntry ?? null;
      return entry ? transformFoodEntry(entry) : null;
    },
    itemId: (item) => item.foodEntryId,
    order: (items) => orderBy(items, (item) => item.date.toISOString(), 'desc'),
  });

  const updateFoodEntry = createUpdateOperation<
    FoodEntry,
    GqlupdateMeFoodEntryMutation,
    GqlupdateMeFoodEntryMutationVariables
  >({
    listRef: foodEntries,
    mutateFn: doUpdateFoodEntry,
    transformResult: (res) => {
      const entry = res?.data?.me?.updateFoodEntry ?? null;
      return entry ? transformFoodEntry(entry) : null;
    },
    itemId: (item) => item.foodEntryId,
    order: (items) => orderBy(items, (item) => item.date.toISOString(), 'desc'),
  });

  const deleteFoodEntry = createDeleteOperation<
    FoodEntry,
    GqldeleteMeFoodEntryMutation,
    GqldeleteMeFoodEntryMutationVariables,
    { foodEntryId: string }
  >({
    listRef: foodEntries,
    mutateFn: doDeleteFoodEntry,
    transformResult: (res) => res?.data?.me?.deleteFoodEntry ?? null,
    itemId: (item) => item.foodEntryId,
  });

  return {
    foodEntries,
    getFoodEntries,
    getFoodEntriesError,
    getFoodEntriesLoading,
    createFoodEntry,
    createFoodEntryError,
    createFoodEntryLoading,
    updateFoodEntry,
    updateFoodEntryError,
    updateFoodEntryLoading,
    deleteFoodEntry,
    deleteFoodEntryError,
    deleteFoodEntryLoading,
  };
};

/** CRUD composable for FoodEntry admin actions */
export const useFoodEntryAdmin = () => {
  const foodEntries: Ref<AdminFoodEntry[]> = ref([]);

  const { mutate: doCreateFoodEntry, loading: createFoodEntryLoading, error: createFoodEntryError } = usecreateAdminFoodEntryMutation({}); // prettier-ignore
  const { mutate: doUpdateFoodEntry, loading: updateFoodEntryLoading, error: updateFoodEntryError } = useupdateAdminFoodEntryMutation({}); // prettier-ignore
  const { mutate: doDeleteFoodEntry, loading: deleteFoodEntryLoading, error: deleteFoodEntryError } = usedeleteAdminFoodEntryMutation({}); // prettier-ignore
  const { result: foodEntriesResult, load: getFoodEntries, loading: getFoodEntriesLoading, error: getFoodEntriesError } = useLazyQuery<GqlgetAdminFoodEntriesQuery, GqlgetAdminFoodEntriesQueryVariables>(getAdminFoodEntriesDocument); // prettier-ignore

  watch(
    foodEntriesResult,
    (newFoodEntriesResult) => {
      // Overwrite our list
      foodEntries.value =
        newFoodEntriesResult?.admin?.foodEntries?.map(
          transformAdminFoodEntry,
        ) ?? [];
    },
    { immediate: true },
  );

  const createFoodEntry = createCreateOperation<
    AdminFoodEntry,
    GqlcreateAdminFoodEntryMutation,
    GqlcreateAdminFoodEntryMutationVariables
  >({
    listRef: foodEntries,
    mutateFn: doCreateFoodEntry,
    transformResult: (res) => {
      const entry = res?.data?.admin?.createFoodEntry ?? null;
      return entry ? transformAdminFoodEntry(entry) : null;
    },
    itemId: (item) => item.foodEntryId,
    order: (items) => orderBy(items, (item) => item.date.toISOString(), 'desc'),
  });

  const updateFoodEntry = createUpdateOperation<
    AdminFoodEntry,
    GqlupdateAdminFoodEntryMutation,
    GqlupdateAdminFoodEntryMutationVariables
  >({
    listRef: foodEntries,
    mutateFn: doUpdateFoodEntry,
    transformResult: (res) => {
      const entry = res?.data?.admin?.updateFoodEntry ?? null;
      return entry ? transformAdminFoodEntry(entry) : null;
    },
    itemId: (item) => item.foodEntryId,
    order: (items) => orderBy(items, (item) => item.date.toISOString(), 'desc'),
  });

  const deleteFoodEntry = createDeleteOperation<
    AdminFoodEntry,
    GqldeleteAdminFoodEntryMutation,
    GqldeleteAdminFoodEntryMutationVariables,
    { foodEntryId: string }
  >({
    listRef: foodEntries,
    mutateFn: doDeleteFoodEntry,
    transformResult: (res) => res?.data?.admin?.deleteFoodEntry ?? null,
    itemId: (item) => item.foodEntryId,
  });

  return {
    foodEntries,
    getFoodEntries,
    getFoodEntriesError,
    getFoodEntriesLoading,
    createFoodEntry,
    createFoodEntryError,
    createFoodEntryLoading,
    updateFoodEntry,
    updateFoodEntryError,
    updateFoodEntryLoading,
    deleteFoodEntry,
    deleteFoodEntryError,
    deleteFoodEntryLoading,
  };
};
