import { ConfigModule } from '@nestjs/config';
import { DynamicModule, Module } from '@nestjs/common';
import {
  EmailOptions,
  EmailProviderType,
  EMAIL_PROVIDER_SERVICE,
} from './mailer-provider.model';
import { MailerProviderService } from './mailer-provider.service';
import {
  registerer as sesConfigRegisterer,
  validationSchema as sesConfigValidationSchema,
} from './ses/awsses.config';
import { registerer, validationSchema } from './mailer-provider.config';
import { TemplaterModule } from './templater/templater.module';

import { AWSSesModule } from './ses/awsses.module';
import { AWSSesService } from './ses/awsses.service';
import { SMTPEmailModule } from './smtp-email/smtp-email.module';
import { SMTPEmailService } from './smtp-email/smtp-email.service';
import {
  registerer as smtpConfigRegisterer,
  validationSchema as smtpConfigValidationSchema,
} from './smtp-email/smtp-email.config';
import { FakeEmailModule } from './fake-email/fake-email.module';
import { FakeEmailService } from './fake-email/fake-email.service';

@Module({})
export class MailerProviderModule {
  static forRoot(option: EmailOptions): DynamicModule {
    const emailProvider: EmailProviderType = option.emailProviderOverride;
    switch (emailProvider) {
      case EmailProviderType.SES:
        return {
          imports: [
            TemplaterModule,
            ConfigModule.forRoot({
              load: [registerer],
              validationSchema,
            }),
            ConfigModule.forRoot({
              load: [sesConfigRegisterer],
              validationSchema: sesConfigValidationSchema,
            }),
            AWSSesModule.forRoot(),
          ],
          providers: [
            MailerProviderService,
            {
              provide: EMAIL_PROVIDER_SERVICE,
              useExisting: AWSSesService,
            },
          ],
          module: MailerProviderModule,
          exports: [MailerProviderService],
        };
      case EmailProviderType.SMTP:
        return {
          imports: [
            ConfigModule.forRoot({
              load: [registerer],
              validationSchema,
            }),
            ConfigModule.forRoot({
              load: [smtpConfigRegisterer],
              validationSchema: smtpConfigValidationSchema,
            }),
            SMTPEmailModule,
            TemplaterModule,
          ],
          providers: [
            MailerProviderService,
            {
              provide: EMAIL_PROVIDER_SERVICE,
              useExisting: SMTPEmailService,
            },
          ],
          module: MailerProviderModule,
          exports: [MailerProviderService],
        };
      case EmailProviderType.FAKE:
        return {
          imports: [
            ConfigModule.forRoot({
              load: [registerer],
              validationSchema,
            }),
            FakeEmailModule,
            TemplaterModule,
          ],
          providers: [
            MailerProviderService,
            {
              provide: EMAIL_PROVIDER_SERVICE,
              useExisting: FakeEmailService,
            },
          ],
          module: MailerProviderModule,
          exports: [MailerProviderService],
        };
    }
  }
}
