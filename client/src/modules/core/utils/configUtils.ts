import Joi from 'joi';

export const isValidHttpUrl = (val: string): boolean => {
  let url;

  try {
    url = new URL(val);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
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
