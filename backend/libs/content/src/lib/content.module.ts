import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComponentModule } from '@polycode/component';
import { ContentController } from './content.controller';
import { Content, ContentSchema } from '@polycode/shared';
import { ContentService } from './content.service';
import { AuthConsumerModule } from '@polycode/auth-consumer';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Content.name,
        schema: ContentSchema,
      },
    ]),
    ComponentModule,
    AuthConsumerModule,
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
