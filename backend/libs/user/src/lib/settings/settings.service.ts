import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { QueryOptions, QueryManager } from '@polycode/query-manager';
import { GenericSequelizeService } from '@polycode/generic';
import { is409 } from '@polycode/to';
import { PreferredLanguage, UserSettings } from '@polycode/shared';

@Injectable()
export class UserSettingsService extends GenericSequelizeService<UserSettings> {
  constructor(sequelize: Sequelize) {
    super(UserSettings, sequelize, {
      fields: ['preferredEditingLanguage', 'preferredLanguage'],
    });
  }

  /**
   * "Find a user settings by user id."
   *
   * The first line of the function is the function signature. It's a function that returns a promise
   * of a user settings. The function takes a user id and an optional query options
   * @param {string} userId - string - The userId of the user we want to find the settings for.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise of a UserSettings object.
   */
  async findByUserId(
    userId: string,
    queryOptions: QueryOptions = {}
  ): Promise<UserSettings> {
    return this._findOne({ where: { userId } }, queryOptions);
  }

  /**
   * "Create a new user settings object for the given user ID, or throw a 409 error if one already
   * exists."
   *
   * The first thing we do is check if a transaction was passed in as a query option. If not, we create
   * a new transaction
   * @param {string} userId - string - The userId of the user to create settings for
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns The settings object
   */
  async create(
    userId: string,
    queryOptions: QueryOptions = {}
  ): Promise<UserSettings> {
    await this.findByUserId(userId, {
      validator: is409,
      ...queryOptions,
    });

    const settings = await QueryManager.create(
      UserSettings,
      { userId, ...this.getDefault() },
      queryOptions
    );

    return settings;
  }

  /**
   * "Update the settings for a user."
   *
   * The first thing to notice is that the function is marked as `async`. This means that the function
   * will return a promise
   * @param {string} userId - The userId of the user whose settings we want to update.
   * @param changes - Record<string, unknown>
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns The updated settings
   */
  async update(
    userId: string,
    changes: Record<string, unknown>,
    queryOptions: QueryOptions = {}
  ): Promise<UserSettings> {
    const settings = await this.findByUserId(userId, queryOptions);

    await this._updateInstance(settings, changes, queryOptions);

    return settings;
  }

  /**
   * "Reset the user's settings to the default settings."
   *
   * The function takes two parameters:
   *
   * * userId: The user's ID.
   * * queryOptions: Optional query options
   * @param {string} userId - The user's ID.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns The updated user settings.
   */
  async reset(
    userId: string,
    queryOptions: QueryOptions = {}
  ): Promise<UserSettings> {
    return this._updateById(userId, this.getDefault(), queryOptions);
  }

  /**
   * It returns an object with two properties, preferredEditingLanguage and preferredLanguage
   * @returns An object with two properties.
   */
  private getDefault() {
    return {
      preferredEditingLanguage: 'javascript',
      preferredLanguage: PreferredLanguage.ENGLISH,
    };
  }
}
