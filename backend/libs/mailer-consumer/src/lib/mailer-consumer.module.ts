import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  EmailOptions,
  EmailProviderType,
  MailerProviderModule,
} from '@polycode/mailer-provider';
import { registerer, validationSchema } from './mailer-consumer.config';
import { MailerConsumerService } from './mailer-consumer.service';

@Module({})
export class MailerConsumerModule {
  static forRoot(options: EmailOptions): DynamicModule {
    const dynamicModule = {
      imports: [ConfigModule.forRoot({ load: [registerer], validationSchema })],
      providers: [MailerConsumerService],
      module: MailerConsumerModule,
      exports: [MailerConsumerService],
    };

    const emailProvider =
      options.emailProviderOverride || process.env['EMAIL_PROVIDER'];

    switch (emailProvider) {
      case EmailProviderType.SES:
        dynamicModule.imports.push(
          MailerProviderModule.forRoot({
            emailProviderOverride: EmailProviderType.SES,
          })
        );
        break;
      case EmailProviderType.FAKE:
        dynamicModule.imports.push(
          MailerProviderModule.forRoot({
            emailProviderOverride: EmailProviderType.FAKE,
          })
        );
        break;
      case EmailProviderType.SMTP:
        dynamicModule.imports.push(
          MailerProviderModule.forRoot({
            emailProviderOverride: EmailProviderType.SMTP,
          })
        );
        break;
      default:
        throw new Error(
          'EMAIL_PROVIDER is not defined or invalid ( must be SES, SMTP,  fake )'
        );
    }

    return dynamicModule;
  }
}
