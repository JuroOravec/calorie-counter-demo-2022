import { UserRoleType } from '@prisma/client';
import { serverDbClient } from './src/datasources/serverDb/serverDbClient';
import { createUser } from './src/datasources/serverDb/modules/user';

const createDemoData = async () => {
  createUser(serverDbClient, {
    firstName: 'John',
    lastName: 'Sharp',
    email: 'john.sharp@sharp.io',
    plaintextPassword: '12345678',
  });

  createUser(serverDbClient, {
    firstName: 'Stacy',
    lastName: 'Walsh',
    email: 's.walsh@kmail.com',
    plaintextPassword: 'tr33b!rdnestTest',
  });

  createUser(serverDbClient, {
    firstName: 'Adam',
    lastName: 'Admin',
    email: 'adam@admin.co.uk',
    plaintextPassword: 'ee8dce792e83fe5255f43e4362e5e3e0',
    userRoles: [UserRoleType.ADMIN],
  });
};

// A `main` function so that you can use async/await
async function main() {
  // ... you will write your Prisma Client queries here
  await createDemoData();
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await serverDbClient.$disconnect();
  });
