import Joi from 'joi';

import type { Prisma, PrismaClient, UserSettings } from '@prisma/client';
import { logger } from '@/modules/core/utils/logger';

export type ServerDbUserSettingsUpdateInput = Omit<
  Prisma.UserSettingsUncheckedUpdateInput,
  'userId' | 'userSettingsId'
> &
  Pick<UserSettings, 'userId'>;

export const DEFAULT_USER_SETTINGS: Omit<UserSettings, 'userId' | 'userSettingsId'> = {
  priceLimitMonthly: 1000,
  caloriesLimitDaily: 2100,
};

const userSettingsValidationSchema = Joi.object<UserSettings>({
  userId: Joi.string().uuid({ version: 'uuidv4' }).required(),
  priceLimitMonthly: Joi.number().min(0),
  caloriesLimitDaily: Joi.number().min(0),
})
  .required()
  .unknown(true);

export const getUserSettings = (
  client: PrismaClient,
  { userId }: { userId: string },
): Promise<UserSettings | null> => client.userSettings.findUnique({ where: { userId } });

export const updateUserSettings = async (
  client: PrismaClient,
  input: ServerDbUserSettingsUpdateInput,
): Promise<UserSettings | null> => {
  Joi.assert(input, userSettingsValidationSchema);

  const { userId, priceLimitMonthly, caloriesLimitDaily } = input;

  return client.userSettings
    .update({
      where: {
        userId,
      },
      data: {
        priceLimitMonthly,
        caloriesLimitDaily,
      },
    })
    .catch((err) => {
      logger.error(err);
      return null;
    });
};
