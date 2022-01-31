import { gql } from 'apollo-server-express';

export const metricsSchema = gql`
  type AdminQuery {
    """
    Metrics available to admin users
    """
    metrics: AdminMetrics
  }

  """
  Food entry metrics available to admin users
  """
  type AdminMetrics {
    foodEntry: AdminFoodEntryMetrics
  }

  type AdminFoodEntryMetrics {
    """
    Number of added entries in the last 7 days.
    """
    numOfEntriesThisWeek: Int
    """
    Number of added entries in the last 8-14 days (7 days before the last 7 days).
    """
    numOfEntriesLastWeek: Int
    """
    The average number of calories added per user in the last 7 days
    """
    avgOfCaloriesPerUserThisWeek: Float
    """
    The average number of calories added per user in the last 8-14 days (7 days before the last 7 days).
    """
    avgOfCaloriesPerUserLastWeek: Float
  }
`;
