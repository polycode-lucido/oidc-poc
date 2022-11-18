import { Template } from '../templater.model';

export class JoinTeamTemplate extends Template {
  /**
   * It creates a new JoinTeamTemplate object.
   * @param {string} recipientUsername - The username of the recipient.
   * @param {string} invitingUsername - The username of the user who invited.
   * @param {string} teamName - The name of the team.
   * @param {string} url - The link url.
   */
  constructor(
    recipientUsername: string,
    invitingUsername: string,
    teamName: string,
    url: string
  ) {
    super(url);
    this.setTitle('You have been added to a team');
    this.setUsername(recipientUsername);
    this.setTopParagraph(`${invitingUsername} added you in ${teamName} team.`);
    this.setButtonText('SEE MY TEAMS');
  }
}
