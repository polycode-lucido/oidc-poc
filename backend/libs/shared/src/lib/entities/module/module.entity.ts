import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Content } from '.';
import { User } from '../user';

export type ModuleDocument = Module & mongoose.Document;

@Schema()
export class ModuleData extends mongoose.Document {}
export const ModuleDataSchema = SchemaFactory.createForClass(ModuleData);

@Schema({
  autoIndex: true,
  autoCreate: true,
  collection: 'module',
})
export class Module {
  @Prop({
    required: true,
    unique: true,
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  })
  id: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: String })
  type: ModuleType;

  @Prop({ required: true, type: Number })
  reward: number;

  @Prop({ required: true, type: [String] })
  tags: string[];

  @Prop({
    required: true,
    type: ModuleDataSchema,
  })
  data: ModuleData;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
  })
  modules: Module[];

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
  })
  contents: Content[];

  // userId of the author of this module.
  @Prop({ required: true, type: String })
  authorId: string;

  //Used only to return the author. Should not be saved in database.
  author?: Partial<User>;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);

export type ModuleType =
  | 'challenge'
  | 'practice'
  | 'certification'
  | 'submodule';
