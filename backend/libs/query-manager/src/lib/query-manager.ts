import {
  FilterResult,
  OrderResult,
  PaginationResult,
} from '@polycode/request-helper';
import { to500 } from '@polycode/to';
import {
  Attributes,
  CountOptions,
  DestroyOptions,
  FindOptions,
  Identifier,
  Model,
  ModelStatic,
  Op,
  SaveOptions,
  Sequelize,
  Transaction,
  UpdateOptions,
} from 'sequelize';
import { Col, Fn, Literal } from 'sequelize/types/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface QueryOptions<T = any> {
  pagination?: PaginationResult;
  order?: OrderResult;
  filter?: FilterResult;
  transaction?: Transaction;
  skipCommit?: boolean;
  validator?: (promise: Promise<T>) => Promise<T>;
}

export class QueryManager {
  /**
   * "Find all the records in the database that match the given options, and return them as an array of
   * model instances."
   *
   * The first parameter is the model class that we want to query. The second parameter is an object
   * that contains the options for the query. The third parameter is an object that contains options
   * for the query itself
   * @param model - The model class that you want to query.
   * @param findOptions - These are the options that are passed to the Sequelize findAll method.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise of an array of models
   */
  static async findAll<M extends Model>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: ModelStatic<M>,
    findOptions: FindOptions<Attributes<M>> = {},
    queryOptions: QueryOptions<M[]> = {}
  ): Promise<M[]> {
    const promise = model.findAll({
      ...findOptions,
      ...(queryOptions.pagination && {
        offset: queryOptions.pagination.offset,
        limit: queryOptions.pagination.limit,
      }),
      ...(queryOptions.order && {
        order: Object.keys(queryOptions.order.keys || []).map((key) => [
          key,
          queryOptions.order.keys[key],
        ]),
      }),
      ...(queryOptions.filter && {
        where: {
          ...findOptions?.where,
          ...Object.keys(queryOptions.filter.keys || []).reduce(
            (acc, key) => ({
              ...acc,
              [key]: {
                ...(queryOptions.filter.keys[key].matching && {
                  [Op.iLike]: `%${queryOptions.filter.keys[key].value}%`,
                }),
                ...(!queryOptions.filter.keys[key].matching && {
                  [Op.eq]: queryOptions.filter.keys[key].value,
                }),
              },
            }),
            {}
          ),
        },
      }),
      transaction: queryOptions.transaction,
    });

    if (queryOptions.validator) {
      try {
        return await queryOptions.validator(promise);
      } catch (err) {
        if (queryOptions.transaction) {
          await to500(queryOptions.transaction.rollback());
        }
        throw err;
      }
    }

    try {
      return await to500(promise);
    } catch (err) {
      if (queryOptions.transaction) {
        await to500(queryOptions.transaction.rollback());
      }
      throw err;
    }
  }

  /**
   * It takes a model, find options, and query options, and returns a promise that resolves to an
   * object containing the count of all the rows in the database that match the find options, and the
   * rows that match the find options and query options
   * @param model - The model you want to query
   * @param findOptions - FindOptions<Attributes<M>> = {}
   * @param queryOptions - QueryOptions<M[]> = {}
   * @returns An object with a count and data property.
   */
  static async findAllAndCount<M extends Model>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: ModelStatic<M>,
    findOptions: FindOptions<Attributes<M>> = {},
    queryOptions: QueryOptions<M[]> = {}
  ): Promise<{ count: number; data: M[] }> {
    const promise = model.findAll({
      ...findOptions,
      ...(queryOptions.pagination && {
        offset: queryOptions.pagination.offset,
        limit: queryOptions.pagination.limit,
      }),
      ...(queryOptions.order && {
        order: Object.keys(queryOptions.order.keys || []).map((key) => [
          key,
          queryOptions.order.keys[key],
        ]),
      }),
      ...(queryOptions.filter && {
        where: {
          ...findOptions?.where,
          ...Object.keys(queryOptions.filter.keys || []).reduce(
            (acc, key) => ({
              ...acc,
              [key]: {
                ...(queryOptions.filter.keys[key].matching && {
                  [Op.iLike]: `%${queryOptions.filter.keys[key].value}%`,
                }),
                ...(!queryOptions.filter.keys[key].matching && {
                  [Op.eq]: queryOptions.filter.keys[key].value,
                }),
              },
            }),
            {}
          ),
        },
      }),
      transaction: queryOptions.transaction,
    });

    let rows: M[];
    if (queryOptions.validator) {
      try {
        rows = await queryOptions.validator(promise);
      } catch (err) {
        if (queryOptions.transaction) {
          await to500(queryOptions.transaction.rollback());
        }
        throw err;
      }
    }

    try {
      rows = await to500(promise);
    } catch (err) {
      if (queryOptions.transaction) {
        await to500(queryOptions.transaction.rollback());
      }
      throw err;
    }

    const count = await this.count(model, findOptions, queryOptions as unknown);

    return {
      count,
      data: rows,
    };
  }

  /**
   * It counts the number of records in a database table that match the given criteria
   * @param model - The model to query
   * @param findOptions - These are the options that are passed to the find method.
   * @param queryOptions - QueryOptions<number> = {}
   * @returns The number of rows that match the query.
   */
  static async count<M extends Model>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: ModelStatic<M>,
    findOptions: CountOptions<Attributes<M>> = {},
    queryOptions: QueryOptions<number> = {}
  ): Promise<number> {
    const promise = model.count({
      ...findOptions,
      ...(queryOptions.filter && {
        where: {
          ...findOptions?.where,
          ...Object.keys(queryOptions.filter.keys || []).reduce(
            (acc, key) => ({
              ...acc,
              [key]: {
                ...(queryOptions.filter.keys[key].matching && {
                  [Op.iLike]: `%${queryOptions.filter.keys[key].value}%`,
                }),
                ...(!queryOptions.filter.keys[key].matching && {
                  [Op.eq]: queryOptions.filter.keys[key].value,
                }),
              },
            }),
            {}
          ),
        },
      }),
      transaction: queryOptions.transaction,
    });

    if (queryOptions.validator) {
      try {
        return await queryOptions.validator(promise);
      } catch (err) {
        if (queryOptions.transaction) {
          await to500(queryOptions.transaction.rollback());
        }
        throw err;
      }
    }

    try {
      return await to500(promise);
    } catch (err) {
      if (queryOptions.transaction) {
        await to500(queryOptions.transaction.rollback());
      }
      throw err;
    }
  }

  /**
   * "Find one record from the database, and if a validator is provided, validate the result."
   *
   * The first parameter is the model class. The second parameter is an object that contains the
   * options for the `findOne` method. The third parameter is an object that contains the options for
   * the query
   * @param model - The model to query
   * @param findOptions - These are the options that are passed to the findOne method of the model.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise of a model
   */
  static async findOne<M extends Model<M, M>>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: ModelStatic<M>,
    findOptions: FindOptions<Attributes<M>> = {},
    queryOptions: QueryOptions<M>
  ): Promise<M> {
    const promise = model.findOne({
      ...findOptions,
      ...(queryOptions.order && {
        order: Object.keys(queryOptions.order.keys || []).map((key) => [
          key,
          queryOptions.order.keys[key],
        ]),
      }),
      ...(queryOptions?.filter && {
        where: {
          ...findOptions.where,
          ...Object.keys(queryOptions.filter.keys || []).reduce(
            (acc, key) => ({
              ...acc,
              [key]: {
                ...(queryOptions.filter.keys[key].matching && {
                  [Op.iLike]: `%${queryOptions.filter.keys[key].value}%`,
                }),
                ...(!queryOptions.filter.keys[key].matching && {
                  [Op.eq]: queryOptions.filter.keys[key].value,
                }),
              },
            }),
            {}
          ),
        },
      }),
      transaction: queryOptions.transaction,
    });

    if (queryOptions.validator) {
      try {
        return await queryOptions.validator(promise);
      } catch (err) {
        if (queryOptions.transaction) {
          await to500(queryOptions.transaction.rollback());
        }
        throw err;
      }
    }

    try {
      return await to500(promise);
    } catch (err) {
      if (queryOptions.transaction) {
        await to500(queryOptions.transaction.rollback());
      }
      throw err;
    }
  }

  /**
   * It finds a model by its primary key
   * @param model - The model class that you want to query.
   * @param {Identifier} identifier - The primary key of the model you're looking for.
   * @param findOptions - FindOptions<Attributes<M>> = {}
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise that resolves to a model instance.
   */
  static async findByPk<M extends Model>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: ModelStatic<M>,
    identifier: Identifier,
    findOptions: FindOptions<Attributes<M>> = {},
    queryOptions: QueryOptions<M>
  ): Promise<M> {
    const promise = model.findByPk(identifier, {
      ...findOptions,
      transaction: queryOptions.transaction,
    });

    if (queryOptions.validator) {
      try {
        return await queryOptions.validator(promise);
      } catch (err) {
        if (queryOptions.transaction) {
          await to500(queryOptions.transaction.rollback());
        }
        throw err;
      }
    }

    try {
      return await to500(promise);
    } catch (err) {
      if (queryOptions.transaction) {
        await to500(queryOptions.transaction.rollback());
      }
      throw err;
    }
  }

  /**
   * "Create a new model instance and return it."
   *
   * The first parameter is the model class. The second parameter is the attributes to be used to
   * create the model instance. The third parameter is an object that can contain a transaction and a
   * validator
   * @param model - The model class that you want to create a new instance of.
   * @param attributes - The attributes to create the model with.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise that resolves to a model instance.
   */
  static async create<M extends Model>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: ModelStatic<M>,
    attributes: Attributes<M>,
    queryOptions: QueryOptions<M>
  ): Promise<M> {
    const promise = model.create(attributes, {
      transaction: queryOptions.transaction,
    });

    if (queryOptions.validator) {
      try {
        return await queryOptions.validator(promise);
      } catch (err) {
        if (queryOptions.transaction) {
          await to500(queryOptions.transaction.rollback());
        }
        throw err;
      }
    }

    try {
      return await to500(promise);
    } catch (err) {
      if (queryOptions.transaction) {
        await to500(queryOptions.transaction.rollback());
      }
      throw err;
    }
  }

  /**
   * It updates a model with the given changes, and returns the number of affected rows
   * @param model - The model class that you want to update.
   * @param changes - The changes to make to the model.
   * @param updateOptions - Omit<UpdateOptions<Attributes<M>>, 'returning'>,
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns An array with a single element, the number of affected rows.
   */
  static async update<M extends Model>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: ModelStatic<M>,
    changes: {
      [key in keyof Attributes<M>]?: Fn | Col | Literal | Attributes<M>[key];
    },
    updateOptions: Omit<UpdateOptions<Attributes<M>>, 'returning'>,
    queryOptions: QueryOptions<[affectedCount: number]> = {}
  ): Promise<[affectedCount: number]> {
    const promise = model.update(changes, {
      ...updateOptions,
      transaction: queryOptions.transaction,
    });

    if (queryOptions.validator) {
      try {
        return await queryOptions.validator(promise);
      } catch (err) {
        if (queryOptions.transaction) {
          await to500(queryOptions.transaction.rollback());
        }
        throw err;
      }
    }

    try {
      return await to500(promise);
    } catch (err) {
      if (queryOptions.transaction) {
        await to500(queryOptions.transaction.rollback());
      }
      throw err;
    }
  }

  /**
   * It updates a model instance with the given changes, and returns the updated instance
   * @param {M} model - The model instance to update
   * @param changes - The changes to make to the model.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise that resolves to a model instance.
   */
  static async updateInstance<M extends Model>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: M,
    changes: {
      [key in keyof Attributes<M>]?: Fn | Col | Literal | Attributes<M>[key];
    },
    queryOptions: QueryOptions<M>
  ): Promise<M> {
    const promise = model.update(changes, {
      transaction: queryOptions.transaction,
    });

    if (queryOptions.validator) {
      try {
        return await queryOptions.validator(promise);
      } catch (err) {
        if (queryOptions.transaction) {
          await to500(queryOptions.transaction.rollback());
        }
        throw err;
      }
    }

    try {
      return await to500(promise);
    } catch (err) {
      if (queryOptions.transaction) {
        await to500(queryOptions.transaction.rollback());
      }
      throw err;
    }
  }

  /**
   * "Save the model, and if a validator is provided, use it to validate the result."
   *
   * The first parameter is the model to save. The second parameter is the save options. The third
   * parameter is the query options
   * @param model - The model to save
   * @param saveOptions - SaveOptions<M>
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise that resolves to a model.
   */
  static async save<M extends Model>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: Model<M>,
    saveOptions: SaveOptions<M>,
    queryOptions: QueryOptions<Model<M, M>> = {}
  ): Promise<Model<M, M>> {
    const promise = model.save({
      ...saveOptions,
      transaction: queryOptions.transaction,
    });

    if (queryOptions.validator) {
      try {
        return await queryOptions.validator(promise);
      } catch (err) {
        if (queryOptions.transaction) {
          await to500(queryOptions.transaction.rollback());
        }
        throw err;
      }
    }

    try {
      return await to500(promise);
    } catch (err) {
      if (queryOptions.transaction) {
        await to500(queryOptions.transaction.rollback());
      }
      throw err;
    }
  }

  /**
   * It destroys a model
   * @param model - The model to be destroyed
   * @param destroyOptions - The options to pass to the destroy method.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise that resolves to the number of rows deleted.
   */
  static async destroy<M extends Model>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: ModelStatic<M>,
    destroyOptions: DestroyOptions<Attributes<M>>,
    queryOptions: QueryOptions<number> = {}
  ): Promise<number> {
    const promise = model.destroy({
      ...destroyOptions,
      ...queryOptions,
    });

    if (queryOptions.validator) {
      try {
        return await queryOptions.validator(promise);
      } catch (err) {
        if (queryOptions.transaction) {
          await to500(queryOptions.transaction.rollback());
        }
        throw err;
      }
    }

    try {
      return await to500(promise);
    } catch (err) {
      if (queryOptions.transaction) {
        await to500(queryOptions.transaction.rollback());
      }
      throw err;
    }
  }

  /**
   * It destroys a model instance
   * @param {M} model - The model instance to be destroyed.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns The promise is being returned.
   */
  static async destroyInstance<M extends Model>(
    model: M,
    queryOptions: QueryOptions<void> = {}
  ): Promise<void> {
    const promise = model.destroy(queryOptions);

    if (queryOptions.validator) {
      try {
        return await queryOptions.validator(promise);
      } catch (err) {
        if (queryOptions.transaction) {
          await to500(queryOptions.transaction.rollback());
        }
        throw err;
      }
    }

    try {
      return await to500(promise);
    } catch (err) {
      if (queryOptions.transaction) {
        await to500(queryOptions.transaction.rollback());
      }
      throw err;
    }
  }

  /**
   * "If the queryOptions object doesn't have a transaction property, create one and assign it to the
   * queryOptions object."
   *
   * The function is a little more complicated than that, but not much. The first line of the function
   * is a default parameter. If the caller doesn't pass in a queryOptions object, the function will
   * create one
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @param {Sequelize} sequelize - Sequelize - The sequelize instance
   */
  static async createTransaction(
    queryOptions: QueryOptions<number>,
    sequelize: Sequelize
  ) {
    queryOptions.transaction =
      queryOptions.transaction ?? (await to500(sequelize.transaction()));
  }

  /**
   * If the queryOptions object has a transaction property, commit it and set the transaction property
   * to undefined
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   */
  static async commitTransaction(queryOptions: QueryOptions<number>) {
    if (queryOptions?.transaction && !queryOptions?.skipCommit) {
      await to500(queryOptions.transaction.commit());
      queryOptions.transaction = undefined;
    }
  }

  /**
   * It takes a queryOptions object and returns a new queryOptions object with the skipTransaction
   * property set to true
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns An object with the property skipTransaction set to true and all the properties of the
   * queryOptions object.
   */
  static skipTransaction(queryOptions: QueryOptions): QueryOptions {
    return {
      ...queryOptions,
      skipCommit: true,
    };
  }
}
