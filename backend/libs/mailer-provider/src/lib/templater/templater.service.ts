import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JoinTeamTemplate } from './templates/joinTeam';
import { LeaveTeamTemplate } from './templates/leaveTeam';
import { VerificationTemplate } from './templates/verification';
import { TemplaterConfig } from './templater.config';

@Injectable()
export class TemplaterService {
  private readonly frontendUrl: string;
  private readonly verificationPath: string;
  private readonly teamPath: string;

  constructor(private readonly configService: ConfigService) {
    const configuration = this.configService.get<TemplaterConfig>('templater');
    this.frontendUrl = configuration.frontendUrl;
    this.verificationPath = configuration.verificationPath;
    this.teamPath = configuration.teamPath;
  }

  /**
   * It formats and returns the verification email template.
   * @param {string} recipientUsername - The username of the recipient.
   * @param {string} token - The token that was generated in the previous step.
   * @returns A VerificationTemplate object.
   */
  public getVerificationTemplate(
    recipientUsername: string,
    token: string
  ): VerificationTemplate {
    const url = `${this.frontendUrl}${this.verificationPath}${token}`;
    const template = new VerificationTemplate(recipientUsername, url);
    return template;
  }

  /**
   * It formats and returns the join team email template.
   * @param {string} recipientUsername - The username of the recipient.
   * @param {string} invitingUsername - The username of the user who invited.
   * @param {string} teamName - The name of the team.
   */
  public getJoinTeamsTemplate(
    recipientUsername: string,
    invitingUsername: string,
    teamName: string
  ): JoinTeamTemplate {
    const url = `${this.frontendUrl}${this.teamPath}`;
    const template = new JoinTeamTemplate(
      recipientUsername,
      invitingUsername,
      teamName,
      url
    );
    return template;
  }

  /**
   * It formats and returns the leave team email template.
   * @param {string} recipientUsername - The username of the recipient.
   * @param {string} teamName - The name of the team.
   */
  public getLeaveTeamsTemplate(
    recipientUsername: string,
    teamName: string
  ): LeaveTeamTemplate {
    const url = `${this.frontendUrl}${this.teamPath}`;
    const template = new LeaveTeamTemplate(recipientUsername, teamName, url);
    return template;
  }
}
