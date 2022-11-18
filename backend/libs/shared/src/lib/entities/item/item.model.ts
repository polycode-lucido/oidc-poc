import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ItemDocument = Item & Document;

export enum ItemType {
  HINT = 'hint',
  VALIDATOR = 'validator',
}

@Schema({
  autoIndex: true,
  autoCreate: true,
})
export class Item {
  @Prop({
    required: true,
    unique: true,
    type: String,
    default: uuidv4,
  })
  id: string;

  @Prop({ min: 0, type: Number, required: true })
  cost: number;

  @Prop({ enum: ItemType, type: String, required: true })
  type: string;

  @Prop({ type: 'object', required: true })
  data: {
    text: string;
  };
}
export const ItemSchema = SchemaFactory.createForClass(Item);
