import Joi from 'joi';

export const parseEnvVarAsInt = (val?: string): number | null => {
  const parsed = parseInt(val ?? '', 10);
  return Number.isNaN(parsed) ? null : parsed;
};

export const createConfig = <TConfig = any, TKey extends string = string>({
  configs,
  validationSchema,
  appEnv,
}: {
  configs: Record<TKey, TConfig>;
  appEnv: TKey;
  validationSchema: Joi.Schema;
}): TConfig => {
  Object.values(configs).forEach((config) => {
    Joi.assert(config, validationSchema, 'Config validation failed');
  });

  const config = configs[appEnv];

  if (!config) {
    throw Error(`Unknown APP_ENV value "${appEnv}"`);
  }

  return config;
};
