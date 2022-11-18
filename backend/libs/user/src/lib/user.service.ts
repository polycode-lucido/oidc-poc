import { Injectable } from '@nestjs/common';
import { is409 } from '@polycode/to';
import { CreateUserDto } from './templates/dtos/create-user.dto';
import { AuthConsumerService } from '@polycode/auth-consumer';
import { UserEmailService } from './email/email.service';
import { UserSettingsService } from './settings/settings.service';
import { Sequelize } from 'sequelize-typescript';
import { QueryManager, QueryOptions } from '@polycode/query-manager';
import { GenericSequelizeService } from '@polycode/generic';
import { Team, User } from '@polycode/shared';
import { Attributes, Op } from 'sequelize';

@Injectable()
export class UserService extends GenericSequelizeService<User> {
  constructor(
    private readonly authConsumerService: AuthConsumerService,
    private readonly userEmailService: UserEmailService,
    private readonly userSettingService: UserSettingsService,
    sequelize: Sequelize
  ) {
    super(User, sequelize, {
      fields: ['id', 'username', 'description', 'points', 'rank'],
    });
  }

  /**
   * It creates a user, and also creates a user email, user setting, and auth consumer for that user
   * @param {CreateUserDto} createUserDto - CreateUserDto - This is the DTO that will be used to create
   * the user.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns The user object
   */
  async create(createUserDto: CreateUserDto, queryOptions: QueryOptions = {}) {
    await QueryManager.createTransaction(queryOptions, this.sequelize);

    await this._findOne(
      { where: { username: createUserDto.username } },
      { validator: is409, ...QueryManager.skipTransaction(queryOptions) }
    );

    const user = await QueryManager.create<User>(
      User,
      { ...createUserDto },
      QueryManager.skipTransaction(queryOptions)
    );

    await this.userEmailService.create(
      createUserDto,
      user,
      QueryManager.skipTransaction(queryOptions)
    );

    await this.userSettingService.create(
      user.id,
      QueryManager.skipTransaction(queryOptions)
    );

    await this.authConsumerService.createSubjectAsUser(
      user.id,
      createUserDto.email,
      createUserDto.password,
      QueryManager.skipTransaction(queryOptions)
    );

    await QueryManager.commitTransaction(queryOptions);

    return user;
  }

  /**
   * It returns the user (and its rank) with the given id
   * @param {string} id - The id of the user
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns The user object
   * @throws {NotFoundException} - If the user is not found
   */
  async findByIdWithRank(
    id: string,
    queryOptions: QueryOptions = {}
  ): Promise<Attributes<User> & { rank: number }> {
    const user: User = await this._findById(id, queryOptions);

    const rank: number = await QueryManager.count<User>(User, {
      where: { points: { [Op.gt]: user.points } },
    });

    return { ...user.toJSON(), rank: rank + 1 };
  }

  /**
   * Get all teams of an user
   * @param {string} userId - user's id
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information
   * @returns Team[] - all the teams the user belongs to
   */
  async getTeams(userId: string, queryOptions: QueryOptions = {}) {
    return this._findOne(
      {
        attributes: [],
        where: {
          id: userId,
        },
        include: [
          {
            model: Team,
            as: 'teams',
            attributes: ['id'],
            through: {
              attributes: [],
            },
          },
        ],
      },
      queryOptions
    );
  }
}
