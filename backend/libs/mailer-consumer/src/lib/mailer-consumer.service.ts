import { Injectable } from '@nestjs/common';
import { MailerProviderService } from '@polycode/mailer-provider';

export enum EmailTemplate {
  USER_WELCOME,
  USER_VERIFY_EMAIL,
}

@Injectable()
export class MailerConsumerService {
  constructor(private readonly mailerProviderService: MailerProviderService) {}

  /**
   * This function sends a verification email to the user's email address
   * @param {string} recipientEmail - The email address of the recipient.
   * @param {string} recipientUsername - The username of the recipient.
   * @param {string} token - The token that was generated in the previous step.
   */
  async sendVerificationEmail(
    recipientEmail: string,
    recipientUsername: string,
    token: string
  ) {
    this.mailerProviderService.sendVerificationEmail(
      recipientEmail,
      recipientUsername,
      token
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
    this.mailerProviderService.sendJoinTeamEmail(
      recipientEmail,
      recipientUsername,
      invitingUsername,
      teamName
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
    this.mailerProviderService.sendLeaveTeamEmail(
      recipientEmail,
      recipientUsername,
      teamName
    );
  }
}
