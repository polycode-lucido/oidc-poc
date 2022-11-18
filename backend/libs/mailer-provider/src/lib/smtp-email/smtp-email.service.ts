import { Injectable } from '@nestjs/common';
import { EmailProvider } from '../mailer-provider.model';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class SMTPEmailService implements EmailProvider {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: process.env.EMAIL_SMTP_HOST,
      port: parseInt(process.env.EMAIL_SMTP_PORT, 10),
      secure: process.env.EMAIL_SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_SMTP_USER,
        pass: process.env.EMAIL_SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string, from: string) {
    const mailOptions = {
      from,
      to,
      subject,
      html: text,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
