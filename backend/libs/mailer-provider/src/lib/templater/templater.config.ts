import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface TemplaterConfig {
  frontendUrl: string;
  verificationPath: string;
  teamPath: string;
}

export const validationSchema = Joi.object({
  PUBLIC_WWW_URL: Joi.string().default('http://localhost:3000'),
  EMAIL_VERIFICATION_PATH: Joi.string().default('/email/verification/'),
  EMAIL_TEAMS_PATH: Joi.string().default('/teams'),
});

export const registerer = registerAs('templater', (): TemplaterConfig => {
  return {
    frontendUrl: process.env['PUBLIC_WWW_URL'],
    verificationPath: process.env['EMAIL_VERIFICATION_PATH'],
    teamPath: process.env['EMAIL_TEAMS_PATH'],
  };
});
