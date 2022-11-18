import { registerAs } from '@nestjs/config';
import { Environment } from '@polycode/env';
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.valid(...Object.values(Environment)).default('development'),
  AUTH_DATABASE_NAME: Joi.string().default('postgres'),
  AUTH_DATABASE_USER: Joi.string().default('postgres'),
  AUTH_DATABASE_PASSWORD: Joi.string().default('postgres'),
  AUTH_DATABASE_HOST: Joi.string().default('localhost'),
  AUTH_DATABASE_PORT: Joi.number().default(5432),
  AUTH_DATABASE_SSL: Joi.boolean().default(false),
  MONGODB_URL: Joi.string().default('mongodb://localhost:27017/'),
  MONGODB_USER: Joi.string().default('root'),
  MONGODB_PASSWORD: Joi.string().default('root'),
  DEFAULT_ROLE_ID: Joi.string()
    .guid({
      version: ['uuidv4'],
    })
    .default('db78e634-1034-4bee-9e70-a1d56de1738d'),
  DEFAULT_VALIDATED_ROLE_ID: Joi.string()
    .guid({
      version: ['uuidv4'],
    })
    .default('cdccf05d-a8b9-4455-a373-595eae252adf'),
});

export const registerer = registerAs('api', () => {
  return {
    nodeEnv: process.env['NODE_ENV'],
    authDatabaseName: process.env['AUTH_DATABASE_NAME'],
    authDatabaseUser: process.env['AUTH_DATABASE_USER'],
    authDatabasePassword: process.env['AUTH_DATABASE_PASSWORD'],
    authDatabaseHost: process.env['AUTH_DATABASE_HOST'],
    authDatabasePort: process.env['AUTH_DATABASE_PORT'],
    mongodbUrl: process.env['MONGODB_URL'],
    mongodbUser: process.env['MONGODB_USER'],
    mongodbPassword: process.env['MONGODB_PASSWORD'],
    defaultRoleId: process.env['DEFAULT_ROLE_ID'],
    defaultValidatedRoleId: process.env['DEFAULT_VALIDATED_ROLE_ID'],
  };
});
