import Joi from 'joi';

import { createConfig } from './configUtils';

/**
 * App environements.
 */
export enum AppEnv {
  DEV = 'dev',
  PRD = 'prd',
}

interface Config {
  serverApolloUrl: string;
  enableGraphqlDebug: boolean;
}

/**
 * Config definitions per environment.
 *
 * This is the source of truth.
 */
const configs: Record<AppEnv, Config> = Object.freeze({
  [AppEnv.DEV]: {
    serverApolloUrl: 'http://localhost:3000/graphql',
    enableGraphqlDebug: true,
  },
  [AppEnv.PRD]: {
    serverApolloUrl: 'http://localhost:3000/graphql',
    enableGraphqlDebug: false,
  },
});

/** Validation for the configs. */
const configValidationSchema = Joi.object<Config>({
  serverApolloUrl: Joi.string()
    .min(1)
    .uri({ scheme: ['http', 'https'] })
    .required(),
  enableGraphqlDebug: Joi.boolean(),
}).required();

/** Config instance based on the current environment */
export const config = createConfig<Config, AppEnv>({
  configs,
  validationSchema: configValidationSchema,
  appEnv: import.meta.env.VITE_APP_ENV?.toLowerCase() as AppEnv,
});
