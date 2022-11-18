import { Injectable } from '@nestjs/common';
import { QueryManager, QueryOptions } from '@polycode/query-manager';
import { Attributes, FindOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { is404, is409 } from '@polycode/to';
import { CreateTeamDto } from './template/dtos/create-team.dto';
import { GenericSequelizeService } from '@polycode/generic';
import { Team, TeamMemberRole, TeamMembers, User } from '@polycode/shared';
import { AuthConsumerService, IRole } from '@polycode/auth-consumer';
import { Action, ResourceName } from '@polycode/casl';
import { UpdateTeamDto } from './template/dtos/update-user.dto';

@Injectable()
export class TeamProviderService extends GenericSequelizeService<Team> {
  constructor(
    readonly sequelize: Sequelize,
    readonly authConsumerService: AuthConsumerService
  ) {
    super(Team, sequelize, {});
  }

  /**
   * It returns a promise of a Team object.
   * @param findOptions - FindOptions<Attributes<Team>>
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise that resolves to a Team object.
   */
  async _findOne(
    findOptions: FindOptions<Attributes<Team>>,
    queryOptions: QueryOptions = {}
  ): Promise<Team> {
    return QueryManager.findOne<Team>(
      this.model,
      {
        ...findOptions,
        include: [
          {
            model: User,
            as: 'users',
          },
        ],
      },
      {
        validator: is404,
        ...queryOptions,
      }
    );
  }

  /**
   * It creates a team with the given name, and adds the creator as a member
   * @param {CreateTeamDto} createTeamDto - CreateTeamDto - This is the DTO that will be used to create
   * the team.
   * @param {string} creatorId - The id of the user who is creating the team.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns The team that was created.
   */
  async create(
    createTeamDto: CreateTeamDto,
    creatorId: string,
    queryOptions: QueryOptions = {}
  ) {
    await QueryManager.createTransaction(queryOptions, this.sequelize);

    await this._findOne(
      { where: { name: createTeamDto.name } },
      { validator: is409, ...QueryManager.skipTransaction(queryOptions) }
    );

    let team = await this._create(
      { ...createTeamDto },
      QueryManager.skipTransaction(queryOptions)
    );

    await QueryManager.create<TeamMembers>(
      TeamMembers,
      {
        teamId: team.id,
        userId: creatorId,
        role: TeamMemberRole.CAPTAIN,
      },
      QueryManager.skipTransaction(queryOptions)
    );

    const creatorRole: IRole = await this.authConsumerService.createRole(
      this.getRoleNameForTeamCaptain(team.id),
      `Role for captain of the team '${team.name}'`,
      QueryManager.skipTransaction(queryOptions)
    );

    await this.authConsumerService.createRolePolicy(
      Action.Manage,
      ResourceName.TEAM,
      { id: team.id },
      creatorRole.id,
      QueryManager.skipTransaction(queryOptions)
    );

    await this.authConsumerService.createRolePolicy(
      Action.Manage,
      ResourceName.TEAM_MEMBER,
      { team_id: team.id },
      creatorRole.id,
      QueryManager.skipTransaction(queryOptions)
    );

    await this.authConsumerService.addRoleToUser(
      creatorId,
      creatorRole.id,
      QueryManager.skipTransaction(queryOptions)
    );

    const membrRole: IRole = await this.authConsumerService.createRole(
      this.getRoleNameForTeamMember(team.id),
      `Role for members of the team '${team.name}'`,
      QueryManager.skipTransaction(queryOptions)
    );

    await this.authConsumerService.addRoleToUser(
      creatorId,
      membrRole.id,
      QueryManager.skipTransaction(queryOptions)
    );

    // Get the team but with the creator added
    team = await this._findById(
      team.id,
      QueryManager.skipTransaction(queryOptions)
    );

    await QueryManager.commitTransaction(queryOptions);

    return team;
  }

  /**
   * It returns a promise that resolves to an array of Team objects
   * @returns A promise of an array of Team objects.
   */
  async _findAll(
    findOptions: FindOptions<Attributes<Team>> = {},
    queryOptions: QueryOptions = {}
  ): Promise<Team[]> {
    const teams = await QueryManager.findAll<Team>(
      Team,
      {
        include: [
          {
            model: User,
            as: 'users',
          },
        ],
        ...findOptions,
      },
      queryOptions
    );

    return teams;
  }

  /**
   * It finds a team by id, updates it with the changes, and returns the team
   * @param {string} id - The id of the team you want to update
   * @param changes - Record<string, string>
   * @returns The team that was updated.
   */
  async update(
    id: string,
    changes: UpdateTeamDto,
    queryOptions: QueryOptions = {}
  ): Promise<Team> {
    const team = await this._findById(id, queryOptions);
    await this._updateInstance(team, changes, queryOptions);

    return team;
  }

  /**
   * Delete a team by id.
   * @param {string} id - string - The id of the team to delete
   * @returns The team is being deleted.
   */
  async delete(id: string, queryOptions: QueryOptions = {}): Promise<void> {
    await QueryManager.createTransaction(queryOptions, this.sequelize);

    const team = await this._findById(id, queryOptions);

    await this.authConsumerService.deleteRoleByName(
      this.getRoleNameForTeamCaptain(team.id),
      QueryManager.skipTransaction(queryOptions)
    );

    await this.authConsumerService.deleteRoleByName(
      this.getRoleNameForTeamMember(team.id),
      QueryManager.skipTransaction(queryOptions)
    );

    await this._deleteInstance(
      team,
      QueryManager.skipTransaction(queryOptions)
    );

    await QueryManager.commitTransaction(queryOptions);
  }

  /**
   * It takes a Team object and returns a new object with the same properties, but with the users
   * property mapped to a new array of objects with the same properties, but with the role property
   * added
   * @param {Team} team - Team - This is the team object that we're going to format.
   * @returns An object with the following properties:
   *   id: The id of the team
   *   name: The name of the team
   *   description: The description of the team
   *   members: An array of objects with the following properties:
   *     id: The id of the user
   *     username: The username of the user
   *     role: The role of the user in the team
   */
  format(
    team: Team | Team[]
  ): Partial<Record<string, unknown>> | Partial<Record<string, unknown>>[] {
    if (Array.isArray(team)) {
      return team.map((e) => this.format(e)) as Partial<Team>[];
    }

    return {
      id: team.id,
      name: team.name,
      description: team.description,
      members: team.users?.map((user) => ({
        id: user.id,
        username: user.username,
        points: user.points,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        role: (user as any).TeamMembers.role,
      })),
    };
  }

  getRoleNameForTeamMember(id: string): string {
    return `team::${id}::member`;
  }

  getRoleNameForTeamCaptain(id: string): string {
    return `team::${id}::captain`;
  }
}
