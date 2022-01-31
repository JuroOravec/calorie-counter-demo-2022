import bcrypt from 'bcrypt';

import type { PrismaClient } from '@prisma/client';
import { logger } from '@/modules/core/utils/logger';

export const encryptPassword = async (plaintextPassword: string): Promise<string> => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(plaintextPassword, saltRounds);
  return hash;
};

export const verifyPassword = async ({
  encryptedPassword,
  plainTextPassword,
}: {
  encryptedPassword: string;
  plainTextPassword: string;
}): Promise<boolean> => {
  return bcrypt.compare(plainTextPassword, encryptedPassword);
};

export const verifyUserPasswordByEmail = async (
  client: PrismaClient,
  { email, password }: { email: string; password: string },
): Promise<boolean> => {
  const res = await client.user
    .findUnique({
      where: { email },
      select: {
        userPassword: {
          select: {
            password: true,
          },
        },
      },
    })
    .catch((err) => {
      logger.error(err);
      return null;
    });

  const encryptedPassword = res?.userPassword?.password ?? null;
  if (!encryptedPassword) return false;

  return verifyPassword({ encryptedPassword, plainTextPassword: password });
};
