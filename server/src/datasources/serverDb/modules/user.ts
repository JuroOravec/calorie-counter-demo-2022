import { v4 as uuid4 } from 'uuid';

import type { Prisma, PrismaClient, User, UserRoleType } from '@prisma/client';
import { encryptPassword } from './userPassword';
import { logger } from '@/modules/core/utils/logger';
import { DEFAULT_USER_SETTINGS } from './userSettings';

export const getUserById = (client: PrismaClient, userId: string): Promise<User | null> =>
  client.user.findUnique({ where: { userId } }).catch((err) => {
    logger.error(err);
    return null;
  });

export const getUserByEmail = (
  client: PrismaClient,
  email: string,
): Promise<User | null> =>
  client.user.findUnique({ where: { email } }).catch((err) => {
    logger.error(err);
    return null;
  });

export const createUser = async (
  client: PrismaClient,
  {
    email,
    plaintextPassword,
    firstName,
    lastName,
    userRoles,
  }: {
    email: string;
    firstName: string;
    lastName: string;
    plaintextPassword: string;
    userRoles?: UserRoleType[];
  },
): Promise<User | null> => {
  const userData: Prisma.UserCreateInput = {
    userId: uuid4(),
    email,
    firstName,
    lastName,
    userPassword: {
      create: {
        password: await encryptPassword(plaintextPassword),
      },
    },
    userRoles: {
      create: userRoles?.map((role) => ({
        userRoleId: uuid4(),
        role,
      })),
    },
    userSettings: {
      create: {
        ...DEFAULT_USER_SETTINGS,
        userSettingsId: uuid4(),
      },
    },
  };

  return client.user
    .create({
      data: userData,
      select: {
        userId: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    })
    .catch((err) => {
      logger.error(err);
      return null;
    });
};
