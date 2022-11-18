import { RunnerOptions } from '../runner-provider.model';
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  RUNNER_TIMEOUT: Joi.number().default(15000),
});

export const registerer = registerAs('forkexec', (): RunnerOptions => {
  return {
    timeout: parseInt(process.env['RUNNER_TIMEOUT']),
  };
});
