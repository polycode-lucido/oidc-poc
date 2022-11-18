import { Module } from '@nestjs/common';
import { ValidatorService } from './validator.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidatorSchema, Validator } from '@polycode/shared';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Validator.name, schema: ValidatorSchema },
    ]),
  ],
  providers: [ValidatorService],
  exports: [ValidatorService],
})
export class ValidatorModule {}
