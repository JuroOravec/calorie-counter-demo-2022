import Prisma from '@prisma/client';
import { AppContext } from '@/modules/core/handlers/appContextHandler';

declare global {
  namespace Express {
    /* eslint-disable-next-line */
    interface User extends Prisma.User {
    }

    interface Request {
      context: () => AppContext;
    }
  }
}
