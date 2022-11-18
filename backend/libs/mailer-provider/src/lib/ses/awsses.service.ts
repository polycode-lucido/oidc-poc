import { Injectable } from '@nestjs/common';
import { SesEmailOptions, SesService } from '@polycode/nestjs-ses';
import { EmailProvider } from '../mailer-provider.model';

@Injectable()
export class AWSSesService implements EmailProvider {
  constructor(private readonly sesService: SesService) {}

  /**
   * It sends an email
   * @param {string} to - The email address of the recipient.
   * @param {string} subject - The subject of the email
   * @param {string} text - The body of the email.
   */
  async sendEmail(to: string, subject: string, text: string, from: string) {
    const emailOptions: SesEmailOptions = {
      to,
      from,
      subject,
      html: text,
    };
    this.sesService.sendEmail(emailOptions);
  }
}
