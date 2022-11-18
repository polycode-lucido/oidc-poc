import { registerAs } from '@nestjs/config';
import { EmailProviderType } from '@polycode/mailer-provider';
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  EMAIL_PROVIDER: Joi.valid(...Object.values(EmailProviderType)).default(
    'FAKE'
  ),
});

export const registerer = registerAs(
  'mailer-consumer',
  (): { emailProvider: EmailProviderType } => {
    switch (process.env['EMAIL_PROVIDER']) {
      case EmailProviderType.SES:
        return { emailProvider: EmailProviderType.SES };
      case EmailProviderType.SMTP:
        return { emailProvider: EmailProviderType.SMTP };
      default:
      case EmailProviderType.FAKE:
        return { emailProvider: EmailProviderType.FAKE };
    }
  }
);
