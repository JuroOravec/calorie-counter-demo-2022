import type { User } from '@prisma/client';
import type { PartialFields } from '@/modules/shared/types';
import type { GqlUser } from '@/__generated__/graphql';

export const sdb2gqlUser = (
  user: User,
): PartialFields<GqlUser, 'userRoles' | 'userSettings'> => ({
  ...user,
});
