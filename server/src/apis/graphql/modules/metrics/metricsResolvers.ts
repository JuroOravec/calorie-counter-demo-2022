import { subWeeks } from 'date-fns';

import {
  avgCaloriesPerUserByDateRange,
  countFoodEntriesByDateRange,
} from '@/datasources/serverDb/modules/foodEntry';
import type { GqlResolvers } from '@/__generated__/graphql';

const getWeekDates = ({
  weekOffset = 0,
}: {
  /**
   * Offset the dates by num of weeks into the past.
   *
   * E.g.
   *
   * ```
   * weekOffset === 0 -> last 7 days
   * weekOffset === 1 -> last 8-14 days (7 days before the last 7 days)
   * weekOffset === 2 -> last 15-21 days (14 days before the last 7 days)
   * ```
   */
  weekOffset?: number;
} = {}) => {
  const now = new Date();
  return {
    from: subWeeks(now, 1 + weekOffset),
    to: subWeeks(now, 0 + weekOffset),
  };
};

export const metricsResolvers: GqlResolvers = {
  AdminQuery: {
    // Let child resolvers process the queries
    metrics: () => ({}),
  },

  AdminMetrics: {
    // Let child resolvers process the queries
    foodEntry: () => ({}),
  },

  AdminFoodEntryMetrics: {
    // Number of added entries in the last 7 days.
    numOfEntriesThisWeek: async (_parent, _args, { serverDb }) => {
      const { from, to } = getWeekDates();
      const count = await countFoodEntriesByDateRange(serverDb, { from, to });
      return count;
    },

    // Number of added entries in the last 8-14 days (7 days before the last 7 days).
    numOfEntriesLastWeek: async (_parent, _args, { serverDb }) => {
      const { from, to } = getWeekDates({ weekOffset: 1 });
      const count = await countFoodEntriesByDateRange(serverDb, { from, to });
      return count;
    },

    // The average number of calories added per user in the last 7 days
    avgOfCaloriesPerUserThisWeek: async (_parent, _args, { serverDb }) => {
      const { from, to } = getWeekDates();
      const count = await avgCaloriesPerUserByDateRange(serverDb, { from, to });
      return count;
    },

    // The average number of calories added per user in the last 8-14 days (7 days before the last 7 days).
    avgOfCaloriesPerUserLastWeek: async (_parent, _args, { serverDb }) => {
      const { from, to } = getWeekDates({ weekOffset: 1 });
      const count = await avgCaloriesPerUserByDateRange(serverDb, { from, to });
      return count;
    },
  },
};
