import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  AUTH_JWT_SECRET: Joi.string().min(10).default('JWT_SECRET').messages({
    'string.min': 'JWT secret must be at least 10 characters long',
  }),
  AUTH_JWT_ISSUER: Joi.string().default('https://auth.app'),
  AUTH_JWT_AUDIENCE: Joi.string().default('https://api.app'),
  AUTH_JWT_EXPIRES_IN: Joi.number().default(86400),
});

export const registerer = registerAs('auth', () => {
  return {
    jwtSecret: process.env['AUTH_JWT_SECRET'],
    jwtIssuer: process.env['AUTH_JWT_ISSUER'],
    jwtAudience: process.env['AUTH_JWT_AUDIENCE'],
    jwtExpiresIn: process.env['AUTH_JWT_EXPIRES_IN'],
  };
});
