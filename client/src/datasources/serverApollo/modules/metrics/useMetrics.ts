import { computed, ComputedRef } from 'vue';

import { usegetAdminFoodEntryMetricsQuery } from '@/__generated__/graphql';

export const useFoodEntryMetrics = (): ComputedRef<{
  numOfEntriesThisWeek: number;
  numOfEntriesLastWeek: number;
  avgOfCaloriesPerUserThisWeek: number;
  avgOfCaloriesPerUserLastWeek: number;
}> => {
  const { result } = usegetAdminFoodEntryMetricsQuery();

  const metrics = computed(() => {
    const foodEntryMetrics = result.value?.admin?.metrics?.foodEntry ?? {};

    return {
      numOfEntriesThisWeek: foodEntryMetrics.numOfEntriesThisWeek ?? 0,
      numOfEntriesLastWeek: foodEntryMetrics.numOfEntriesLastWeek ?? 0,
      avgOfCaloriesPerUserThisWeek:
        foodEntryMetrics.avgOfCaloriesPerUserThisWeek ?? 0,
      avgOfCaloriesPerUserLastWeek:
        foodEntryMetrics.avgOfCaloriesPerUserLastWeek ?? 0,
    };
  });

  return metrics;
};
