import { Injectable, Inject } from '@nestjs/common';
import { KEY, REGION, SECRET } from '../../tokens/tokens';
import * as ses from 'node-ses';

export interface SesEmailOptions {
  from: string;
  to: string;
  subject: string;
  replyTo?: string;
  html?: string;
  cc?: string;
  bcc?: string[];
  text?: string;
}

@Injectable()
export class SesService {
  private readonly ses;
  constructor(
    @Inject(KEY) private readonly apiKey: string,
    @Inject(REGION) private readonly region: string,
    @Inject(SECRET) private readonly secret: string,
  ) {
    this.ses = ses.createClient({
      key: apiKey,
      amazon: `https://email.${region}.amazonaws.com`,
      secret,
    });
  }

  public sendEmail(emailOptions: SesEmailOptions): Promise<boolean> {
    const message = emailOptions.html || '';
    const email = {
      ...emailOptions,
      message,
      altText: emailOptions.text,
    };
    delete email.html;
    delete email.text;

    if (!email.text) {
      delete email.text;
    }
    delete email.html;
    return new Promise((resolve, reject) => {
      this.ses.sendEmail(email, (err, data, res) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        return resolve(!!res);
      });
    });
  }
}
