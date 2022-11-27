import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentModule } from '@polycode/content';
import { ModuleSchema } from '@polycode/shared';
import { UserModule } from '@polycode/user';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Module.name, schema: ModuleSchema }]),
    UserModule,
    ContentModule,
  ],
  controllers: [ModuleController],
  providers: [ModuleService],
})
export class ModuleModule {}
