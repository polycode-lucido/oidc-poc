import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  MAIL_FROM_DO_NOT_REPLY: Joi.string().default('noreply@polycode.do-2021.fr'),
  MAIL_FROM_DO_NOT_REPLY_NAME: Joi.string().default('PolyCode'),
});

export const registerer = registerAs('mailer-provider', () => {
  return {
    mailFromDoNotReply: process.env['MAIL_FROM_DO_NOT_REPLY'],
    mailFromDoNotReplyName: process.env['MAIL_FROM_DO_NOT_REPLY_NAME'],
  };
});
