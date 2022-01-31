import type { Handler, Request } from 'express';

import type { PrismaClient } from '@prisma/client';
import { serverDbClient } from '@/datasources/serverDb/serverDbClient';

/**
 * Context available to all request handlers
 */
export interface AppContext {
  serverDb: PrismaClient;
  user: Express.User | null;
  session: Express.Request['session'];
}

export const createAppContext = (req: Request): AppContext => ({
  user: req.user ?? null,
  session: req.session,
  serverDb: serverDbClient,
});

export const appContextHandler: Handler = (req, res, next) => {
  req.context = () => createAppContext(req);

  next();
};
