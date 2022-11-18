import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type SubmissionDocument = Submission & Document;

@Schema({
  _id: false,
})
export class AttemptData {
  @Prop({ required: true, type: String })
  language: string;

  @Prop({ required: true, type: String })
  code: string;

  @Prop({ type: String })
  version?: string | null;
}

export const AttemptDataSchema = SchemaFactory.createForClass(AttemptData);
@Schema({
  _id: false,
})
export class Attempt {
  @Prop({
    required: true,
    type: String,
  })
  at: string;

  @Prop({ required: true, type: AttemptDataSchema })
  data: AttemptData;
}

export const AttemptSchema = SchemaFactory.createForClass(Attempt);

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class Submission extends Model {
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
  userId: string;

  @Prop({ required: true, type: String })
  componentId: string;

  @Prop({ required: true, type: AttemptSchema })
  lastAttempt: Attempt;

  @Prop({ type: AttemptSchema })
  lastSuccess: Attempt;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
