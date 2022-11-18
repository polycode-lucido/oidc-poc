import { Inject, Injectable } from '@nestjs/common';
import { TemplaterService } from './templater/templater.service';
import { EmailProvider, EMAIL_PROVIDER_SERVICE } from './mailer-provider.model';

@Injectable()
export class MailerProviderService {
  private mailProvider: EmailProvider;

  constructor(
    @Inject(EMAIL_PROVIDER_SERVICE) emailProviderService: EmailProvider,
    private templaterService: TemplaterService
  ) {
    this.mailProvider = emailProviderService;
  }

  /**
   * It sends an email to the user with a link to verify their account
   * @param {string} recipientEmail - The email address of the recipient.
   * @param {string} recipientUsername - The username of the recipient.
   * @param {string} token - The token that was generated in the previous step.
   */
  async sendVerificationEmail(
    recipientEmail: string,
    recipientUsername: string,
    token: string
  ) {
    await this.mailProvider.sendEmail(
      recipientEmail,
      'Verify your account',
      this.templaterService.getVerificationTemplate(recipientUsername, token)
        .html,
      this.getDoNotReplyEmail()
    );
  }

  /**
   * It sends an email to the user when he joins a team
   * @param {string} recipientEmail - The email address of the recipient.
   * @param {string} recipientUsername - The username of the recipient.
   * @param {string} invitingUsername - The username of the user who invited.
   * @param {string} teamName - The name of the team.
   */
  async sendJoinTeamEmail(
    recipientEmail: string,
    recipientUsername: string,
    invitingUsername: string,
    teamName: string
  ) {
    await this.mailProvider.sendEmail(
      recipientEmail,
      'Added to a team',
      this.templaterService.getJoinTeamsTemplate(
        recipientUsername,
        invitingUsername,
        teamName
      ).html,
      this.getDoNotReplyEmail()
    );
  }

  /**
   * It sends an email to the user when he is removed from a team
   * @param {string} recipientEmail - The email address of the recipient.
   * @param {string} recipientUsername - The username of the recipient.
   * @param {string} teamName - The name of the team.
   */
  async sendLeaveTeamEmail(
    recipientEmail: string,
    recipientUsername: string,
    teamName: string
  ) {
    await this.mailProvider.sendEmail(
      recipientEmail,
      'Removed from a team',
      this.templaterService.getLeaveTeamsTemplate(recipientUsername, teamName)
        .html,
      this.getDoNotReplyEmail()
    );
  }

  getDoNotReplyEmail(): string {
    return `"${process.env['MAIL_FROM_DO_NOT_REPLY_NAME']}" <${process.env['MAIL_FROM_DO_NOT_REPLY']}>`;
  }
}
