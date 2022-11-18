import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Component } from './component.entity';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export enum ContentType {
  EXERCISE = 'exercise',
  LESSON = 'lesson',
}

@Schema({
  autoIndex: true,
  autoCreate: true,
  collection: 'content',
})
export class Content extends Model {
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

  @Prop({ required: true, enum: ContentType })
  type: string;

  @Prop({
    required: true,
    type: Number,
  })
  reward: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Component',
  })
  rootComponent: Component;

  @Prop({
    required: true,
    type: Object,
  })
  data: Record<string, unknown>;
}

export const ContentSchema = SchemaFactory.createForClass(Content)
  .post(
    ['find', 'findOne', 'updateOne', 'findOneAndUpdate'],
    async function (found) {
      if (found && !Array.isArray(found)) {
        await found.populate({
          path: 'rootComponent',
          select: '-_id -__v',
        });
      } else if (Array.isArray(found)) {
        await Promise.all(
          found.map(async (content) => {
            await content.populate({
              path: 'rootComponent',
              select: '-_id -__v',
            });
          })
        );
      }
      return found;
    }
  )
  .pre(
    ['updateOne', 'save'],
    { document: true, query: false },
    function (next) {
      this.populate({
        path: 'rootComponent',
        select: '-_id -__v',
      });
      next();
    }
  );

export type ContentDocument = Content & mongoose.Document;
