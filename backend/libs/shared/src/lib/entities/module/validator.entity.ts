import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ValidatorDocument = Validator & mongoose.Document;

@Schema({ _id: false })
export class ValidatorInput {
  @Prop({
    type: [String],
  })
  stdin: string[];
}

@Schema({ _id: false })
export class ValidatorExpected {
  @Prop({
    type: [String],
  })
  stdout: string[];
}

@Schema({
  autoIndex: true,
  autoCreate: true,
  collection: 'validator',
})
export class Validator extends Model {
  @Prop({
    required: true,
    unique: true,
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  })
  id: string;

  @Prop({ required: true, type: Boolean })
  isHidden: boolean;

  @Prop({
    type: ValidatorInput,
  })
  input: ValidatorInput;

  @Prop({
    required: true,
    type: ValidatorExpected,
  })
  expected: ValidatorExpected;
}

export const ValidatorSchema = SchemaFactory.createForClass(Validator);
