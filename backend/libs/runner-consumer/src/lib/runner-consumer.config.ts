import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  RUNNER_API_URL: Joi.string().uri().default('http://localhost:3001'),
});

export const registerer = registerAs('api', () => {
  return {
    runnerApiUrl: process.env['RUNNER_API_URL'],
  };
});
