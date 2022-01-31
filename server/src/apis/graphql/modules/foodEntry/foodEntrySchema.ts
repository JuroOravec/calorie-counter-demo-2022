import { gql } from 'apollo-server-express';

export const foodEntrySchema = gql`
  extend type MeQuery {
    foodEntries: [FoodEntry!]!
  }

  extend type AdminQuery {
    foodEntries(userId: String): [FoodEntry!]!
  }

  extend type MeMutation {
    createFoodEntry(foodEntry: FoodEntryCreateInput!): FoodEntry
    updateFoodEntry(foodEntry: FoodEntryUpdateInput!): FoodEntry
    deleteFoodEntry(foodEntryId: String!): FoodEntry
  }

  extend type AdminMutation {
    createFoodEntry(userId: String!, foodEntry: FoodEntryCreateInput!): FoodEntry
    updateFoodEntry(userId: String!, foodEntry: FoodEntryUpdateInput!): FoodEntry
    deleteFoodEntry(userId: String!, foodEntryId: String!): FoodEntry
  }

  type FoodEntry {
    foodEntryId: String!
    name: String!
    # Date string.
    # TODO: Define custom scalar or make graphql-scalars work with codegen
    date: String!
    calories: Int!
    price: Int
    userId: String!
    user: User!
  }

  input FoodEntryCreateInput {
    name: String!
    # Date string.
    # TODO: Define custom scalar or make graphql-scalars work with codegen
    date: String!
    calories: Int!
    price: Int
  }

  input FoodEntryUpdateInput {
    foodEntryId: String!
    name: String
    # Date string.
    # TODO: Define custom scalar or make graphql-scalars work with codegen
    date: String
    calories: Int
    price: Int
  }
`;
