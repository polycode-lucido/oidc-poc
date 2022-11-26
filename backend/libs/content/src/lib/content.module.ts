import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComponentModule } from '@polycode/component';
import { Content, ContentSchema } from '@polycode/shared';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Content.name,
        schema: ContentSchema,
      },
    ]),
    ComponentModule,
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
