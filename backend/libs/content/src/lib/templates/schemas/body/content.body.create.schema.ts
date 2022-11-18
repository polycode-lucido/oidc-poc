import { ContentType } from '@polycode/shared';
import { createComponentBodySchema } from '@polycode/component';

export const createBodySchema = {
  type: 'object',
  required: ['name', 'description', 'type', 'reward', 'rootComponent', 'data'],
  properties: {
    name: {
      type: 'string',
      description: 'The content name',
    },
    description: {
      type: 'string',
      description: 'The content description',
    },
    type: {
      enum: Object.values(ContentType),
      description: 'The content type',
    },
    reward: {
      type: 'number',
      description: 'The content reward',
    },
    rootComponent: {
      ...createComponentBodySchema,
    },
    data: {
      type: 'object',
      description: 'The content data',
    },
  },
};
