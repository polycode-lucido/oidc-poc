export enum EmailProviderType {
  SES = 'SES',
  SMTP = 'SMTP',
  FAKE = 'FAKE',
}
export interface EmailProvider {
  sendEmail(
    to: string,
    subject: string,
    text: string,
    from: string
  ): Promise<void>;
}

export interface EmailOptions {
  emailProviderOverride?: EmailProviderType;
}

export const EMAIL_PROVIDER_SERVICE = 'EmailProviderService';
