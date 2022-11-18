import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  EMAIL_SES_SECRET: Joi.string().required(),
  EMAIL_SES_REGION: Joi.string().required(),
  EMAIL_SES_KEY: Joi.string().required(),
});

export const registerer = registerAs('awsses', () => {
  return {
    sesSecret: process.env['EMAIL_SES_SECRET'],
    sesRegion: process.env['EMAIL_SES_REGION'],
    sesKey: process.env['EMAIL_SES_KEY'],
  };
});
