import express, { Express } from 'express';
import compression from 'compression';
import passport from 'passport';

import {
  bodyParserHandler,
  bodyParserOptions,
} from './modules/core/handlers/bodyParserHandler';
import { corsHandler, corsOptions } from './modules/core/handlers/corsHandler';
import { sessionHandler } from './modules/core/handlers/sessionHandler';
import { createValidateRequestHandler } from './modules/core/handlers/validateRequestHandler';
import { errorHandler } from './modules/core/handlers/errorHandler';
import { notFoundHandler } from './modules/core/handlers/notFoundHandler';
import { csrfHandler } from './modules/core/handlers/csrfHandler';
import { helmetHandler } from './modules/core/handlers/helmetHandler';

import { apolloServer } from './apis/graphql/apolloServer';
import { initRedisClient } from './datasources/redis/redisClient';
import { authRouter } from './modules/auth/authRouter';
import { appContextHandler } from './modules/core/handlers/appContextHandler';

export const createExpressServer = async (): Promise<Express> => {
  const app = express();

  // Get real ip from nginx proxy
  app.set('trust proxy', true);

  // Common middlewares
  app.use(
    appContextHandler,
    bodyParserHandler,
    corsHandler,
    compression(),
    helmetHandler,
    sessionHandler,
    // TODO: Enable this or what?
    // app.use(createValidateRequestHandler());
    csrfHandler,
    passport.initialize(),
    passport.session(),
  );

  // Routers
  app.use('/auth', authRouter);

  await apolloServer.start();
  const apolloRouter = apolloServer.getMiddleware({
    path: '/graphql',
    cors: corsOptions,
    bodyParserConfig: bodyParserOptions,
  });
  app.use(apolloRouter);

  // Catch-all middlewares
  app.use(notFoundHandler, errorHandler);

  // TODO: Await for this ?
  initRedisClient();

  return app;
};
