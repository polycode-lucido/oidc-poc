import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemSchema } from '@polycode/shared';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { TransactionsModule } from '@polycode/transactions';
import { UserModule } from '@polycode/user';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),
    TransactionsModule,
    UserModule,
  ],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService, MongooseModule],
})
export class ItemModule {}
