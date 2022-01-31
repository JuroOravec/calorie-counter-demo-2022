import { v4 as uuid4 } from 'uuid';
import Joi from 'joi';
import { round, sumBy } from 'lodash';

import type { FoodEntry, Prisma, PrismaClient } from '@prisma/client';

export type ServerDbFoodEntryCreateInput = Omit<
  Prisma.FoodEntryUncheckedCreateInput,
  'foodEntryId'
>;
export type ServerDbFoodEntryUpdateInput = Prisma.FoodEntryUncheckedUpdateInput &
  Pick<FoodEntry, 'userId' | 'foodEntryId'>;
export type ServerDbFoodEntryDeleteInput =
  Prisma.FoodEntryFoodEntryIdUserIdCompoundUniqueInput;

const foodEntryValidationSchema = Joi.object<FoodEntry>({
  userId: Joi.string().uuid({ version: 'uuidv4' }),
  name: Joi.string().min(1),
  calories: Joi.number().min(0),
  date: Joi.date().min('2020-01-01'),
  price: Joi.number().min(0).empty(null),
})
  .required()
  .unknown(true);

const DEFAULT_ORDER: Prisma.Enumerable<Prisma.FoodEntryOrderByWithRelationInput> = {
  date: 'desc',
};

//////////////////////////////////
// READ QUERIES
//////////////////////////////////

export const getAllFoodEntries = async (client: PrismaClient): Promise<FoodEntry[]> => {
  return client.foodEntry.findMany({
    orderBy: DEFAULT_ORDER,
  });
};

export const getFoodEntriesByUserId = async (
  client: PrismaClient,
  { userId }: { userId: string },
): Promise<FoodEntry[]> => {
  return client.foodEntry.findMany({
    where: {
      userId,
    },
    orderBy: DEFAULT_ORDER,
  });
};

//////////////////////////////////
// AGGREGATIONS
//////////////////////////////////

export const countFoodEntriesByDateRange = async (
  client: PrismaClient,
  { from, to }: { from: Date; to?: Date },
): Promise<number> => {
  const res = await client.foodEntry.aggregate({
    _count: {
      foodEntryId: true,
    },
    where: {
      date: {
        gte: from,
        lte: to,
      },
    },
  });

  return res._count.foodEntryId ?? 0;
};

export const avgCaloriesPerUserByDateRange = async (
  client: PrismaClient,
  { from, to }: { from: Date; to?: Date },
): Promise<number> => {
  // Get average calories per user in given time range
  const res = await client.foodEntry.groupBy({
    by: ['userId'],
    _avg: {
      calories: true,
    },
    where: {
      date: {
        gte: from,
        lte: to,
      },
    },
  });

  // Average the average calories across users
  const sumOfAvgCaloriesForAllUsers = sumBy(res, (data) => data._avg.calories ?? 0);
  return round(sumOfAvgCaloriesForAllUsers / res.length, 2);
};

//////////////////////////////////
// CUD QUERIES
//////////////////////////////////

export const createFoodEntry = async (
  client: PrismaClient,
  input: ServerDbFoodEntryCreateInput,
): Promise<FoodEntry> => {
  Joi.assert(input, foodEntryValidationSchema);

  const { userId, name, date, calories, price } = input;

  const foodEntryData: Prisma.FoodEntryUncheckedCreateInput = {
    foodEntryId: uuid4(),
    userId,
    name,
    date,
    calories,
    price,
  };

  return client.foodEntry.create({ data: foodEntryData });
};

export const updateFoodEntry = async (
  client: PrismaClient,
  input: ServerDbFoodEntryUpdateInput,
): Promise<FoodEntry> => {
  Joi.assert(input, foodEntryValidationSchema);

  const { foodEntryId, userId, name, date, calories, price } = input;

  return client.foodEntry.update({
    where: {
      foodEntryId_userId: {
        foodEntryId,
        userId,
      },
    },
    data: {
      name,
      date,
      calories,
      price,
    },
  });
};

export const deleteFoodEntry = async (
  client: PrismaClient,
  input: ServerDbFoodEntryDeleteInput,
): Promise<FoodEntry> => {
  const { foodEntryId, userId } = input;

  return client.foodEntry.delete({
    where: {
      foodEntryId_userId: {
        foodEntryId,
        userId,
      },
    },
  });
};
