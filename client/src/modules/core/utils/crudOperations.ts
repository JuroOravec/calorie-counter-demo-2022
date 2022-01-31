import type { FetchResult } from '@apollo/client';
import { MutateFunction } from '@vue/apollo-composable';
import { Ref } from 'vue';
import differenceBy from 'lodash/differenceBy';
import unionBy from 'lodash/unionBy';

/**
 * Given a list of items, and a create mutation, create a function that
 * updates the list when we call the create operation.
 */
export const createCreateOperation =
  <
    T,
    TRes extends Record<string, any> | null,
    TVars extends Record<string, any>,
  >({
    listRef,
    mutateFn,
    transformResult,
    itemId,
    order,
  }: {
    listRef: Ref<T[]>;
    mutateFn: MutateFunction<TRes, TVars>;
    transformResult: (res: FetchResult<TRes, TVars> | null) => T | null;
    itemId: (item: T) => any;
    order?: (items: T[]) => T[];
  }): MutateFunction<TRes, TVars> =>
  async (...args) => {
    return mutateFn(...args).then((result) => {
      if (result?.errors) throw result?.errors[0];

      // Update our list
      const newEntry = transformResult(result as any);

      if (newEntry) {
        // By default, put the new entry to the start of the list
        const mergedEntries = unionBy([newEntry], listRef.value, itemId);
        listRef.value = order ? order(mergedEntries) : mergedEntries;
      }

      return result;
    });
  };

/**
 * Given a list of items, and an update mutation, create a function that
 * updates the list when we call the update operation.
 */
export const createUpdateOperation =
  <
    T,
    TRes extends Record<string, any> | null,
    TVars extends Record<string, any>,
  >({
    listRef,
    mutateFn,
    transformResult,
    itemId,
    order,
  }: {
    listRef: Ref<T[]>;
    mutateFn: MutateFunction<TRes, TVars>;
    transformResult: (res: FetchResult<TRes, TVars> | null) => T | null;
    itemId: (item: T) => any;
    order?: (items: T[]) => T[];
  }): MutateFunction<TRes, TVars> =>
  async (...args) => {
    return mutateFn(...args).then((result) => {
      if (result?.errors) throw result?.errors[0];

      // Update our list
      const updatedEntry = transformResult(result as any);

      if (updatedEntry) {
        // By default, put the updated entry on the same position as where
        // it was before.
        const mergedEntries = listRef.value.map((item) =>
          itemId(item) === itemId(updatedEntry) ? updatedEntry : item,
        );
        listRef.value = order ? order(mergedEntries) : mergedEntries;
      }

      return result;
    });
  };

/**
 * Given a list of items, and a delete mutation, create a function that
 * updates the list when we call the delete operation.
 */
export const createDeleteOperation =
  <
    T,
    TRes extends Record<string, any> | null,
    TVars extends Record<string, any>,
    TTransform,
  >({
    listRef,
    mutateFn,
    transformResult,
    itemId,
  }: {
    listRef: Ref<T[]>;
    mutateFn: MutateFunction<TRes, TVars>;
    transformResult: (
      res: FetchResult<TRes, TVars> | null,
    ) => TTransform | null;
    itemId: (item: T | TTransform) => any;
  }): MutateFunction<TRes, TVars> =>
  (...args) => {
    return mutateFn(...args).then((result) => {
      if (result?.errors) throw result?.errors[0];

      // Update our list
      const deletedEntry = transformResult(result as any);
      if (deletedEntry) {
        listRef.value = differenceBy(
          listRef.value,
          deletedEntry ? [deletedEntry] : [],
          itemId,
        );
      }

      return result;
    });
  };
