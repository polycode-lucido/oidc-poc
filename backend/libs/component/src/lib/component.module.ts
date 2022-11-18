import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComponentService } from './component.service';
import { Component, ComponentSchema } from '@polycode/shared';
import { ValidatorModule } from '@polycode/validator';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Component.name,
        schema: ComponentSchema,
      },
    ]),
    ValidatorModule,
  ],
  controllers: [],
  providers: [ComponentService],
  exports: [ComponentService],
})
export class ComponentModule {}
