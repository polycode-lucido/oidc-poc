import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Validator } from './validator.entity';
import { RunnerLanguages } from '@polycode/runner-consumer';

export type ComponentDocument = Component & Document;

export enum ComponentType {
  CONTAINER = 'container',
  EDITOR = 'editor',
  QUIZZ = 'quizz',
  MARKDOWN = 'markdown',
}

export enum ComponentOrientation {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

@Schema()
export class Language extends Document {
  @Prop()
  defaultCode: string;

  @Prop({ type: String, enum: RunnerLanguages })
  language: RunnerLanguages;

  @Prop()
  version: string;
}
export const LanguageSchema = SchemaFactory.createForClass(Language);

export class EditorSettings extends Document {
  @Prop({ type: [LanguageSchema] })
  languages: Language[];
}
export const EditorSettingsSchema =
  SchemaFactory.createForClass(EditorSettings);

export class ComponentData extends Document {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Component' }] })
  components: Component[];

  @Prop()
  markdown: string;

  //TODO replace items
  @Prop({
    type: [{ type: String }],
  })
  items: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Validator' }] })
  validators: Validator[];

  @Prop({ type: EditorSettingsSchema })
  editorSettings: EditorSettings;

  @Prop({ enum: ComponentOrientation })
  orientation: ComponentOrientation;
}

@Schema({
  autoIndex: true,
  autoCreate: true,
  collection: 'component',
})
export class Component extends Model {
  @Prop({
    required: true,
    unique: true,
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  })
  id: string;

  @Prop({ required: true, enum: ComponentType })
  type: ComponentType;

  @Prop({ type: ComponentData })
  data: ComponentData;
}

export const ComponentSchema = SchemaFactory.createForClass(Component)
  .pre(
    ['find', 'findOne', 'updateOne', 'findOneAndUpdate'],
    async function (next) {
      if (this.populate) {
        this.populate({
          path: 'data',
          populate: { path: 'components validators', select: '-_id -__v' },
          select: '-_id -__v',
        });
      }
      next();
    }
  )
  .pre(
    ['updateOne', 'save'],
    { document: true, query: false },
    function (next) {
      if (this.populate) {
        this.populate({
          path: 'data',
          populate: { path: 'components validators', select: '-_id -__v' },
          select: '-_id -__v',
        });
      }
      next();
    }
  );
