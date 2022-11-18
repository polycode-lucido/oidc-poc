import { Injectable } from '@nestjs/common';
import { Role } from '../entities/Role.entity';
import { QueryManager, QueryOptions } from '@polycode/query-manager';
import { Attributes, FindOptions } from 'sequelize/types';
import { is404, is409 } from '@polycode/to';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class RoleService {
  constructor(readonly sequelize: Sequelize) {}

  /**
   * It creates a new role in the database.
   * @param {string} name - The name of the role
   * @param {string} description - The description of the role
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise that resolves to a Role.
   */
  async create(
    name: string,
    description: string,
    queryOptions: QueryOptions = {}
  ): Promise<Role> {
    await this.findByName(name, {
      validator: is409,
      ...QueryManager.skipTransaction(queryOptions),
    });

    return QueryManager.create<Role>(
      Role,
      {
        name,
        description,
      },
      QueryManager.skipTransaction(queryOptions)
    );
  }

  /**
   * It returns a promise that resolves to a single role.
   * @param findOptions - FindOptions<Role>
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise that resolves to a single role.
   */
  findOne(
    findOptions: FindOptions<Attributes<Role>>,
    queryOptions: QueryOptions = {}
  ): Promise<Role> {
    return QueryManager.findOne<Role>(Role, findOptions, {
      validator: is404,
      ...queryOptions,
    });
  }

  /**
   * It returns a promise that resolves to a single role.
   * @param {string} id - The id of the role.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise that resolves to a single role.
   */
  findById(id: string, queryOptions: QueryOptions = {}): Promise<Role> {
    return this.findOne({ where: { id } } as unknown, queryOptions);
  }

  /**
   * It returns a promise that resolves to a single role.
   * @param {string} name - The name of the role.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise that resolves to a single role.
   */
  findByName(name: string, queryOptions: QueryOptions = {}): Promise<Role> {
    return this.findOne({ where: { name } } as unknown, queryOptions);
  }

  /**
   * It returns a promise that resolves to a single role.
   * @param {string} id - The id of the role.
   * @param changes - The changes to be made to the role.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise that resolves to a single role.
   */
  async update(
    id: string,
    changes: Record<string, string>,
    queryOptions: QueryOptions = {}
  ): Promise<Role> {
    const role: Role = await this.findById(id, queryOptions);

    await QueryManager.updateInstance(role, changes, queryOptions);

    return role;
  }

  /**
   * It creates a new role in the database.
   * @param {string} id - The id of the role.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise that resolves to a Role.
   */
  async delete(id: string, queryOptions: QueryOptions = {}) {
    const role: Role = await this.findById(id, queryOptions);
    await QueryManager.destroyInstance(role, queryOptions);
  }
}
