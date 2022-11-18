import { Template } from '../templater.model';

export class LeaveTeamTemplate extends Template {
  /**
   * It creates a new LeaveTeamTemplate object.
   * @param {string} recipientUsername - The username of the recipient.
   * @param {string} teamName - The name of the team.
   * @param {string} url - The link url.
   */
  constructor(recipientUsername: string, teamName: string, url: string) {
    super(url);
    this.setTitle('You have been removed from a team');
    this.setUsername(recipientUsername);
    this.setTopParagraph(`You are no longer a member of the ${teamName} team`);
    this.setButtonText('SEE MY TEAMS');
  }
}
