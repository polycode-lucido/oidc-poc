import { is404 } from '@polycode/to';
import {
  Attributes,
  FindOptions,
  Identifier,
  Model,
  ModelStatic,
} from 'sequelize/types';
import { Col, Fn, Literal } from 'sequelize/types/utils';
import { FormatOptions, GenericService } from '.';
import { QueryManager, QueryOptions } from '@polycode/query-manager';
import { Sequelize } from 'sequelize-typescript';
import { defaults } from 'lodash';

export class GenericSequelizeService<
  M extends Model
> extends GenericService<M> {
  constructor(
    readonly model: ModelStatic<M>,
    readonly sequelize: Sequelize,
    formatOptions?: FormatOptions
  ) {
    super(
      defaults(formatOptions, {
        excludes: ['createdAt', 'updatedAt', 'deletedAt'],
      })
    );
  }

  /**
   * It returns a promise that resolves to a single model instance
   * @param findOptions - FindOptions<M>
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise that resolves to a single model instance.
   */
  _findOne(
    findOptions: FindOptions<Attributes<M>>,
    queryOptions: QueryOptions = {}
  ): Promise<M> {
    return QueryManager.findOne<M>(this.model, findOptions, {
      validator: is404,
      ...queryOptions,
    });
  }

  /**
   * It returns a promise that resolves to a model instance with the given id, or rejects with a 404
   * error if no such model exists
   * @param {Identifier} id - Identifier - The id of the model you want to find.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise that resolves to a model instance.
   */
  async _findById(id: Identifier, queryOptions: QueryOptions = {}): Promise<M> {
    return this._findOne({ where: { id } } as unknown, queryOptions);
  }

  /**
   * This function returns a promise that resolves to an array of model instances
   * @param findOptions - FindOptions<Attributes<M>>
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns An array of models.
   */
  _findAll(
    findOptions: FindOptions<Attributes<M>> = {},
    queryOptions: QueryOptions = {}
  ): Promise<M[]> {
    return QueryManager.findAll<M>(this.model, findOptions, queryOptions);
  }

  /**
   * It returns a promise that resolves to an object with a count and data property.
   * @param findOptions - FindOptions<Attributes<M>> = {}
   * @param {QueryOptions} queryOptions - QueryOptions = {}
   * @returns An object with a count and data property.
   */
  async _findAllAndCount(
    findOptions: FindOptions<Attributes<M>> = {},
    queryOptions: QueryOptions = {}
  ): Promise<{ count: number; data: M[] }> {
    const data = await this._findAll(findOptions, queryOptions);
    const count = await QueryManager.count<M>(
      this.model,
      findOptions,
      queryOptions
    );

    return { count, data };
  }

  /**
   * It creates a new instance of the model, and returns it
   * @param attributes - The attributes to create the model with.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise that resolves to a model instance.
   */
  _create(
    attributes: Attributes<M>,
    queryOptions: QueryOptions<M> = {}
  ): Promise<M> {
    return QueryManager.create<M>(this.model, attributes, queryOptions);
  }

  /**
   * Update an entity by id, with the given changes, using the given query options.
   *
   * The first thing we do is create a transaction. This is a good idea because if the update fails, we
   * don't want to leave the database in an inconsistent state
   * @param findOptions - The options to find the entity to update.
   * @param changes - The changes you want to make to the entity.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   */
  async _update(
    findOptions: FindOptions<Attributes<M>>,
    changes: {
      [key in keyof Attributes<M>]?: Fn | Col | Literal | Attributes<M>[key];
    },
    queryOptions: QueryOptions = {}
  ): Promise<M> {
    const entity = await this._findOne(findOptions, queryOptions);
    await QueryManager.updateInstance(entity, changes, queryOptions);

    return entity;
  }

  /**
   * Update a record by id.
   *
   * The first parameter is the id of the record to update. The second parameter is an object that
   * contains the changes to make to the record. The third parameter is an object that contains options
   * for the query
   * @param {Identifier} id - Identifier - The id of the record to update.
   * @param changes - {
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   */
  _updateById(
    id: Identifier,
    changes: {
      [key in keyof Attributes<M>]?: Fn | Col | Literal | Attributes<M>[key];
    },
    queryOptions: QueryOptions = {}
  ): Promise<M> {
    return this._update({ where: { id } } as unknown, changes, queryOptions);
  }

  /**
   * It updates an instance of a model with the given changes
   * @param {M} entity - The entity to update
   * @param changes - {
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   */
  async _updateInstance(
    entity: M,
    changes: {
      [key in keyof Attributes<M>]?: Fn | Col | Literal | Attributes<M>[key];
    },
    queryOptions: QueryOptions = {}
  ): Promise<void> {
    await QueryManager.updateInstance(entity, changes, queryOptions);
  }

  /**
   * It deletes a record from the database.
   * @param findOptions - FindOptions<Attributes<M>>
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   */
  async _delete(
    findOptions: FindOptions<Attributes<M>>,
    queryOptions: QueryOptions = {}
  ): Promise<void> {
    const entity = await this._findOne(findOptions, queryOptions);
    await QueryManager.destroyInstance(entity, queryOptions);
  }

  /**
   * Delete the record with the given id.
   * @param {Identifier} id - The id of the entity to delete.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise that resolves to void.
   */
  _deleteById(id: Identifier, queryOptions: QueryOptions = {}): Promise<void> {
    return this._delete({ where: { id } } as unknown, queryOptions);
  }

  /**
   * It deletes an instance of a model
   * @param {M} entity - The entity to be deleted.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   */
  _deleteInstance(entity: M, queryOptions: QueryOptions = {}): Promise<void> {
    return QueryManager.destroyInstance(entity, queryOptions);
  }
}
