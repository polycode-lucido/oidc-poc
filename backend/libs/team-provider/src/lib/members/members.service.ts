import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { MailerConsumerService } from '@polycode/mailer-consumer';
import { QueryManager, QueryOptions } from '@polycode/query-manager';
import {
  TeamMemberRole,
  TeamMembers,
  Team,
  User,
  UserEmail,
} from '@polycode/shared';
import { is404 } from '@polycode/to';
import { UserEmailService, UserService } from '@polycode/user';
import { Sequelize } from 'sequelize-typescript';
import { TeamProviderService } from '../team-provider.service';
import { CreateTeamMemberDto } from './template/dtos/create-member.dto';
import { DeleteTeamMemberDto } from './template/dtos/delete-member.dto';

@Injectable()
export class TeamMembersService {
  constructor(
    readonly sequelize: Sequelize,
    private readonly userService: UserService,
    private readonly userEmailService: UserEmailService,
    @Inject(forwardRef(() => TeamProviderService))
    private readonly teamService: TeamProviderService,
    private readonly mailerConsumerService: MailerConsumerService
  ) {}

  /**
   * "Add a member to a team."
   *
   * The first thing we do is check that the team and user exist. If they don't, we throw an error
   * @param {string} teamId - The id of the team to add the user to.
   * @param {QueryOptions} [queryOptions] - This is an optional parameter that allows you to pass in a
   * transaction to be used for the query.
   * @returns The team object
   */
  async addMember(
    teamId: string,
    createTeamMemberDto: CreateTeamMemberDto,
    invitingUserId: string,
    queryOptions: QueryOptions = {}
  ) {
    const team: Team = await this.teamService._findById(teamId, queryOptions);
    const guestUser: User = await this.userService._findById(
      createTeamMemberDto.userId,
      queryOptions
    );
    const invitingUser: User = await this.userService._findById(
      invitingUserId,
      queryOptions
    );

    if (team.users.find((user) => user.id === guestUser.id)) {
      throw new ConflictException('User is already a member of the team');
    }

    await QueryManager.createTransaction(queryOptions, this.sequelize);

    await QueryManager.create<TeamMembers>(
      TeamMembers,
      {
        teamId: teamId,
        userId: guestUser.id,
        role: TeamMemberRole.MEMBER,
      },
      QueryManager.skipTransaction(queryOptions)
    );

    await QueryManager.commitTransaction(queryOptions);

    try {
      const userEmail: UserEmail = (
        await this.userEmailService.findAllByUserId(guestUser.id, queryOptions)
      ).shift();

      await this.mailerConsumerService.sendJoinTeamEmail(
        userEmail.email,
        guestUser.username,
        invitingUser.username,
        team.name
      );
    } catch (err) {
      // skip email sending error
      Logger.error(err);
    }

    return this.teamService._findById(teamId, queryOptions);
  }

  /**
   * "Delete a member from a team."
   *
   * The first thing we do is find the team and the user. If the user is not a member of the team, we
   * throw a ConflictException
   * @param {string} teamId - The id of the team to delete the member from.
   * @param {QueryOptions} [queryOptions] - This is an optional parameter that allows you to pass in a
   * transaction object.
   * @returns The team with the user removed.
   */
  async deleteMember(
    teamId: string,
    deleteTeamMemberDto: DeleteTeamMemberDto,
    queryOptions: QueryOptions = {}
  ) {
    const team: Team = await this.teamService._findById(teamId, queryOptions);
    const user: User = await this.userService._findById(
      deleteTeamMemberDto.userId,
      queryOptions
    );

    const memberToDelete = await is404(
      new Promise((res) => {
        res(team.users.find((user) => user.id === deleteTeamMemberDto.userId));
      }),
      { message: 'User is not a member of the team' }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((memberToDelete as any).TeamMembers.role == TeamMemberRole.CAPTAIN) {
      throw new ConflictException('You cannot delete the captain of a team');
    }

    await QueryManager.createTransaction(queryOptions, this.sequelize);

    await QueryManager.destroy(
      TeamMembers,
      {
        where: {
          teamId: teamId,
          userId: deleteTeamMemberDto.userId,
        },
      },
      QueryManager.skipTransaction(queryOptions)
    );

    await QueryManager.commitTransaction(queryOptions);

    try {
      const userEmail: UserEmail = (
        await this.userEmailService.findAllByUserId(user.id, queryOptions)
      ).shift();

      await this.mailerConsumerService.sendLeaveTeamEmail(
        userEmail.email,
        user.username,
        team.name
      );
    } catch (err) {
      // skip email sending error
      Logger.error(err);
    }

    return this.teamService._findById(teamId, queryOptions);
  }
}
