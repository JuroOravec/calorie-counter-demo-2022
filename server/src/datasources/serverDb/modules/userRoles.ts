import { v4 as uuidv4 } from 'uuid';

import type { GqlUserRoleType } from '@/__generated__/graphql';
import type { PrismaClient, UserRole } from '@prisma/client';
import { logger } from '@/modules/core/utils/logger';

export const getUserRoles = (
  client: PrismaClient,
  { userId }: { userId: string },
): Promise<UserRole[]> => client.userRole.findMany({ where: { userId } });

/** Overwrite user roles for given user */
export const setUserRoles = async (
  client: PrismaClient,
  { userId, roles }: { userId: string; roles: GqlUserRoleType[] },
): Promise<UserRole[]> => {
  const deleteOldRoles = client.userRole.deleteMany({
    where: { userId },
  });

  const newUserRoles: UserRole[] = roles.map((role) => ({
    userRoleId: uuidv4(),
    userId,
    role,
  }));

  const insertNewRoles = client.userRole.createMany({
    data: newUserRoles,
  });

  const [_, createdRoles] = await client.$transaction([deleteOldRoles, insertNewRoles]);

  if (createdRoles.count !== newUserRoles.length) {
    logger.warn(
      `Partial batch insert in ${setUserRoles.name}. Given: ${newUserRoles.length} Inserted: ${createdRoles.count}`,
    );
  }

  return newUserRoles;
};
