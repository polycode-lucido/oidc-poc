import { Injectable } from '@nestjs/common';

import { Transaction } from '@polycode/shared';
import { GenericSequelizeService } from '@polycode/generic';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class TransactionsService extends GenericSequelizeService<Transaction> {
  constructor(sequelize: Sequelize) {
    super(Transaction, sequelize, {
      fields: ['id', 'userId', 'objectId'],
    });
  }
}
