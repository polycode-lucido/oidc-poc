import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  EMAIL_SMTP_HOST: Joi.string().required(),
  EMAIL_SMTP_PORT: Joi.number().required(),
  EMAIL_SMTP_USER: Joi.string().required(),
  EMAIL_SMTP_PASSWORD: Joi.string().required(),
  EMAIL_SMTP_SECURE: Joi.boolean().default(false),
});

export const registerer = registerAs('smtp', () => {
  return {
    smtpHost: process.env['EMAIL_SMTP_HOST'],
    smtpPort: process.env['EMAIL_SMTP_PORT'],
    smtpUser: process.env['EMAIL_SMTP_USER'],
    smtpPassword: process.env['EMAIL_SMTP_PASSWORD'],
    smtpSecure: process.env['EMAIL_SMTP_SECURE'],
  };
});
