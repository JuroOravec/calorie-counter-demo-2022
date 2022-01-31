import { gql } from 'apollo-server-express';

export const userSettingsSchema = gql`
  extend type MeMutation {
    updateUserSettings(userSettings: UserSettingsUpdateInput!): UserSettings
  }

  type UserSettings {
    userId: String!
    caloriesLimitDaily: Int!
    priceLimitMonthly: Int!
  }

  input UserSettingsUpdateInput {
    caloriesLimitDaily: Int
    priceLimitMonthly: Int
  }
`;
