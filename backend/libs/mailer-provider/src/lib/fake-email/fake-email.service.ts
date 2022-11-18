import { Injectable, Logger } from '@nestjs/common';
import { EmailProvider } from '../mailer-provider.model';

@Injectable()
export class FakeEmailService implements EmailProvider {
  async sendEmail(
    to: string,
    subject: string,
    text: string,
    from: string
  ): Promise<void> {
    Logger.debug(
      `Sending email to ${to}. From is ${from}. Subject is ${subject}. Body is : 
    ${text}`,
      'FakeEmailService'
    );
  }
}
