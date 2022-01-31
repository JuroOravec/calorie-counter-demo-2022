import { computed, ComputedRef, Ref } from 'vue';

import {
  GqlgetMeUserQuery,
  GqlgetMeUserQueryVariables,
  GqlMeUserFragment,
  GqlUserRoleType,
  usegetMeUserQuery,
} from '@/__generated__/graphql';
import type { UseQueryReturn } from '@vue/apollo-composable';
import type { ApolloError } from '@apollo/client';
import type { PartialFields } from '@/modules/shared/types';

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  userRoles: GqlUserRoleType[];
}

export interface UseGetUser {
  user: ComputedRef<User | null>;
  userRoles: ComputedRef<GqlUserRoleType[]>;
  userError: Ref<ApolloError | null>;
  userLoading: Ref<boolean>;
  refetchUser: UseQueryReturn<
    GqlgetMeUserQuery,
    GqlgetMeUserQueryVariables
  >['refetch'];
}

export const transformUser = (
  user: PartialFields<GqlMeUserFragment, 'userRoles'>,
): User => ({
  userId: user.userId,
  firstName: user.firstName,
  lastName: user.lastName,
  userRoles: user.userRoles ?? [],
});

export const transformGetMeUserQuery = (
  res?: GqlgetMeUserQuery,
): User | null => {
  const user = res?.me?.user ?? null;
  return user ? transformUser(user) : null;
};

export const useGetUser = (): UseGetUser => {
  const {
    result: userResult,
    error: userError,
    loading: userLoading,
    refetch: refetchUser,
  } = usegetMeUserQuery({ fetchPolicy: 'cache-first' });

  const user = computed((): User | null =>
    transformGetMeUserQuery(userResult.value),
  );

  const userRoles = computed(() => user.value?.userRoles ?? []);

  return {
    user,
    userRoles,
    userError,
    userLoading,
    refetchUser,
  };
};
