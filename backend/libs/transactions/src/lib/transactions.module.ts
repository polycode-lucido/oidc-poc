import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

import { sequelizeTransactionModels } from '@polycode/shared';
@Module({
  imports: [SequelizeModule.forFeature(sequelizeTransactionModels)],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
