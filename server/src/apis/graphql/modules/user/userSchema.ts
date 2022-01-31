import { gql } from 'apollo-server-express';

export const userSchema = gql`
  extend type MeQuery {
    user: User
  }

  type User {
    userId: String!
    firstName: String!
    lastName: String!
    email: String!
    userRoles: [UserRoleType!]!
    userSettings: UserSettings!
  }
`;
