import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { to500, is404 } from '@polycode/to';

import CreateItemDTO from './templates/dtos/create-item.dto';
import { UpdateItemDTO } from './templates/dtos/update-item.dto';
import { Item, ItemDocument } from '@polycode/shared';
import { QueryManager, QueryOptions } from '@polycode/query-manager';
import { UserService } from '@polycode/user';
import { User, Transaction } from '@polycode/shared';
import { TransactionsService } from '@polycode/transactions';
import { OrderKeys } from '@polycode/request-helper';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    private transactionService: TransactionsService,
    private userService: UserService
  ) {}

  /**
   * This finds all the Item documents from the Item collection, you can provide a find object,
   * you can set an offset, a limit, and order by a document field
   * @param {number} offset - offset
   * @param {number} limit - limit
   * @param {Record<string, unknown>} findOptions - a mongo-like find object
   * @param {OrderKeys} order - a sorting object
   * @returns {Promise<Item[]>}
   */
  getAll(
    offset?: number,
    limit?: number,
    findOptions?: Record<string, unknown>,
    order?: OrderKeys
  ): Promise<Item[]> {
    return to500(
      this.itemModel
        .find(findOptions)
        .skip(offset)
        .limit(limit)
        .sort(order)
        .exec()
    );
  }

  /**
   * It gets an item by its id
   * @param {string} id - the id of an item to get
   * @returns {Promise<Item>} - found item
   */
  async getOne(id: string): Promise<Item> {
    return await is404(this.itemModel.findOne({ id: id }).exec());
  }

  /**
   * Inserts an item into the DB
   * @param {CreateItemDTO} item - the item to insert
   * @returns {Item} - created item
   */
  async create(item: CreateItemDTO): Promise<Item> {
    return await to500(this.itemModel.create(item));
  }

  /**
   * Deletes an Item Document from the DB
   * @param id - id of an item to delete
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    await is404(this.itemModel.findOneAndDelete({ id: id }).exec());
  }

  /**
   * Updates an Item documents with the fields given in the body
   * @param {string} id - id of an item to update
   * @param {UpdateItemDTO} item - fields to update
   * @returns {Promise<Item>}
   */
  async patch(id: string, item: UpdateItemDTO): Promise<Item> {
    const original = await is404(
      this.itemModel.findOneAndUpdate({ id: id }, item).exec()
    );

    const toReturn = { ...original.toObject() } as Item;

    for (const key in item) {
      if (original[key] !== item[key]) {
        toReturn[key] = item[key];
      }
    }

    return toReturn;
  }

  /**
   * It attempts to buy an item with user's balance,
   * if it succeded it will create a Transaction in the DB
   * and returns it, if not throws an exception with 403 error
   * @param {string} item - UUID of an item
   * @param {string} user - UUID of an user
   * @returns {Promise<Transaction>} The transaction object
   */
  async buy(
    item: string,
    user: string,
    queryOptions: QueryOptions = {}
  ): Promise<Transaction> {
    await QueryManager.createTransaction(
      queryOptions,
      this.transactionService.sequelize
    );
    const itemData: Item = await to500(this.getOne(item));
    const userData: User = await this.userService._findById(user, {
      validator: is404,
      ...QueryManager.skipTransaction(queryOptions),
    });

    if (itemData.cost > userData.points)
      throw new ForbiddenException('Not enought points!');

    this.userService._updateById(
      user,
      {
        points: userData.points - itemData.cost,
      },
      QueryManager.skipTransaction(queryOptions)
    );

    const toReturn = await this.transactionService._create(
      {
        userId: user,
        objectId: item,
      },
      QueryManager.skipTransaction(queryOptions)
    );

    await QueryManager.commitTransaction(queryOptions);
    return toReturn;
  }

  /**
   * Takes either a single Item or an array of Items, to ditch useless fields such as _id and __v
   * @param {Item | Item []} item - Item(s) to format
   * @returns Formatted Item(s)
   */
  format(item: Item | Item[]): Item | Item[] {
    if (Array.isArray(item)) {
      return item.map((item) => this.format(item)) as Item[];
    }
    return {
      id: item.id,
      cost: item.cost,
      type: item.type,
      data: item.data,
    } as Item;
  }
}
