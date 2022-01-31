import { gql } from 'apollo-server-express';

export const rootSchema = gql`
  type Query {
    """
    Queries available to authenticated user.
    """
    me: MeQuery @auth(roles: [])
    """
    Queries available to authenticated admin user.
    """
    admin: AdminQuery @auth(roles: [ADMIN])
  }

  type MeQuery {
    hello: String
  }

  type AdminQuery {
    hello: String
  }

  type Mutation {
    """
    Mutations available to authenticated user.
    """
    me: MeMutation @auth(roles: [])
    """
    Mutations available to authenticated admin user.
    """
    admin: AdminMutation @auth(roles: [ADMIN])
  }

  type MeMutation {
    hello: String
  }

  type AdminMutation {
    hello: String
  }
`;
