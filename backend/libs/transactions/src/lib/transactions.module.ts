import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

import { sequelizeTransactionModels } from '@polycode/shared';
import { AuthConsumerModule } from '@polycode/auth-consumer';
@Module({
  imports: [
    SequelizeModule.forFeature(sequelizeTransactionModels),
    AuthConsumerModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
