import { format } from 'date-fns';

import type { FoodEntry } from '@prisma/client';
import type { PartialFields } from '@/modules/shared/types';
import {
  ServerDbFoodEntryCreateInput,
  ServerDbFoodEntryUpdateInput,
} from '@/datasources/serverDb/modules/foodEntry';
import type {
  GqlFoodEntry,
  GqlFoodEntryCreateInput,
  GqlFoodEntryUpdateInput,
} from '@/__generated__/graphql';

export const gql2sdbFoodEntryCreateInput = ({
  userId,
  foodEntry,
}: {
  userId: string;
  foodEntry: GqlFoodEntryCreateInput;
}): ServerDbFoodEntryCreateInput => ({
  userId: userId,
  name: foodEntry.name,
  date: new Date(foodEntry.date),
  calories: foodEntry.calories,
  price: foodEntry.price ?? null,
});

export const gql2sdbFoodEntryUpdateInput = ({
  userId,
  foodEntry,
}: {
  userId: string;
  foodEntry: GqlFoodEntryUpdateInput;
}): ServerDbFoodEntryUpdateInput => ({
  userId,
  foodEntryId: foodEntry.foodEntryId,
  name: foodEntry.name ?? undefined,
  date: foodEntry.date ? new Date(foodEntry.date) : undefined,
  calories: foodEntry.calories ?? undefined,
  price: foodEntry.price ?? undefined,
});

export const sdb2gqlFoodEntry = (
  foodEntry: FoodEntry,
): PartialFields<GqlFoodEntry, 'user'> => ({
  ...foodEntry,
  date: format(foodEntry.date, 'yyyy-MM-dd'),
});
