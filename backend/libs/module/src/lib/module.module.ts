import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleSchema } from '@polycode/shared';
import { AuthConsumerModule } from '@polycode/auth-consumer';
import { UserModule } from '@polycode/user';
import { ContentModule } from '@polycode/content';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Module.name, schema: ModuleSchema }]),
    AuthConsumerModule,
    UserModule,
    ContentModule,
  ],
  controllers: [ModuleController],
  providers: [ModuleService],
})
export class ModuleModule {}
