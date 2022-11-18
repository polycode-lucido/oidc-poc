import { Template } from '../templater.model';

export class VerificationTemplate extends Template {
  /**
   * It creates a new VerificationTemplate object.
   * @param {string} recipientUsername - The username of the recipient.
   * @param {string} url - The link url.
   */
  constructor(recipientUsername: string, url: string) {
    super(url);
    this.setTitle('Welcome to PolyCode!');
    this.setUsername(recipientUsername);
    this.setTopParagraph(
      "We're excited to have you get started. First, you need to confirm your account. Just press the button below."
    );
    this.setButtonText('Confirm Account');
  }
}
